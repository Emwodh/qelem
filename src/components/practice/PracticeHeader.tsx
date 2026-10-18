"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { GradeLevel } from "@/types/curriculum";

interface PracticeHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  subject: string;
  grade: GradeLevel;
  unitNumber: number;
  unitTitle: string;
  timerSeconds: number;
  isCompleted?: boolean;
}

export const PracticeHeader: React.FC<PracticeHeaderProps> = ({
  currentIndex,
  totalQuestions,
  subject,
  grade,
  unitNumber,
  unitTitle,
  timerSeconds,
  isCompleted = false,
}) => {
  // Format seconds to mm:ss
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = isCompleted
    ? 100
    : Math.min(100, Math.round(((currentIndex + 1) / totalQuestions) * 100));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-3 sm:px-6 gap-2">
        {/* Left: Exit/Back link & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-lg border border-neutral-200/80 bg-white px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-all hover:bg-neutral-50 hover:text-neutral-950 hover:border-neutral-300 shrink-0"
            title="Return to Qelem Overview"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-neutral-500 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Overview</span>
          </Link>

          <div className="h-4 w-px bg-neutral-200 hidden sm:block shrink-0" />

          {/* Curriculum Path Breadcrumb */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs min-w-0">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-semibold text-blue-700 border border-blue-200/70 shrink-0">
              {subject}
            </span>
            <span className="text-neutral-400 shrink-0">/</span>
            <span className="font-medium text-neutral-700 truncate max-w-[65px] sm:max-w-none">
              Gr {grade}
            </span>
            <span className="text-neutral-400 hidden md:inline shrink-0">/</span>
            <span className="font-normal text-neutral-500 hidden md:inline truncate max-w-[220px]">
              Unit {unitNumber}: {unitTitle}
            </span>
          </div>
        </div>

        {/* Right: Question Counter & Live Timer */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Progress Tag */}
          <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-neutral-100 px-2.5 sm:px-3 py-1 text-xs font-medium text-neutral-700 border border-neutral-200/60">
            <span className="font-semibold text-neutral-900">
              {isCompleted ? totalQuestions : currentIndex + 1}
            </span>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-600">{totalQuestions}</span>
          </div>

          {/* Live Timer Pill */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-neutral-200/80 bg-white px-2.5 sm:px-3 py-1 text-xs font-mono font-medium text-neutral-800 shadow-2xs"
            title="Time elapsed in this practice session"
          >
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neutral-400" />
            <span>{formatTime(timerSeconds)}</span>
          </div>
        </div>
      </div>

      {/* High-precision micro progress bar */}
      <div className="h-[2px] w-full bg-neutral-100">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};
