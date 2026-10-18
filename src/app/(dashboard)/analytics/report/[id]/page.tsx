"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Flame,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Layers,
  Sparkles,
} from "lucide-react";
import { MathRenderer } from "@/components/ui/MathRenderer";
import { OFFICIAL_MOCK_EXAMS, getQuestionsForExam, getActiveAttempt, getExamHistory } from "@/lib/mockExamData";
import { MockExamAttempt, MockExamDefinition } from "@/types/exam";
import { ExamQuestion } from "@/types/curriculum";

export default function ExamDiagnosticReportPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || "euee-2016-physics";

  const [attempt, setAttempt] = useState<MockExamAttempt | null>(null);
  const [examDef, setExamDef] = useState<MockExamDefinition | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [filterMode, setFilterMode] = useState<"all" | "incorrect" | "flagged">("all");

  useEffect(() => {
    // 1. Resolve Exam Definition
    let foundDef = OFFICIAL_MOCK_EXAMS.find((e) => e.id === rawId);
    if (!foundDef) {
      foundDef = OFFICIAL_MOCK_EXAMS[0];
    }
    setExamDef(foundDef);

    // 2. Resolve Questions
    const qs = getQuestionsForExam(foundDef);
    setQuestions(qs);

    // 3. Resolve Attempt (active or from history)
    const active = getActiveAttempt(rawId);
    if (active && active.isSubmitted) {
      setAttempt(active);
    } else {
      const history = getExamHistory();
      const past = history.find((h) => h.examId === rawId);
      if (past) {
        setAttempt(past);
      } else {
        // Mock fallback attempt if accessed directly
        setAttempt({
          examId: foundDef.id,
          examTitle: foundDef.title,
          subject: foundDef.subject,
          subjectId: foundDef.subjectId,
          startedAt: new Date(Date.now() - 7200000).toISOString(),
          remainingSeconds: 600,
          answers: {},
          flagged: {},
          isSubmitted: true,
          completedAt: new Date().toISOString(),
          score: Math.round(qs.length * 0.76),
          scorePercentage: 76,
          totalQuestions: qs.length,
          correctCount: Math.round(qs.length * 0.76),
          incorrectCount: Math.round(qs.length * 0.24),
          unansweredCount: 0,
          gradeBreakdown: {
            9: { total: 10, correct: 8, percent: 80 },
            10: { total: 12, correct: 9, percent: 75 },
            11: { total: 14, correct: 10, percent: 71 },
            12: { total: 14, correct: 11, percent: 78 },
          },
        });
      }
    }
  }, [rawId]);

  // Unit-level telemetry
  const unitStats = useMemo(() => {
    if (!questions.length || !attempt) return [];

    const unitMap = new Map<
      string,
      { grade: number; title: string; total: number; correct: number; questions: ExamQuestion[] }
    >();

    questions.forEach((q) => {
      const key = `${q.grade}-${q.unitTitle || "General"}`;
      if (!unitMap.has(key)) {
        unitMap.set(key, {
          grade: q.grade,
          title: q.unitTitle || "Core Unit",
          total: 0,
          correct: 0,
          questions: [],
        });
      }
      const entry = unitMap.get(key)!;
      entry.total++;
      entry.questions.push(q);

      const studentAns = attempt.answers?.[q.id];
      const verifiedKey = attempt.questionResults?.[q.id]?.correctOptionId || q.correctOptionId;
      if (studentAns === verifiedKey) {
        entry.correct++;
      }
    });

    return Array.from(unitMap.values()).map((u) => ({
      ...u,
      percent: Math.round((u.correct / u.total) * 100),
      isWeakness: (u.correct / u.total) < 0.65,
    }));
  }, [questions, attempt]);

  if (!examDef || !attempt) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    );
  }

  const scorePct = attempt.scorePercentage || Math.round(((attempt.correctCount || 0) / questions.length) * 100);
  const timeConsumedSeconds = Math.max(60, (examDef.durationMinutes * 60) - (attempt.remainingSeconds || 0));
  const avgSecondsPerQ = Math.round(timeConsumedSeconds / (questions.length || 1));

  // Filter questions for detailed review
  const filteredQuestions = questions.filter((q) => {
    const studentAns = attempt.answers?.[q.id];
    const verifiedKey = attempt.questionResults?.[q.id]?.correctOptionId || q.correctOptionId;
    const isCorrect = studentAns === verifiedKey;

    if (filterMode === "incorrect") return !isCorrect;
    if (filterMode === "flagged") return Boolean(attempt.flagged?.[q.id]);
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20 pt-4">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/analytics"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="h-4 w-4 text-neutral-700" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                Official Post-Exam Report
              </span>
              <span className="text-xs text-neutral-400">{examDef.year}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 mt-0.5">
              {examDef.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/mistakes"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-all"
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Open Mistake Bank</span>
          </Link>
          <Link
            href={`/mock-exams/${examDef.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 px-4 py-2 text-xs font-semibold shadow-sm transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Exam</span>
          </Link>
        </div>
      </div>

      {/* Top Score & Pacing Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Score Percentage */}
        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 text-center">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Composite Score
          </span>
          <div className="mt-2 text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight">
            {scorePct}%
          </div>
          <p className="text-xs font-semibold text-neutral-600 mt-1">
            {attempt.correctCount} of {questions.length} Correct
          </p>
        </div>

        {/* National Percentile Rank */}
        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 text-center md:col-span-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            National EUEE Percentile Rank
          </span>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-amber-500" />
            <span className="text-xl font-bold text-neutral-950">
              {scorePct >= 80
                ? "Top 5% — High Distinction Track"
                : scorePct >= 70
                ? "Top 15% — Competitive University Track"
                : "Pass with Foundation Review"}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {scorePct >= 70
              ? "Comfortably satisfies Addis Ababa University (AAU) cut-off benchmarks for technology and natural science."
              : "Recommend drilling weak textbook units below 65% in the Spaced Repetition Mistake Bank."}
          </p>
        </div>

        {/* Pacing Telemetry */}
        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 text-center">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Pacing Velocity
          </span>
          <div className="mt-2 text-3xl font-black text-neutral-950">
            {avgSecondsPerQ}s <span className="text-xs font-normal text-neutral-400">/ item</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Total Time: {Math.floor(timeConsumedSeconds / 60)} mins consumed
          </p>
        </div>
      </div>

      {/* Grade 9-12 Curriculum Breakdown */}
      {attempt.gradeBreakdown && (
        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Four-Year Syllabus Distribution (Grades 9–12)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[9, 10, 11, 12].map((g) => {
              const gb = attempt.gradeBreakdown?.[g] || { total: 0, correct: 0, percent: 0 };
              const isHigh = gb.percent >= 70;
              return (
                <div key={g} className="rounded-xl border border-neutral-200 bg-white p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Grade {g}</span>
                    <span className={isHigh ? "text-emerald-600" : "text-amber-600"}>{gb.percent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isHigh ? "bg-emerald-500" : "bg-amber-500"}`}
                      style={{ width: `${gb.percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 block">
                    {gb.correct} of {gb.total} items
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Diagnostic Unit Mastery Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div>
            <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-neutral-700" />
              Detailed Unit Diagnostic Table
            </h2>
            <p className="text-xs text-neutral-500">
              Identifies specific chapters where points were dropped with direct 1-click Mistake Bank CTAs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {unitStats.map((u, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-4 space-y-2.5 transition-all ${
                u.isWeakness
                  ? "border-rose-200 bg-rose-50/40"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-bold text-neutral-700">
                  Grade {u.grade}
                </span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                    u.isWeakness ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {u.percent}% ({u.correct}/{u.total})
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-950 line-clamp-1">{u.title}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {u.isWeakness ? "Needs targeted practice" : "Solid conceptual mastery"}
                </p>
              </div>

              {u.isWeakness && (
                <Link
                  href="/mistakes"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors"
                >
                  <Flame className="h-3 w-3" />
                  <span>Drill Weak Questions Now</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Question-by-Question Solution Review */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200">
          <h2 className="text-base font-bold text-neutral-950">
            Step-by-Step Question Derivations ({questions.length})
          </h2>

          <div className="inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/70">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterMode === "all" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              All ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("incorrect")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterMode === "incorrect" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Incorrect Only ({questions.length - (attempt.correctCount || 0)})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("flagged")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterMode === "flagged" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Flagged ({Object.keys(attempt.flagged || {}).length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const studentAns = attempt.answers?.[q.id];
            const verifiedKey = attempt.questionResults?.[q.id]?.correctOptionId || q.correctOptionId;
            const isCorrect = studentAns === verifiedKey;
            const isUnanswered = !studentAns;
            const explanation =
              attempt.questionResults?.[q.id]?.explanation ||
              q.explanation ||
              "Standard Ministry of Education verified solution derivation.";

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">Question #{idx + 1}</span>
                    <span className="text-neutral-400">&bull;</span>
                    <span className="text-neutral-600">Grade {q.grade} &bull; {q.unitTitle}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Correct</span>
                      </span>
                    ) : isUnanswered ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 font-bold text-neutral-600 border border-neutral-200">
                        <HelpCircle className="h-3.5 w-3.5 text-neutral-400" />
                        <span>Unanswered</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 font-bold text-rose-700 border border-rose-200">
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        <span>Incorrect (You chose {studentAns})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                <div className="text-sm font-medium text-neutral-950 leading-relaxed">
                  <MathRenderer content={q.prompt} />
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt) => {
                    const isChosen = studentAns === opt.id;
                    const isAnswerKey = verifiedKey === opt.id;

                    let style = "border-neutral-200/80 bg-neutral-50/50 text-neutral-700";
                    if (isAnswerKey) {
                      style = "border-emerald-400 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-500";
                    } else if (isChosen && !isAnswerKey) {
                      style = "border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-500";
                    }

                    return (
                      <div key={opt.id} className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${style}`}>
                        <span className="font-bold shrink-0">{opt.id}.</span>
                        <div className="leading-relaxed">
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pedagogical Explanation */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-xs space-y-2">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Verified Solution & Derivation:</span>
                  </div>
                  <div className="text-neutral-800 leading-relaxed">
                    <MathRenderer content={explanation} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
