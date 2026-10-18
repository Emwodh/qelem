"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Calendar,
  Sparkles,
  Bookmark,
  Printer,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  GraduationCap,
  Flame,
  Check,
  ListTodo,
} from "lucide-react";
import { getUserProfile, getExamCountdown } from "@/lib/userStore";
import { UserProfile } from "@/types/user";

interface StudyDay {
  day: string;
  dateLabel: string;
  subject: string;
  unit: string;
  targetQuestions: number;
  estimatedMinutes: number;
  priority: "High" | "Core" | "Review";
  completed: boolean;
}

const INITIAL_WEEKLY_PLAN: StudyDay[] = [
  {
    day: "Monday",
    dateLabel: "Day 1",
    subject: "Physics",
    unit: "Unit 2: Electromagnetism & Induction (Gr. 12)",
    targetQuestions: 30,
    estimatedMinutes: 60,
    priority: "High",
    completed: true,
  },
  {
    day: "Tuesday",
    dateLabel: "Day 2",
    subject: "Mathematics",
    unit: "Unit 4: Integration & Differential Calculus (Gr. 12)",
    targetQuestions: 35,
    estimatedMinutes: 75,
    priority: "High",
    completed: true,
  },
  {
    day: "Wednesday",
    dateLabel: "Day 3",
    subject: "Chemistry",
    unit: "Unit 3: Electrochemistry & Galvanic Cells (Gr. 12)",
    targetQuestions: 25,
    estimatedMinutes: 50,
    priority: "Core",
    completed: false,
  },
  {
    day: "Thursday",
    dateLabel: "Day 4",
    subject: "Biology",
    unit: "Unit 2: Molecular Genetics & Protein Synthesis (Gr. 12)",
    targetQuestions: 30,
    estimatedMinutes: 50,
    priority: "Core",
    completed: false,
  },
  {
    day: "Friday",
    dateLabel: "Day 5",
    subject: "Physics & Math",
    unit: "Combined High-Yield Derivations Sprint",
    targetQuestions: 40,
    estimatedMinutes: 80,
    priority: "High",
    completed: false,
  },
  {
    day: "Saturday",
    dateLabel: "Day 6",
    subject: "Full Mock Exam",
    unit: "Timed 2016 E.C. National Entrance Paper Simulator",
    targetQuestions: 50,
    estimatedMinutes: 120,
    priority: "High",
    completed: false,
  },
  {
    day: "Sunday",
    dateLabel: "Day 7",
    subject: "Error Log & Weak Areas",
    unit: "Diagnostic Distractor & Trap Remediation",
    targetQuestions: 20,
    estimatedMinutes: 45,
    priority: "Review",
    completed: false,
  },
];

const PREPARATION_PHASES = [
  {
    phase: "Phase 1",
    title: "Grades 9 & 10 Foundation Reinforcement",
    timeline: "Months 1–2",
    description: "Core physical laws, basic algebraic formulations, stoichiometry, and cellular biology foundations.",
    status: "Completed",
    percent: 100,
  },
  {
    phase: "Phase 2",
    title: "Grades 11 & 12 Intensive Unit Mastery",
    timeline: "Months 3–4",
    description: "In-depth calculus, rotational dynamics, organic reaction mechanisms, and genetics.",
    status: "Active Sprint",
    percent: 68,
  },
  {
    phase: "Phase 3",
    title: "National Past Papers & Timed Simulation",
    timeline: "Month 5",
    description: "Authentic 2014, 2015, and 2016 E.C. official examination paper drills under strict 120-minute constraints.",
    status: "Upcoming",
    percent: 25,
  },
  {
    phase: "Phase 4",
    title: "Final High-Yield Sene Sprint",
    timeline: "Month 6",
    description: "Targeted error-log revisions, examiner insight traps, formula cheat-sheet memorization, and speed drills.",
    status: "Upcoming",
    percent: 0,
  },
];

