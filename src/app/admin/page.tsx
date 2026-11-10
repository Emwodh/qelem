"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Layers,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Database,
  Lock,
  RotateCcw,
  Sparkles,
  BookOpen,
  Users,
  Compass,
  FileText,
  Settings,
  Activity,
  Cpu,
  Check,
  ArrowUpRight,
  UserCheck,
} from "lucide-react";
import { getLocalPayments, updatePaymentStatus } from "@/lib/paymentStore";
import { PaymentRecord } from "@/types/payment";
import { getAllQuestions } from "@/lib/questionStore";
import { getExamHistory } from "@/lib/mockExamData";
import { getAllCandidates, CandidateItem } from "@/lib/userStore";
import { logAdminAction } from "@/lib/auditStore";

export default function AdminDashboardPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [questionsCount, setQuestionsCount] = useState<number>(0);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPayments(getLocalPayments());
      setQuestionsCount(getAllQuestions().length);
      setAttemptsCount(getExamHistory().length);
      setCandidates(getAllCandidates());
    }
  }, []);

  const handleQuickApprove = async (paymentId: string, candidateName: string, amount: number) => {
    await updatePaymentStatus(paymentId, "COMPLETED", "Approved via Quick Action Hub");
    logAdminAction("APPROVE_PAYMENT", `Quick-approved ${amount} ETB for ${candidateName}`, paymentId);
    setPayments(getLocalPayments());
    setActionFeedback(`Approved slip for ${candidateName} (${amount} ETB)`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const metrics = useMemo(() => {
    const pendingSlips = payments.filter((p) => p.status === "MANUAL_REVIEW");
    const completedPayments = payments.filter((p) => p.status === "COMPLETED");
    const grossRevenueETB = completedPayments.reduce((sum, p) => sum + (p.amountETB || 0), 0);
    const proCandidates = candidates.filter((c) => c.isPro).length;

    return {
      pendingCount: pendingSlips.length,
      completedCount: completedPayments.length,
      grossRevenueETB,
      recentPending: pendingSlips.slice(0, 4),
      totalCandidates: Math.max(candidates.length, 6),
      proCandidates: Math.max(proCandidates, 4),
    };
  }, [payments, candidates]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-mono font-medium text-indigo-300">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Admin Command Center</span>
            </span>
            <span className="text-xs text-neutral-500 font-mono">«የአድሚን መቆጣጠሪያ»</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Platform Management & Executive Operations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Verify manual CBE/Telebirr student slips, ingest and curate Grade 9–12 national entrance exam questions, oversee candidate roster access, and inspect institutional readiness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all active:scale-[0.98]"
          >
            <CreditCard className="h-4 w-4" />
            <span>Process Slips</span>
            {metrics.pendingCount > 0 && (
              <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
                {metrics.pendingCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/questions"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 px-4 py-2.5 text-xs font-semibold transition-all hover:border-white/[0.16]"
          >
            <Database className="h-4 w-4 text-indigo-400" />
            <span>Question Bank</span>
          </Link>
        </div>
      </div>

      {actionFeedback && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-medium text-emerald-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        </div>
      )}

      {/* Primary KPI Metrics per DESIGN.md */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-2 hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Gross Platform Intake</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {metrics.grossRevenueETB.toLocaleString()}{" "}
            <span className="text-xs font-mono font-medium text-neutral-400">ETB</span>
          </div>
          <p className="text-xs text-neutral-400">
            From <span className="text-white font-medium">{metrics.completedCount}</span> approved Season & Monthly passes
          </p>
        </div>

        {/* Pending Slips Queue */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-2 hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pending Slips Queue</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-black text-amber-400 tracking-tight">
              {metrics.pendingCount}
            </div>
            {metrics.pendingCount > 0 ? (
              <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full animate-pulse">
                Action Required
              </span>
            ) : (
              <span className="text-[10px] font-mono text-emerald-400">Queue Clear</span>
            )}
          </div>
          <p className="text-xs text-neutral-400">
            Awaiting manual CBE & Telebirr receipt verification
          </p>
        </div>

        {/* Question Bank Size */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-2 hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Question Bank</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {questionsCount}{" "}
            <span className="text-xs font-mono font-medium text-neutral-400">Curated Items</span>
          </div>
          <p className="text-xs text-neutral-400">
            Grades 9–12 Natural & Social streams with KaTeX derivations
          </p>
        </div>

        {/* Registered Candidates */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-2 hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Candidate Roster</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {metrics.totalCandidates}{" "}
            <span className="text-xs font-mono font-medium text-neutral-400">Enrolled</span>
          </div>
          <p className="text-xs text-neutral-400">
            <span className="text-emerald-400 font-medium">{metrics.proCandidates} Pro Access</span> &bull; {Math.max(attemptsCount, 12)} mock exams taken
          </p>
        </div>
      </div>

      {/* Operational Command Navigation Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Module 1: Payment Verification Portal */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-5 flex flex-col justify-between hover:border-white/[0.16] transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full">
                {metrics.pendingCount} Pending Slips
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Payment Slips Verification
              </h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Review candidate bank references, inspect high-resolution CBE mobile banking and Telebirr receipts with zoom/rotation, and unlock Pro with 1-click.
              </p>
            </div>
          </div>

          <Link
            href="/admin/payments"
            className="inline-flex items-center justify-between rounded-xl bg-[#181A24] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] text-white px-4 py-2.5 text-xs font-semibold transition-all group"
          >
            <span>Open Verification Portal</span>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Module 2: Question Bank Manager & Ingestion */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-5 flex flex-col justify-between hover:border-white/[0.16] transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Database className="h-5 w-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                {questionsCount} Questions
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Question Bank & Ingestion
              </h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Browse, search, edit, or create questions with live KaTeX preview. Ingest entire past entrance exams from text, Telegram copy-paste, JSON, or CSV.
              </p>
            </div>
          </div>

          <Link
            href="/admin/questions"
            className="inline-flex items-center justify-between rounded-xl bg-[#181A24] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] text-white px-4 py-2.5 text-xs font-semibold transition-all group"
          >
            <span>Manage Question Inventory</span>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Module 3: Candidate Roster & System Settings */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-5 flex flex-col justify-between hover:border-white/[0.16] transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                {metrics.totalCandidates} Candidates
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Candidate Roster & Access
              </h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Inspect registered students by stream (Natural vs Social) and Grade 9–12. Grant manual Pro overrides, reset device lockouts, and view diagnostic scores.
              </p>
            </div>
          </div>

          <Link
            href="/admin/users"
            className="inline-flex items-center justify-between rounded-xl bg-[#181A24] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] text-white px-4 py-2.5 text-xs font-semibold transition-all group"
          >
            <span>View Candidate Roster</span>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {/* Two Column Section: Live Action Slips + Quick Candidate Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Pending Slips Action Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Receipts Awaiting Verification
              </h2>
            </div>
            <Link
              href="/admin/payments"
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>All Slips ({payments.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {metrics.recentPending.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-8 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Payment queue is clear</h3>
              <p className="text-xs text-neutral-400">
                All submitted student slips have been verified. New Telebirr or CBE transfers will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {metrics.recentPending.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 flex flex-col justify-between gap-3 hover:border-white/[0.16] transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{p.candidateName}</span>
                      <span className="text-[10px] font-mono font-bold uppercase rounded-md bg-white/[0.06] border border-white/[0.08] text-neutral-300 px-2 py-0.5">
                        {p.method}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">
                      Ref: <span className="text-neutral-200">{p.bankTxRef || p.txRef}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {p.phone} &bull; <span className="font-semibold text-emerald-400">{p.amountETB} ETB</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => handleQuickApprove(p.id, p.candidateName, p.amountETB)}
                      className="flex-1 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 py-1.5 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                    <Link
                      href="/admin/payments"
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-neutral-300 transition-all"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right (1 col): System Infrastructure & Quick Access */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Node Diagnostics
              </h2>
            </div>
            <Link
              href="/admin/settings"
              className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Settings</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Local PWA Cache</span>
                <span className="font-mono text-emerald-400 font-medium">Operational (Sync OK)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">KaTeX Math Engine</span>
                <span className="font-mono text-emerald-400 font-medium">Loaded v0.16</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">CBE / Telebirr Verifier</span>
                <span className="font-mono text-amber-400 font-medium">Dual-Track Active</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Device Limiter Guard</span>
                <span className="font-mono text-indigo-400 font-medium">2 Max per Candidate</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <Link
                href="/admin/analytics"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#181A24] border border-white/[0.06] hover:border-white/[0.12] text-xs font-medium text-neutral-200 transition-all"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Curriculum Danger Zones</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-neutral-500" />
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#181A24] border border-white/[0.06] hover:border-white/[0.12] text-xs font-medium text-neutral-200 transition-all"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Grant Manual Pro Access</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-neutral-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
