"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ShieldCheck,
  Zap,
  Target,
  X,
  GraduationCap,
  Atom,
  BookOpen,
  Mail,
  Lock,
  User,
  Loader2,
} from "lucide-react";
import { ExamQuestion, UserAnswerRecord } from "@/types/curriculum";
import { ExamStream } from "@/types/user";
import { saveUserProfile, TARGET_UNIVERSITIES } from "@/lib/userStore";
import { createClient as createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { MathRenderer } from "@/components/ui/MathRenderer";

interface DiagnosticSummaryProps {
  questions: ExamQuestion[];
  userAnswers: UserAnswerRecord[];
  timerSeconds: number;
  onRetake: () => void;
}

export const DiagnosticSummary: React.FC<DiagnosticSummaryProps> = ({
  questions,
  userAnswers,
  timerSeconds,
  onRetake,
}) => {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<ExamStream>("natural");
  const [targetUniversity, setTargetUniversity] = useState<string>(TARGET_UNIVERSITIES[0]);

  const totalQuestions = questions.length;
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  const avgSeconds = Math.round(timerSeconds / (totalQuestions || 1));

  // Determine tier & feedback
  const getTierInfo = (percent: number) => {
    if (percent >= 80) {
      return {
        badge: "Top 5% — University Distinction Track",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        message:
          "Exceptional performance! Your speed and conceptual derivation accuracy place you in the highest bracket for Addis Ababa University (AAU) and ASTU engineering/medical placement.",
      };
    }
    if (percent >= 60) {
      return {
        badge: "Competitive Matric Track — Good Foundation",
        color: "text-blue-700 bg-blue-50 border-blue-200",
        message:
          "Solid comprehension of Grade 11 & 12 concepts. Targeting the step-by-step derivations on your missed items will push you directly into top percentile ranks.",
      };
    }
    return {
      badge: "Foundation Reinforcement Recommended",
      color: "text-amber-700 bg-amber-50 border-amber-200",
      message:
        "Focus on fundamental formulas in Electromagnetism and Calculus. Review the step-by-step derivations below before re-attempting.",
    };
  };

  const tierInfo = getTierInfo(scorePercent);

  // Group performance by subject
  const physicsQuestions = questions.filter((q) => q.subjectId === "physics");
  const physicsCorrect = physicsQuestions.filter((q) => {
    const ans = userAnswers.find((a) => a.questionId === q.id);
    return ans?.isCorrect;
  }).length;

  const mathQuestions = questions.filter((q) => q.subjectId === "math-nat");
  const mathCorrect = mathQuestions.filter((q) => {
    const ans = userAnswers.find((a) => a.questionId === q.id);
    return ans?.isCorrect;
  }).length;

  // Identify weakest topic from missed questions
  const firstMissed = userAnswers.find((a) => !a.isCorrect);
  const missedQuestion = firstMissed
    ? questions.find((q) => q.id === firstMissed.questionId)
    : null;
  const computedWeakestTopic = missedQuestion
    ? `Unit ${missedQuestion.unitNumber}: ${missedQuestion.unitTitle}`
    : "Unit 4: Coordinate Geometry & Conic Sections";

  const handleSaveAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const trimmedName = candidateName.trim() || "Candidate";
    const trimmedEmail = email.trim().toLowerCase();

    try {
      if (isSupabaseConfigured()) {
        const supabase = createSupabaseClient();
        let userId: string | null = null;

        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email: trimmedEmail,
            password,
            options: {
              data: {
                full_name: trimmedName,
                stream: selectedStream,
                target_university: targetUniversity,
              },
            },
          });

          if (error) {
            if (error.message.toLowerCase().includes("already registered")) {
              const signInRes = await supabase.auth.signInWithPassword({
                email: trimmedEmail,
                password,
              });
              if (signInRes.error) throw signInRes.error;
              userId = signInRes.data.user?.id || null;
            } else {
              throw error;
            }
          } else {
            userId = data.user?.id || null;
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });
          if (error) throw error;
          userId = data.user?.id || null;
        }

        if (userId) {
          // Sync profile to database
          await supabase.from("profiles").upsert({
            id: userId,
            full_name: trimmedName,
            email: trimmedEmail,
            stream: selectedStream,
            target_university: targetUniversity,
            grade: 12,
            target_score: 585,
          });

          // Insert verified practice session record
          await supabase.from("practice_sessions").insert({
            user_id: userId,
            stream: selectedStream,
            score_percentage: scorePercent,
            total_questions: totalQuestions,
            correct_count: correctCount,
            time_spent_seconds: timerSeconds,
            weakest_topic: computedWeakestTopic,
            predicted_tier: tierInfo.badge,
          });
        }
      }
    } catch (err: unknown) {
      console.warn("Supabase auth sync notice:", err instanceof Error ? err.message : err);
    } finally {
      // Local fallback / cache
      saveUserProfile({
        name: trimmedName,
        email: trimmedEmail,
        stream: selectedStream,
        grade: 12,
        targetUniversity,
        latestDiagnosticScore: scorePercent,
        diagnosticTotalQuestions: totalQuestions,
        diagnosticCorrectCount: correctCount,
        diagnosticCompletedAt: new Date().toISOString(),
        weakestTopic: computedWeakestTopic,
        predictedTier: tierInfo.badge,
      });

      setAuthLoading(false);
      setIsSaveModalOpen(false);
      router.push("/dashboard");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Top Banner / Hero Score Card */}
      <section className="overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] text-center relative">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-sm mb-4">
          <Trophy className="h-7 w-7 text-amber-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Diagnostic Assessment Complete
        </h1>
        <p className="mt-2 text-sm text-neutral-600 max-w-xl mx-auto">
          Here is your calibrated breakdown based on official Ethiopian University Entrance
          Examination (EUEE) benchmarks.
        </p>

        {/* Readiness Badge */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold shadow-2xs">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${tierInfo.color}`}>
            <Sparkles className="h-3.5 w-3.5" />
            {tierInfo.badge}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          {/* Overall Score */}
          <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total Score
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight">
                {scorePercent}%
              </span>
              <span className="text-xs text-neutral-500">
                ({correctCount}/{totalQuestions})
              </span>
            </div>
          </div>

          {/* Time Elapsed */}
          <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total Time
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-neutral-950 font-mono tracking-tight">
                {formatTime(timerSeconds)}
              </span>
            </div>
          </div>

          {/* Average Pace */}
          <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Average Pace
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-neutral-950 font-mono tracking-tight">
                {avgSeconds}s
              </span>
              <span className="text-xs text-neutral-500">/item</span>
            </div>
          </div>

          {/* MoE Verified Status */}
          <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Syllabus Standard
            </span>
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              <span>MoE Verified</span>
            </div>
          </div>
        </div>

        {/* Subject Breakdown Bars */}
        <div className="mt-6 max-w-xl mx-auto pt-6 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {physicsQuestions.length > 0 && (
            <div className="rounded-xl border border-neutral-200/70 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-medium text-neutral-700 mb-1.5">
                <span className="font-semibold text-neutral-900">Physics (Grades 11–12)</span>
                <span>
                  {physicsCorrect}/{physicsQuestions.length} (
                  {Math.round((physicsCorrect / physicsQuestions.length) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((physicsCorrect / physicsQuestions.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {mathQuestions.length > 0 && (
            <div className="rounded-xl border border-neutral-200/70 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-medium text-neutral-700 mb-1.5">
                <span className="font-semibold text-neutral-900">Maths (Grades 11–12)</span>
                <span>
                  {mathCorrect}/{mathQuestions.length} (
                  {Math.round((mathCorrect / mathQuestions.length) * 100)}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((mathCorrect / mathQuestions.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            id="save-progress-cta-hero"
            onClick={() => setIsSaveModalOpen(true)}
            className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
          >
            <Bookmark className="h-4 w-4 text-blue-200" />
            <span>Save Progress & View Personal Roadmap</span>
            <ArrowRight className="h-4 w-4 text-blue-200 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 shadow-2xs transition-all hover:bg-neutral-50 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4 text-neutral-500" />
            <span>Retake Practice</span>
          </button>

          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 shadow-2xs transition-all hover:bg-neutral-50 hover:text-neutral-950 active:scale-[0.98]"
          >
            <span>Overview</span>
          </Link>
        </div>
      </section>

      {/* Question-by-Question Review Breakdown */}
      <section className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-neutral-100">
          <div>
            <h3 className="text-lg font-bold text-neutral-950">
              Detailed Question Analysis ({totalQuestions} Items)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Click any question to view the full step-by-step mathematical derivation.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700 border border-emerald-200/70">
              <CheckCircle2 className="h-3.5 w-3.5" /> {correctCount} Correct
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 font-medium text-rose-700 border border-rose-200/70">
              <XCircle className="h-3.5 w-3.5" /> {totalQuestions - correctCount} Incorrect
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {questions.map((question, idx) => {
            const answer = userAnswers.find((a) => a.questionId === question.id);
            const isCorrect = answer?.isCorrect ?? false;
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={question.id}
                className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/40 transition-all hover:border-neutral-300"
              >
                {/* Header row / toggle */}
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-neutral-50"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 sm:gap-4 pr-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-200/70 text-xs font-bold text-neutral-700 font-mono">
                      Q{idx + 1}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-900">
                          {question.subject}
                        </span>
                        <span className="text-neutral-300">&bull;</span>
                        <span className="text-xs text-neutral-500">
                          Unit {question.unitNumber}: {question.unitTitle}
                        </span>
                        {question.examYear && (
                          <span className="hidden sm:inline-block rounded bg-neutral-100 px-1.5 py-0.2 text-[10px] text-neutral-600 border border-neutral-200">
                            {question.examYear}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-neutral-600 line-clamp-1">
                        <MathRenderer content={question.prompt} />
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {/* User result pill */}
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2.5 py-1 text-xs font-medium text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Option {question.correctOptionId}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100/70 px-2.5 py-1 text-xs font-medium text-rose-800">
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        <span className="hidden sm:inline">
                          Picked {answer?.selectedOptionId || "None"} (Ans: {question.correctOptionId})
                        </span>
                      </span>
                    )}

                    <div className="text-neutral-400">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="border-t border-neutral-200/70 bg-white p-5 sm:p-6 space-y-4 animate-in fade-in-50 duration-200">
                    <div>
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                        Complete Question
                      </h5>
                      <div className="text-sm font-medium text-neutral-900 leading-relaxed">
                        <MathRenderer content={question.prompt} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {question.options.map((opt) => {
                        const isCorrectOpt = opt.id === question.correctOptionId;
                        const isChosen = answer?.selectedOptionId === opt.id;

                        let style = "bg-neutral-50 border-neutral-200 text-neutral-700";
                        if (isCorrectOpt) {
                          style = "bg-emerald-50 border-emerald-400 text-emerald-950 font-medium";
                        } else if (isChosen && !isCorrectOpt) {
                          style = "bg-rose-50 border-rose-300 text-rose-950";
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`flex items-center justify-between rounded-lg border p-2.5 ${style}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-bold">{opt.id}.</span> <MathRenderer content={opt.text} />
                            </span>
                            {isCorrectOpt && (
                              <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                                Verified
                              </span>
                            )}
                            {isChosen && !isCorrectOpt && (
                              <span className="text-[10px] font-semibold text-rose-700 uppercase">
                                Your Pick
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {question.keyFormula && (
                      <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-3 text-white">
                        <span className="text-[10px] text-neutral-400 font-mono block mb-1">
                          Core Formula:
                        </span>
                        <div className="text-sm font-mono text-blue-300 font-semibold">
                          <MathRenderer content={question.keyFormula} displayMode />
                        </div>
                      </div>
                    )}

                    <div>
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                        Step-by-Step Derivation
                      </h5>
                      <div className="space-y-1.5">
                        {question.derivationSteps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-2 text-xs font-mono text-neutral-800 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200/60"
                          >
                            <span className="font-bold text-neutral-500">{sIdx + 1}.</span>
                            <div className="flex-1">
                              <MathRenderer content={step} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Next Steps Card: Unlock full prep & save progress */}
      <section className="overflow-hidden rounded-3xl border border-neutral-950 bg-neutral-950 p-6 sm:p-10 text-white relative shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-800/80 px-3 py-1 text-xs font-semibold text-emerald-400 border border-neutral-700 mb-4">
            <Zap className="h-3.5 w-3.5" />
            <span>National Matric Prep 2026/27 Edition</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Ready to master all past exam questions?
          </h3>
          <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
            Create your free Qelem account to unlock full topic diagnostics, track daily revision
            streaks, and get step-by-step video & mathematical breakdowns for all 14 Ethiopian
            national curriculum subjects across Grades 9, 10, 11, and 12.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              id="save-progress-cta-bottom"
              onClick={() => setIsSaveModalOpen(true)}
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
            >
              <span>Save Progress & View Personal Roadmap</span>
              <ArrowRight className="h-4 w-4 text-blue-200 transition-transform group-hover:translate-x-0.5" />
            </button>

            <span className="text-xs text-neutral-400">
              No credit card required &bull; 100% Ethiopian MoE aligned
            </span>
          </div>
        </div>
      </section>

      {/* Save Progress & Roadmap Modal */}
      {isSaveModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in-50 duration-200"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsSaveModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/80">
                <Sparkles className="h-3.5 w-3.5" />
                Score: {scorePercent}% Verified
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              {isSignUp ? "Create Account & Save Roadmap" : "Sign In to Save Roadmap"}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {isSignUp
                ? "Lock in your Grade 12 diagnostic score and sync your preparation roadmap to Supabase."
                : "Sign in with your registered candidate account to update your profile and study records."}
            </p>

            {/* Auth Mode Switcher */}
            <div className="mt-4 flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/80">
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isSignUp
                    ? "bg-white text-neutral-950 shadow-2xs border border-neutral-200/60"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                New Account
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  !isSignUp
                    ? "bg-white text-neutral-950 shadow-2xs border border-neutral-200/60"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Existing Candidate
              </button>
            </div>

            <form onSubmit={handleSaveAndContinue} className="mt-5 space-y-4">
              {/* Candidate Full Name */}
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Candidate Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required={isSignUp}
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Dawit Yohannes"
                      className="w-full rounded-xl border border-neutral-200/90 bg-neutral-50/50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all pl-9"
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@target.aau.edu.et"
                    className="w-full rounded-xl border border-neutral-200/90 bg-neutral-50/50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all pl-9"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-200/90 bg-neutral-50/50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all pl-9"
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                </div>
              </div>

              {/* Stream Segmented Toggle */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Examination Stream
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100/80 rounded-xl border border-neutral-200/70">
                  <button
                    type="button"
                    onClick={() => setSelectedStream("natural")}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer ${
                      selectedStream === "natural"
                        ? "bg-white text-neutral-950 shadow-2xs border border-neutral-200"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    <Atom className="h-3.5 w-3.5 text-blue-600" />
                    <span>Natural Science</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStream("social")}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer ${
                      selectedStream === "social"
                        ? "bg-white text-neutral-950 shadow-2xs border border-neutral-200"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                    <span>Social Science</span>
                  </button>
                </div>
              </div>

              {/* Target University / Placement Goal */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Target University / Program
                </label>
                <div className="relative">
                  <select
                    value={targetUniversity}
                    onChange={(e) => setTargetUniversity(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-neutral-200/90 bg-neutral-50/50 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all pr-8"
                  >
                    {TARGET_UNIVERSITIES.map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
                </div>
              </div>

              {/* Diagnostic Baseline Preview Note */}
              <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-2.5 flex items-center justify-between text-xs text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-neutral-500" />
                  <span>Target Exam: 2017 E.C. Matric</span>
                </span>
                <span className="font-semibold text-neutral-900">
                  Baseline: {scorePercent}%
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="submit-roadmap-btn"
                disabled={authLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98] cursor-pointer disabled:opacity-70"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-300" />
                    <span>Syncing with Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {isSignUp ? "Create Account & Launch Dashboard" : "Sign In & Open Dashboard"}
                    </span>
                    <ArrowRight className="h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
