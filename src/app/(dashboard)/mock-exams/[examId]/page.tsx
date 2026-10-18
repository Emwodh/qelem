"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Timer,
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Flag,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  HelpCircle,
} from "lucide-react";
import { OFFICIAL_MOCK_EXAMS, getQuestionsForExam, saveActiveAttempt, getActiveAttempt, clearActiveAttempt } from "@/lib/mockExamData";
import { MockExamDefinition, MockExamAttempt } from "@/types/exam";
import { ExamQuestion } from "@/types/curriculum";
import { MathRenderer } from "@/components/ui/MathRenderer";

export default function ExamTestRoomPage() {
  const params = useParams();
  const router = useRouter();
  const examId = (params?.examId as string) || "euee-2016-physics";

  // 1. Resolve Exam Definition
  const examDef: MockExamDefinition = useMemo(() => {
    const found = OFFICIAL_MOCK_EXAMS.find((e) => e.id === examId);
    if (found) return found;

    // Handle Custom Exam (e.g. custom-physics-30-60)
    if (examId.startsWith("custom-")) {
      const parts = examId.split("-");
      const sub = (parts[1] || "physics") as any;
      const count = Number(parts[2]) || 30;
      const duration = Number(parts[3]) || 60;
      const subName = sub === "physics" ? "Physics" : sub === "math-nat" ? "Mathematics" : sub === "chemistry" ? "Chemistry" : "Biology";

      return {
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

    return OFFICIAL_MOCK_EXAMS[0];
  }, [examId]);

  // 2. Exam Questions
  const questions: ExamQuestion[] = useMemo(() => {
    return getQuestionsForExam(examDef);
  }, [examDef]);

  // 3. State Management
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(examDef.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [completedAttempt, setCompletedAttempt] = useState<MockExamAttempt | null>(null);

  // Filter for review mode on scorecard
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "flagged">("all");

  // 4. Local-First Initialization & Restoration
  useEffect(() => {
    const saved = getActiveAttempt(examDef.id);
    if (saved) {
      setAnswers(saved.answers || {});
      setFlagged(saved.flagged || {});
      if (saved.isSubmitted) {
        setIsSubmitted(true);
        setCompletedAttempt(saved);
      } else if (saved.remainingSeconds > 0) {
        setRemainingSeconds(saved.remainingSeconds);
      }
    }
  }, [examDef.id]);

  // 5. Submit Handler
  const handleSubmitExam = useCallback(() => {
    let correct = 0;
    const gradeStats: Record<number, { total: number; correct: number; percent: number }> = {
      9: { total: 0, correct: 0, percent: 0 },
      10: { total: 0, correct: 0, percent: 0 },
      11: { total: 0, correct: 0, percent: 0 },
      12: { total: 0, correct: 0, percent: 0 },
    };

    questions.forEach((q) => {
      const g = q.grade || 12;
      if (!gradeStats[g]) gradeStats[g] = { total: 0, correct: 0, percent: 0 };
      gradeStats[g].total++;

      const chosen = answers[q.id];
      if (chosen === q.correctOptionId) {
        correct++;
        gradeStats[g].correct++;
      }
    });

    Object.keys(gradeStats).forEach((gKey) => {
      const g = Number(gKey);
      if (gradeStats[g].total > 0) {
        gradeStats[g].percent = Math.round((gradeStats[g].correct / gradeStats[g].total) * 100);
      }
    });

    const total = questions.length;
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = total - answeredCount;
    const scorePct = Math.round((correct / total) * 100);

    const attempt: MockExamAttempt = {
      examId: examDef.id,
      examTitle: examDef.title,
      subject: examDef.subject,
      subjectId: examDef.subjectId,
      startedAt: new Date().toISOString(),
      remainingSeconds: Math.max(0, remainingSeconds),
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
    };

    saveActiveAttempt(attempt);
    setCompletedAttempt(attempt);
    setIsSubmitted(true);
    setShowSubmitModal(false);
  }, [answers, flagged, examDef, questions, remainingSeconds]);

  // 6. Countdown Timer with auto-submit
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        const updated = prev - 1;

        // Periodic background resilience save
        if (updated % 10 === 0) {
          saveActiveAttempt({
            examId: examDef.id,
            examTitle: examDef.title,
            subject: examDef.subject,
            subjectId: examDef.subjectId,
            startedAt: new Date().toISOString(),
            remainingSeconds: updated,
            answers,
            flagged,
            isSubmitted: false,
          });
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, examDef, answers, flagged, handleSubmitExam]);

  // 7. Option Selection
  const handleSelectOption = (optId: "A" | "B" | "C" | "D") => {
    if (isSubmitted) return;
    const q = questions[currentIndex];
    if (!q) return;

    const newAnswers = { ...answers, [q.id]: optId };
    setAnswers(newAnswers);

    saveActiveAttempt({
      examId: examDef.id,
      examTitle: examDef.title,
      subject: examDef.subject,
      subjectId: examDef.subjectId,
      startedAt: new Date().toISOString(),
      remainingSeconds,
      answers: newAnswers,
      flagged,
      isSubmitted: false,
    });
  };

  // 8. Toggle Flag for Review
  const handleToggleFlag = () => {
    const q = questions[currentIndex];
    if (!q) return;

    const newFlagged = { ...flagged, [q.id]: !flagged[q.id] };
    setFlagged(newFlagged);

    saveActiveAttempt({
      examId: examDef.id,
      examTitle: examDef.title,
      subject: examDef.subject,
      subjectId: examDef.subjectId,
      startedAt: new Date().toISOString(),
      remainingSeconds,
      answers,
      flagged: newFlagged,
      isSubmitted: false,
    });
  };

  // 9. Keyboard Shortcuts Listener
  useEffect(() => {
    if (isSubmitted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === "1" || e.key.toLowerCase() === "a") handleSelectOption("A");
      if (e.key === "2" || e.key.toLowerCase() === "b") handleSelectOption("B");
      if (e.key === "3" || e.key.toLowerCase() === "c") handleSelectOption("C");
      if (e.key === "4" || e.key.toLowerCase() === "d") handleSelectOption("D");
      if (e.key.toLowerCase() === "f") handleToggleFlag();
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, questions.length, isSubmitted, handleSelectOption, handleToggleFlag]);

  // Format time HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isLowTime = remainingSeconds < 300; // < 5 mins
  const isMedTime = remainingSeconds < 900 && !isLowTime; // < 15 mins

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  const handleRetakeExam = () => {
    clearActiveAttempt(examDef.id);
    setAnswers({});
    setFlagged({});
    setRemainingSeconds(examDef.durationMinutes * 60);
    setIsSubmitted(false);
    setCompletedAttempt(null);
    setCurrentIndex(0);
  };

  // =========================================================================
  // VIEW A: POST-EXAM SCORECARD (When submitted)
  // =========================================================================
  if (isSubmitted && completedAttempt) {
    const scorePct = completedAttempt.scorePercentage || 0;
    const isPass = scorePct >= examDef.passingScorePercent;

    // Filter review questions
    const reviewQuestions = questions.filter((q) => {
      const isCorrect = answers[q.id] === q.correctOptionId;
      const isFlaggedQ = Boolean(flagged[q.id]);
      if (reviewFilter === "incorrect") return !isCorrect;
      if (reviewFilter === "flagged") return isFlaggedQ;
      return true;
    });

    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-in fade-in-50 duration-300">
        {/* Scorecard Header */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                  Official Scorecard
                </span>
                <span className="text-xs text-neutral-500 font-medium">{examDef.year}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
                {examDef.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRetakeExam}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Exam</span>
              </button>
              <Link
                href="/mock-exams"
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition-all"
              >
                <span>Back to Exam Catalog</span>
                <ArrowRight className="h-3.5 w-3.5 text-neutral-300" />
              </Link>
            </div>
          </div>

          {/* Core Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Percentage */}
            <div className="rounded-2xl border border-neutral-200/80 bg-[#FAFAFA] p-5 text-center">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                Total Score & Accuracy
              </span>
              <div className="mt-2 text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight">
                {scorePct}%
              </div>
              <p className="text-xs font-medium text-neutral-600 mt-1">
                {completedAttempt.correctCount} of {questions.length} Correct
              </p>
            </div>

            {/* National Percentile & Projection */}
            <div className="rounded-2xl border border-neutral-200/80 bg-[#FAFAFA] p-5 text-center md:col-span-2">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                National Entrance Projection
              </span>
              <div className="mt-2 flex items-center justify-center gap-2">
                <Award className="h-6 w-6 text-amber-500" />
                <span className="text-xl font-bold text-neutral-950">
                  {scorePct >= 85
                    ? "Top 3% — High Distinction Track"
                    : scorePct >= 70
                    ? "Top 12% — Competitive University Track"
                    : "Foundation Review Recommended"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                {scorePct >= 70
                  ? "Meets the historical cutoff for Addis Ababa University (AAU) Engineering and Technology faculties."
                  : "Target additional practice on Grade 11 and 12 advanced units to push past the 75% threshold."}
              </p>
            </div>

            {/* Pacing Stats */}
            <div className="rounded-2xl border border-neutral-200/80 bg-[#FAFAFA] p-5 text-center">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                Time Consumed
              </span>
              <div className="mt-2 text-2xl font-black text-neutral-950">
                {formatTime((examDef.durationMinutes * 60) - (completedAttempt.remainingSeconds || 0))}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Total Allocated: {examDef.durationMinutes} mins
              </p>
            </div>
          </div>

          {/* Curriculum Mastery Breakdown by Grade */}
          {completedAttempt.gradeBreakdown && (
            <div className="rounded-2xl border border-neutral-200/80 bg-[#FAFAFA] p-5 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Four-Year Curriculum Breakdown (Grades 9–12)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[9, 10, 11, 12].map((g) => {
                  const stat = completedAttempt.gradeBreakdown?.[g] || { total: 0, correct: 0, percent: 0 };
                  const isHigh = stat.percent >= 75;
                  return (
                    <div key={g} className="rounded-xl border border-neutral-200 bg-white p-3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-900">Grade {g}</span>
                        <span className={`font-bold ${isHigh ? "text-emerald-600" : "text-amber-600"}`}>
                          {stat.percent}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isHigh ? "bg-emerald-500" : "bg-amber-500"}`}
                          style={{ width: `${stat.percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 block">
                        {stat.correct} / {stat.total} items
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Question Review Mode */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
              <Layers className="h-5 w-5 text-neutral-700" />
              Question-by-Question Solution Review
            </h2>

            {/* Review Filter Tabs */}
            <div className="inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/60">
              <button
                type="button"
                onClick={() => setReviewFilter("all")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  reviewFilter === "all" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                All Questions ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter("incorrect")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  reviewFilter === "incorrect" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                Incorrect Only ({questions.length - (completedAttempt.correctCount || 0)})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter("flagged")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  reviewFilter === "flagged" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                Flagged ({flaggedCount})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {reviewQuestions.map((q, idx) => {
              const studentAnswer = answers[q.id];
              const isCorrect = studentAnswer === q.correctOptionId;
              const isUnanswered = !studentAnswer;

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
                          <span>Incorrect</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prompt */}
                  <div className="text-sm font-medium text-neutral-950 leading-relaxed">
                    <MathRenderer content={q.prompt} />
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt) => {
                      const isChosen = studentAnswer === opt.id;
                      const isAnswerKey = q.correctOptionId === opt.id;

                      let style = "border-neutral-200 bg-white text-neutral-700";
                      if (isAnswerKey) {
                        style = "border-emerald-300 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-300";
                      } else if (isChosen && !isAnswerKey) {
                        style = "border-rose-300 bg-rose-50 text-rose-950 line-through";
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs sm:text-sm ${style}`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              isAnswerKey
                                ? "bg-emerald-600 text-white"
                                : isChosen
                                ? "bg-rose-600 text-white"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <div className="flex-1">
                            <MathRenderer content={opt.text} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Derivation / Explanation Box */}
                  <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-4 space-y-1.5">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                      Step-by-Step Derivation & Formula:
                    </span>
                    <div className="text-xs text-neutral-700 leading-relaxed">
                      <MathRenderer content={q.explanation} />
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

  // =========================================================================
  // VIEW B: DISTRACTION-FREE EXAM TEST ROOM
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F7F7F6] text-neutral-900 pb-16">
      {/* 1. Exam Room Sticky Chrome Header */}
      <header className="sticky top-0 z-30 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Exam Title & Subject */}
          <div className="flex items-center gap-3">
            <Link
              href="/mock-exams"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              title="Exit exam room"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>

            <div>
              <h1 className="text-xs sm:text-sm font-bold text-neutral-950 truncate max-w-[200px] sm:max-w-md">
                {examDef.title}
              </h1>
              <span className="text-[11px] text-neutral-500 font-medium">
                Question {currentIndex + 1} of {questions.length} &bull; {examDef.year}
              </span>
            </div>
          </div>

          {/* Center / Right: Countdown Timer & Submit CTA */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-mono font-bold border transition-colors ${
                isLowTime
                  ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse"
                  : isMedTime
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "bg-neutral-100 border-neutral-200 text-neutral-900"
              }`}
            >
              <Clock className="h-4 w-4 shrink-0" />
              <span>{formatTime(remainingSeconds)}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-4 sm:px-5 text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
            >
              <span>Submit Exam</span>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Exam Arena */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question Stage (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-6">
            {currentQ ? (
              <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                {/* Meta Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-neutral-950 text-sm">
                      Question #{currentIndex + 1}
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-neutral-500 font-medium">
                      Grade {currentQ.grade} &bull; {currentQ.unitTitle}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleFlag}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      flagged[currentQ.id]
                        ? "bg-amber-50 border-amber-300 text-amber-800"
                        : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <Flag className={`h-3.5 w-3.5 ${flagged[currentQ.id] ? "fill-amber-500 text-amber-500" : ""}`} />
                    <span>{flagged[currentQ.id] ? "Flagged (Key F)" : "Flag for Review"}</span>
                  </button>
                </div>

                {/* Prompt */}
                <div className="text-base sm:text-lg font-medium text-neutral-950 leading-relaxed select-none">
                  <MathRenderer content={currentQ.prompt} />
                </div>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full flex items-center gap-3.5 rounded-2xl border p-4 text-left text-sm transition-all cursor-pointer ${
                          isSelected
                            ? "bg-neutral-950 border-neutral-950 text-white shadow-sm ring-1 ring-neutral-950"
                            : "bg-neutral-50/70 border-neutral-200 hover:border-neutral-400 hover:bg-white text-neutral-800"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold border transition-colors ${
                            isSelected
                              ? "bg-white text-neutral-950 border-white"
                              : "bg-white text-neutral-700 border-neutral-200"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="flex-1 font-medium">
                          <MathRenderer content={opt.text} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Bar */}
                <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous (←)</span>
                  </button>

                  <div className="text-xs text-neutral-400 font-medium hidden sm:block">
                    Keyboard: Keys 1-4 (A-D) &bull; Arrows to navigate &bull; &apos;F&apos; to flag
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentIndex === questions.length - 1}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-semibold shadow-sm disabled:opacity-40 transition-all"
                  >
                    <span>Next (→)</span>
                    <ChevronRight className="h-4 w-4 text-neutral-300" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right: Question Navigator Grid Palette (Cols 9-12) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Question Navigator
                </h2>
                <span className="text-xs font-semibold text-emerald-600">
                  {answeredCount} / {questions.length} Answered
                </span>
              </div>

              {/* Status Legend */}
              <div className="flex items-center justify-between text-[11px] text-neutral-500 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-neutral-950" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-amber-400" />
                  <span>Flagged</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md border border-neutral-300 bg-white" />
                  <span>Unanswered</span>
                </div>
              </div>

              {/* Number Buttons Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[460px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const isCurrent = currentIndex === idx;
                  const isAnswered = Boolean(answers[q.id]);
                  const isFlaggedQ = Boolean(flagged[q.id]);

                  let btnStyle = "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400";
                  if (isCurrent) {
                    btnStyle = "ring-2 ring-blue-600 font-extrabold";
                  }

                  if (isFlaggedQ) {
                    btnStyle += " bg-amber-50 text-amber-900 border-amber-300";
                  } else if (isAnswered) {
                    btnStyle += " bg-neutral-900 text-white border-neutral-900";
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative flex h-9 items-center justify-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${btnStyle}`}
                    >
                      <span>{idx + 1}</span>
                      {isFlaggedQ && (
                        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Submit CTA */}
              <div className="pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full h-10 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Review & Finish Exam</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-950">
                Submit Examination?
              </h3>
              <p className="text-xs text-neutral-500">
                Once submitted, your final score and national percentile prediction will be calculated.
              </p>
            </div>

            {/* Summary Counters */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-neutral-50 p-3.5 text-center text-xs">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Answered</span>
                <span className="font-extrabold text-neutral-900 text-base">{answeredCount}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Unanswered</span>
                <span className="font-extrabold text-rose-600 text-base">{questions.length - answeredCount}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Flagged</span>
                <span className="font-extrabold text-amber-600 text-base">{flaggedCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 h-11 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold text-xs transition-colors"
              >
                Return to Test
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="flex-1 h-11 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs shadow-sm transition-all"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
