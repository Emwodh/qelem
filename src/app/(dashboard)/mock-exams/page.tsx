"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Timer,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Play,
  RotateCcw,
} from "lucide-react";
import { OFFICIAL_MOCK_EXAMS, getExamHistory } from "@/lib/mockExamData";
import { MockExamAttempt } from "@/types/exam";

export default function MockExamsCatalogPage() {
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [history, setHistory] = useState<MockExamAttempt[]>([]);

  // Custom Mock Generator States
  const [customSubject, setCustomSubject] = useState<"physics" | "math-nat" | "chemistry" | "biology">("physics");
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(30);
  const [customDuration, setCustomDuration] = useState<number>(60);

  useEffect(() => {
    setHistory(getExamHistory());
  }, []);

  const filteredExams = OFFICIAL_MOCK_EXAMS.filter((exam) => {
    if (subjectFilter !== "all" && exam.subjectId !== subjectFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 animate-in fade-in-50 duration-300">
      {/* 1. Hero Header Banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200/80">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
            Mock Exams
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Practice with timed exam simulators and get instant scorecards.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-3.5 sm:p-4 text-center shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 block">
              Official Papers
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 font-mono">
              {OFFICIAL_MOCK_EXAMS.length} Papers
            </span>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-white p-3.5 sm:p-4 text-center shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 block">
              Completed Mocks
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono">
              {history.length}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Candidate Recent Attempts Bar (if any) */}
      {history.length > 0 && (
        <section className="rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Recent Exam Attempts & Performance
            </h2>
            <span className="text-[11px] text-neutral-400">{history.length} recorded</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.slice(0, 3).map((attempt, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-neutral-950 truncate max-w-[180px]">
                    {attempt.examTitle}
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {new Date(attempt.startedAt).toLocaleDateString()} &bull; {attempt.correctCount} correct
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-600 block">
                    {attempt.scorePercentage}%
                  </span>
                  <Link
                    href={`/mock-exams/${attempt.examId}`}
                    className="text-[10px] font-semibold text-neutral-700 hover:text-neutral-950 underline"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Subject Selector Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-neutral-200/60">
        {[
          { id: "all", label: "All Subjects" },
          { id: "physics", label: "Physics" },
          { id: "math-nat", label: "Mathematics (Natural)" },
          { id: "chemistry", label: "Chemistry" },
          { id: "biology", label: "Biology" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubjectFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              subjectFilter === tab.id
                ? "bg-neutral-950 text-white shadow-sm"
                : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-950"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Official Past Papers Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-950 flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-neutral-700" />
            Official Ethiopian Entrance Exam Papers
          </h2>
          <span className="text-xs text-neutral-500 font-medium">
            Standard time limits & full question counts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all"
            >
              <div className="space-y-3">
                {/* Year & Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-lg bg-neutral-100 border border-neutral-200 px-2.5 py-1 text-[11px] font-bold text-neutral-800">
                    {exam.year}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {exam.badge}
                  </span>
                </div>

                {/* Title & Subject */}
                <div>
                  <h3 className="text-base font-bold text-neutral-950 group-hover:text-blue-600 transition-colors">
                    {exam.title}
                  </h3>
                  {exam.amharicTitle && (
                    <p className="text-xs text-neutral-400 mt-0.5 font-medium">
                      {exam.amharicTitle}
                    </p>
                  )}
                </div>

                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {exam.description}
                </p>

                {/* Exam Metadata Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{exam.durationMinutes} Minutes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Layers className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{exam.totalQuestions} Questions</span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400">
                  {exam.curriculumCoverage}
                </div>
              </div>

              {/* Start CTA */}
              <div className="mt-5 pt-4 border-t border-neutral-100">
                <Link
                  href={`/mock-exams/${exam.id}`}
                  className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-xs shadow-sm transition-all active:scale-[0.98]"
                >
                  <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                  <span>Start Timed Exam</span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-300" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Custom Mock Generator */}
      <section className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-xs font-semibold text-blue-700 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Custom Mock Exam Generator</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
            Tailor Your Exam Sprint
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
            Choose your subject, target question count, and time duration to practice specific pacing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <select
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value as any)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
            >
              <option value="physics">Physics</option>
              <option value="math-nat">Mathematics (Natural)</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Question Count
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200">
              {[15, 30, 50].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setCustomQuestionCount(count)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    customQuestionCount === count
                      ? "bg-white text-neutral-950 shadow-sm"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  {count} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Time Duration */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Time Duration
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200">
              {[30, 60, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setCustomDuration(mins)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    customDuration === mins
                      ? "bg-white text-neutral-950 shadow-sm"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  {mins} Mins
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Link
            href={`/mock-exams/custom-${customSubject}-${customQuestionCount}-${customDuration}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-6 font-medium text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98]"
          >
            <Play className="h-4 w-4 text-emerald-400 fill-emerald-400" />
            <span>Generate & Launch Custom Mock Exam ({customQuestionCount} Qs)</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
