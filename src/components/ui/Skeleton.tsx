import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse-subtle animate-shimmer rounded-xl bg-neutral-200/70 ${className}`}
      {...props}
    />
  );
}

export function SkeletonCard({ className = "", children, ...props }: SkeletonProps) {
  return (
    <div
      className={`rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SkeletonText({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`h-4 rounded-md bg-neutral-200/80 animate-pulse-subtle animate-shimmer ${className}`}
      {...props}
    />
  );
}

export function SkeletonCircle({ className = "", size = "h-10 w-10", ...props }: SkeletonProps & { size?: string }) {
  return (
    <div
      className={`rounded-full bg-neutral-200/80 animate-pulse-subtle animate-shimmer shrink-0 ${size} ${className}`}
      {...props}
    />
  );
}
