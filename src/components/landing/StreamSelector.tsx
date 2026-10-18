"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Languages,
  Brain,
  Hourglass,
  Compass,
  TrendingUp,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  NATURAL_SCIENCE_SUBJECTS,
  SOCIAL_SCIENCE_SUBJECTS,
} from "@/lib/landing-data";
import { SubjectModule, StreamType } from "@/types/landing";

const SUBJECT_ICONS = {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Languages,
  Brain,
  Hourglass,
  Compass,
  TrendingUp,
} as const;

// Distinct colored icon glyph badges per subject
const SUBJECT_GLYPH_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "math-nat": {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200/70",
  },
  physics: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200/70",
  },
  chemistry: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200/70",
  },
  biology: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200/70",
  },
  "english-nat": {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200/70",
  },
  "aptitude-nat": {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200/70",
  },
  "math-soc": {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200/70",
  },
  history: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200/70",
  },
  geography: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-200/70",
  },
  economics: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200/70",
  },
  "english-soc": {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200/70",
  },
  "aptitude-soc": {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200/70",
  },
};

export const StreamSelector: React.FC = () => {
  const [activeStream, setActiveStream] = useState<StreamType>("natural");

  const currentSubjects: SubjectModule[] =
    activeStream === "natural"
      ? NATURAL_SCIENCE_SUBJECTS
      : SOCIAL_SCIENCE_SUBJECTS;

  return (
    <section id="curriculum" className="py-20 sm:py-28 relative border-t border-neutral-200/70 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header: Centered & Authoritative */}
        <div className="text-center max-w-3xl mx-auto px-2 sm:px-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
            <Bookmark className="h-3.5 w-3.5 fill-neutral-700/20 text-neutral-700" />
            <span>Grades 9–12 Coverage</span>
          </div>

          <h2 className="mt-3 text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-neutral-950">
            Choose Your Stream
          </h2>

          <p className="mt-2.5 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl mx-auto">
            Modular revision units, formula sheets, and authentic past questions for both high school streams.
          </p>

          {/* Centered Tactile Segmented Pill Switcher */}
          <div className="mt-7 sm:mt-8 flex justify-center">
            <div className="inline-flex p-1 sm:p-1.5 bg-neutral-100 rounded-full border border-neutral-200 shadow-inner max-w-full">
              <button
                type="button"
                onClick={() => setActiveStream("natural")}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm transition-all ${
                  activeStream === "natural"
                    ? "bg-neutral-900 text-white shadow-sm font-semibold"
                    : "text-neutral-500 hover:text-neutral-900 font-medium"
                }`}
              >
                <Atom className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Natural Science</span>
                <span
                  className={`ml-1 text-[10px] sm:text-[11px] rounded-full px-1.5 sm:px-2 py-0.5 font-medium ${
                    activeStream === "natural"
                      ? "bg-white/20 text-white"
                      : "bg-neutral-200/80 text-neutral-600"
                  }`}
                >
                  6 Subjects
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStream("social")}
                className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm transition-all ${
                  activeStream === "social"
                    ? "bg-neutral-900 text-white shadow-sm font-semibold"
                    : "text-neutral-500 hover:text-neutral-900 font-medium"
                }`}
              >
                <Compass className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Social Science</span>
                <span
                  className={`ml-1 text-[10px] sm:text-[11px] rounded-full px-1.5 sm:px-2 py-0.5 font-medium ${
                    activeStream === "social"
                      ? "bg-white/20 text-white"
                      : "bg-neutral-200/80 text-neutral-600"
                  }`}
                >
                  6 Subjects
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Subjects Grid with Elevated Cards and Colored Glyph Containers */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSubjects.map((subject) => {
            const IconComponent = SUBJECT_ICONS[subject.iconName];
            const glyphStyle = SUBJECT_GLYPH_STYLES[subject.id] || {
              bg: "bg-neutral-100",
              text: "text-neutral-900",
              border: "border-neutral-200",
            };

            return (
              <div
                key={subject.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white border border-neutral-200/70 p-6 shadow-sm hover:shadow-md hover:border-neutral-400/60 transition-all duration-200 ease-out hover:-translate-y-1"
              >
                <div>
                  {/* Card Header: Distinct Colored Icon Glyph Container + Title */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${glyphStyle.bg} ${glyphStyle.border} ${glyphStyle.text} shadow-xs transition-transform group-hover:scale-105`}
                      >
                        <IconComponent className="h-6 w-6 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-neutral-950">
                          {subject.name}
                        </h3>
                        <span className="text-xs font-medium text-neutral-500">
                          {subject.amharicName}
                        </span>
                      </div>
                    </div>

                    {subject.badge && (
                      <span className="inline-flex items-center rounded-full bg-neutral-100 border border-neutral-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700">
                        {subject.badge}
                      </span>
                    )}
                  </div>

                  {/* Clean Horizontal Pill Tags for Unit Breakdown */}
                  <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 border border-neutral-200/60">
                      {subject.gradesCovered}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 border border-neutral-200/60">
                      {subject.unitsCount} Units
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/70">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Solutions
                    </span>
                  </div>

                  {/* Core Matric Focus Areas (High Yield Topics) */}
                  <div className="mt-4 pt-3.5 border-t border-neutral-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Core Units
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {subject.highYieldTopics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-lg bg-neutral-50 border border-neutral-200/60 px-2 py-0.5 text-xs font-medium text-neutral-600"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Crisp Text Button with Micro-Hover Transition */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-neutral-500 font-mono">
                    <span className="font-bold text-neutral-900">
                      {subject.pastQuestionsCount.toLocaleString()}
                    </span>
                    <span>past questions</span>
                  </div>

                  <Link
                    href={`#subject-${subject.id}`}
                    className="group/link inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 hover:text-blue-700 transition-colors"
                  >
                    <span>View Bank</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Studio Curriculum Model Exam Notice */}
        <div className="mt-10 rounded-2xl bg-white border border-neutral-200/80 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200/70 text-neutral-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-950">
                Preparing for both Ethiopian University Entrance and regional model exams?
              </p>
              <p className="text-xs text-neutral-600">
                All questions include curriculum unit tags referencing Grade 9, 10, 11, and 12 official MoE textbooks.
              </p>
            </div>
          </div>

          <Link
            href="#diagnostic"
            className="whitespace-nowrap px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-xs font-semibold text-white shadow-sm transition-all"
          >
            Take 15-Min Diagnostic
          </Link>
        </div>
      </div>
    </section>
  );
};
