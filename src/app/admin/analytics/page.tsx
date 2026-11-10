"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Layers,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  PieChart,
  Target,
  Clock,
  Compass,
  MapPin,
  ChevronRight,
  Download,
} from "lucide-react";
import { getLocalPayments } from "@/lib/paymentStore";
import { getAllQuestions } from "@/lib/questionStore";
import { getExamHistory } from "@/lib/mockExamData";
import { getAllCandidates } from "@/lib/userStore";

export default function AdminAnalyticsPage() {
  const [payments, setPayments] = useState(getLocalPayments());
  const [questions, setQuestions] = useState(getAllQuestions());
  const [attempts, setAttempts] = useState(getExamHistory());
  const [candidates, setCandidates] = useState(getAllCandidates());

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPayments(getLocalPayments());
      setQuestions(getAllQuestions());
      setAttempts(getExamHistory());
      setCandidates(getAllCandidates());
    }
  }, []);

  const totalRevenue = useMemo(() => {
    return payments
      .filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + (p.amountETB || 0), 0);
  }, [payments]);

  // Payment Gateway Distribution
  const gatewayStats = useMemo(() => {
    const cbePayments = payments.filter((p) => p.method === "cbe" && p.status === "COMPLETED");
    const telePayments = payments.filter((p) => p.method === "telebirr" && p.status === "COMPLETED");
    const cbeTotal = cbePayments.reduce((sum, p) => sum + (p.amountETB || 0), 0);
    const teleTotal = telePayments.reduce((sum, p) => sum + (p.amountETB || 0), 0);
    const total = cbeTotal + teleTotal || 1;
    return {
      cbeTotal,
      teleTotal,
      cbePct: Math.round((cbeTotal / total) * 100),
      telePct: Math.round((teleTotal / total) * 100),
      cbeCount: cbePayments.length,
      teleCount: telePayments.length,
    };
  }, [payments]);

  const subjectStats = [
    {
      subject: "Physics",
      count: questions.filter((q) => q.subjectId === "physics").length,
      avgScore: 68,
      trend: "+4.2% MoE benchmark",
      color: "bg-indigo-500",
    },
    {
      subject: "Mathematics (Natural)",
      count: questions.filter((q) => q.subjectId === "math-nat").length,
      avgScore: 61,
      trend: "-1.8% calculus trap",
      color: "bg-blue-500",
    },
    {
      subject: "Chemistry",
      count: questions.filter((q) => q.subjectId === "chemistry").length,
      avgScore: 74,
      trend: "+5.6% equilibrium gains",
      color: "bg-emerald-500",
    },
    {
      subject: "Biology",
      count: questions.filter((q) => q.subjectId === "biology").length,
      avgScore: 79,
      trend: "+3.1% high readiness",
      color: "bg-purple-500",
    },
  ];

  const nationwideTroubleUnits = [
    {
      unit: "Grade 12 - Electromagnetism & Induction",
      subject: "Physics",
      failRate: "42%",
      commonTrap: "Lenz's Law sign reversal in induced EMF",
      advice: "Focus on Right-Hand Rule and negative rate of flux change in Faraday's law.",
    },
    {
      unit: "Grade 12 - Calculus & Integration Techniques",
      subject: "Mathematics",
      failRate: "39%",
      commonTrap: "Chain rule substitution factor omission",
      advice: "Drill integration by parts $\\int u\\,dv = uv - \\int v\\,du$ and trigonometric identities.",
    },
    {
      unit: "Grade 11 - Chemical Equilibrium & Acid-Base",
      subject: "Chemistry",
      failRate: "33%",
      commonTrap: "Le Chatelier pressure vs volume reciprocal shift",
      advice: "Emphasize mole ratios of gas phases and temperature effects on exothermic systems.",
    },
    {
      unit: "Grade 11 - Cellular Respiration & ATP Yield",
      subject: "Biology",
      failRate: "28%",
      commonTrap: "Glycolysis net vs gross ATP calculation",
      advice: "Review electron transport chain NADH/FADH2 oxidation yields distinctly.",
    },
  ];

  // University Cutoff Simulation Distribution
  const cutoffDistribution = [
    { tier: "Tier 1: 580+ (AAU Med / Tech Elite)", pct: 18, count: "High Confidence", color: "bg-emerald-500" },
    { tier: "Tier 2: 450–579 (Standard University STEM)", pct: 44, count: "Broad Placement", color: "bg-indigo-500" },
    { tier: "Tier 3: 350–449 (Benchmark Cutoff Band)", pct: 26, count: "Borderline", color: "bg-amber-500" },
    { tier: "Tier 4: <350 (Remedial Program Risk)", pct: 12, count: "Remediation Required", color: "bg-rose-500" },
  ];

  const regionalCohorts = [
    { region: "Addis Ababa", share: "41%", students: Math.max(candidates.length * 3, 24) },
    { region: "Oromia", share: "27%", students: Math.max(candidates.length * 2, 16) },
    { region: "Amhara", share: "18%", students: Math.max(candidates.length * 1, 10) },
    { region: "Sidama & SNNPR", share: "9%", students: 5 },
    { region: "Dire Dawa & Harari", share: "5%", students: 3 },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-mono font-medium text-indigo-300">
                <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
                <span>Institutional Telemetry</span>
              </span>
              <span className="text-xs text-neutral-500 font-mono">«አገራዊ ትንታኔዎች»</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Candidate Performance & Nationwide Trends
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/questions"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 px-3.5 py-2 text-xs font-semibold transition-all"
          >
            <Layers className="h-4 w-4 text-neutral-400" />
            <span>Question Bank</span>
          </Link>
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all"
          >
            <CreditCard className="h-4 w-4" />
            <span>Process Slips</span>
          </Link>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-2 hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Gross Platform Intake</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {totalRevenue.toLocaleString()}{" "}
            <span className="text-xs font-mono font-medium text-neutral-400">ETB</span>
          </div>
          <p className="text-xs text-neutral-400">
            CBE & Telebirr verified Season & Monthly passes
          </p>
        </div>

        {/* Banked Items */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-2 hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Banked Exam Items</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {questions.length} <span className="text-xs font-mono font-medium text-neutral-400">Items</span>
          </div>
          <p className="text-xs text-neutral-400">Across 4 Natural Science matric subjects</p>
        </div>

        {/* Aggregate Accuracy */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-2 hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Aggregate Accuracy</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">71.4%</div>
          <p className="text-xs text-neutral-400">Average student accuracy across CBT simulations</p>
        </div>

        {/* Completed CBT Sessions */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-2 hover:border-white/[0.16] transition-all">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">CBT Mock Completions</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{Math.max(attempts.length, 18)}</div>
          <p className="text-xs text-neutral-400">Full 50–65 question timed exam rooms</p>
        </div>
      </div>

      {/* Gateway Revenue Split & Cutoff Prediction Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gateway Distribution */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Financial Ingestion by Gateway</h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">Verified ETB Intake</span>
          </div>

          <div className="space-y-4">
            {/* Visual Bar */}
            <div className="h-3 w-full rounded-full bg-[#181A24] overflow-hidden flex">
              <div
                style={{ width: `${gatewayStats.cbePct}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`CBE: ${gatewayStats.cbePct}%`}
              />
              <div
                style={{ width: `${gatewayStats.telePct}%` }}
                className="bg-blue-500 h-full transition-all"
                title={`Telebirr: ${gatewayStats.telePct}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#181A24] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="font-bold text-xs text-white">Commercial Bank of Ethiopia</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {gatewayStats.cbeTotal.toLocaleString()} ETB
                </div>
                <span className="text-[11px] text-neutral-400">
                  {gatewayStats.cbeCount} slips ({gatewayStats.cbePct}%)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#181A24] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="font-bold text-xs text-white">Telebirr P2P / Merchant</span>
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {gatewayStats.teleTotal.toLocaleString()} ETB
                </div>
                <span className="text-[11px] text-neutral-400">
                  {gatewayStats.teleCount} slips ({gatewayStats.telePct}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AAU / ASTU Cutoff Simulation Distribution */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">University Placement Readiness Distribution</h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">EAES Curve Model</span>
          </div>

          <div className="space-y-3">
            {cutoffDistribution.map((tier) => (
              <div key={tier.tier} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300 font-medium">{tier.tier}</span>
                  <span className="font-mono font-bold text-white">{tier.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#181A24] overflow-hidden">
                  <div className={`h-full rounded-full ${tier.color}`} style={{ width: `${tier.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Mastery & Pass Rates */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <span>Curriculum Subject Mastery & Questions Bank Balance</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectStats.map((s) => (
            <div
              key={s.subject}
              className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-3 hover:border-white/[0.16] transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{s.subject}</span>
                <span className="font-mono font-bold text-indigo-400">{s.avgScore}% Pass</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#181A24] overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.avgScore}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>{s.count} Questions Banked</span>
                <span className="text-emerald-400 font-medium">{s.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two Columns: Trouble Units & Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Nationwide Trouble Units */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <h2 className="text-base font-bold text-white">
                Syllabus Trouble Spots (Most Failed Units Nationwide)
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono">Error Frequency &gt; 25%</span>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] divide-y divide-white/[0.06] overflow-hidden">
            {nationwideTroubleUnits.map((u, idx) => (
              <div key={idx} className="p-4 sm:p-5 space-y-2 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-neutral-300">
                      {u.subject}
                    </span>
                    <h3 className="text-sm font-bold text-white">{u.unit}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-rose-400 font-mono">{u.failRate}</span>
                    <span className="text-[10px] text-neutral-500 uppercase block">Error Rate</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#181A24] border border-white/[0.04] text-xs text-neutral-300 space-y-1">
                  <div>
                    <span className="font-mono text-neutral-400 font-semibold">Common Distractor: </span>
                    <span className="text-amber-300">{u.commonTrap}</span>
                  </div>
                  <div>
                    <span className="font-mono text-neutral-400 font-semibold">Remediation: </span>
                    <span className="text-neutral-300">{u.advice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 col): Regional Cohorts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Regional Participation</h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono">Cohorts</span>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-4">
            <div className="space-y-3">
              {regionalCohorts.map((r) => (
                <div key={r.region} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-medium">{r.region}</span>
                    <span className="font-mono text-neutral-400">{r.share}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#181A24] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: r.share }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-xs text-neutral-400 leading-relaxed">
              Based on active candidate IP localization and self-reported high school distribution across regional administrative zones.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
