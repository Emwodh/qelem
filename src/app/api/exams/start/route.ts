import { NextRequest, NextResponse } from "next/server";
import { OFFICIAL_MOCK_EXAMS, getQuestionsForExam } from "@/lib/mockExamData";
import { MockExamDefinition, SanitizedExamQuestion, ExamStartResponse } from "@/types/exam";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const examId = body.examId || request.nextUrl.searchParams.get("examId") || "euee-2016-physics";

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

    // 2. Fetch full question bank for this exam
    const fullQuestions = getQuestionsForExam(examDef);

    // 3. STRICT SECURITY SANITIZATION (PRD Section 4.3 & 10)
    // Strip correct answers, solutions, and derivations so candidates cannot inspect network traffic
    const sanitizedQuestions: SanitizedExamQuestion[] = fullQuestions.map((q) => {
      const {
        correctOptionId,
        explanation,
        derivationSteps,
        distractorAnalysis,
        examinerInsight,
        ...safeFields
      } = q;
      return safeFields;
    });

    const responsePayload: ExamStartResponse = {
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      examDef,
      questions: sanitizedQuestions,
      startedAt: new Date().toISOString(),
      durationMinutes: examDef.durationMinutes,
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: any) {
    console.error("Error starting exam session:", error);
    return NextResponse.json(
      { error: "Failed to initialize secure exam session", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Allow GET for easy client inspection and preloading
  return POST(request);
}
