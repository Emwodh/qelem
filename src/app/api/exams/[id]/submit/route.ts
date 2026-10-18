import { NextRequest, NextResponse } from "next/server";
import { OFFICIAL_MOCK_EXAMS, getQuestionsForExam } from "@/lib/mockExamData";
import { MockExamDefinition, MockExamAttempt, GradedQuestionDetail } from "@/types/exam";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const body = await request.json().catch(() => ({}));
    const examId = rawId || body.examId || "euee-2016-physics";
    const answers: Record<string, "A" | "B" | "C" | "D"> = body.answers || {};
    const flagged: Record<string, boolean> = body.flagged || {};
    const timeElapsedSec: number = Number(body.timeElapsedSec) || 0;
    const startedAt: string = body.startedAt || new Date().toISOString();

    // 1. Resolve Exam Definition
    let examDef: MockExamDefinition | undefined = OFFICIAL_MOCK_EXAMS.find((e) => e.id === examId);

    if (!examDef && examId.startsWith("custom-")) {
      const parts = examId.split("-");
      const sub = (parts[1] || "physics") as any;
      const count = Number(parts[2]) || 30;
      const duration = Number(parts[3]) || 60;
      const subName =
        sub === "physics"
          ? "Physics"
          : sub === "math-nat"
          ? "Mathematics (Natural)"
          : sub === "chemistry"
          ? "Chemistry"
          : "Biology";

      examDef = {
        id: examId,
        title: `Custom ${subName} Mock Exam`,
        amharicTitle: `የተዘጋጀ የ${subName} መለማመጃ ፈተና`,
        subject: subName,
        subjectId: sub,
        stream: "natural",
        year: "2016 E.C. Calibrated",
        durationMinutes: duration,
        totalQuestions: count,
        description: `Custom-generated practice sprint with ${count} questions and ${duration}-minute duration.`,
        isOfficialPastPaper: false,
        curriculumCoverage: "Grades 9–12 Proportional",
        passingScorePercent: 70,
        badge: "Custom Mock Exam",
      };
    }

    if (!examDef) {
      examDef = OFFICIAL_MOCK_EXAMS[0];
    }

    // 2. Resolve Master Question Bank (with verified answer keys & derivations)
    const questions = getQuestionsForExam(examDef);

    // 3. Server-Side Grading & Verification
    let correct = 0;
    const gradeStats: Record<number, { total: number; correct: number; percent: number }> = {
      9: { total: 0, correct: 0, percent: 0 },
      10: { total: 0, correct: 0, percent: 0 },
      11: { total: 0, correct: 0, percent: 0 },
      12: { total: 0, correct: 0, percent: 0 },
    };

    const questionResults: Record<string, GradedQuestionDetail> = {};

    questions.forEach((q) => {
      const g = q.grade || 12;
      if (!gradeStats[g]) gradeStats[g] = { total: 0, correct: 0, percent: 0 };
      gradeStats[g].total++;

      const chosen = answers[q.id] || null;
      const isCorrect = chosen === q.correctOptionId;

      if (isCorrect) {
        correct++;
        gradeStats[g].correct++;
      }

      // Populate full pedagogical breakdown now that exam has been submitted
      questionResults[q.id] = {
        questionId: q.id,
        selectedOptionId: chosen,
        correctOptionId: q.correctOptionId,
        isCorrect,
        explanation: q.explanation || "Detailed MoE derivation step verified.",
        derivationSteps: q.derivationSteps && q.derivationSteps.length > 0 ? q.derivationSteps : [q.explanation || ""],
        keyFormula: q.keyFormula,
        distractorAnalysis: q.distractorAnalysis,
      };
    });

    Object.keys(gradeStats).forEach((gKey) => {
      const g = Number(gKey);
      if (gradeStats[g].total > 0) {
        gradeStats[g].percent = Math.round((gradeStats[g].correct / gradeStats[g].total) * 100);
      }
    });

    const total = questions.length;
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = Math.max(0, total - answeredCount);
    const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const remainingSeconds = Math.max(0, examDef.durationMinutes * 60 - timeElapsedSec);

    const attempt: MockExamAttempt = {
      examId: examDef.id,
      examTitle: examDef.title,
      subject: examDef.subject,
      subjectId: examDef.subjectId,
      startedAt,
      remainingSeconds,
      answers,
      flagged,
      isSubmitted: true,
      completedAt: new Date().toISOString(),
      score: correct,
      scorePercentage: scorePct,
      totalQuestions: total,
      correctCount: correct,
      incorrectCount: answeredCount - correct,
      unansweredCount,
      gradeBreakdown: gradeStats,
      questionResults,
    };

    // 4. Record to Supabase if authenticated session exists
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("mock_exam_sessions").insert({
          user_id: user.id,
          exam_id: examDef.id,
          score: correct,
          total_questions: total,
          started_at: startedAt,
          completed_at: new Date().toISOString(),
          answers: answers,
        });
      }
    } catch (dbErr) {
      // Non-blocking: local client will store attempt in history regardless
      console.warn("Could not log attempt to Supabase mock_exam_sessions:", dbErr);
    }

    return NextResponse.json({ success: true, attempt }, { status: 200 });
  } catch (error: any) {
    console.error("Error grading exam submission:", error);
    return NextResponse.json(
      { error: "Failed to grade exam submission", details: error?.message },
      { status: 500 }
    );
  }
}
