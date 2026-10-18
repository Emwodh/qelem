"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_QUESTIONS } from "@/lib/mockQuestions";
import { UserAnswerRecord, ExamQuestion } from "@/types/curriculum";
import { PracticeHeader } from "@/components/practice/PracticeHeader";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { ExplanationDrawer } from "@/components/practice/ExplanationDrawer";
import { DiagnosticSummary } from "@/components/practice/DiagnosticSummary";

function PracticeWorkspace() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");

  const questions: ExamQuestion[] = MOCK_QUESTIONS;
  const totalQuestions = questions.length;

  const qParam = searchParams.get("q");
  const parsedQ = qParam ? parseInt(qParam, 10) - 1 : 0;
  const initialIndex = !isNaN(parsedQ) && parsedQ >= 0 && parsedQ < totalQuestions ? parsedQ : 0;

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  // Initialize state based on view parameter for deep-linking & testing
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>(() => {
    if (viewParam === "summary") {
      // Pre-seed realistic diagnostic session: 8 correct, 2 incorrect (80% score)
      return questions.map((q, idx) => {
        const isWrong = idx === 3 || idx === 7;
        const chosen = isWrong
          ? (q.options.find((o) => o.id !== q.correctOptionId)?.id ?? "A")
          : q.correctOptionId;
        return {
          questionId: q.id,
          selectedOptionId: chosen as "A" | "B" | "C" | "D",
          isSubmitted: true,
          isCorrect: !isWrong,
          timeSpentSeconds: 22 + (idx * 3),
        };
      });
    }

    if (viewParam === "answered") {
      // Pre-seed question answered correctly
      return questions.map((q, idx) => {
        if (idx === initialIndex) {
          return {
            questionId: q.id,
            selectedOptionId: q.correctOptionId,
            isSubmitted: true,
            isCorrect: true,
            timeSpentSeconds: 28,
          };
        }
        return {
          questionId: q.id,
          selectedOptionId: null,
          isSubmitted: false,
          isCorrect: false,
          timeSpentSeconds: 0,
        };
      });
    }

    if (viewParam === "incorrect") {
      // Pre-seed question answered incorrectly
      return questions.map((q, idx) => {
        if (idx === initialIndex) {
          const wrongOption = (q.options.find((o) => o.id !== q.correctOptionId)?.id ?? "A") as "A" | "B" | "C" | "D";
          return {
            questionId: q.id,
            selectedOptionId: wrongOption,
            isSubmitted: true,
            isCorrect: false,
            timeSpentSeconds: 35,
          };
        }
        return {
          questionId: q.id,
          selectedOptionId: null,
          isSubmitted: false,
          isCorrect: false,
          timeSpentSeconds: 0,
        };
      });
    }

    return questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: null,
      isSubmitted: false,
      isCorrect: false,
      timeSpentSeconds: 0,
    }));
  });

  const [timerSeconds, setTimerSeconds] = useState<number>(() => {
    if (viewParam === "summary") return 248; // 04:08
    if (viewParam === "answered" || viewParam === "incorrect") return 28;
    return 0;
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => viewParam === "summary");

  // Live timer interval
  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCompleted]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = userAnswers[currentIndex];

  // Option selection handler
  const handleSelectOption = useCallback(
    (optionId: "A" | "B" | "C" | "D") => {
      if (currentAnswer?.isSubmitted) return;

      setUserAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = {
          ...next[currentIndex],
          selectedOptionId: optionId,
        };
        return next;
      });
    },
    [currentAnswer, currentIndex]
  );

  // Submit answer
  const handleSubmitAnswer = useCallback(() => {
    if (!currentAnswer?.selectedOptionId || currentAnswer.isSubmitted) return;

    const isCorrect = currentAnswer.selectedOptionId === currentQuestion.correctOptionId;

    setUserAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = {
        ...next[currentIndex],
        isSubmitted: true,
        isCorrect,
      };
      return next;
    });
  }, [currentAnswer, currentQuestion, currentIndex]);

  // Next Question or Complete
  const handleNextQuestion = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIndex, totalQuestions]);

  // Previous Question
  const handlePrevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIndex]);

  // Retake practice session
  const handleRetake = () => {
    setUserAnswers(
      questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: null,
        isSubmitted: false,
        isCorrect: false,
        timeSpentSeconds: 0,
      }))
    );
    setCurrentIndex(0);
    setTimerSeconds(0);
    setIsCompleted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Keyboard shortcut support (A, B, C, D to pick; Enter to check/proceed)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;

      const key = e.key.toUpperCase();

      if (key === "A" || key === "B" || key === "C" || key === "D") {
        if (!currentAnswer?.isSubmitted) {
          handleSelectOption(key as "A" | "B" | "C" | "D");
        }
      } else if (e.key === "Enter") {
        if (!currentAnswer?.isSubmitted && currentAnswer?.selectedOptionId) {
          handleSubmitAnswer();
        } else if (currentAnswer?.isSubmitted) {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isCompleted,
    currentAnswer,
    handleSelectOption,
    handleSubmitAnswer,
    handleNextQuestion,
  ]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Top Session Header */}
      <PracticeHeader
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        subject={currentQuestion?.subject || "Curriculum"}
        grade={currentQuestion?.grade || 12}
        unitNumber={currentQuestion?.unitNumber || 1}
        unitTitle={currentQuestion?.unitTitle || "Practice"}
        timerSeconds={timerSeconds}
        isCompleted={isCompleted}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-5 sm:py-10 min-w-0">
        {!isCompleted ? (
          <div className="space-y-6">
            {/* Interactive Question Card */}
            <QuestionCard
              question={currentQuestion}
              userAnswer={currentAnswer}
              onSelectOption={handleSelectOption}
              onSubmitAnswer={handleSubmitAnswer}
              onNextQuestion={handleNextQuestion}
              onPrevQuestion={handlePrevQuestion}
              isFirst={currentIndex === 0}
              isLast={currentIndex === totalQuestions - 1}
            />

            {/* Instant Verified Solution & Derivation Drawer */}
            <ExplanationDrawer
              question={currentQuestion}
              userAnswer={currentAnswer}
            />

      {/* Quick Jump Navigation Pill Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span className="font-semibold text-neutral-700 mr-1 text-[11px] sm:text-xs">
                  Questions:
                </span>
                {questions.map((q, idx) => {
                  const ans = userAnswers[idx];
                  const isCurrent = idx === currentIndex;
                  const isDone = ans.isSubmitted;
                  const isRight = ans.isCorrect;

                  let dotStyle = "bg-neutral-200 text-neutral-600 hover:bg-neutral-300";
                  if (isDone) {
                    dotStyle = isRight
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white";
                  } else if (isCurrent) {
                    dotStyle = "ring-2 ring-blue-600 bg-white text-blue-700 font-bold";
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-5.5 w-5.5 sm:h-6 sm:w-6 rounded-md text-[10px] sm:text-[11px] font-mono flex items-center justify-center transition-all ${dotStyle}`}
                      title={`Go to Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Keyboard shortcuts reminder */}
              <div className="hidden md:flex items-center gap-2 text-[11px] text-neutral-400">
                <span>
                  Keys: <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-600">A</kbd>–<kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-600">D</kbd> select
                </span>
                <span>&bull;</span>
                <span>
                  <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-neutral-600">Enter ↵</kbd> submit / next
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Comprehensive Diagnostic Summary Screen */
          <DiagnosticSummary
            questions={questions}
            userAnswers={userAnswers}
            timerSeconds={timerSeconds}
            onRetake={handleRetake}
          />
        )}
      </main>

      {/* Studio Footer */}
      <footer className="border-t border-neutral-200/80 bg-white py-4 mt-auto w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-semibold text-neutral-900">Qelem</span>
            <span>&bull;</span>
            <span>Ethiopian Matric Engine (Grades 9–12)</span>
          </div>
          <div className="text-[11px] text-neutral-400">
            Aligned with Ethiopian MoE Curriculum Syllabus
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
      <PracticeWorkspace />
    </Suspense>
  );
}
