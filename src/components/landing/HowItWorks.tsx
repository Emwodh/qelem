"use client";

import React from "react";
import Link from "next/link";
import { Compass, Target, Award, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/lib/landing-data";

const STEP_ICONS = {
  Compass,
  Target,
  Award,
} as const;

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative border-t border-neutral-200/70 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-neutral-800" />
            <span>How It Works</span>
          </div>

          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-neutral-950">
            Three Steps to Exam Mastery
          </h2>

          <p className="mt-2.5 text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            A simple, structured pathway from diagnostic testing to top marks.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {HOW_IT_WORKS_STEPS.map((item, idx) => {
            const Icon = STEP_ICONS[item.iconName];
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-[#FAFAFA] p-7 sm:p-8 hover:bg-white hover:border-neutral-300 hover:shadow-studio transition-all duration-200"
              >
                <div>
                  {/* Step header tag */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-neutral-400">
                      STEP {item.step}
                    </span>
                    <span className="rounded-full bg-white border border-neutral-200 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 shadow-xs">
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon & title */}
                  <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-neutral-200/80 text-neutral-900 shadow-xs group-hover:bg-neutral-950 group-hover:text-white transition-all">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold tracking-tight text-neutral-950">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Phase {idx + 1}
                  </span>
                  <span className="font-mono text-[11px] text-neutral-400">
                    Grades 9–12
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA inline */}
        <div className="mt-12 text-center">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-neutral-700 transition-colors"
          >
            <span>Take your free 15-minute diagnostic audit</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
