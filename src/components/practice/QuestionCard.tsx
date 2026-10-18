"use client";

import React from "react";
import {
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
  BarChart2,
} from "lucide-react";
import { ExamQuestion, UserAnswerRecord } from "@/types/curriculum";
import { MathRenderer } from "@/components/ui/MathRenderer";

interface QuestionCardProps {
  question: ExamQuestion;
  userAnswer?: UserAnswerRecord;
  onSelectOption: (optionId: "A" | "B" | "C" | "D") => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onSelectOption,
  onSubmitAnswer,
  onNextQuestion,
  onPrevQuestion,
  isFirst,
  isLast,
}) => {
  const isSubmitted = userAnswer?.isSubmitted ?? false;
  const selectedOptionId = userAnswer?.selectedOptionId ?? null;

  // Map difficulty to badge colors
  const difficultyBadge = {
    foundation: "bg-neutral-100 text-neutral-700 border-neutral-200",
    moderate: "bg-blue-50 text-blue-700 border-blue-200/80",
    advanced: "bg-purple-50 text-purple-700 border-purple-200/80",
  }[question.difficulty];

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all min-w-0">
      {/* Question Metadata Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-neutral-100">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {/* Historical EUEE Year */}
          {question.examYear && (
            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-950 px-2.5 py-1 text-xs font-medium text-white shadow-2xs shrink-0">
              <Calendar className="h-3 w-3 text-neutral-300" />
              <span>{question.examYear}</span>
            </span>
          )}

          {/* Unit Pill */}
          <span className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 border border-neutral-200 truncate max-w-[260px] sm:max-w-none">
            Unit {question.unitNumber}: {question.unitTitle}
          </span>
        </div>

        {/* Difficulty Pill */}
        <span
          className={`capitalize inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border shrink-0 ${difficultyBadge}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
          <span>{question.difficulty} Level</span>
        </span>
      </div>

      {/* Main Question Stem / Prompt */}
      <div className="py-5 sm:py-6">
        <h2 className="text-base sm:text-lg md:text-xl font-medium text-neutral-900 leading-relaxed font-sans select-text break-words">
          <MathRenderer content={question.prompt} />
        </h2>
      </div>

      {/* Multiple Choice Options List */}
      <div className="space-y-3" role="radiogroup" aria-label="Question Options">
        {question.options.map((option) => {
          const isOptionSelected = selectedOptionId === option.id;
          const isCorrectOption = option.id === question.correctOptionId;

          // Determine styling based on submission & selection
          let optionStyles =
            "border-neutral-200/80 bg-neutral-50/60 hover:bg-neutral-100/70 text-neutral-800 hover:border-neutral-300";
          let badgeStyles =
            "bg-white border-neutral-200 text-neutral-700 group-hover:border-neutral-300";

          if (!isSubmitted) {
            if (isOptionSelected) {
              optionStyles =
                "border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-600 shadow-2xs";
              badgeStyles = "bg-blue-600 border-blue-600 text-white font-bold";
            }
          } else {
            // Post-submission states
            if (isCorrectOption) {
              optionStyles =
                "border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 font-medium shadow-2xs";
              badgeStyles = "bg-emerald-600 border-emerald-600 text-white";
            } else if (isOptionSelected && !isCorrectOption) {
              optionStyles =
                "border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-400";
              badgeStyles = "bg-rose-600 border-rose-600 text-white";
            } else {
              optionStyles =
                "border-neutral-200/50 bg-neutral-50/30 text-neutral-400 opacity-60";
              badgeStyles = "bg-neutral-100 border-neutral-200 text-neutral-400";
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelectOption(option.id)}
              className={`group flex w-full items-center justify-between rounded-xl border p-3.5 sm:p-4 text-left transition-all duration-150 ${optionStyles} ${
                isSubmitted ? "cursor-default" : "cursor-pointer active:scale-[0.99]"
              }`}
              role="radio"
              aria-checked={isOptionSelected}
            >
              <div className="flex items-center gap-3 sm:gap-3.5 pr-2 sm:pr-4 min-w-0 flex-1">
                {/* Option Identifier Pill (A, B, C, D) */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold shadow-2xs transition-colors ${badgeStyles}`}
                >
                  {isSubmitted && isCorrectOption ? (
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  ) : isSubmitted && isOptionSelected && !isCorrectOption ? (
                    <X className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    option.id
                  )}
                </div>

                {/* Option Text */}
                <span className="text-sm sm:text-base font-normal leading-normal min-w-0 break-words flex-1">
                  <MathRenderer content={option.text} />
                </span>
              </div>

              {/* Status Icons or Keyboard Shortcut Badge */}
              <div className="shrink-0 flex items-center gap-2">
                {!isSubmitted && (
                  <span className="hidden sm:inline-flex rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-mono font-medium text-neutral-500 shadow-2xs group-hover:border-neutral-300">
                    {option.id}
                  </span>
                )}
                {isSubmitted && isCorrectOption && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    Correct
                  </span>
                )}
                {isSubmitted && isOptionSelected && !isCorrectOption && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md">
                    Your Choice
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Footer & Navigation Controls */}
      <div className="mt-8 pt-5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
        {/* Previous Button */}
        <div>
          <button
            type="button"
            disabled={isFirst}
            onClick={onPrevQuestion}
            className={`inline-flex items-center gap-1.5 rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 transition-colors shadow-2xs ${
              isFirst
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-neutral-50 hover:text-neutral-950 active:scale-[0.98]"
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>
        </div>

        {/* Primary Action Button (Check Answer or Next Question) */}
        <div className="flex items-center gap-3">
          {!isSubmitted ? (
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={onSubmitAnswer}
              className={`group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all ${
                selectedOptionId
                  ? "bg-neutral-950 text-white hover:bg-neutral-800 active:scale-[0.98] cursor-pointer"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200/70"
              }`}
            >
              <span>Check Answer</span>
              <span className="hidden sm:inline-block rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300">
                ↵
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextQuestion}
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
            >
              <span>{isLast ? "View Diagnostic Report" : "Next Question"}</span>
              <ArrowRight className="h-4 w-4 text-blue-200 transition-transform group-hover:translate-x-0.5" />
              <span className="hidden sm:inline-block rounded bg-blue-700/80 px-1.5 py-0.5 text-[10px] font-mono text-blue-100">
                ↵
              </span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