export default function StudyPlanPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<StudyDay[]>(INITIAL_WEEKLY_PLAN);
  const countdown = getExamCountdown();

  useEffect(() => {
    setProfile(getUserProfile());
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qelem_study_plan_weekly");
      if (saved) {
        try {
          setWeeklyPlan(JSON.parse(saved));
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

  const toggleDayCompletion = (index: number) => {
    setWeeklyPlan((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], completed: !next[index].completed };
      if (typeof window !== "undefined") {
        localStorage.setItem("qelem_study_plan_weekly", JSON.stringify(next));
      }
      return next;
    });
  };

  const completedDaysCount = weeklyPlan.filter((d) => d.completed).length;
  const weeklyCompletionPercent = Math.round((completedDaysCount / weeklyPlan.length) * 100);

  const totalWeeklyQuestions = weeklyPlan.reduce((acc, curr) => acc + curr.targetQuestions, 0);
  const completedQuestions = weeklyPlan
    .filter((d) => d.completed)
    .reduce((acc, curr) => acc + curr.targetQuestions, 0);

  return (
    <main className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans animate-in fade-in-50 duration-200">
      {/* 1. Header Hub Banner */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-[11px] font-semibold text-indigo-700">
            <Sparkles className="h-3 w-3" />
            <span>2017 E.C. Matric Pacing &amp; Revision Blueprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950">
            Candidate Study Plan
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl">
            A calibrated weekly sprint roadmap designed around the Ethiopian national syllabus, targeting your goal score of{" "}
            <span className="font-semibold text-neutral-900">{profile?.targetScore || 585}/700</span>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-neutral-500" />
            <span>Print Timetable</span>
          </button>

          <Link
            href="/practice"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
          >
            <span>Take Diagnostic</span>
            <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
          </Link>
        </div>
      </section>

      {/* 2. Candidate Status & Countdown KPI Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Exam Countdown */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-medium">National Exam Countdown</span>
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-neutral-950 font-mono">
              {countdown.daysRemaining}
            </span>
            <span className="text-xs font-semibold text-neutral-500">days left</span>
          </div>
          <p className="text-[11px] text-neutral-400">
            {countdown.examMonth} &bull; {countdown.examYearEC}
          </p>
        </div>

        {/* Metric 2: Weekly Progress */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-medium">Weekly Target Completion</span>
            <CalendarCheck2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-neutral-950 font-mono">
              {weeklyCompletionPercent}%
            </span>
            <span className="text-xs font-semibold text-neutral-500">
              ({completedDaysCount}/{weeklyPlan.length} days)
            </span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${weeklyCompletionPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Question Volume Target */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-medium">Sprint Question Volume</span>
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-neutral-950 font-mono">
              {completedQuestions}
            </span>
            <span className="text-xs font-semibold text-neutral-500">
              / {totalWeeklyQuestions} Qs
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">High-yield matric items scheduled</p>
        </div>

        {/* Metric 4: Target Goal & University */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-medium">Placement Goal</span>
            <Target className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-neutral-950 font-mono">
              {profile?.targetScore || 585}
            </span>
            <span className="text-xs font-semibold text-neutral-500">/ 700 pts</span>
          </div>
          <p className="text-[11px] text-neutral-500 truncate" title={profile?.targetUniversity}>
            {profile?.targetUniversity || "Addis Ababa University (AAU)"}
          </p>
        </div>
      </section>

      {/* 3. Weekly Active Revision Schedule */}
      <section className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950 flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-indigo-600" />
              <span>Current Week Sprint Schedule</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Check off daily modules as you complete question bank sets or diagnostic mock exams.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/80 self-start sm:self-auto">
            7-Day Revision Cycle
          </span>
        </div>

        <div className="divide-y divide-neutral-100 border border-neutral-200/80 rounded-2xl overflow-hidden">
          {weeklyPlan.map((item, idx) => (
            <div
              key={item.day}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                item.completed ? "bg-neutral-50/60" : "bg-white hover:bg-neutral-50/30"
              }`}
            >
              {/* Day & Checkbox */}
              <div className="flex items-start sm:items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => toggleDayCompletion(idx)}
                  className={`mt-0.5 sm:mt-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                    item.completed
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-2xs"
                      : "border-neutral-300 bg-white hover:border-neutral-400"
                  }`}
                  aria-label={`Mark ${item.day} as ${item.completed ? "incomplete" : "complete"}`}
                >
                  {item.completed && <Check className="h-4 w-4" />}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase">
                      {item.dateLabel}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        item.completed
                          ? "text-neutral-500 line-through"
                          : "text-neutral-950"
                      }`}
                    >
                      {item.day}: {item.subject}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item.priority === "High"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : item.priority === "Core"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-neutral-100 text-neutral-600 border-neutral-200"
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">{item.unit}</p>
                </div>
              </div>

              {/* Metrics & Quick Action Link */}
              <div className="flex items-center gap-4 pl-9 sm:pl-0">
                <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    {item.estimatedMinutes}m
                  </span>
                  <span>&bull;</span>
                  <span>{item.targetQuestions} Qs</span>
                </div>

                <Link
                  href={item.subject.toLowerCase().includes("mock") ? "/mock-exams" : "/bank"}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <span>Practice Set</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Strategic 4-Phase Matric Preparation Roadmap */}
      <section className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            <span>4-Phase National Examination Milestone Plan</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Structured roadmap calibrated to the FDRE Ministry of Education high school examination cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PREPARATION_PHASES.map((p, idx) => (
            <div
              key={p.phase}
              className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600">
                  {p.phase} &bull; {p.timeline}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    p.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : p.status === "Active Sprint"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-neutral-100 text-neutral-600 border-neutral-200"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-950">{p.title}</h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                  <span>Phase Completion</span>
                  <span>{p.percent}%</span>
                </div>
                <div className="w-full bg-neutral-200/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      p.percent === 100 ? "bg-emerald-500" : "bg-indigo-600"
                    }`}
                    style={{ width: `${p.percent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Quick Links Footer Banner */}
      <section className="rounded-2xl border border-neutral-200/80 bg-gradient-to-r from-neutral-900 to-neutral-950 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
            <Flame className="h-4 w-4 text-amber-400" />
            <span>Need Fast Concept Formulas?</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Access The Comprehensive Reference Library
          </h3>
          <p className="text-xs text-neutral-300 max-w-xl">
            Review detailed formulas, laws, and common examiner distractor traps in our dedicated learning center.
          </p>
        </div>

        <Link
          href="/learn"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <BookOpen className="h-4 w-4" />
          <span>Open Formula &amp; Theory Library</span>
        </Link>
      </section>
    </main>
  );
}
