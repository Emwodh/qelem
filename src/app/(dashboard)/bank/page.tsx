"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Atom,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  RotateCcw,
  Zap,
  ShieldCheck,
  Sigma,
  X,
  GraduationCap,
  Play,
  Check,
} from "lucide-react";
import {
  CURRICULUM_UNITS,
  CURRICULUM_QUESTIONS,
  filterCurriculumQuestions,
  getAvailableExamYears,
} from "@/lib/curriculumData";
import { getAllQuestions, loadQuestionsWithSupabase } from "@/lib/questionStore";
import {
  ExamQuestion,
  CurriculumUnit,
  QuestionFilter,
  GradeLevel,
} from "@/types/curriculum";
import { MathRenderer } from "@/components/ui/MathRenderer";

export default function QuestionBankPage() {
  // Filter States
  const [subjectFilter, setSubjectFilter] = useState<QuestionFilter["subjectId"]>("all");
  const [gradeFilter, setGradeFilter] = useState<GradeLevel | "all">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<QuestionFilter["difficulty"]>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Accordion state: which units are expanded (default to first unit open)
  const [expandedUnitIds, setExpandedUnitIds] = useState<Record<string, boolean>>({
    "phy-12-u2": true,
    "math-12-u4": true,
  });

  // Question solution reveal states: Record<questionId, boolean>
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // Practice Sprint Modal State
  const [activeSprintUnit, setActiveSprintUnit] = useState<CurriculumUnit | null>(null);
  const [sprintQuestionIndex, setSprintQuestionIndex] = useState<number>(0);
  const [sprintAnswers, setSprintAnswers] = useState<
    Record<string, { selected: "A" | "B" | "C" | "D"; isSubmitted: boolean }>
  >({});

  const availableYears = useMemo(() => getAvailableExamYears(), []);

  const [allQuestionsList, setAllQuestionsList] = useState<ExamQuestion[]>(CURRICULUM_QUESTIONS);

  useEffect(() => {
    setAllQuestionsList(getAllQuestions());
    loadQuestionsWithSupabase().then((qs) => {
      setAllQuestionsList(qs);
    });
  }, []);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return filterCurriculumQuestions(allQuestionsList, {
      subjectId: subjectFilter,
      grade: gradeFilter,
      examYear: yearFilter,
      difficulty: difficultyFilter,
      searchQuery,
    });
  }, [allQuestionsList, subjectFilter, gradeFilter, yearFilter, difficultyFilter, searchQuery]);

  // Filtered Units
  const filteredUnits = useMemo(() => {
    return CURRICULUM_UNITS.filter((unit) => {
      if (subjectFilter !== "all" && unit.subjectId !== subjectFilter) {
        return false;
      }
      if (gradeFilter !== "all" && unit.grade !== gradeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesUnit =
          unit.unitTitle.toLowerCase().includes(query) ||
          unit.description.toLowerCase().includes(query) ||
          unit.keyTopics.some((t) => t.toLowerCase().includes(query));
        const hasMatchingQuestion = filteredQuestions.some(
          (q) => q.unitNumber === unit.unitNumber && q.subjectId === unit.subjectId && q.grade === unit.grade
        );
        return matchesUnit || hasMatchingQuestion;
      }
      return true;
    });
  }, [subjectFilter, gradeFilter, searchQuery, filteredQuestions]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnitIds((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const toggleSolution = (questionId: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Launch focused sprint modal
  const handleLaunchSprint = (unit: CurriculumUnit) => {
    setActiveSprintUnit(unit);
    setSprintQuestionIndex(0);
    setSprintAnswers({});
  };

  // Sprint questions for active modal
  const sprintQuestions = useMemo(() => {
    if (!activeSprintUnit) return [];
    return CURRICULUM_QUESTIONS.filter(
      (q) =>
        q.subjectId === activeSprintUnit.subjectId &&
        q.grade === activeSprintUnit.grade &&
        q.unitNumber === activeSprintUnit.unitNumber
    );
  }, [activeSprintUnit]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Hero Banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Question Bank
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Browse questions by subject and grade, then practice.
          </p>
        </div>

        {/* Global Bank Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-3.5 sm:p-4 text-center shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 block">
              Units
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 font-mono">
              {filteredUnits.length}
            </span>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-white p-3.5 sm:p-4 text-center shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 block">
              Questions
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-blue-600 font-mono">
              {filteredQuestions.length}
            </span>
          </div>

          <Link
            href="/admin/questions"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-xs font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>+ Ingest Questions</span>
          </Link>
        </div>
      </section>

      {/* 2. Interactive Filter & Search Controls */}
      <section className="rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
        {/* Top Filter Row: Search Input & Exam Year Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-xl border border-neutral-200/90 bg-neutral-50/50 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 rounded-full p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Exam Year Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-neutral-400 shrink-0 hidden sm:block" />
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="rounded-xl border border-neutral-200/90 bg-neutral-50/50 px-3 py-2.5 text-xs sm:text-sm font-medium text-neutral-800 focus:border-blue-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              <option value="all">All Exam Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            {/* Difficulty Filter Dropdown */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as QuestionFilter["difficulty"])}
              className="rounded-xl border border-neutral-200/90 bg-neutral-50/50 px-3 py-2.5 text-xs sm:text-sm font-medium text-neutral-800 focus:border-blue-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="foundation">Foundation Level</option>
              <option value="moderate">Moderate Level</option>
              <option value="advanced">Advanced Level</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Row: Subject Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSubjectFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                subjectFilter === "all"
                  ? "bg-neutral-900 text-white shadow-2xs"
                  : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900"
              }`}
            >
              All Subjects
            </button>
            <button
              type="button"
              onClick={() => setSubjectFilter("math-nat")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                subjectFilter === "math-nat"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900"
              }`}
            >
              <Sigma className="h-3.5 w-3.5" />
              <span>Mathematics (Natural)</span>
            </button>
            <button
              type="button"
              onClick={() => setSubjectFilter("physics")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                subjectFilter === "physics"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900"
              }`}
            >
              <Atom className="h-3.5 w-3.5" />
              <span>Physics</span>
            </button>
          </div>

          {/* Grade Level Pills */}
          <div className="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/70">
            {(["all", 12, 11, 10, 9] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGradeFilter(g)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  gradeFilter === g
                    ? "bg-white text-neutral-950 shadow-2xs border border-neutral-200"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {g === "all" ? "All" : `Gr ${g}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Unit Accordion List */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950">
            Syllabus Units & Past Exam Items ({filteredUnits.length} Chapters)
          </h2>
          <span className="text-xs text-neutral-500">
            Click any unit to expand questions & mathematical derivations.
          </span>
        </div>

        {filteredUnits.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-12 text-center shadow-sm">
            <Layers className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">No units match your filter</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try broadening your subject, grade level, or exam year criteria to view more curriculum chapters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubjectFilter("all");
                setGradeFilter("all");
                setYearFilter("all");
                setDifficultyFilter("all");
                setSearchQuery("");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          filteredUnits.map((unit) => {
            const isExpanded = Boolean(expandedUnitIds[unit.id]);
            const unitQuestions = filteredQuestions.filter(
              (q) =>
                q.subjectId === unit.subjectId &&
                q.grade === unit.grade &&
                q.unitNumber === unit.unitNumber
            );
            const progressPercent = Math.round((unit.solvedQuestions / unit.totalQuestions) * 100);

            return (
              <div
                key={unit.id}
                className="overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all hover:border-neutral-300"
              >
                {/* Unit Header Accordion Bar */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50/40">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-neutral-950 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                        <GraduationCap className="h-3 w-3 text-neutral-300" />
                        <span>Grade {unit.grade}</span>
                      </span>
                      <span className="text-xs text-neutral-300">&bull;</span>
                      <span className="text-xs font-semibold text-neutral-700">
                        {unit.subject}
                      </span>
                      <span className="text-xs text-neutral-300">&bull;</span>
                      <span className="text-xs font-medium text-neutral-500">
                        Unit {unit.unitNumber}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight">
                      {unit.unitTitle}
                    </h3>
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {unit.description}
                    </p>

                    {/* Topics Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {unit.keyTopics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 border border-neutral-200/70"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress & Actions Strip */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                    {/* Unit Progress Bar */}
                    <div className="w-full sm:w-36 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span>Unit Progress</span>
                        <span className="font-mono font-semibold text-neutral-900">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-neutral-200/80 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 block text-right font-mono">
                        {unit.solvedQuestions}/{unit.totalQuestions} Solved
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleLaunchSprint(unit)}
                        className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all active:scale-[0.98] cursor-pointer"
                        title="Launch 10-Question Focused Sprint for this Unit"
                      >
                        <Play className="h-3 w-3 fill-white" />
                        <span>Practice Unit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleUnit(unit.id)}
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-neutral-200/90 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-950 transition-all cursor-pointer"
                        aria-expanded={isExpanded}
                      >
                        <span className="font-mono">{unitQuestions.length} Qs</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5 text-neutral-500" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Questions List */}
                {isExpanded && (
                  <div className="border-t border-neutral-200/80 divide-y divide-neutral-100 bg-white p-4 sm:p-6 space-y-6">
                    {unitQuestions.length === 0 ? (
                      <p className="text-xs text-neutral-500 text-center py-4">
                        No specific questions match your current year or difficulty filters for this unit.
                      </p>
                    ) : (
                      unitQuestions.map((question, qIdx) => {
                        const isSolutionRevealed = Boolean(revealedSolutions[question.id]);

                        return (
                          <article
                            key={question.id}
                            className="pt-6 first:pt-0 space-y-4"
                          >
                            {/* Question Header Metadata */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-900 text-white font-mono text-[11px] font-bold">
                                  {qIdx + 1}
                                </span>
                                {question.examYear && (
                                  <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700 border border-neutral-200">
                                    <Calendar className="h-3 w-3 text-neutral-400" />
                                    <span>{question.examYear}</span>
                                  </span>
                                )}
                              </div>

                              <span className="inline-flex items-center rounded-md bg-neutral-50 px-2 py-0.5 font-medium text-neutral-600 border border-neutral-200/70 capitalize">
                                {question.difficulty}
                              </span>
                            </div>

                            {/* Question Stem with KaTeX Math Rendering */}
                            <div className="text-sm sm:text-base font-medium text-neutral-950 leading-relaxed">
                              <MathRenderer content={question.prompt} />
                            </div>

                            {/* Multiple Choice Options Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {question.options.map((opt) => (
                                <div
                                  key={opt.id}
                                  className="flex items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3 text-neutral-800"
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200 font-bold text-neutral-700 text-xs shadow-2xs">
                                    {opt.id}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <MathRenderer content={opt.text} />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Solution & Derivation Drawer Toggle */}
                            <div>
                              <button
                                type="button"
                                onClick={() => toggleSolution(question.id)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                              >
                                <span>{isSolutionRevealed ? "Hide Solution" : "Reveal Solution & Step-by-Step Derivation"}</span>
                                {isSolutionRevealed ? (
                                  <ChevronUp className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                )}
                              </button>

                              {/* Derivation Details Box */}
                              {isSolutionRevealed && (
                                <div className="mt-3 rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4 sm:p-5 space-y-4 animate-in fade-in-50 duration-200">
                                  {/* Verified Answer Pill */}
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                      <span>Correct Option: Option {question.correctOptionId}</span>
                                    </span>
                                    <span className="text-xs text-neutral-400">&bull;</span>
                                    <span className="text-xs text-neutral-600 font-medium">
                                      MoE Standard Key
                                    </span>
                                  </div>

                                  {/* Governing Formula */}
                                  {question.keyFormula && (
                                    <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-3.5 text-white">
                                      <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                                        <span className="font-semibold flex items-center gap-1">
                                          <Sigma className="h-3 w-3 text-blue-400" />
                                          Governing Formula:
                                        </span>
                                        <span className="text-[10px] font-mono uppercase bg-neutral-800 px-1.5 py-0.5 rounded">
                                          Unit {question.unitNumber}
                                        </span>
                                      </div>
                                      <div className="text-sm sm:text-base font-mono text-blue-300 font-semibold">
                                        <MathRenderer content={question.keyFormula} displayMode />
                                      </div>
                                    </div>
                                  )}

                                  {/* Step-by-Step Derivation Steps */}
                                  <div>
                                    <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                                      Step-by-Step Derivation
                                    </h5>
                                    <div className="space-y-1.5">
                                      {question.derivationSteps.map((step, sIdx) => (
                                        <div
                                          key={sIdx}
                                          className="flex items-start gap-2.5 rounded-lg border border-neutral-200/70 bg-white p-2.5 text-xs text-neutral-800 shadow-2xs font-mono"
                                        >
                                          <span className="font-bold text-neutral-500 shrink-0">
                                            {sIdx + 1}.
                                          </span>
                                          <div className="flex-1 min-w-0">
                                            <MathRenderer content={step} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Conceptual Explanation */}
                                  <div className="pt-2 border-t border-neutral-200/60 text-xs text-neutral-700 leading-relaxed">
                                    <span className="font-semibold text-neutral-900 block mb-0.5">
                                      Conceptual Principle:
                                    </span>
                                    <MathRenderer content={question.explanation} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* 4. Interactive Practice Sprint Modal */}
      {activeSprintUnit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in-50 duration-200"
        >
          <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                  <span className="font-semibold text-blue-600">{activeSprintUnit.subject}</span>
                  <span>&bull;</span>
                  <span>Grade {activeSprintUnit.grade} &bull; Unit {activeSprintUnit.unitNumber}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-950">
                  {activeSprintUnit.unitTitle} &bull; Practice Sprint
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveSprintUnit(null)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sprint Question Body */}
            {sprintQuestions.length > 0 && sprintQuestions[sprintQuestionIndex] ? (
              <div className="mt-6 space-y-6">
                {/* Progress counter */}
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>
                    Question {sprintQuestionIndex + 1} of {sprintQuestions.length}
                  </span>
                  {sprintQuestions[sprintQuestionIndex].examYear && (
                    <span className="font-medium text-neutral-700">
                      {sprintQuestions[sprintQuestionIndex].examYear}
                    </span>
                  )}
                </div>

                {/* Prompt */}
                <div className="text-base font-medium text-neutral-900 leading-relaxed bg-neutral-50/70 p-4 rounded-2xl border border-neutral-200/70">
                  <MathRenderer content={sprintQuestions[sprintQuestionIndex].prompt} />
                </div>

                {/* Multiple choice options */}
                <div className="space-y-2.5">
                  {sprintQuestions[sprintQuestionIndex].options.map((opt) => {
                    const currentQ = sprintQuestions[sprintQuestionIndex];
                    const recorded = sprintAnswers[currentQ.id];
                    const isSelected = recorded?.selected === opt.id;
                    const isSubmitted = recorded?.isSubmitted ?? false;
                    const isCorrect = opt.id === currentQ.correctOptionId;

                    let optStyle = "border-neutral-200 hover:border-neutral-300 bg-white";
                    if (isSelected && !isSubmitted) {
                      optStyle = "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600";
                    } else if (isSubmitted) {
                      if (isCorrect) {
                        optStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium";
                      } else if (isSelected && !isCorrect) {
                        optStyle = "border-rose-400 bg-rose-50/80 text-rose-950";
                      } else {
                        optStyle = "border-neutral-200/50 bg-neutral-50/40 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => {
                          setSprintAnswers((prev) => ({
                            ...prev,
                            [currentQ.id]: { selected: opt.id, isSubmitted: false },
                          }));
                        }}
                        className={`flex w-full items-center justify-between p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${optStyle}`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-bold text-neutral-700 text-xs">
                            {opt.id}
                          </span>
                          <div className="flex-1 min-w-0">
                            <MathRenderer content={opt.text} />
                          </div>
                        </div>

                        {isSubmitted && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback Callout when Submitted */}
                {sprintAnswers[sprintQuestions[sprintQuestionIndex].id]?.isSubmitted && (() => {
                  const currentQ = sprintQuestions[sprintQuestionIndex];
                  const recorded = sprintAnswers[currentQ.id];
                  const isCorrect = recorded?.selected === currentQ.correctOptionId;
                  const correctOption = currentQ.options.find((o) => o.id === currentQ.correctOptionId);

                  return (
                    <div
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 animate-in fade-in-50 duration-200 ${
                        isCorrect
                          ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                          : "bg-rose-50/80 border-rose-200 text-rose-950"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>Correct! Option {currentQ.correctOptionId} is verified accurate.</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-rose-600 shrink-0" />
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>You selected Option {recorded?.selected}. Correct answer is Option {currentQ.correctOptionId}:</span>
                              <span className="font-semibold px-1.5 py-0.5 rounded bg-white border border-rose-200 text-rose-950 shadow-2xs">
                                <MathRenderer content={correctOption?.text || ""} />
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="text-neutral-700 leading-relaxed pt-1 border-t border-neutral-200/50">
                        <MathRenderer content={currentQ.explanation} />
                      </div>
                    </div>
                  );
                })()}

                {/* Feedback & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    disabled={sprintQuestionIndex === 0}
                    onClick={() => setSprintQuestionIndex((prev) => prev - 1)}
                    className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-semibold text-neutral-700 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Check Answer Button */}
                    {!sprintAnswers[sprintQuestions[sprintQuestionIndex].id]?.isSubmitted ? (
                      <button
                        type="button"
                        disabled={!sprintAnswers[sprintQuestions[sprintQuestionIndex].id]?.selected}
                        onClick={() => {
                          const currentQ = sprintQuestions[sprintQuestionIndex];
                          const selected = sprintAnswers[currentQ.id]?.selected;
                          if (selected) {
                            setSprintAnswers((prev) => ({
                              ...prev,
                              [currentQ.id]: { selected, isSubmitted: true },
                            }));
                          }
                        }}
                        className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (sprintQuestionIndex < sprintQuestions.length - 1) {
                            setSprintQuestionIndex((prev) => prev + 1);
                          } else {
                            setActiveSprintUnit(null);
                          }
                        }}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        {sprintQuestionIndex < sprintQuestions.length - 1
                          ? "Next Question →"
                          : "Finish Sprint"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-neutral-500">
                All questions for this unit completed in this session.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
