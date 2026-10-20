import React from "react";
import { CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { Skeleton, SkeletonCard, SkeletonCircle, SkeletonText } from "@/components/ui/Skeleton";

interface AuthTransitionSkeletonProps {
  candidateName?: string;
  stream?: string;
}

export function AuthTransitionSkeleton({
  candidateName = "Candidate",
  stream = "natural",
}: AuthTransitionSkeletonProps) {
  return (
    <div className="flex flex-col justify-between h-full p-2 sm:p-4 space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
          <span>Setting Up Workspace</span>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
            Welcome, {candidateName}!
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5 capitalize">
            {stream} Science Track • Grade 12 National Matric
          </p>
        </div>
      </div>

      {/* Progressive Initialization Milestones */}
      <div className="space-y-2.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 p-4">
        <div className="flex items-center gap-3 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Candidate credentials authenticated</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-indigo-700">
          <Loader2 className="h-4 w-4 text-indigo-600 animate-spin shrink-0" />
          <span>Loading verified Ethiopian entrance past papers...</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-neutral-400">
          <div className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
          </div>
          <span>Preparing spaced-repetition mistake bank...</span>
        </div>
      </div>

      {/* Mini Workspace Preview Skeleton */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          <span>Candidate Workspace</span>
          <span>Initializing...</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <SkeletonCard className="p-3 space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-12 rounded-lg" />
            <Skeleton className="h-1 w-full rounded-full" />
          </SkeletonCard>

          <SkeletonCard className="p-3 space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-14 rounded-lg" />
            <Skeleton className="h-1 w-full rounded-full" />
          </SkeletonCard>
        </div>
      </div>

      {/* Bottom Shimmer Progress Bar */}
      <div className="space-y-2 pt-2 border-t border-neutral-100">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 relative">
          <div className="h-full w-full bg-neutral-900 animate-shimmer" />
        </div>
        <p className="text-[11px] text-center text-neutral-400 font-mono">
          Redirecting to your student dashboard...
        </p>
      </div>
    </div>
  );
}
