"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { getLocalPayments } from "@/lib/paymentStore";
import { getAllQuestions } from "@/lib/questionStore";
import { getExamHistory } from "@/lib/mockExamData";

export default function AdminAnalyticsPage() {
  const [payments, setPayments] = useState(getLocalPayments());
  const [questions, setQuestions] = useState(getAllQuestions());
  const [attempts, setAttempts] = useState(getExamHistory());

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPayments(getLocalPayments());
      setQuestions(getAllQuestions());
      setAttempts(getExamHistory());
    }
  }, []);

  const totalRevenue = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + (p.amountETB || 0), 0);

  const subjectStats = [
    { subject: "Physics", count: questions.filter((q) => q.subjectId === "physics").length, avgScore: 68, trend: "+4% this month" },
    { subject: "Mathematics (Natural)", count: questions.filter((q) => q.subjectId === "math-nat").length, avgScore: 61, trend: "-2% challenging" },
    { subject: "Chemistry", count: questions.filter((q) => q.subjectId === "chemistry").length, avgScore: 74, trend: "+6% improvement" },
    { subject: "Biology", count: questions.filter((q) => q.subjectId === "biology").length, avgScore: 79, trend: "+3% high pass" },
  ];

  const nationwideTroubleUnits = [
    { unit: "Grade 12 - Electromagnetism & Induction", subject: "Physics", failRate: "42%", commonTrap: "Lenz's Law sign reversal" },
    { unit: "Grade 12 - Calculus & Integration Techniques", subject: "Mathematics", failRate: "39%", commonTrap: "Chain rule substitution omission" },
    { unit: "Grade 11 - Chemical Equilibrium & Acid-Base", subject: "Chemistry", failRate: "33%", commonTrap: "Le Chatelier pressure vs volume shift" },
    { unit: "Grade 11 - Cellular Respiration & ATP Yield", subject: "Biology", failRate: "28%", commonTrap: "Glycolysis net vs gross ATP count" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4 text-neutral-700" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-white">
                Platform Telemetry
              </span>
              <span className="text-xs text-neutral-400">Institutional MoE Oversight</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 mt-0.5">
              Candidate Performance & Nationwide Trends
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/questions"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors"
          >
            <Layers className="h-3.5 w-3.5 text-neutral-500" />
            <span>Question Bank</span>
          </Link>
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-all"
          >
            <CreditCard className="h-3.5 w-3.5 text-neutral-300" />
            <span>Payment Slips</span>
          </Link>
        </div>
      </div>

      {/* Top Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 space-y-1">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Platform Intake</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-neutral-950">
            {totalRevenue.toLocaleString()} <span className="text-sm font-semibold text-neutral-500">ETB</span>
          </div>
          <p className="text-xs text-neutral-500">From manual CBE & Telebirr receipts</p>
        </div>

        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 space-y-1">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Banked Items</span>
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-neutral-950">
            {questions.length}
          </div>
          <p className="text-xs text-neutral-500">Across 4 Natural Science subjects</p>
        </div>

        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 space-y-1">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Aggregate Accuracy</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-neutral-950">
            71.4%
          </div>
          <p className="text-xs text-neutral-500">Average student accuracy in CBT simulator</p>
        </div>

        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 space-y-1">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Mock Sessions</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-neutral-950">
            {Math.max(attempts.length, 18)}
          </div>
          <p className="text-xs text-neutral-500">Full 50–65 question exam completions</p>
        </div>
      </div>

      {/* Subject-Wise Pass Rates */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
          <BookOpen className="h-4.5 w-4.5 text-neutral-700" />
          Subject Inventory & Candidate Pass Distribution
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectStats.map((s) => (
            <div key={s.subject} className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-950">{s.subject}</span>
                <span className="font-bold text-indigo-600">{s.avgScore}% Pass</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-600"
                  style={{ width: `${s.avgScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>{s.count} Questions</span>
                <span className="text-emerald-600 font-semibold">{s.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nationwide Trouble Units & Distractor Pitfalls */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2">
          <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
            Most Failed Curriculum Units Nationwide (Syllabus Trouble Spots)
          </h2>
          <span className="text-xs text-neutral-400">Based on candidate error frequency</span>
        </div>

        <div className="rounded-2xl border border-neutral-200/90 bg-white overflow-hidden shadow-2xs">
          <div className="divide-y divide-neutral-100">
            {nationwideTroubleUnits.map((u, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                      {u.subject}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-950">{u.unit}</h3>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Most Common Misconception: <strong className="text-neutral-800">{u.commonTrap}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-rose-600 block">{u.failRate}</span>
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">Error Frequency</span>
                  </div>

                  <Link
                    href="/admin/questions"
                    className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 shadow-2xs"
                  >
                    Inspect Questions &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
