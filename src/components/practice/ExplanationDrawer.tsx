"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sigma,
  BookOpen,
  Sparkles,
  Lock,
  ArrowRight,
  AlertTriangle,
  Zap,
  Eye,
  Check,
} from "lucide-react";
import { ExamQuestion, UserAnswerRecord } from "@/types/curriculum";
import { MathRenderer } from "@/components/ui/MathRenderer";
import { UpgradeModal } from "@/components/billing/UpgradeModal";

interface ExplanationDrawerProps {
  question: ExamQuestion;
  userAnswer?: UserAnswerRecord;
}

export const ExplanationDrawer: React.FC<ExplanationDrawerProps> = ({
  question,
  userAnswer,
}) => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isProUnlocked, setIsProUnlocked] = useState<boolean>(false);

  if (!userAnswer || !userAnswer.isSubmitted) return null;

  const isCorrect = userAnswer.isCorrect;
  const correctOption = question.options.find((opt) => opt.id === question.correctOptionId);

  return (
    <section 
      aria-label="Solution & Derivation"
      className="mt-6 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-all animate-in fade-in-50 slide-in-from-top-4 duration-300"
    >
      {/* Result Status Banner */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b ${
          isCorrect
            ? "border-emerald-200/80 bg-emerald-50/70"
            : "border-rose-200/80 bg-rose-50/70"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isCorrect ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-xs">
              <XCircle className="h-4.5 w-4.5" />
            </div>
          )}
          <div>
            <h4
              className={`text-sm font-semibold tracking-tight ${
                isCorrect ? "text-emerald-950" : "text-rose-950"
              }`}
            >
              {isCorrect ? "Correct Solution" : "Incorrect Answer"}
            </h4>
            <div
              className={`text-xs ${
                isCorrect ? "text-emerald-800/90" : "text-rose-800/90"
              }`}
            >
              {isCorrect ? (
                <span>Option {question.correctOptionId} is verified accurate.</span>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>
                    You selected {userAnswer.selectedOptionId || "none"}. Correct answer is Option {question.correctOptionId}:
                  </span>
                  <span className="font-semibold inline-flex items-center px-1.5 py-0.5 rounded bg-white/90 border border-rose-200 text-rose-950 shadow-2xs">
                    <MathRenderer content={correctOption?.text || ""} />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MoE Verified Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-neutral-700 shadow-2xs border border-neutral-200/80">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          <span>MoE Curriculum Verified</span>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Conceptual Principle */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-neutral-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Core Concept & Rule
            </span>
          </div>
          <div className="text-sm text-neutral-800 leading-relaxed font-normal bg-neutral-50/70 rounded-xl p-3.5 border border-neutral-200/70">
            <MathRenderer content={question.explanation} />
          </div>
        </div>

        {/* Key Equation Callout */}
        {question.keyFormula && (
          <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-4 text-white shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                <Sigma className="h-3.5 w-3.5 text-blue-400" />
                <span>Primary Governing Formula</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                Unit {question.unitNumber}
              </span>
            </div>
            <div className="text-base sm:text-lg font-mono font-semibold text-blue-300 tracking-wide">
              <MathRenderer content={question.keyFormula} displayMode />
            </div>
          </div>
        )}

        {/* Step-by-Step Derivation */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Step-by-Step Derivation ({question.derivationSteps.length} Steps)
            </h5>
            {question.examYear && (
              <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                {question.examYear}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {question.derivationSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-neutral-200/70 bg-white p-3 sm:p-3.5 transition-colors hover:bg-neutral-50/50 shadow-2xs min-w-0"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs font-semibold text-neutral-700 border border-neutral-200">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1 break-words text-xs sm:text-sm font-mono text-neutral-800 leading-relaxed pt-0.5">
                  <MathRenderer content={step} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Pro Gated - Examiner Insights & Distractor Analysis */}
        <div className="pt-4 border-t border-neutral-200/90 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 fill-white" />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <span>Examiner Insights & Distractor Traps</span>
                  <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[9px] px-2 py-0.2 font-bold tracking-tight">
                    PRO TIER
                  </span>
                </h5>
              </div>
            </div>

            {/* Pro status or preview toggle */}
            <div className="flex items-center gap-2">
              {isProUnlocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Pro Pass Unlocked</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsProUnlocked(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                  title="Simulate Pro pass access without checkout"
                >
                  Quick Demo: Unlock Pro
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed -mt-1">
            National EUEE exam writers deliberately engineer incorrect options to trap candidates who make common arithmetic, unit conversion, or conceptual sign blunders.
          </p>

          {isProUnlocked ? (
            /* Unlocked Pro Content */
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Examiner Insight Callout */}
              {question.examinerInsight && (
                <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/60 p-4 text-xs text-indigo-950 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                    <Zap className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Examiner Psychology Note:</span>
                  </div>
                  <div className="leading-relaxed text-neutral-800 font-normal">
                    <MathRenderer content={question.examinerInsight} />
                  </div>
                </div>
              )}

              {/* Distractor Traps Grid / List */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">
                  Why the Other Choices Are Traps:
                </span>

                {question.distractorAnalysis && question.distractorAnalysis.length > 0 ? (
                  question.distractorAnalysis.map((distractor) => (
                    <div
                      key={distractor.optionId}
                      className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 space-y-1.5 text-xs transition-colors hover:bg-neutral-50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-neutral-900 text-white font-mono text-[10px] font-bold">
                            {distractor.optionId}
                          </span>
                          <span className="font-semibold text-neutral-900">
                            Option {distractor.optionId} Trap
                          </span>
                        </div>
                        <span className="rounded bg-rose-100/80 px-2 py-0.5 text-[10px] font-semibold text-rose-800 border border-rose-200">
                          {distractor.commonErrorType}
                        </span>
                      </div>
                      <div className="text-neutral-700 leading-relaxed pl-7">
                        <MathRenderer content={distractor.trapExplanation} />
                      </div>
                    </div>
                  ))
                ) : (
                  /* Fallback if question has no custom distractors */
                  <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 text-xs text-neutral-600">
                    Distractor analysis for remaining choices is verified in accordance with official MoE marking schemes.
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsProUnlocked(false)}
                  className="text-[11px] text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  Reset to Locked State
                </button>
              </div>
            </div>
          ) : (
            /* Gated Free Tier Callout */
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-50/60 p-5 sm:p-6 text-center space-y-4">
              {/* Blurred teaser behind */}
              <div className="opacity-40 filter blur-[1.5px] select-none pointer-events-none space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                  <span className="h-5 w-5 rounded bg-neutral-200 flex items-center justify-center">A</span>
                  <span>Option A Trap: Metric conversion oversight (multiplied by 10 instead of 10^-4)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                  <span className="h-5 w-5 rounded bg-neutral-200 flex items-center justify-center">C</span>
                  <span>Option C Trap: Extremum sign inverted; failed to check second derivative concavity</span>
                </div>
              </div>

              {/* Elevated Action Card */}
              <div className="relative z-10 max-w-md mx-auto space-y-3 pt-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
                  <Lock className="h-4.5 w-4.5 text-amber-700" />
                </div>

                <div className="space-y-1">
                  <h6 className="text-sm font-bold text-neutral-950">
                    Unlock Examiner Traps & Distractor Insights
                  </h6>
                  <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                    Know exactly how national exam writers design options B, C, and D as traps. See the exact common algebra slips, formula misapplications, and sign errors.
                  </p>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>Upgrade to Pro via Chapa (499 ETB)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Syllabus Footer Tag */}
        <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500">
          <span className="min-w-0 break-words">
            Grade {question.grade} &bull; Unit {question.unitNumber}: {question.unitTitle}
          </span>
          <span className="capitalize font-medium text-neutral-600 shrink-0">
            Difficulty: {question.difficulty}
          </span>
        </div>
      </div>

      {/* Chapa Pro Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        triggerContext="Examiner Trap & Distractor Analysis"
        onSuccess={() => {
          setIsProUnlocked(true);
        }}
      />
    </section>
  );
};
