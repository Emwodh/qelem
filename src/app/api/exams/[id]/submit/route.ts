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
        // A. Log exam attempt session
        await supabase.from("mock_exam_sessions").insert({
          user_id: user.id,
          exam_id: examDef.id,
          score: correct,
          total_questions: total,
          started_at: startedAt,
          completed_at: new Date().toISOString(),
          answers: answers,
        });

        // B. Automated Mistake Ingestion & Spaced Repetition Graduation
        const now = new Date().toISOString();
        const incorrectList = questions.filter((q) => answers[q.id] && answers[q.id] !== q.correctOptionId);
        const correctList = questions.filter((q) => answers[q.id] === q.correctOptionId);

        // Upsert incorrect items into mistake_bank
        for (const q of incorrectList) {
          try {
            const { data: existing } = await supabase
              .from("mistake_bank")
              .select("id, fail_count")
              .eq("user_id", user.id)
              .eq("question_id", q.id)
              .maybeSingle();

            if (existing) {
              await supabase
                .from("mistake_bank")
                .update({
                  fail_count: (existing.fail_count || 1) + 1,
                  consecutive_correct: 0,
                  is_graduated: false,
                  last_attempted_at: now,
                  updated_at: now,
                })
                .eq("id", existing.id);
            } else {
              await supabase.from("mistake_bank").insert({
                user_id: user.id,
                question_id: q.id,
                subject: examDef.subject,
                subject_id: examDef.subjectId,
                grade: q.grade,
                fail_count: 1,
                consecutive_correct: 0,
                is_graduated: false,
                last_attempted_at: now,
              });
            }
          } catch (mErr) {
            console.warn("Could not upsert mistake item:", q.id, mErr);
          }
        }

        // Advance Spaced Repetition graduation for questions answered correctly
        for (const q of correctList) {
          try {
            const { data: existing } = await supabase
              .from("mistake_bank")
              .select("id, consecutive_correct, is_graduated")
              .eq("user_id", user.id)
              .eq("question_id", q.id)
              .eq("is_graduated", false)
              .maybeSingle();

            if (existing) {
              const newStreak = (existing.consecutive_correct || 0) + 1;
              await supabase
                .from("mistake_bank")
                .update({
                  consecutive_correct: newStreak,
                  is_graduated: newStreak >= 2,
                  last_attempted_at: now,
                  updated_at: now,
                })
                .eq("id", existing.id);
            }
          } catch (cErr) {
            console.warn("Could not update graduation progress:", q.id, cErr);
          }
        }
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
