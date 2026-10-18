"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  Zap,
  Lock,
  Loader2,
  CheckCircle2,
  CreditCard,
  Smartphone,
  BookOpen,
  Award,
} from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerContext?: string;
  onSuccess?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  triggerContext = "Examiner Insights & Distractor Traps",
  onSuccess,
}) => {
  const [selectedTier, setSelectedTier] = useState<"season" | "ultimate">("season");
  const [selectedMethod, setSelectedMethod] = useState<"telebirr" | "cbe" | "awash" | "card">("telebirr");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const handleSimulateCheckout = () => {
    setIsProcessing(true);
    // Simulate real Chapa API payment gateway handoff & verification
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      if (onSuccess) {
        onSuccess();
      }
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={() => !isProcessing && onClose()}
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-neutral-200/90 shadow-[0_25px_70px_rgba(0,0,0,0.22)] p-6 sm:p-8 text-neutral-900 overflow-hidden my-auto">
        {/* Subtle accent glow top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {!isCompleted ? (
          <div className="space-y-6">
            {/* Header Motif */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200/80">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Grades 9–12 High School Pass</span>
              </div>
              <h3 id="upgrade-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                Upgrade to Qelem Pro
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Unlock {triggerContext} and verified curriculum solutions across Grades 9–12.
              </p>
            </div>

            {/* Tier Switcher Pills */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-xl border border-neutral-200/80">
              <button
                type="button"
                onClick={() => setSelectedTier("season")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTier === "season"
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                High School Pro (499 ETB)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTier("ultimate")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedTier === "ultimate"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>All-Access (1,200 ETB)</span>
              </button>
            </div>

            {/* Price Box */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 sm:p-5 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-950">
                    {selectedTier === "season" ? "499 ETB" : "1,200 ETB"}
                  </span>
                  <span className="text-xs sm:text-sm line-through text-neutral-400 font-mono">
                    {selectedTier === "season" ? "850 ETB" : "2,400 ETB"}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-block mt-1">
                  {selectedTier === "season"
                    ? "Save 41% • Full Academic Year Pass"
                    : "Save 50% • Lifetime Access + Future Features"}
                </span>
              </div>
              <div className="text-right text-[11px] text-neutral-500 font-medium">
                <div>Single Payment</div>
                <div className="font-semibold text-neutral-700">
                  {selectedTier === "season" ? "Full Academic Year" : "Lifetime High School Access"}
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
                {selectedTier === "season"
                  ? "Included in High School Pro:"
                  : "Included in All-Access Pass:"}
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
                <li className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </div>
                  <span>
                    <strong className="text-neutral-900">Examiner Trap & Distractor Analysis</strong>: Detailed breakdown on why options A, B, C, or D are traps across all EUEE items.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </div>
                  <span>
                    <strong className="text-neutral-900">Complete High-Yield Cheat Sheets</strong>: Unlimited access to formula sheets, variable legends, and core laws across Grades 9–12.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </div>
                  <span>
                    <strong className="text-neutral-900">Unlimited Computer-Based Mock Exams</strong>: Full simulated national exam sessions with percentile ranking.
                  </span>
                </li>
                {selectedTier === "ultimate" && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mt-0.5">
                        <Sparkles className="h-3 w-3 stroke-[2.5]" />
                      </div>
                      <span>
                        <strong className="text-indigo-900">AI Socratic Tutor & Explainer</strong>: Instant step-by-step reasoning in Amharic & English.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mt-0.5">
                        <Sparkles className="h-3 w-3 stroke-[2.5]" />
                      </div>
                      <span>
                        <strong className="text-indigo-900">Offline Mobile Mode & University Matcher</strong>: Zero-data offline revision and AAU/ASTU placement predictions.
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Payment Method Selector (Chapa Supported) */}
            <div className="space-y-2.5 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800">Select Ethiopian Payment Method:</span>
                <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Chapa Encrypted
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* Telebirr */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod("telebirr")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === "telebirr"
                      ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 text-blue-950 font-semibold"
                      : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <Smartphone className="h-4 w-4 mb-1 text-blue-600" />
                  <span className="text-[11px]">telebirr</span>
                </button>

                {/* CBE Birr */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod("cbe")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === "cbe"
                      ? "border-purple-600 bg-purple-50/70 ring-1 ring-purple-600 text-purple-950 font-semibold"
                      : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <Award className="h-4 w-4 mb-1 text-purple-600" />
                  <span className="text-[11px]">CBE Birr</span>
                </button>

                {/* Awash Birr */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod("awash")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === "awash"
                      ? "border-amber-600 bg-amber-50/70 ring-1 ring-amber-600 text-amber-950 font-semibold"
                      : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <Zap className="h-4 w-4 mb-1 text-amber-600" />
                  <span className="text-[11px]">Awash Birr</span>
                </button>

                {/* Bank Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod("card")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === "card"
                      ? "border-neutral-900 bg-neutral-100 ring-1 ring-neutral-900 text-neutral-950 font-semibold"
                      : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <CreditCard className="h-4 w-4 mb-1 text-neutral-700" />
                  <span className="text-[11px]">Debit Card</span>
                </button>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSimulateCheckout}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting to Chapa Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed via Chapa (499 ETB)</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 text-center">
                <span>Instant activation &bull; 100% money-back guarantee if exam cancelled</span>
              </div>
            </div>
          </div>
        ) : (
          /* Success Confirmation State */
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-neutral-950">Matric Pro Pass Activated!</h4>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
                Your payment of 499 ETB was verified via Chapa. All examiner insights, distractor analyses, and cheat sheets are now fully unlocked.
              </p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeModal;
