import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 select-none relative">
      {/* Background architectural pattern */}
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-60" />

      {/* Main Studio Emblem Container */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm w-full">
        {/* Obsidian Brand Icon with Glowing Ambient Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-4 rounded-3xl bg-indigo-500/10 blur-xl animate-pulse" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-xl border border-neutral-800">
            <span className="font-black text-2xl tracking-tight text-white">ቀ</span>
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-semibold text-neutral-700">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>Qelem • 2017 E.C. Matric</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900 tracking-tight">
            Preparing Candidate Workspace
          </h2>
          <p className="text-xs text-neutral-400">
            Loading verified past exam papers and curriculum tracks...
          </p>
        </div>

        {/* Shimmering Progress Bar */}
        <div className="w-full max-w-[220px] space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 relative">
            <div className="h-full w-2/3 rounded-full bg-neutral-900 animate-shimmer" />
          </div>
          <p className="text-[10px] font-mono font-medium text-neutral-400">
            Optimizing Ethiopian low-bandwidth cache...
          </p>
        </div>
      </div>
    </div>
  );
}
