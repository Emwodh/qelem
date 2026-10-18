"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Smartphone,
  Award,
  Copy,
  UploadCloud,
  AlertCircle,
  FileText,
  Clock,
  HelpCircle,
} from "lucide-react";
import { getUserProfile, setUserPendingPayment } from "@/lib/userStore";
import { PaymentMethod, SubscriptionPlan } from "@/types/payment";

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
  const profile = getUserProfile();

  // Tier & Method
  const [selectedTier, setSelectedTier] = useState<"season" | "ultimate">("season");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("telebirr");

  // Form Fields
  const [candidateName, setCandidateName] = useState(profile?.name || "");
  const [phone, setPhone] = useState("");
  const [bankTxRef, setBankTxRef] = useState("");
  const [receiptImageBase64, setReceiptImageBase64] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  // Interaction States
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedPayment, setSubmittedPayment] = useState<any | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (isOpen && profile?.name) {
      setCandidateName(profile.name);
    }
  }, [isOpen, profile?.name]);

  if (!isOpen) return null;

  const currentAmount = selectedTier === "season" ? 349 : 999;
  const currentPlan: SubscriptionPlan = selectedTier === "season" ? "MATRIC_SEASON_PASS" : "LIFETIME_PASS";

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Receipt image must be smaller than 5MB.");
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptImageBase64(reader.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!candidateName.trim()) {
      setErrorMessage("Please enter your full candidate name.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMessage("Please provide a valid Ethiopian mobile number (09... or 07...).");
      return;
    }

    if (!bankTxRef.trim()) {
      setErrorMessage(
        selectedMethod === "telebirr"
          ? "Please enter your Telebirr Transaction ID (found in SMS confirmation)."
          : "Please enter your CBE Bank Transaction Reference (e.g. FT24...)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/payments/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: candidateName.trim(),
          phone: phone.trim(),
          email: profile?.email || undefined,
          method: selectedMethod,
          amountETB: currentAmount,
          plan: currentPlan,
          bankTxRef: bankTxRef.trim(),
          receiptImageUrl: receiptImageBase64 || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUserPendingPayment({
          txRef: data.payment.txRef,
          bankTxRef: data.payment.bankTxRef,
          method: selectedMethod,
          amountETB: currentAmount,
          submittedAt: new Date().toISOString(),
          status: "MANUAL_REVIEW",
        });
        setSubmittedPayment(data.payment);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(data.error || "Failed to submit receipt. Please check your details.");
      }
    } catch {
      setErrorMessage("Network error submitting receipt. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        onClick={() => !isSubmitting && onClose()}
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-neutral-200/90 shadow-[0_25px_70px_rgba(0,0,0,0.22)] p-6 sm:p-8 text-neutral-900 overflow-hidden my-auto">
        {/* Accent Glow Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {submittedPayment ? (
          /* Success / Verification Pending State */
          <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
              <Clock className="h-7 w-7 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-neutral-950">Receipt Under Verification</h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-neutral-900">{submittedPayment.candidateName}</span>! We received your {submittedPayment.method.toUpperCase()} receipt reference.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction Reference:</span>
                <span className="font-mono font-bold text-neutral-900">{submittedPayment.bankTxRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Amount:</span>
                <span className="font-mono font-bold text-neutral-900">{submittedPayment.amountETB} ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status:</span>
                <span className="font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full text-[10px]">
                  Manual Verification (15–30 mins)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400">
              Our academic coordinators verify incoming CBE & Telebirr statements continuously between 7:00 AM – 11:00 PM.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              Continue Studying
            </button>
          </div>
        ) : (
          /* Payment & Receipt Submission Form */
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200/80">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Manual Bank Transfer & Telebirr</span>
              </div>
              <h3 id="upgrade-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                Upgrade to Qelem Pro
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Unlock {triggerContext} and full EUEE derivation proofs via direct Ethiopian transfer.
              </p>
            </div>

            {/* Plan Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-xl border border-neutral-200/80">
              <button
                type="button"
                onClick={() => setSelectedTier("season")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTier === "season" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                Season Pass (349 ETB)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTier("ultimate")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedTier === "ultimate" ? "bg-indigo-600 text-white shadow-sm" : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>Lifetime Pass (999 ETB)</span>
              </button>
            </div>

            {/* Step 1: Select Bank & View Account Information */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
                1. Transfer {currentAmount} ETB to Official Account:
              </span>

              {/* Method Toggle Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("telebirr")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === "telebirr"
                      ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 text-blue-950 font-bold"
                      : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <span>telebirr</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("cbe")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === "cbe"
                      ? "border-purple-600 bg-purple-50/70 ring-1 ring-purple-600 text-purple-950 font-bold"
                      : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <Award className="h-4 w-4 text-purple-600" />
                  <span>CBE Birr / Bank</span>
                </button>
              </div>

              {/* Official Account Box */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 text-xs space-y-2">
                {selectedMethod === "telebirr" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Telebirr Account Number:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900 text-sm">
                        <span>0911 23 45 67</span>
                        <button
                          type="button"
                          onClick={() => handleCopy("0911234567", "tel")}
                          className="p-1 text-neutral-400 hover:text-neutral-900"
                          title="Copy Telebirr Number"
                        >
                          {copiedField === "tel" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Account / Merchant Name:</span>
                      <span className="font-semibold text-neutral-900">Qelem Education (ቀለም)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">CBE Account Number:</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900 text-sm">
                        <span>1000 4567 89123</span>
                        <button
                          type="button"
                          onClick={() => handleCopy("1000456789123", "cbe")}
                          className="p-1 text-neutral-400 hover:text-neutral-900"
                          title="Copy CBE Number"
                        >
                          {copiedField === "cbe" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Account Name:</span>
                      <span className="font-semibold text-neutral-900">Qelem Matric Prep / ቀለም</span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between border-t border-neutral-200/80 pt-2 text-[11px]">
                  <span className="text-neutral-500">Exact Transfer Amount:</span>
                  <span className="font-bold text-emerald-700 font-mono text-xs">{currentAmount} ETB</span>
                </div>
              </div>
            </div>

            {/* Step 2: Verification Slip Form */}
            <form onSubmit={handleSubmitReceipt} className="space-y-3.5 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
                2. Enter Transfer Slip Details:
              </span>

              {errorMessage && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Full Name</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Candidate name..."
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs focus:border-neutral-950 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Mobile Phone (Telebirr/SMS)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09... or 07..."
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs focus:border-neutral-950 focus:bg-white focus:outline-hidden font-mono"
                    required
                  />
                </div>
              </div>

              {/* Transaction Ref Number */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-neutral-700 flex items-center justify-between">
                  <span>{selectedMethod === "telebirr" ? "Telebirr Transaction ID" : "CBE Bank Transaction Ref"}</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Found on SMS confirmation</span>
                </label>
                <input
                  type="text"
                  value={bankTxRef}
                  onChange={(e) => setBankTxRef(e.target.value)}
                  placeholder={selectedMethod === "telebirr" ? "e.g. TLB8912345 or SMS text" : "e.g. FT24289XXXXXXXX"}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs focus:border-neutral-950 focus:bg-white focus:outline-hidden font-mono"
                  required
                />
              </div>

              {/* Optional Screenshot Upload */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-neutral-700 flex items-center justify-between">
                  <span>Receipt Screenshot (Optional)</span>
                  <span className="text-[10px] text-neutral-400 font-normal">JPG, PNG up to 5MB</span>
                </label>
                <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50/50 p-3 text-center cursor-pointer transition-colors">
                  <UploadCloud className="h-5 w-5 text-neutral-400 mb-1" />
                  <span className="text-[11px] text-neutral-600 font-medium">
                    {imageFileName ? `Selected: ${imageFileName}` : "Tap to attach SMS or transfer receipt screenshot"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Submitting Receipt for Review...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Transfer for Verification ({currentAmount} ETB)</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
