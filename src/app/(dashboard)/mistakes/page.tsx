"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  CheckCircle2,
  AlertCircle,
  Zap,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Filter,
  Check,
  X,
  Sparkles,
  ChevronRight,
  Award,
  Layers,
  HelpCircle,
} from "lucide-react";
import { MathRenderer } from "@/components/ui/MathRenderer";
import { ExamQuestion } from "@/types/curriculum";
import { MistakeBankItem, MistakeBankStats } from "@/types/mistake";
import {
  getMistakeItems,
  getMistakeStats,
  recordDrillAnswer,
  getQuestionsForDrill,
} from "@/lib/mistakeStore";

export default function MistakeBankPage() {
  const [items, setItems] = useState<MistakeBankItem[]>([]);
  const [stats, setStats] = useState<MistakeBankStats>({
    totalLogged: 0,
    activeWeaknesses: 0,
    oneStepAway: 0,
    graduatedCount: 0,
    bySubject: {},
  });
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"active" | "all" | "graduated">("active");

  // Interactive Drill Session State
  const [isDrillActive, setIsDrillActive] = useState<boolean>(false);
  const [drillQuestions, setDrillQuestions] = useState<ExamQuestion[]>([]);
  const [drillIndex, setDrillIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [drillFeedback, setDrillFeedback] = useState<{
    isCorrect: boolean;
    consecutiveCorrect: number;
    graduatedNow: boolean;
  } | null>(null);
  const [drillGraduatedCount, setDrillGraduatedCount] = useState<number>(0);

  // Load items and stats
  const refreshData = () => {
    const loaded = getMistakeItems();
    setItems(loaded);
    setStats(getMistakeStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered Items for List View
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedSubject !== "all" && item.subjectId !== selectedSubject) {
        return false;
      }
      if (selectedStatus === "active" && item.isGraduated) {
        return false;
      }
      if (selectedStatus === "graduated" && !item.isGraduated) {
        return false;
      }
      return true;
    });
  }, [items, selectedSubject, selectedStatus]);

  // Launch Drill Session
  const handleStartDrill = (questionSubset?: ExamQuestion[]) => {
    const questionsToDrill =
      questionSubset && questionSubset.length > 0
        ? questionSubset
        : getQuestionsForDrill({
            subjectId: selectedSubject === "all" ? undefined : selectedSubject,
            count: 10,
            status: selectedStatus === "all" ? "active" : selectedStatus,
          });

    if (questionsToDrill.length === 0) return;

    setDrillQuestions(questionsToDrill);
    setDrillIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setDrillFeedback(null);
    setDrillGraduatedCount(0);
    setIsDrillActive(true);
  };

  // Submit Answer in Drill
  const handleVerifyDrillAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    const currentQ = drillQuestions[drillIndex];
    if (!currentQ) return;

    const isCorrect = selectedOption === currentQ.correctOptionId;
    const result = recordDrillAnswer(currentQ.id, isCorrect);

    setIsAnswerSubmitted(true);
    setDrillFeedback({
      isCorrect,
      consecutiveCorrect: result.consecutiveCorrect,
      graduatedNow: result.graduatedNow,
    });

    if (result.graduatedNow) {
      setDrillGraduatedCount((prev) => prev + 1);
    }

    refreshData();
  };

  // Next Question in Drill
  const handleNextDrillQuestion = () => {
    if (drillIndex < drillQuestions.length - 1) {
      setDrillIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setDrillFeedback(null);
    } else {
      // Completed drill
      setIsDrillActive(false);
      refreshData();
    }
  };

  const currentDrillQuestion = drillQuestions[drillIndex];
  const currentMistakeItem = currentDrillQuestion
    ? items.find((i) => i.questionId === currentDrillQuestion.id)
    : null;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16 pt-4">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
              <Flame className="h-3.5 w-3.5 text-amber-600" />
              <span>Spaced Repetition Engine</span>
            </span>
            <span className="text-xs text-neutral-400 font-mono">2-Consecutive-Correct Rule</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Automated Mistake Bank
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Every question you miss during exams is automatically cataloged. Answer it correctly{" "}
            <strong className="text-neutral-900 font-bold">2 consecutive times</strong> to graduate it.
          </p>
        </div>

        {!isDrillActive && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={stats.activeWeaknesses === 0}
              onClick={() => handleStartDrill()}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Launch Drill Session ({Math.min(10, stats.activeWeaknesses || items.length)})</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Drill Room Screen */}
      {isDrillActive && currentDrillQuestion ? (
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-sm space-y-6">
          {/* Drill Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-700">
                Drill Question {drillIndex + 1} of {drillQuestions.length}
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                {currentDrillQuestion.subject} &bull; Grade {currentDrillQuestion.grade}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
                <span>Graduation Status:</span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-800 border border-amber-200 font-bold">
                  {currentMistakeItem?.consecutiveCorrect || 0} / 2 Correct
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDrillActive(false)}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 ml-3"
              >
                Exit Drill
              </button>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {currentDrillQuestion.unitTitle || "MoE Curriculum Item"}
            </div>
            <div className="text-base sm:text-lg font-medium text-neutral-950 leading-relaxed">
              <MathRenderer content={currentDrillQuestion.prompt} />
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentDrillQuestion.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrectKey = currentDrillQuestion.correctOptionId === opt.id;

              let btnStyle = "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800";
              let badgeStyle = "bg-neutral-100 text-neutral-700 border-neutral-200";

              if (isAnswerSubmitted) {
                if (isCorrectKey) {
                  btnStyle = "border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold";
                  badgeStyle = "bg-emerald-600 text-white border-emerald-600";
                } else if (isSelected && !isCorrectKey) {
                  btnStyle = "border-rose-500 bg-rose-50/70 text-rose-950";
                  badgeStyle = "bg-rose-600 text-white border-rose-600";
                } else {
                  btnStyle = "border-neutral-200/60 bg-neutral-50/50 text-neutral-400 opacity-60";
                }
              } else if (isSelected) {
                btnStyle = "border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-600";
                badgeStyle = "bg-indigo-600 text-white border-indigo-600";
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${btnStyle}`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${badgeStyle}`}>
                    {opt.id}
                  </span>
                  <div className="text-xs sm:text-sm pt-0.5 leading-snug">
                    <MathRenderer content={opt.text} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Verification Feedback Banner */}
          {isAnswerSubmitted && drillFeedback && (
            <div
              className={`rounded-xl border p-4 transition-all ${
                drillFeedback.isCorrect
                  ? drillFeedback.graduatedNow
                    ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                    : "border-blue-300 bg-blue-50 text-blue-950"
                  : "border-rose-300 bg-rose-50 text-rose-950"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {drillFeedback.isCorrect ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>
                      {drillFeedback.graduatedNow
                        ? "🎉 Mastered & Graduated! Cleared from active weaknesses."
                        : "Correct! Progress: 1/2. Answer correctly in your next session to graduate."}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-rose-600" />
                    <span>
                      Incorrect. Correct option was {currentDrillQuestion.correctOptionId}. Graduation streak reset to 0/2.
                    </span>
                  </>
                )}
              </div>

              {/* Step-by-Step Derivation */}
              {currentDrillQuestion.explanation && (
                <div className="mt-3 pt-3 border-t border-neutral-200/60 text-xs text-neutral-700 space-y-1">
                  <div className="font-bold text-neutral-900">Official Derivation & Logic:</div>
                  <div>
                    <MathRenderer content={currentDrillQuestion.explanation} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-400">
              Drill Session Progress: {drillIndex + 1} / {drillQuestions.length}
            </span>

            <div className="flex items-center gap-3">
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedOption}
                  onClick={handleVerifyDrillAnswer}
                  className="rounded-xl bg-neutral-950 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextDrillQuestion}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
                >
                  <span>{drillIndex < drillQuestions.length - 1 ? "Next Question" : "Finish Drill"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Metric Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-4 sm:p-5">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Logged</span>
                <Flame className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-950">
                {stats.totalLogged}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">Across all mock exams & sprints</p>
            </div>

            <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-4 sm:p-5">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Weaknesses</span>
                <AlertCircle className="h-4 w-4 text-rose-500" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-rose-600">
                {stats.activeWeaknesses}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">Requires 2 consecutive correct</p>
            </div>

            <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-4 sm:p-5">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-semibold uppercase tracking-wider">1 Step to Graduate</span>
                <Zap className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-blue-600">
                {stats.oneStepAway}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">Answer 1 more time to clear</p>
            </div>

            <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-4 sm:p-5">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Graduated / Mastered</span>
                <Award className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600">
                {stats.graduatedCount}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">2 consecutive correct answers</p>
            </div>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Subject Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Subjects" },
                { id: "physics", label: "Physics" },
                { id: "math-nat", label: "Mathematics" },
                { id: "chemistry", label: "Chemistry" },
                { id: "biology", label: "Biology" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedSubject === sub.id
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/70">
              <button
                type="button"
                onClick={() => setSelectedStatus("active")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  selectedStatus === "active" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Active Only ({stats.activeWeaknesses})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("graduated")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  selectedStatus === "graduated" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Graduated ({stats.graduatedCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("all")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  selectedStatus === "all" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                All ({stats.totalLogged})
              </button>
            </div>
          </div>

          {/* List of Cataloged Mistakes */}
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-12 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                {selectedStatus === "graduated"
                  ? "No graduated questions yet"
                  : "No active weaknesses found in this filter"}
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                {selectedStatus === "graduated"
                  ? "Answer active questions correctly 2 consecutive times in drills or mock exams to graduate them."
                  : "Questions you answer incorrectly during Mock Exams or Practice will automatically appear here for spaced repetition."}
              </p>
              <div className="pt-2">
                <Link
                  href="/mock-exams"
                  className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Take a Mock Exam</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const q = item.question;
                const isOneAway = item.consecutiveCorrect === 1;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-sm space-y-3 hover:border-neutral-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-100 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-900">{item.subject}</span>
                        <span className="text-neutral-400">&bull;</span>
                        <span className="text-neutral-600">Grade {item.grade}</span>
                        {item.unitTitle && (
                          <>
                            <span className="text-neutral-400">&bull;</span>
                            <span className="text-neutral-500">{item.unitTitle}</span>
                          </>
                        )}
                        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                          Failed {item.failCount} {item.failCount === 1 ? "time" : "times"}
                        </span>
                      </div>

                      {/* Graduation Badge */}
                      <div className="flex items-center gap-2">
                        {item.isGraduated ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Graduated / Mastered</span>
                          </span>
                        ) : isOneAway ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                            <Zap className="h-3.5 w-3.5 text-blue-600" />
                            <span>1 / 2 Correct &bull; 1 Step Away!</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                            <Flame className="h-3.5 w-3.5 text-amber-600" />
                            <span>0 / 2 Correct</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleStartDrill([q])}
                          className="rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
                        >
                          Practice
                        </button>
                      </div>
                    </div>

                    {/* Question Prompt */}
                    <div className="text-sm font-medium text-neutral-950 leading-relaxed">
                      <MathRenderer content={q.prompt} />
                    </div>

                    {/* Options Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600 pt-1">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`rounded-lg border px-3 py-2 ${
                            opt.id === q.correctOptionId
                              ? "border-emerald-300 bg-emerald-50/50 text-emerald-950 font-medium"
                              : "border-neutral-200/80 bg-neutral-50/50"
                          }`}
                        >
                          <span className="font-bold mr-2 text-neutral-800">{opt.id}.</span>
                          <MathRenderer content={opt.text} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
