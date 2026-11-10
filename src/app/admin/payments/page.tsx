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
  Smartphone,
  Award,
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2,
  Download,
  Plus,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Trash2,
  FileText,
  DollarSign,
} from "lucide-react";
import { PaymentRecord, PaymentStatus, ManualPaymentSubmission } from "@/types/payment";
import { getLocalPayments, updatePaymentStatus, submitPaymentRecord } from "@/lib/paymentStore";
import { updateCandidateProAccess } from "@/lib/userStore";
import { logAdminAction } from "@/lib/auditStore";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("MANUAL_REVIEW");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Inspection Lightbox & Zoom
  const [inspectingPayment, setInspectingPayment] = useState<PaymentRecord | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);

  // Rejection Reason Modal
  const [rejectingPayment, setRejectingPayment] = useState<PaymentRecord | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("Duplicate transaction reference ID.");

  // Record Manual Payment Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("+2519");
  const [manualMethod, setManualMethod] = useState<"cbe" | "telebirr">("cbe");
  const [manualBankRef, setManualBankRef] = useState("");
  const [manualAmount, setManualAmount] = useState<number>(349);
  const [manualNote, setManualNote] = useState("Offline in-person payment verified.");

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch payments
  const fetchPayments = async () => {
    setIsLoading(true);
    const adminKey = typeof window !== "undefined" ? sessionStorage.getItem("qelem_admin_key") : null;
    try {
      const res = await fetch("/api/admin/payments", {
        headers: adminKey ? { "x-admin-key": adminKey } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.payments && Array.isArray(data.payments) && data.payments.length > 0) {
          setPayments(data.payments);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Local fallback
    }
    setPayments(getLocalPayments());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 3500);
  };

  // 1. Single Approve / Reject
  const handleReview = async (paymentId: string, action: "approve" | "reject", notes?: string) => {
    setProcessingId(paymentId);
    const adminKey = typeof window !== "undefined" ? sessionStorage.getItem("qelem_admin_key") : "";

    const targetPayment = payments.find((p) => p.id === paymentId || p.txRef === paymentId);

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
          adminNotes: notes || (action === "approve" ? "Verified via CBE / Telebirr statement." : "Transaction unverified."),
        }),
      });

      if (res.ok) {
        // Success via server API
      }
    } catch {
      // Offline fallback
    }

    // Always update local store
    await updatePaymentStatus(paymentId, action === "approve" ? "COMPLETED" : "REJECTED", notes);

    // If approved, update candidate record
    if (action === "approve" && targetPayment) {
      updateCandidateProAccess(targetPayment.phone, true, "MATRIC_SEASON_PASS");
      logAdminAction(
        "APPROVE_PAYMENT",
        `Approved ${targetPayment.amountETB} ETB (${targetPayment.method.toUpperCase()}) for ${targetPayment.candidateName}. Activated Pro access.`,
        targetPayment.id
      );
    } else if (targetPayment) {
      logAdminAction(
        "REJECT_PAYMENT",
        `Rejected slip for ${targetPayment.candidateName}: ${notes || "Invalid reference"}`,
        targetPayment.id
      );
    }

    fetchPayments();
    setProcessingId(null);
    if (inspectingPayment?.id === paymentId) {
      setInspectingPayment(null);
    }
    showFeedback(
      action === "approve"
        ? "Payment approved! Candidate Pro access has been activated."
        : "Slip marked as rejected."
    );
  };

  // 2. Bulk Approve
  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      await updatePaymentStatus(id, "COMPLETED", "Bulk approved by administrator");
      const target = payments.find((p) => p.id === id);
      if (target) {
        updateCandidateProAccess(target.phone, true, "MATRIC_SEASON_PASS");
      }
    }
    logAdminAction("APPROVE_PAYMENT", `Bulk approved ${selectedIds.length} candidate payment slips.`);
    setSelectedIds([]);
    fetchPayments();
    showFeedback(`Bulk approved ${selectedIds.length} candidate slips.`);
  };

  // 3. Record Manual Offline Payment
  const handleCreateManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualBankRef.trim()) return;

    const submission: ManualPaymentSubmission = {
      candidateName: manualName.trim(),
      phone: manualPhone.trim(),
      method: manualMethod,
      bankTxRef: manualBankRef.trim().toUpperCase(),
      amountETB: Number(manualAmount) || 349,
      plan: "MATRIC_SEASON_PASS",
      receiptImageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    };

    const newRecord = await submitPaymentRecord(submission);
    await updatePaymentStatus(newRecord.id, "COMPLETED", manualNote);
    updateCandidateProAccess(manualPhone.trim(), true, "MATRIC_SEASON_PASS");

    logAdminAction(
      "RECORD_MANUAL_PAYMENT",
      `Recorded manual cash/bank payment of ${manualAmount} ETB for ${manualName} (${manualBankRef})`,
      newRecord.id
    );

    setIsRecordModalOpen(false);
    setManualName("");
    setManualBankRef("");
    fetchPayments();
    showFeedback(`Recorded & approved payment for ${manualName}!`);
  };

  // 4. Export CSV
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Candidate Name",
      "Phone",
      "Email",
      "Method",
      "Amount (ETB)",
      "Plan",
      "Bank Tx Ref",
      "Internal Tx Ref",
      "Status",
      "Created At",
      "Reviewed At",
      "Admin Notes",
    ];

    const rows = payments.map((p) => [
      p.id,
      `"${p.candidateName}"`,
      `"${p.phone}"`,
      `"${p.email || ""}"`,
      p.method.toUpperCase(),
      p.amountETB,
      p.plan,
      `"${p.bankTxRef || ""}"`,
      p.txRef,
      p.status,
      p.createdAt,
      p.reviewedAt || "",
      `"${p.adminNotes || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `qelem_payment_reconciliation_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedRef(text);
      setTimeout(() => setCopiedRef(null), 2000);
    }
  };

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (methodFilter !== "all" && p.method !== methodFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inName = p.candidateName.toLowerCase().includes(query);
        const inPhone = p.phone.toLowerCase().includes(query);
        const inTx = p.txRef.toLowerCase().includes(query);
        const inBankTx = (p.bankTxRef || "").toLowerCase().includes(query);
        if (!inName && !inPhone && !inTx && !inBankTx) return false;
      }

      return true;
    });
  }, [payments, statusFilter, methodFilter, searchQuery]);

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

  const toggleSelectAllPending = () => {
    const pendingIds = filteredPayments
      .filter((p) => p.status === "MANUAL_REVIEW")
      .map((p) => p.id);
    if (selectedIds.length === pendingIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingIds);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-mono font-medium text-indigo-300">
              <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
              <span>Financial Verification Gateway</span>
            </span>
            <span className="text-xs text-neutral-500 font-mono">«የክፍያ ማረጋገጫ»</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Manual CBE & Telebirr Slip Verification
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Review uploaded mobile banking receipts, match transaction IDs with bank SMS feeds, and approve student Pro Season passes in 1-click.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-neutral-400" />
            <span>Export Financial Ledger</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRecordModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Record Manual Payment</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`rounded-2xl p-4 text-xs font-medium flex items-center justify-between animate-in fade-in ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Verified Revenue</span>
          <div className="text-2xl font-black text-white">
            {metrics.totalETB.toLocaleString()}{" "}
            <span className="text-xs font-mono font-medium text-neutral-400">ETB</span>
          </div>
          <span className="text-[11px] text-neutral-400">{metrics.completed} successful transactions</span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Review Queue</span>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black text-amber-400">{metrics.pending}</div>
            {metrics.pending > 0 && (
              <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <span className="text-[11px] text-neutral-400">Awaiting admin review</span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Total Submissions</span>
          <div className="text-2xl font-black text-indigo-400">{metrics.total}</div>
          <span className="text-[11px] text-neutral-400">CBE + Telebirr tickets</span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Conversion Rate</span>
          <div className="text-2xl font-black text-emerald-400">
            {metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 100}%
          </div>
          <span className="text-[11px] text-neutral-400">Approval percentage</span>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, phone (+251), bank ref (FT... / TLB...)..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-neutral-300 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="MANUAL_REVIEW">Review Queue (Pending)</option>
            <option value="COMPLETED">Approved & Active</option>
            <option value="REJECTED">Rejected Slips</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-neutral-300 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Gateways</option>
            <option value="cbe">CBE Mobile / Branch</option>
            <option value="telebirr">Telebirr P2P / Merchant</option>
          </select>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkApprove}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>Approve Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Slips Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-mono uppercase text-neutral-400">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length ===
                        filteredPayments.filter((p) => p.status === "MANUAL_REVIEW").length
                    }
                    onChange={toggleSelectAllPending}
                    className="rounded border-white/[0.1] bg-[#181A24] text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Candidate & Phone</th>
                <th className="py-3 px-4">Method & Amount</th>
                <th className="py-3 px-4">Bank Reference</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    No payment slips found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSelected ? "bg-indigo-600/10" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        {p.status === "MANUAL_REVIEW" && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds([...selectedIds, p.id]);
                              } else {
                                setSelectedIds(selectedIds.filter((id) => id !== p.id));
                              }
                            }}
                            className="rounded border-white/[0.1] bg-[#181A24] text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                        )}
                      </td>

                      {/* Candidate & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{p.candidateName}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {p.phone} {p.email ? `• ${p.email}` : ""}
                        </div>
                      </td>

                      {/* Method & Amount */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                              p.method === "cbe"
                                ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                                : "bg-blue-500/15 border-blue-500/30 text-blue-300"
                            }`}
                          >
                            {p.method}
                          </span>
                          <span className="font-mono font-bold text-white">
                            {p.amountETB} ETB
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{p.plan}</div>
                      </td>

                      {/* Bank Reference */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-200">
                          <span className="font-semibold">{p.bankTxRef || p.txRef}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(p.bankTxRef || p.txRef)}
                            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                            title="Copy Transaction Reference"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          {copiedRef === (p.bankTxRef || p.txRef) && (
                            <span className="text-[10px] text-emerald-400">Copied!</span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">{p.txRef}</div>
                      </td>

                      {/* Submitted Time */}
                      <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString()}{" "}
                        <span className="text-neutral-500">
                          {new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {p.status === "MANUAL_REVIEW" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                            <Clock className="h-3 w-3" />
                            <span>PENDING</span>
                          </span>
                        ) : p.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>APPROVED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300">
                            <XCircle className="h-3 w-3" />
                            <span>REJECTED</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setInspectingPayment(p);
                            setZoomLevel(1);
                            setRotationDegrees(0);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 transition-all cursor-pointer"
                        >
                          <Eye className="h-3 w-3 inline mr-1" />
                          <span>Inspect</span>
                        </button>

                        {p.status === "MANUAL_REVIEW" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleReview(p.id, "approve")}
                              disabled={processingId === p.id}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
                            >
                              <Check className="h-3 w-3 inline mr-0.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRejectingPayment(p)}
                              disabled={processingId === p.id}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
                            >
                              <X className="h-3 w-3 inline mr-0.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: RECEIPT LIGHTBOX INSPECTOR */}
      {inspectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#11131B] p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.7)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Receipt Inspection: {inspectingPayment.candidateName}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Ref: {inspectingPayment.bankTxRef || inspectingPayment.txRef} &bull; {inspectingPayment.amountETB} ETB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                  className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                  className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotationDegrees((d) => (d + 90) % 360)}
                  className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:text-white"
                  title="Rotate 90 Degrees"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setInspectingPayment(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Inspection Stage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left (2 cols): Image Stage */}
              <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-[#090A0F] p-4 flex items-center justify-center min-h-[350px] overflow-hidden">
                {inspectingPayment.receiptImageUrl ? (
                  <div className="overflow-auto max-h-[450px] max-w-full flex items-center justify-center">
                    <img
                      src={inspectingPayment.receiptImageUrl}
                      alt="Student payment slip"
                      style={{
                        transform: `scale(${zoomLevel}) rotate(${rotationDegrees}deg)`,
                        transition: "transform 0.2s ease-out",
                      }}
                      className="rounded-xl max-h-[400px] object-contain shadow-md"
                    />
                  </div>
                ) : (
                  <div className="text-center text-neutral-500 space-y-2">
                    <FileText className="h-10 w-10 mx-auto" />
                    <p className="text-xs">No screenshot uploaded. Reference provided via bank SMS.</p>
                  </div>
                )}
              </div>

              {/* Right (1 col): Verification Summary */}
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#181A24] border border-white/[0.06] space-y-2">
                  <span className="font-mono text-[10px] uppercase text-neutral-500">Transaction Details</span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Gateway:</span>
                      <span className="font-bold text-white uppercase">{inspectingPayment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Amount:</span>
                      <span className="font-mono font-bold text-emerald-400">{inspectingPayment.amountETB} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Phone:</span>
                      <span className="font-mono text-neutral-200">{inspectingPayment.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Submitted:</span>
                      <span className="font-mono text-neutral-400">
                        {new Date(inspectingPayment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {inspectingPayment.adminNotes && (
                  <div className="p-3 rounded-xl bg-[#181A24] border border-white/[0.06] space-y-1">
                    <span className="font-mono text-[10px] uppercase text-neutral-500">Staff Note</span>
                    <p className="text-neutral-300">{inspectingPayment.adminNotes}</p>
                  </div>
                )}

                {inspectingPayment.status === "MANUAL_REVIEW" ? (
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleReview(inspectingPayment.id, "approve")}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve & Grant Pro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectingPayment(inspectingPayment);
                        setInspectingPayment(null);
                      }}
                      className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold transition-all cursor-pointer"
                    >
                      Reject Slip...
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/[0.04] text-center font-mono text-neutral-400">
                    Status: {inspectingPayment.status}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REJECT WITH PRESET REASON */}
      {rejectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#11131B] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white">Reject Payment Slip</h3>
              <button
                type="button"
                onClick={() => setRejectingPayment(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-neutral-400">
                Specify the rejection reason for <span className="text-white font-bold">{rejectingPayment.candidateName}</span>:
              </p>

              <div className="space-y-2">
                {[
                  "Duplicate transaction reference ID.",
                  "Amount mismatch — expected 349 ETB for Matric Season Pass.",
                  "Screenshot is blurred or unreadable. Please resubmit.",
                  "Beneficiary name does not match Qelem Education account.",
                  "Invalid CBE / Telebirr transaction confirmation.",
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      rejectReason === reason
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                        : "bg-[#181A24] border-white/[0.06] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectPreset"
                      checked={rejectReason === reason}
                      onChange={() => setRejectReason(reason)}
                      className="mt-0.5"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setRejectingPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleReview(rejectingPayment.id, "reject", rejectReason);
                  setRejectingPayment(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RECORD MANUAL PAYMENT */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#11131B] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Record Manual Student Payment</h3>
                  <p className="text-xs text-neutral-400">Register cash or direct bank transfer payments</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Tsion Bekele"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="+2519..."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Payment Gateway</label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value as any)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="cbe">CBE Branch / Mobile Transfer</option>
                    <option value="telebirr">Telebirr P2P / Agent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Bank Tx Reference ID</label>
                  <input
                    type="text"
                    required
                    value={manualBankRef}
                    onChange={(e) => setManualBankRef(e.target.value)}
                    placeholder="e.g. FT24289MANUAL"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Amount Paid (ETB)</label>
                  <input
                    type="number"
                    required
                    value={manualAmount}
                    onChange={(e) => setManualAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2 text-xs text-white focus:border-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Verification Note</label>
                <input
                  type="text"
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all cursor-pointer"
                >
                  Record & Activate Pro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
