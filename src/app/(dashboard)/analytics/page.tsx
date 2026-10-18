"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Layers,
  ChevronRight,
  Activity,
  BarChart3,
  Compass,
} from "lucide-react";
import { getExamHistory } from "@/lib/mockExamData";
import { MockExamAttempt } from "@/types/exam";
import { getUserProfile } from "@/lib/userStore";
import { UserProfile } from "@/types/user";

export default function AnalyticsPage() {
  const [history, setHistory] = useState<MockExamAttempt[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setHistory(getExamHistory());
    setProfile(getUserProfile());
  }, []);

  // Compute Telemetry Aggregates
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalExams: 0,
        averageScore: 0,
        totalQuestionsAnswered: 0,
        totalCorrect: 0,
        avgSecondsPerQuestion: 0,
        gradeMastery: { 9: 65, 10: 70, 11: 58, 12: 52 },
        projectedAggregate: 420,
        pacingQuadrant: "Needs Initial Baseline",
      };
    }

    let totalScorePct = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalSeconds = 0;

    const gradeSums: Record<number, { correct: number; total: number }> = {
      9: { correct: 0, total: 0 },
      10: { correct: 0, total: 0 },
      11: { correct: 0, total: 0 },
      12: { correct: 0, total: 0 },
    };

    history.forEach((attempt) => {
      totalScorePct += attempt.scorePercentage || 0;
      const qCount =
        attempt.totalQuestions ||
        (attempt.correctCount || 0) + (attempt.incorrectCount || 0) + (attempt.unansweredCount || 0) ||
        50;
      totalQuestions += qCount;
      totalCorrect += attempt.correctCount || 0;

      // Approximate time spent
      const timeSpent = Math.max(60, (120 * 60) - (attempt.remainingSeconds || 0));
      totalSeconds += timeSpent;

      if (attempt.gradeBreakdown) {
        [9, 10, 11, 12].forEach((g) => {
          const gb = attempt.gradeBreakdown?.[g];
          if (gb) {
            gradeSums[g].correct += gb.correct;
            gradeSums[g].total += gb.total;
          }
        });
      }
    });

    const avgScore = Math.round(totalScorePct / history.length);
    const avgSecPerQ = totalQuestions > 0 ? Math.round(totalSeconds / totalQuestions) : 95;

    // Grade Mastery Percentages
    const gradeMastery: Record<number, number> = {
      9: gradeSums[9].total > 0 ? Math.round((gradeSums[9].correct / gradeSums[9].total) * 100) : 72,
      10: gradeSums[10].total > 0 ? Math.round((gradeSums[10].correct / gradeSums[10].total) * 100) : 68,
      11: gradeSums[11].total > 0 ? Math.round((gradeSums[11].correct / gradeSums[11].total) * 100) : 60,
      12: gradeSums[12].total > 0 ? Math.round((gradeSums[12].correct / gradeSums[12].total) * 100) : 54,
    };

    // Projected 600/700 Aggregate Score
    const maxScale = profile?.stream === "social" ? 700 : 600;
    const projectedAggregate = Math.round((avgScore / 100) * maxScale);

    // Pacing Quadrant
    let pacingQuadrant = "Methodical (Optimal Pacing)";
    if (avgScore >= 75 && avgSecPerQ <= 110) {
      pacingQuadrant = "Sniper (High Accuracy & Rapid Pace)";
    } else if (avgScore >= 70 && avgSecPerQ > 110) {
      pacingQuadrant = "Methodical (Accurate, Conditioning Speed)";
    } else if (avgScore < 70 && avgSecPerQ <= 90) {
      pacingQuadrant = "Rushing Trap (Prone to Distractors)";
    } else {
      pacingQuadrant = "Foundation Reinforcement Needed";
    }

    return {
      totalExams: history.length,
      averageScore: avgScore,
      totalQuestionsAnswered: totalQuestions,
      totalCorrect,
      avgSecondsPerQuestion: avgSecPerQ,
      gradeMastery,
      projectedAggregate,
      pacingQuadrant,
    };
  }, [history, profile]);

  const maxTotalScale = profile?.stream === "social" ? 700 : 600;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16 pt-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
              <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
              <span>National Entrance Telemetry</span>
            </span>
            <span className="text-xs text-neutral-400 font-mono">EAES CBT Standards</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Performance Diagnostics & Cut-Off Predictor
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Real-time analytics analyzing curriculum unit mastery, pacing velocity, and entrance cut-off projections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/mistakes"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition-all"
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Mistake Bank Drills</span>
          </Link>
        </div>
      </div>

      {/* Hero Projection & Cut-off Banner */}
      <div className="rounded-3xl border border-neutral-200/90 bg-neutral-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Predicted Aggregate Score */}
          <div className="space-y-2 lg:border-r lg:border-neutral-800 lg:pr-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Projected National Matric Aggregate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                {stats.projectedAggregate}
              </span>
              <span className="text-xl text-neutral-400 font-semibold">/ {maxTotalScale}</span>
            </div>
            <p className="text-xs text-neutral-400">
              Extrapolated across {profile?.stream === "social" ? "7" : "6"} core subjects based on your {stats.totalExams} mock exam attempts.
            </p>
          </div>

          {/* Historical University Cut-Off Comparison */}
          <div className="space-y-3 lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Historical Addis Ababa University (AAU) Cut-Off Thresholds
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300">AAU Medicine</span>
                  <span className={`font-bold text-xs ${stats.projectedAggregate >= 540 ? "text-emerald-400" : "text-amber-400"}`}>
                    540+
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stats.projectedAggregate >= 540 ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, (stats.projectedAggregate / 540) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-neutral-400 block">
                  {stats.projectedAggregate >= 540 ? "Qualified Target" : `${540 - stats.projectedAggregate} pts to threshold`}
                </span>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300">AAiT Engineering</span>
                  <span className={`font-bold text-xs ${stats.projectedAggregate >= 480 ? "text-emerald-400" : "text-amber-400"}`}>
                    480+
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stats.projectedAggregate >= 480 ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, (stats.projectedAggregate / 480) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-neutral-400 block">
                  {stats.projectedAggregate >= 480 ? "Competitive Range" : `${480 - stats.projectedAggregate} pts to threshold`}
                </span>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300">General Public Univ</span>
                  <span className="font-bold text-emerald-400 text-xs">350+</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${Math.min(100, (stats.projectedAggregate / 350) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-emerald-400 block">Exceeds General Pass</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Core Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pacing Speed vs Accuracy */}
        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pacing Telemetry</span>
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-neutral-950">
            {stats.avgSecondsPerQuestion} <span className="text-sm font-medium text-neutral-500">sec / question</span>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-3 space-y-1.5">
            <div className="text-xs font-semibold text-neutral-900">Exam Room Conditioning:</div>
            <div className="text-xs font-bold text-indigo-600">{stats.pacingQuadrant}</div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Official EAES mock allocation provides ~120 seconds per item for Physics and Math.
            </p>
          </div>
        </div>

        {/* Average Examination Accuracy */}
        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Accuracy</span>
            <Target className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-neutral-950">
            {stats.averageScore}%
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Total Items Attempted:</span>
              <span className="font-bold text-neutral-900">{stats.totalQuestionsAnswered}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Correctly Solved:</span>
              <span className="font-bold text-emerald-600">{stats.totalCorrect}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Mock Exams Completed:</span>
              <span className="font-bold text-neutral-900">{stats.totalExams}</span>
            </div>
          </div>
        </div>

        {/* 4-Year Curriculum Mastery */}
        <div className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">MoE 4-Year Syllabus</span>
            <Layers className="h-4 w-4 text-amber-600" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[9, 10, 11, 12].map((g) => {
              const score = (stats.gradeMastery as any)[g] || 60;
              const isHigh = score >= 70;
              return (
                <div key={g} className="rounded-xl border border-neutral-200 bg-white p-2.5 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Grade {g}</span>
                    <span className={isHigh ? "text-emerald-600" : "text-amber-600"}>{score}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isHigh ? "bg-emerald-500" : "bg-amber-500"}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Attempts Table */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
          <h2 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
            <Activity className="h-5 w-5 text-neutral-700" />
            Mock Exam History & Diagnostic Reports
          </h2>
          <span className="text-xs text-neutral-500">
            Showing {history.length} {history.length === 1 ? "session" : "sessions"}
          </span>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-12 text-center space-y-3">
            <Compass className="h-10 w-10 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-950">No exam sessions logged yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Complete your first full-length CBT mock exam to generate granular pacing and curriculum diagnostic reports.
            </p>
            <div className="pt-2">
              <Link
                href="/mock-exams"
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
              >
                <span>Browse Mock Exam Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((attempt, index) => {
              const scorePct = attempt.scorePercentage || 0;
              const isPassing = scorePct >= 70;

              return (
                <div
                  key={`${attempt.examId}-${attempt.startedAt}-${index}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm hover:border-neutral-300 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                        {attempt.subject}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {new Date(attempt.startedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-950">{attempt.examTitle}</h3>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span>
                        Score: <strong className="text-neutral-900 font-bold">{attempt.correctCount}</strong> /{" "}
                        {attempt.totalQuestions || 50}
                      </span>
                      <span>&bull;</span>
                      <span>
                        Time Remaining: {Math.floor((attempt.remainingSeconds || 0) / 60)}m
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-2xl font-black ${isPassing ? "text-emerald-600" : "text-amber-600"}`}>
                        {scorePct}%
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        {isPassing ? "Above Passing" : "Review Recommended"}
                      </span>
                    </div>

                    <Link
                      href={`/analytics/report/${attempt.examId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-800 shadow-xs transition-colors"
                    >
                      <span>Deep Report</span>
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
