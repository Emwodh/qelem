"use client";

import React from "react";
import {
  FileText,
  FolderGit2,
  Timer,
  Crosshair,
  ArrowUpRight,
  CheckCircle,
  Zap,
} from "lucide-react";
import { FEATURES } from "@/lib/landing-data";

const FEATURE_ICONS = {
  FileText,
  FolderFilter: FolderGit2,
  Timer,
  Crosshair,
} as const;

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-32 relative border-t border-neutral-200/70 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
            <Zap className="h-3.5 w-3.5 text-neutral-800" />
            <span>Core Capabilities</span>
          </div>

          <h2 className="mt-3.5 text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-neutral-950">
            Built for Top High School Scores
          </h2>

          <p className="mt-3 text-base sm:text-lg text-neutral-600">
            Aligned with Ethiopian national standards to master school exams and university entrance.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES.map((feature) => {
            const IconComponent = FEATURE_ICONS[feature.iconName];

            return (
              <div
                key={feature.id}
                className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/80 p-7 sm:p-9 shadow-studio hover:shadow-studio-md hover:border-neutral-300 transition-all duration-200 ease-out hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 border border-neutral-200/80 px-3 py-0.5 text-xs font-semibold text-neutral-700">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="mt-6 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200/70 text-neutral-950 group-hover:bg-neutral-950 group-hover:text-white transition-all shadow-xs">
                      <IconComponent className="h-6 w-6 stroke-[1.8]" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-neutral-950">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-600 leading-relaxed font-normal">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Highlight Tags */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {feature.highlightTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-50 border border-neutral-200/70 px-2.5 py-1 text-xs font-medium text-neutral-700"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Metric Strip */}
                {feature.statLabel && (
                  <div className="mt-8 pt-5 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-neutral-500">
                        {feature.statLabel}:
                      </span>
                      <span className="font-mono text-sm font-bold text-neutral-950">
                        {feature.statValue}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-neutral-950 hover:text-blue-700 transition-colors">
                      <span>Explore Module</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
