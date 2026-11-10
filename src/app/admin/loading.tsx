import React from "react";

export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-7xl py-6 space-y-8 animate-pulse">
      {/* 1. Header Bar Skeleton */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-xl bg-white/[0.06]" />
          <div className="h-4 w-96 max-w-full rounded-md bg-white/[0.04]" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 rounded-xl bg-white/[0.06]" />
          <div className="h-10 w-24 rounded-xl bg-white/[0.06]" />
        </div>
      </section>

      {/* 2. 4 Executive Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded-md bg-white/[0.06]" />
              <div className="h-8 w-8 rounded-xl bg-white/[0.06]" />
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-8 w-28 rounded-lg bg-white/[0.08]" />
              <div className="h-3 w-36 rounded-md bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </section>

      {/* 3. Panel Skeleton */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="h-5 w-44 rounded-md bg-white/[0.06]" />
            <div className="h-3 w-56 rounded-md bg-white/[0.04]" />
          </div>
          <div className="h-9 w-24 rounded-xl bg-white/[0.06]" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between p-4 rounded-xl bg-[#181A24] border border-white/[0.06]"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-white/[0.06]" />
                <div className="space-y-1.5">
                  <div className="h-4 w-36 rounded-md bg-white/[0.08]" />
                  <div className="h-3 w-28 rounded-md bg-white/[0.04]" />
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <div className="h-4 w-20 rounded-md bg-white/[0.04]" />
                <div className="h-6 w-24 rounded-full bg-white/[0.06]" />
              </div>
              <div className="h-8 w-20 rounded-xl bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
