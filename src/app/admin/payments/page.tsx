"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Lock,
  KeyRound,
  RotateCcw,
  Sparkles,
  Smartphone,
  Award,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { PaymentRecord, PaymentStatus } from "@/types/payment";
import { getLocalPayments } from "@/lib/paymentStore";

export default function AdminPaymentsPage() {
  // Admin Security States
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [adminKeyError, setAdminKeyError] = useState("");
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [isCheckingSavedKey, setIsCheckingSavedKey] = useState(true);

  // Data & Filter States
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("MANUAL_REVIEW");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReceiptImage, setActiveReceiptImage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Check existing admin session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("qelem_admin_key");
      if (saved) {
        setIsAdminUnlocked(true);
      }
    }
    setIsCheckingSavedKey(false);
  }, []);

  // 2. Fetch payments
  const fetchPayments = async () => {
    setIsLoading(true);
    const adminKey = typeof window !== "undefined" ? sessionStorage.getItem("qelem_admin_key") : null;
    try {
      const res = await fetch("/api/admin/payments", {
        headers: adminKey ? { "x-admin-key": adminKey } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.payments) {
          setPayments(data.payments);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote payments, reading local storage:", err);
    }
    // Fallback to local store
    setPayments(getLocalPayments());
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAdminUnlocked) {
      fetchPayments();
    }
  }, [isAdminUnlocked]);

  // 3. Unlock Admin Form
  const handleUnlockAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKeyInput.trim()) {
      setAdminKeyError("Please enter the administrator security passkey.");
      return;
    }
    setIsValidatingKey(true);
    setAdminKeyError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminKeyInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        sessionStorage.setItem("qelem_admin_key", adminKeyInput.trim());
        setIsAdminUnlocked(true);
        setAdminKeyInput("");
      } else {
        setAdminKeyError(data.error || "Incorrect admin passkey. Access denied.");
      }
    } catch {
      setAdminKeyError("Connection error while validating credentials.");
    } finally {
      setIsValidatingKey(false);
    }
  };

  // 4. Review Payment (Approve or Reject)
  const handleReview = async (paymentId: string, action: "approve" | "reject") => {
    setProcessingId(paymentId);
    setActionMessage(null);
    const adminKey = typeof window !== "undefined" ? sessionStorage.getItem("qelem_admin_key") : "";

    try {
      const res = await fetch("/api/admin/payments/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey || "",
        },
        body: JSON.stringify({
          paymentId,
          action,
          adminNotes: action === "approve" ? "Verified via CBE / Telebirr confirmation." : "Receipt reference invalid.",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Update local state immediately
        setPayments((prev) =>
          prev.map((p) =>
            p.id === paymentId || p.txRef === paymentId
              ? { ...p, status: action === "approve" ? "COMPLETED" : "REJECTED", reviewedAt: new Date().toISOString() }
              : p
          )
        );
        setActionMessage({
          type: "success",
          text: action === "approve" ? "Payment approved! Candidate granted Pro access." : "Payment marked as rejected.",
        });
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to update payment status." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Network error processing payment review." });
    } finally {
      setProcessingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedRef(text);
      setTimeout(() => setCopiedRef(null), 2000);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = payments.length;
    const pending = payments.filter((p) => p.status === "MANUAL_REVIEW").length;
    const completed = payments.filter((p) => p.status === "COMPLETED").length;
    const totalETB = payments
      .filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + (Number(p.amountETB) || 0), 0);
    return { total, pending, completed, totalETB };
  }, [payments]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.candidateName.toLowerCase().includes(q);
        const matchesPhone = p.phone.toLowerCase().includes(q);
        const matchesRef = p.bankTxRef.toLowerCase().includes(q) || p.txRef.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesRef;
      }
      return true;
    });
  }, [payments, statusFilter, searchQuery]);

  // If checking passkey, show clean loader
  if (isCheckingSavedKey) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  // Security Gate UI
  if (!isAdminUnlocked) {
    return (
      <div className="mx-auto max-w-md py-16 px-4">
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 border border-neutral-200">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-neutral-950">Payment Verification Guard</h2>
            <p className="text-xs text-neutral-500">
              Enter administrator passkey to inspect and approve student bank transfers.
            </p>
          </div>

          <form onSubmit={handleUnlockAdmin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">Administrator Passkey</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                <input
                  type="password"
                  value={adminKeyInput}
                  onChange={(e) => setAdminKeyInput(e.target.value)}
                  placeholder="Enter ADMIN_SECRET_KEY..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 py-2.5 pl-10 pr-4 text-sm focus:border-neutral-950 focus:bg-white focus:outline-hidden"
                  autoFocus
                />
              </div>
              {adminKeyError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{adminKeyError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isValidatingKey}
              className="w-full h-11 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isValidatingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              <span>Unlock Payment Queue</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Payment Verification Portal</span>
            </span>
            <span className="text-xs text-neutral-400">&bull;</span>
            <span className="text-xs font-semibold text-neutral-600">Telebirr & CBE Birr</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mt-1.5">
            Student Payment Slips & Verification
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Review manual transfer references, inspect bank receipt screenshots, and activate Pro subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/questions"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors"
          >
            <span>Question CMS</span>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          </Link>
          <button
            type="button"
            onClick={fetchPayments}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors cursor-pointer"
            title="Refresh payment slips"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className={`rounded-2xl p-4 text-xs font-semibold flex items-center justify-between gap-3 border animate-in slide-in-from-top-2 duration-200 ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-rose-50 text-rose-900 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button type="button" onClick={() => setActionMessage(null)} className="text-neutral-500 hover:text-neutral-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Review */}
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>Pending Review</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-950 font-mono">{metrics.pending}</div>
          <span className="text-[11px] text-amber-700 font-medium">Slips requiring verification</span>
        </div>

        {/* Completed / Active */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Verified & Active</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-950 font-mono">{metrics.completed}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Activated Pro passes</span>
        </div>

        {/* Total Collected */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
            <span>Verified Revenue</span>
            <CreditCard className="h-4 w-4 text-neutral-500" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-950 font-mono">{metrics.totalETB.toLocaleString()} ETB</div>
          <span className="text-[11px] text-neutral-400">Total collected via CBE/Telebirr</span>
        </div>

        {/* Total Submissions */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
            <span>Total Submissions</span>
            <Sparkles className="h-4 w-4 text-neutral-500" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-950 font-mono">{metrics.total}</div>
          <span className="text-[11px] text-neutral-400">All submitted payment slips</span>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/70 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStatusFilter("MANUAL_REVIEW")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === "MANUAL_REVIEW" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
            }`}
          >
            Pending Review ({metrics.pending})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === "all" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
            }`}
          >
            All Slips ({metrics.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("COMPLETED")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === "COMPLETED" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
            }`}
          >
            Approved ({metrics.completed})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("REJECTED")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === "REJECTED" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600 hover:text-neutral-950"
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, phone, or ref..."
            className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-4 text-xs focus:border-neutral-950 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Slips List */}
      <div className="space-y-3">
        {filteredPayments.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-12 text-center space-y-2">
            <CheckCircle2 className="mx-auto h-8 w-8 text-neutral-300" />
            <h3 className="text-sm font-bold text-neutral-800">No payment slips match this filter</h3>
            <p className="text-xs text-neutral-500">
              {statusFilter === "MANUAL_REVIEW"
                ? "All student payments have been reviewed and verified!"
                : "No matching payment records found."}
            </p>
          </div>
        ) : (
          filteredPayments.map((p) => {
            const isPending = p.status === "MANUAL_REVIEW";
            const isApproved = p.status === "COMPLETED";
            const isRejected = p.status === "REJECTED";
            const isWorking = processingId === p.id || processingId === p.txRef;

            return (
              <div
                key={p.id}
                className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    {/* Method Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                        p.method === "telebirr"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {p.method === "telebirr" ? <Smartphone className="h-5 w-5" /> : <Award className="h-5 w-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-neutral-950">{p.candidateName}</h3>
                        <span className="text-xs text-neutral-400">&bull;</span>
                        <span className="text-xs font-mono font-medium text-neutral-600">{p.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                        <span className="capitalize font-semibold text-neutral-700">{p.method} Transfer</span>
                        <span>&bull;</span>
                        <span>{new Date(p.createdAt).toLocaleDateString()} at {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        <span>Needs Verification</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Approved & Active</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800 border border-rose-200">
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Slip Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  {/* Bank Reference */}
                  <div className="rounded-xl bg-neutral-50 p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Transaction Reference
                    </span>
                    <div className="flex items-center justify-between font-mono font-bold text-neutral-900 text-sm">
                      <span className="truncate">{p.bankTxRef}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(p.bankTxRef)}
                        className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md cursor-pointer"
                        title="Copy Reference"
                      >
                        {copiedRef === p.bankTxRef ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Amount & Plan */}
                  <div className="rounded-xl bg-neutral-50 p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Amount & Plan
                    </span>
                    <div className="font-bold text-neutral-900 text-sm font-mono">
                      {p.amountETB} ETB
                    </div>
                    <span className="text-[10px] text-neutral-500 font-medium block">
                      {p.plan === "MATRIC_SEASON_PASS" ? "High School Season Pass" : p.plan}
                    </span>
                  </div>

                  {/* Internal ID */}
                  <div className="rounded-xl bg-neutral-50 p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Qelem Reference
                    </span>
                    <div className="font-mono text-neutral-600 text-xs truncate">
                      {p.txRef}
                    </div>
                    {p.email && <span className="text-[10px] text-neutral-400 block truncate">{p.email}</span>}
                  </div>

                  {/* Receipt Screenshot Button */}
                  <div className="rounded-xl bg-neutral-50 p-3 space-y-1 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Receipt Screenshot
                    </span>
                    {p.receiptImageUrl ? (
                      <button
                        type="button"
                        onClick={() => setActiveReceiptImage(p.receiptImageUrl || null)}
                        className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 text-xs cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect Receipt Image</span>
                      </button>
                    ) : (
                      <span className="text-neutral-400 italic text-[11px]">No image attached (Ref only)</span>
                    )}
                  </div>
                </div>

                {/* Admin Note / Rejection Reason if any */}
                {p.adminNotes && (
                  <div className="text-xs text-neutral-600 bg-neutral-50 rounded-xl px-3 py-2 border border-neutral-100">
                    <span className="font-semibold text-neutral-800">Admin Note:</span> {p.adminNotes}
                  </div>
                )}

                {/* Action Buttons */}
                {isPending && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isWorking}
                      onClick={() => handleReview(p.id, "reject")}
                      className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Reject Slip
                    </button>
                    <button
                      type="button"
                      disabled={isWorking}
                      onClick={() => handleReview(p.id, "approve")}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isWorking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      <span>Approve & Grant Pro Access</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Receipt Image Zoom Modal */}
      {activeReceiptImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setActiveReceiptImage(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-neutral-200 space-y-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Payment Screenshot Inspection</h3>
              <button
                type="button"
                onClick={() => setActiveReceiptImage(null)}
                className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto rounded-xl border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeReceiptImage}
                alt="Payment Receipt Slip"
                className="w-full object-contain"
              />
            </div>

            <p className="text-[11px] text-neutral-400 text-center">
              Click outside or press Esc to close inspection.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
