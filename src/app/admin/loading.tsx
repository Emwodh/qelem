import React from "react";
import { Skeleton, SkeletonCard, SkeletonCircle, SkeletonText } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Bar Skeleton */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </section>

      {/* 2. 4 Executive Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} className="p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <SkeletonCircle size="h-8 w-8" />
            </div>
            <div className="space-y-1.5 pt-2">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-3 w-36 rounded-md" />
            </div>
          </SkeletonCard>
        ))}
      </section>

      {/* 3. Verification Queue / Ingestion Table Skeleton */}
      <SkeletonCard className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="space-y-1">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-3 w-56 rounded-md" />
          </div>
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-100"
            >
              <div className="flex items-center gap-3.5">
                <SkeletonCircle size="h-9 w-9" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}
