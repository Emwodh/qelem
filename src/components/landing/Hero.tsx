"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Layers,
  FileCheck2,
} from "lucide-react";
import { GRADE_MASTERY_STATS } from "@/lib/landing-data";

export const Hero: React.FC = () => {
  const [selectedStream, setSelectedStream] = useState<"natural" | "social">(
    "natural"
  );

  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32 bg-dot-pattern">
      {/* Subtle fade overlay for architectural dot pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_60%,transparent_100%)] bg-gradient-to-b from-white/40 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Title & Subtitle */}
        <div className="mx-auto mt-12 sm:mt-16 max-w-4xl text-center px-2 sm:px-0">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] text-neutral-950 leading-[1.06]">
            Master Grades 9 to 12.
            <br />
            Ace Your Exams.
          </h1>

          <p className="mx-auto mt-4 sm:mt-5 max-w-xl text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            Review 4 years of curriculum, practice verified past exam questions, and track your readiness with confidence.
          </p>

          {/* Action CTAs */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/practice"
              className="w-full sm:w-auto h-11 sm:h-12 px-7 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-medium text-sm sm:text-base shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-neutral-300" />
              <span>Start Free Diagnostic</span>
              <ArrowRight className="h-4 w-4 text-neutral-300" />
            </Link>

            <Link
              href="#how-it-works"
              className="w-full sm:w-auto h-11 sm:h-12 px-7 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200/90 text-neutral-800 font-medium text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="h-4 w-4 text-neutral-500" />
              <span>See How It Works</span>
            </Link>
          </div>

          {/* Decorative Metric Strip right below hero buttons */}
          <div className="mt-8 mx-auto max-w-xl grid grid-cols-3 divide-x divide-neutral-200/80 rounded-2xl bg-white/95 border border-neutral-200/80 p-2.5 sm:p-3 shadow-studio backdrop-blur-sm">
            <div className="text-center px-1 sm:px-2">
              <div className="font-mono text-base sm:text-xl font-extrabold text-neutral-950">
                Grades 9–12
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-0.5">
                Full Syllabus
              </div>
            </div>
            <div className="text-center px-1 sm:px-2">
              <div className="font-mono text-base sm:text-xl font-extrabold text-neutral-950">
                8 Subjects
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-0.5">
                Natural & Social
              </div>
            </div>
            <div className="text-center px-1 sm:px-2">
              <div className="font-mono text-base sm:text-xl font-extrabold text-emerald-600">
                MoE Aligned
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-0.5">
                Verified Content
              </div>
            </div>
          </div>

          {/* Social Proof & Trust Tokens */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-neutral-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Ministry of Education Curriculum</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>10+ Years Past National Papers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Verified Step-by-Step Solutions</span>
            </div>
          </div>
        </div>

        {/* Floating Application Frame Wrapped in Elevated Studio Canvas */}
        <div className="mt-12 sm:mt-16 mx-auto max-w-5xl">
          {/* Subtle Background Stage Canvas */}
          <div className="bg-neutral-100/70 p-3 sm:p-8 rounded-3xl border border-neutral-200/60 shadow-inner">
            {/* The Enhanced Browser Card Window */}
            <div className="rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-2 sm:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
              {/* Window Chrome Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden xs:inline">Diagnostic Mode</span>
                </div>
              </div>

              {/* Application Canvas Interior */}
              <div className="rounded-xl sm:rounded-2xl bg-[#FAFAFA] border border-neutral-200/70 p-4 sm:p-7">
                {/* Candidate Info + Segmented Stream Controller */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200/70">
                  <div className="flex items-center gap-3.5">
                    <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white font-semibold shadow-sm">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-950 text-base">
                          Candidate Dashboard
                        </span>
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Live Demo
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Grades 9–12 • Ethiopian National Curriculum
                      </p>
                    </div>
                  </div>

                  {/* macOS / iOS Style Minimalist Segmented Pill Controls */}
                  <div className="inline-flex rounded-xl bg-neutral-200/70 p-1 border border-neutral-200/60 self-start md:self-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedStream("natural")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedStream === "natural"
                          ? "bg-white text-neutral-950 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-950"
                      }`}
                    >
                      Natural Science
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStream("social")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedStream === "social"
                          ? "bg-white text-neutral-950 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-950"
                      }`}
                    >
                      Social Science
                    </button>
                  </div>
                </div>

                {/* Studio Metrics Grid */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* Overall Exam Readiness Card */}
                  <div className="lg:col-span-4 rounded-2xl bg-white border border-neutral-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                          Overall Exam Readiness
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <TrendingUp className="h-3 w-3" />
                          +6% this week
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="font-mono text-5xl font-extrabold tracking-tight text-neutral-950">
                          78%
                        </span>
                        <span className="text-xs font-semibold text-emerald-700">
                          Predicted: 565/700
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                        Calibrated against 1,480 past national entrance exam questions solved across Grades 9 through 12.
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-neutral-100 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-0.5">
                        <span className="text-neutral-500">Placement Prediction</span>
                        <span className="font-semibold text-neutral-900">
                          Addis Ababa University (AAU)
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-0.5">
                        <span className="text-neutral-500">Pacing per Question</span>
                        <span className="font-mono font-medium text-neutral-800">
                          1m 14s (Target: 1m 20s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Four-Year Mastery Progress (Grades 9, 10, 11, 12) with Distinct Punchy Fills */}
                  <div className="lg:col-span-8 rounded-2xl bg-white border border-neutral-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                        <div>
                          <h3 className="text-sm font-bold text-neutral-950">
                            Four-Year Curriculum Mastery (Grades 9–12)
                          </h3>
                        </div>
                        <span className="self-start sm:self-auto rounded-lg bg-neutral-100 border border-neutral-200 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                          6 Subjects Active
                        </span>
                      </div>

                      <div className="space-y-4">
                        {GRADE_MASTERY_STATS.map((stat) => {
                          // Distinct punchy fills per grade
                          const isEmerald = stat.percentage >= 80;
                          const isSapphire = stat.percentage >= 70 && stat.percentage < 80;
                          const isAmber = stat.percentage < 70;

                          const fillColor = isEmerald
                            ? "#10B981"
                            : isSapphire
                            ? "#2563EB"
                            : "#F59E0B";

                          const pillStyle = isEmerald
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isSapphire
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200";

                          return (
                            <div key={stat.grade} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-neutral-900">
                                    {stat.grade}
                                  </span>
                                  <span className="text-neutral-500">• {stat.label}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <span className="text-[11px] text-neutral-500">
                                    {stat.unitsCompleted}/{stat.totalUnits} Units
                                  </span>
                                  <span
                                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md border ${pillStyle}`}
                                  >
                                    {stat.percentage}%
                                  </span>
                                </div>
                              </div>

                              {/* Progress Track */}
                              <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                                <div
                                  className="h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                                  style={{
                                    width: `${stat.percentage}%`,
                                    backgroundColor: fillColor,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
