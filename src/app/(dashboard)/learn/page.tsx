"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Search,
  Sparkles,
  Layers,
  Clock,
  ChevronRight,
  ArrowRight,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  ShieldAlert,
  CheckCircle2,
  X,
  Compass,
  GraduationCap,
} from "lucide-react";
import { CURRICULUM_CHEAT_SHEETS } from "@/lib/cheatSheetData";
import { CURRICULUM_UNITS } from "@/lib/curriculumData";
import { UnitCheatSheet, GradeLevel } from "@/types/curriculum";
import { MathRenderer } from "@/components/ui/MathRenderer";

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-500 font-medium">Loading lessons...</div>}>
      <LearnContent />
    </Suspense>
  );
}

function LearnContent() {
  const searchParams = useSearchParams();
  const initialGradeParam = searchParams.get("grade");
  const initialSubjectParam = searchParams.get("subject");

  const [selectedSubject, setSelectedSubject] = useState<string>(
    initialSubjectParam || "all"
  );
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | "all">(
    initialGradeParam && ["9", "10", "11", "12"].includes(initialGradeParam)
      ? (Number(initialGradeParam) as GradeLevel)
      : "all"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLesson, setActiveLesson] = useState<UnitCheatSheet | null>(null);
  const [activeLessonTab, setActiveLessonTab] = useState<"theory" | "formulas" | "laws" | "traps">("theory");

  useEffect(() => {
    const g = searchParams.get("grade");
    if (g && ["9", "10", "11", "12"].includes(g)) {
      setSelectedGrade(Number(g) as GradeLevel);
    }
    const s = searchParams.get("subject");
    if (s) {
      setSelectedSubject(s);
    }
  }, [searchParams]);

  // Subject options
  const subjects = [
    { id: "all", label: "All Subjects", icon: Layers },
    { id: "physics", label: "Physics", icon: Atom },
    { id: "math-nat", label: "Mathematics", icon: Calculator },
    { id: "chemistry", label: "Chemistry", icon: FlaskConical },
    { id: "biology", label: "Biology", icon: Dna },
  ];

  // Filter lessons
  const filteredSheets = useMemo(() => {
    return CURRICULUM_CHEAT_SHEETS.filter((sheet) => {
      if (selectedSubject !== "all" && sheet.subjectId !== selectedSubject) {
        return false;
      }
      if (selectedGrade !== "all" && sheet.grade !== selectedGrade) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = sheet.unitTitle.toLowerCase().includes(query);
        const inSummary = sheet.summary.toLowerCase().includes(query);
        const inFormulas = sheet.essentialFormulas.some(
          (f) => f.name.toLowerCase().includes(query) || f.description.toLowerCase().includes(query)
        );
        const inLaws = sheet.coreLaws.some(
          (l) => l.title.toLowerCase().includes(query) || l.statement.toLowerCase().includes(query)
        );
        return inTitle || inSummary || inFormulas || inLaws;
      }
      return true;
    });
  }, [selectedSubject, selectedGrade, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200/80">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
            Lessons &amp; Revision
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review chapter notes, formulas, and key concepts across Grades 9–12.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-3.5 sm:p-4 text-center shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 block">
              Curriculum Units
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 font-mono">
              65 Units
            </span>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-white p-3.5 sm:p-4 text-center shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 block">
              Formulas &amp; Laws
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 font-mono">
              340+ Items
            </span>
          </div>
        </div>
      </section>

      {/* 2. Interactive Filter Bar */}
      <section className="rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Row */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, formulas, or concepts..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Subject and Grade Pill Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-neutral-100">
          {/* Subjects */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {subjects.map((sub) => {
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSubject === sub.id
                      ? "bg-neutral-950 text-white shadow-2xs"
                      : "bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-950"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* Grades */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 border border-neutral-200/70 self-start sm:self-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedGrade("all")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedGrade === "all"
                  ? "bg-white text-neutral-950 shadow-2xs font-bold"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              All Grades
            </button>
            {([12, 11, 10, 9] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedGrade === g
                    ? "bg-white text-neutral-950 shadow-2xs font-bold"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                Grade {g} {g === 12 ? "(Matric)" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Context Banner based on selectedGrade */}
        <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3 flex items-start gap-2.5 text-xs text-neutral-600">
          <BookOpen className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            {selectedGrade === "all" && (
              <span>
                <strong className="text-neutral-950">Full 4-Year Matric Scope (Grades 9–12):</strong> Comprehensive revision for Ethiopian university entrance candidates. Every chapter includes structured concept theory, SI variable definitions, KaTeX formulas, and direct links to practice questions.
              </span>
            )}
            {selectedGrade === 12 && (
              <span>
                <strong className="text-neutral-950">Grade 12 Advanced Preparatory Syllabus:</strong> Advanced electromagnetism, wave optics, quantum physics, sequences, and calculus. Switch to Grade 9, 10, or 11 anytime to revise earlier foundations!
              </span>
            )}
            {selectedGrade === 11 && (
              <span>
                <strong className="text-neutral-950">Grade 11 Preparatory Syllabus:</strong> Two-dimensional kinematics, vector operations, work-energy theorem, matrices and determinants, and conic sections.
              </span>
            )}
            {selectedGrade === 10 && (
              <span>
                <strong className="text-neutral-950">Grade 10 General Secondary Syllabus:</strong> Electrostatics, Coulomb&apos;s law, electric potential, polynomial division, factor theorem, and rational functions.
              </span>
            )}
            {selectedGrade === 9 && (
              <span>
                <strong className="text-neutral-950">Grade 9 Foundational Syllabus:</strong> Rectilinear kinematics, Newton&apos;s laws of motion, friction, momentum conservation, and quadratic algebra.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 3. Lesson Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-neutral-950 flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-neutral-700" />
            <span>Unit Lessons ({filteredSheets.length})</span>
          </h2>
          <span className="text-xs text-neutral-500 font-medium">
            Select a unit to study core theory, formulas, and examiner notes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSheets.map((sheet) => (
            <div
              key={sheet.id}
              data-lesson-card="true"
              className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer"
              onClick={() => {
                setActiveLesson(sheet);
                setActiveLessonTab("theory");
              }}
            >
              <div className="space-y-3.5">
                {/* Meta pills */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-lg bg-neutral-100 border border-neutral-200 px-2.5 py-1 text-[11px] font-bold text-neutral-800">
                    Grade {sheet.grade} &bull; Unit {sheet.unitNumber}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                    <Clock className="h-3 w-3 text-neutral-400" />
                    <span>{sheet.estimatedReadTime}</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-neutral-950 group-hover:text-indigo-600 transition-colors">
                    {sheet.unitTitle}
                  </h3>
                  <span className="text-xs font-semibold text-neutral-400">
                    {sheet.subject}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {sheet.summary}
                </p>

                {/* Key Formula Preview */}
                {sheet.essentialFormulas[0] && (
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Core Governing Equation:
                    </span>
                    <div className="text-xs font-mono text-neutral-900 truncate">
                      <MathRenderer content={sheet.essentialFormulas[0].latex} />
                    </div>
                  </div>
                )}

                {/* Quick stats pills */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500">
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-medium">
                    {sheet.essentialFormulas.length} Formulas
                  </span>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-medium">
                    {sheet.coreLaws.length} Core Laws
                  </span>
                  <span className="rounded-md bg-amber-50 text-amber-700 px-2 py-0.5 font-medium border border-amber-200/60">
                    {sheet.commonTraps.length} Traps
                  </span>
                </div>
              </div>

              {/* Start Lesson CTA */}
              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Learn Unit</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-950 bg-neutral-100 group-hover:bg-neutral-950 group-hover:text-white px-3 py-1.5 rounded-xl transition-all">
                  <span>Open Lesson</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Lesson Reader Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-neutral-200 bg-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:px-6 border-b border-neutral-200/80 bg-neutral-50/70">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white font-bold shadow-xs">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-neutral-200/80 px-2 py-0.5 text-[10px] font-bold text-neutral-800">
                      Grade {activeLesson.grade} &bull; Unit {activeLesson.unitNumber}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500">
                      {activeLesson.subject}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-neutral-950 mt-0.5">
                    {activeLesson.unitTitle}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveLesson(null)}
                className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-200/60 hover:text-neutral-700 transition-colors cursor-pointer"
                title="Close lesson reader"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sub-Tabs Selector */}
            <div className="flex items-center gap-1 px-5 sm:px-6 pt-3 pb-2 border-b border-neutral-100 bg-white overflow-x-auto">
              {[
                { id: "theory", label: "Lesson Overview" },
                { id: "formulas", label: `Essential Formulas (${activeLesson.essentialFormulas.length})` },
                { id: "laws", label: `Core Laws (${activeLesson.coreLaws.length})` },
                { id: "traps", label: `Examiner Traps (${activeLesson.commonTraps.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveLessonTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeLessonTab === tab.id
                      ? "bg-neutral-950 text-white shadow-2xs"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Tab 1: Theory Overview */}
              {activeLessonTab === "theory" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-4 sm:p-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
                      Chapter Syllabus Summary
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                      {activeLesson.summary}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Primary Formulas & Principles at a Glance
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeLesson.essentialFormulas.map((f) => (
                        <div
                          key={f.id}
                          className="rounded-xl border border-neutral-200 bg-white p-3.5 space-y-1.5"
                        >
                          <span className="text-xs font-bold text-neutral-900 block">
                            {f.name}
                          </span>
                          <div className="py-1">
                            <MathRenderer content={f.latex} />
                          </div>
                          <p className="text-[11px] text-neutral-500">
                            {f.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Essential Formulas */}
              {activeLessonTab === "formulas" && (
                <div className="space-y-5">
                  {activeLesson.essentialFormulas.map((f, idx) => (
                    <div
                      key={f.id}
                      className="rounded-2xl border border-neutral-200/90 bg-white p-5 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <span className="text-xs font-bold text-neutral-900">
                          #{idx + 1} &bull; {f.name}
                        </span>
                        <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                          KaTeX Formula
                        </span>
                      </div>

                      <div className="py-2 bg-neutral-50/60 rounded-xl p-3 border border-neutral-100 overflow-x-auto text-center">
                        <MathRenderer content={f.latex} />
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {f.description}
                      </p>

                      {/* Variables Legend */}
                      {f.variables && f.variables.length > 0 && (
                        <div className="pt-2 border-t border-neutral-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                            Variable Symbols & SI Units:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {f.variables.map((v, vIdx) => (
                              <div
                                key={vIdx}
                                className="flex items-center justify-between rounded-lg bg-neutral-50 px-2.5 py-1.5 border border-neutral-100"
                              >
                                <span className="font-mono font-bold text-neutral-900">
                                  ${v.symbol}$
                                </span>
                                <span className="text-neutral-600 text-[11px] truncate mx-2">
                                  {v.meaning}
                                </span>
                                <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                                  [{v.unit}]
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* High Yield Tip */}
                      {f.highYieldTip && (
                        <div className="rounded-xl bg-amber-50 border border-amber-200/70 p-3 text-xs text-amber-900 flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Matric Examiner Tip:</strong> {f.highYieldTip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Core Laws */}
              {activeLessonTab === "laws" && (
                <div className="space-y-4">
                  {activeLesson.coreLaws.map((law, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-neutral-200/90 bg-white p-5 space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <h4 className="text-sm font-bold text-neutral-950">
                          {law.title}
                        </h4>
                      </div>
                      <blockquote className="border-l-2 border-emerald-500 pl-3.5 text-xs text-neutral-700 italic leading-relaxed">
                        &ldquo;{law.statement}&rdquo;
                      </blockquote>
                      <div className="pt-2 text-xs text-neutral-600">
                        <strong>Matric Application: </strong>
                        <span>{law.keyApplication}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Examiner Traps */}
              {activeLessonTab === "traps" && (
                <div className="space-y-4">
                  {activeLesson.commonTraps.map((trap, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 space-y-2"
                    >
                      <div className="flex items-center gap-2 text-rose-700">
                        <ShieldAlert className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          Pitfall #{idx + 1}
                        </h4>
                      </div>
                      <div className="text-xs text-neutral-700 space-y-1">
                        <p><strong>The Trap: </strong>{trap.trap}</p>
                        <p className="text-emerald-800 font-semibold">
                          <strong>How to avoid: </strong>{trap.correction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between p-4 sm:px-6 border-t border-neutral-200/80 bg-neutral-50/70">
              <span className="text-xs text-neutral-500">
                Grade {activeLesson.grade} &bull; Unit {activeLesson.unitNumber}
              </span>

              <div className="flex items-center gap-2.5">
                <Link
                  href={`/bank?subject=${activeLesson.subjectId}&grade=${activeLesson.grade}&unit=${activeLesson.unitNumber}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors shadow-2xs"
                >
                  <Layers className="h-3.5 w-3.5 text-blue-600" />
                  <span>Practice Chapter Qs</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveLesson(null)}
                  className="inline-flex items-center rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 text-xs font-semibold transition-all shadow-xs"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
