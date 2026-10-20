import React from "react";
import { Skeleton, SkeletonCard, SkeletonCircle, SkeletonText } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Top Context Anchor & Grade Selector Skeleton */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div className="space-y-2">
          {/* Greeting Headline */}
          <Skeleton className="h-8 w-56 sm:w-72 rounded-xl" />
          {/* Subtitle with Stream & Grade */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <span className="text-neutral-300">•</span>
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
        </div>

        {/* Grade Selector Switcher Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </section>

      {/* 2. Bento Strip: 4 Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} className="p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <SkeletonCircle size="h-7 w-7" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
            <div className="pt-2">
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          </SkeletonCard>
        ))}
      </section>

      {/* 3. Hero Diagnostic Action Card Skeleton */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-[#0A0D14] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2">
              <Skeleton className="h-5 w-32 rounded-full bg-white/10" />
            </div>
            <Skeleton className="h-7 sm:h-9 w-72 sm:w-96 rounded-xl bg-white/15" />
            <Skeleton className="h-4 w-full sm:w-80 rounded-md bg-white/10" />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Skeleton className="h-12 w-44 rounded-xl bg-white/20" />
            <Skeleton className="h-12 w-36 rounded-xl bg-white/10" />
          </div>
        </div>
      </section>

      {/* 4. Curriculum Subjects Grid (4 Subjects) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-3.5 w-64 rounded-md" />
          </div>
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} className="min-h-[250px] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-28 rounded-md" />
                    <Skeleton className="h-3.5 w-16 rounded-md" />
                  </div>
                  <SkeletonCircle size="h-9 w-9" />
                </div>
                <SkeletonText className="h-3 w-full" />
                <SkeletonText className="h-3 w-4/5" />
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </section>
    </div>
  );
}
