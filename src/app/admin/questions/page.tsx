"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Database,
  UploadCloud,
  FileText,
  Code,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  Edit3,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Loader2,
  Check,
  X,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle,
  Save,
  RotateCcw,
} from "lucide-react";
import { ExamQuestion, GradeLevel, QuestionOption } from "@/types/curriculum";
import {
  getAllQuestions,
  saveQuestionsBulk,
  updateSingleQuestion,
  deleteSingleQuestion,
  parsePlainTextQuestions,
  parseCSVQuestions,
} from "@/lib/questionStore";
import { MathRenderer } from "@/components/ui/MathRenderer";
import { logAdminAction } from "@/lib/auditStore";

const SAMPLE_TEXT_INPUT = `1. A projectile is launched with an initial velocity of $v_0 = 40\\,\\text{m/s}$ at an angle of $30^\\circ$ above the horizontal. Assuming $g = 10\\,\\text{m/s}^2$, what is its maximum height?
A) 10 m
B) 20 m
C) 40 m
D) 80 m
Answer: B
Explanation: The vertical component of initial velocity is $v_{0y} = v_0 \\sin(30^\\circ) = 40(0.5) = 20\\,\\text{m/s}$. Using maximum height formula:
$$H_{\\max} = \\frac{v_{0y}^2}{2g} = \\frac{(20)^2}{2(10)} = \\frac{400}{20} = 20\\,\\text{m}$$

2. What is the derivative of $f(x) = \\ln(x^2 + 1)$ with respect to $x$?
A) $\\frac{1}{x^2 + 1}$
B) $\\frac{2x}{x^2 + 1}$
C) $\\frac{x}{x^2 + 1}$
D) $\\frac{2}{x^2 + 1}$
Answer: B
Explanation: By the chain rule, $\\frac{d}{dx}\\ln(u) = \\frac{1}{u}\\frac{du}{dx}$. Here $u = x^2 + 1$, so $\\frac{du}{dx} = 2x$. Thus:
$$f'(x) = \\frac{2x}{x^2 + 1}$$`;

export default function AdminQuestionsPage() {
  const [activeMainTab, setActiveMainTab] = useState<"browse" | "ingest">("browse");
  const [ingestFormat, setIngestFormat] = useState<"upload" | "text" | "json" | "csv">("upload");

  // Questions Database State
  const [allQuestions, setAllQuestions] = useState<ExamQuestion[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Browse Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  // Ingestion Metadata
  const [subjectId, setSubjectId] = useState<"physics" | "math-nat" | "chemistry" | "biology">("physics");
  const [grade, setGrade] = useState<GradeLevel>(12);
  const [unitNumber, setUnitNumber] = useState<number>(2);
  const [unitTitle, setUnitTitle] = useState<string>("Electromagnetism & Induction");
  const [examYear, setExamYear] = useState<string>("2016 E.C.");
  const [difficulty, setDifficulty] = useState<"foundation" | "moderate" | "advanced">("moderate");

  // Ingest Inputs
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [rawText, setRawText] = useState(SAMPLE_TEXT_INPUT);
  const [rawJson, setRawJson] = useState("");
  const [rawCsv, setRawCsv] = useState("");
  const [parsedIngestQuestions, setParsedIngestQuestions] = useState<ExamQuestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Question Editor / Creator Modals
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestion | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newQuestionForm, setNewQuestionForm] = useState<Partial<ExamQuestion>>({
    subject: "Physics",
    subjectId: "physics",
    grade: 12,
    unitNumber: 1,
    unitTitle: "General Physics",
    examYear: "2016 E.C.",
    difficulty: "moderate",
    prompt: "",
    options: [
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" },
    ],
    correctOptionId: "A",
    explanation: "",
    derivationSteps: [],
  });

  const loadAllQuestions = () => {
    if (typeof window !== "undefined") {
      setAllQuestions(getAllQuestions());
    }
  };

  useEffect(() => {
    loadAllQuestions();
  }, []);

  const showStatus = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // 1. Delete Question
  const handleDeleteQuestion = async (q: ExamQuestion) => {
    if (confirm(`Are you sure you want to delete this question (${q.id})?`)) {
      await deleteSingleQuestion(q.id);
      logAdminAction("DELETE_QUESTION", `Deleted question ${q.id} (${q.subject} G${q.grade})`, q.id);
      loadAllQuestions();
      showStatus("Question deleted from bank.");
    }
  };

  // 2. Save Edited Question
  const handleSaveEditedQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    await updateSingleQuestion(editingQuestion);
    logAdminAction("UPDATE_QUESTION", `Updated question ${editingQuestion.id} prompt/options`, editingQuestion.id);
    loadAllQuestions();
    setEditingQuestion(null);
    showStatus("Question updated successfully.");
  };

  // 3. Save New Single Question
  const handleCreateNewQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionForm.prompt || !newQuestionForm.explanation) {
      alert("Please provide both a prompt and an explanation.");
      return;
    }

    const id = `${newQuestionForm.subjectId}-g${newQuestionForm.grade}-u${newQuestionForm.unitNumber}-item-${Date.now()}`;
    const questionToSave: ExamQuestion = {
      id,
      subject: newQuestionForm.subjectId === "physics" ? "Physics" :
               newQuestionForm.subjectId === "math-nat" ? "Mathematics" :
               newQuestionForm.subjectId === "chemistry" ? "Chemistry" : "Biology",
      subjectId: newQuestionForm.subjectId as any || "physics",
      grade: newQuestionForm.grade || 12,
      unitNumber: newQuestionForm.unitNumber || 1,
      unitTitle: newQuestionForm.unitTitle || "General",
      prompt: newQuestionForm.prompt,
      options: newQuestionForm.options as QuestionOption[] || [],
      correctOptionId: newQuestionForm.correctOptionId || "A",
      explanation: newQuestionForm.explanation,
      derivationSteps: [newQuestionForm.explanation],
      examYear: newQuestionForm.examYear || "2016 E.C.",
      difficulty: newQuestionForm.difficulty || "moderate",
      isProSolutionAvailable: true,
    };

    await updateSingleQuestion(questionToSave);
    logAdminAction("UPDATE_QUESTION", `Manually created question ${id}`, id);
    loadAllQuestions();
    setIsCreateModalOpen(false);
    showStatus("New question added to bank.");
  };

  // 4. Batch Ingest Processing
  const handleParseInput = () => {
    const subjectName =
      subjectId === "physics" ? "Physics" :
      subjectId === "math-nat" ? "Mathematics (Natural)" :
      subjectId === "chemistry" ? "Chemistry" : "Biology";

    if (ingestFormat === "text") {
      const results = parsePlainTextQuestions(rawText, {
        subject: subjectName,
        subjectId,
        grade,
        unitNumber,
        unitTitle,
        examYear,
        difficulty,
      });
      setParsedIngestQuestions(results);
      if (results.length > 0) {
        showStatus(`Parsed ${results.length} questions from text input.`);
      } else {
        showStatus("Could not parse questions. Check input format.", "error");
      }
    } else if (ingestFormat === "json") {
      try {
        const parsed = JSON.parse(rawJson);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        setParsedIngestQuestions(list);
        showStatus(`Loaded ${list.length} questions from JSON.`);
      } catch (err) {
        showStatus("Invalid JSON array format.", "error");
      }
    } else if (ingestFormat === "csv") {
      const results = parseCSVQuestions(rawCsv, {
        subject: subjectName,
        subjectId,
        grade,
        unitNumber,
        unitTitle,
        examYear,
      });
      setParsedIngestQuestions(results);
      if (results.length > 0) {
        showStatus(`Parsed ${results.length} questions from CSV.`);
      } else {
        showStatus("Could not parse CSV. Verify column headers.", "error");
      }
    }
  };

  // 5. File Upload Handler
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsExtracting(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectId", subjectId);
    formData.append("grade", String(grade));
    formData.append("unitNumber", String(unitNumber));
    formData.append("unitTitle", unitTitle);
    formData.append("examYear", examYear);
    formData.append("difficulty", difficulty);

    try {
      const adminKey = typeof window !== "undefined" ? sessionStorage.getItem("qelem_admin_key") || "" : "";
      const res = await fetch("/api/admin/parse-file", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setParsedIngestQuestions(data.questions);
          showStatus(`Extracted ${data.questions.length} questions from ${file.name}.`);
        } else if (data.rawText) {
          setRawText(data.rawText);
          setIngestFormat("text");
          handleParseInput();
        }
      } else {
        // Fallback for markdown/text locally
        if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
          const txt = await file.text();
          setRawText(txt);
          const results = parsePlainTextQuestions(txt, {
            subject: subjectId === "physics" ? "Physics" : "Mathematics",
            subjectId,
            grade,
            unitNumber,
            unitTitle,
            examYear,
            difficulty,
          });
          setParsedIngestQuestions(results);
          showStatus(`Parsed ${results.length} questions locally from ${file.name}.`);
        } else {
          showStatus("Server parsing failed. Try copying text into Plain Text tab.", "error");
        }
      }
    } catch (err) {
      showStatus("File extraction error. Please use Plain Text paste.", "error");
    } finally {
      setIsExtracting(false);
    }
  };

  // 6. Bulk Save
  const handleSaveIngestedQuestions = async () => {
    if (parsedIngestQuestions.length === 0) return;
    setIsSaving(true);

    await saveQuestionsBulk(parsedIngestQuestions);
    logAdminAction(
      "INGEST_QUESTIONS",
      `Ingested ${parsedIngestQuestions.length} items for ${subjectId.toUpperCase()} Grade ${grade} (${examYear})`,
      `${subjectId}-g${grade}`
    );

    loadAllQuestions();
    setIsSaving(false);
    showStatus(`Saved ${parsedIngestQuestions.length} questions to master bank.`);
    setParsedIngestQuestions([]);
    setActiveMainTab("browse");
  };

  // 7. Export Bank
  const handleExportJSON = () => {
    const data = JSON.stringify(allQuestions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qelem_question_bank_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Questions for Browse Tab
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (subjectFilter !== "all" && q.subjectId !== subjectFilter) return false;
      if (gradeFilter !== "all" && String(q.grade) !== gradeFilter) return false;
      if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inPrompt = q.prompt.toLowerCase().includes(query);
        const inUnit = q.unitTitle.toLowerCase().includes(query);
        const inExpl = q.explanation.toLowerCase().includes(query);
        const inId = q.id.toLowerCase().includes(query);
        if (!inPrompt && !inUnit && !inExpl && !inId) return false;
      }
      return true;
    });
  }, [allQuestions, subjectFilter, gradeFilter, difficultyFilter, searchQuery]);

  // LaTeX Shortcut Insertion Helper
  const insertLatexShortcut = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    currentVal: string,
    snippet: string
  ) => {
    setter(currentVal + snippet);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-mono font-medium text-indigo-300">
              <Database className="h-3.5 w-3.5 text-indigo-400" />
              <span>National Examination Bank</span>
            </span>
            <span className="text-xs text-neutral-500 font-mono">«የጥያቄዎች ባንክ»</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Question Bank Manager & AI Parser
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Browse, search, and edit verified Grade 9–12 exam items with KaTeX math rendering, or ingest past national papers via PDF, text, JSON, or CSV.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-neutral-400" />
            <span>Export Bank (.json)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Single Question</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`rounded-2xl p-4 text-xs font-medium flex items-center justify-between animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
        <button
          type="button"
          onClick={() => setActiveMainTab("browse")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeMainTab === "browse"
              ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Browse Bank ({allQuestions.length} Items)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab("ingest")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeMainTab === "ingest"
              ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <UploadCloud className="h-4 w-4" />
          <span>AI & Bulk Paper Ingestion</span>
        </button>
      </div>

      {/* VIEW 1: BROWSE & CURATE BANK */}
      {activeMainTab === "browse" && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompt, LaTeX formula, unit, or question ID..."
                className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-neutral-300 focus:border-indigo-500 outline-none"
              >
                <option value="all">All Subjects</option>
                <option value="physics">Physics</option>
                <option value="math-nat">Mathematics (Nat)</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
              </select>

              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-neutral-300 focus:border-indigo-500 outline-none"
              >
                <option value="all">All Grades</option>
                <option value="12">Grade 12</option>
                <option value="11">Grade 11</option>
                <option value="10">Grade 10</option>
                <option value="9">Grade 9</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-neutral-300 focus:border-indigo-500 outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="foundation">Foundation</option>
                <option value="moderate">Moderate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>Showing {filteredQuestions.length} of {allQuestions.length} items</span>
              <span>KaTeX Engine Active</span>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-12 text-center text-neutral-400 space-y-3">
                <Database className="h-8 w-8 text-neutral-600 mx-auto" />
                <p>No questions matched your search query or filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.slice(0, 30).map((q, idx) => (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-4 hover:border-white/[0.16] transition-all"
                  >
                    {/* Top Meta Line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                          {q.subject} G{q.grade}
                        </span>
                        <span className="text-xs font-semibold text-neutral-300">
                          Unit {q.unitNumber}: {q.unitTitle}
                        </span>
                        {q.examYear && (
                          <span className="text-[10px] font-mono text-neutral-500 bg-white/[0.04] px-2 py-0.5 rounded-md">
                            {q.examYear}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-500">ID: {q.id}</span>
                        <button
                          type="button"
                          onClick={() => setEditingQuestion(q)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                          title="Edit Question"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question Prompt with KaTeX */}
                    <div className="text-sm font-medium text-white leading-relaxed">
                      <MathRenderer content={q.prompt} />
                    </div>

                    {/* 4 Multiple Choice Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                            opt.id === q.correctOptionId
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                              : "bg-[#181A24] border-white/[0.06] text-neutral-300"
                          }`}
                        >
                          <span
                            className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                              opt.id === q.correctOptionId
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-white/[0.06] text-neutral-400"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <div className="flex-1">
                            <MathRenderer content={opt.text} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Explanation Drawer */}
                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-[#181A24] border border-white/[0.06] text-xs text-neutral-300 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          Step-by-Step Derivation & Key Formula:
                        </span>
                        <div>
                          <MathRenderer content={q.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: AI & BATCH INGESTION */}
      {activeMainTab === "ingest" && (
        <div className="space-y-6">
          {/* Metadata Selector */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Curriculum Metadata Target</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-400">Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value as any)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                >
                  <option value="physics">Physics</option>
                  <option value="math-nat">Mathematics (Nat)</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-400">Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value) as any)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                >
                  <option value={12}>Grade 12</option>
                  <option value={11}>Grade 11</option>
                  <option value={10}>Grade 10</option>
                  <option value={9}>Grade 9</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-400">Unit Number</label>
                <input
                  type="number"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-[11px] font-mono text-neutral-400">Unit Title</label>
                <input
                  type="text"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-neutral-400">Exam Year</label>
                <input
                  type="text"
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Ingestion Mode Tabs */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
              <button
                type="button"
                onClick={() => setIngestFormat("upload")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  ingestFormat === "upload" ? "bg-indigo-600 text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                PDF / Document Upload
              </button>
              <button
                type="button"
                onClick={() => setIngestFormat("text")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  ingestFormat === "text" ? "bg-indigo-600 text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                Telegram / Plain Text Parser
              </button>
              <button
                type="button"
                onClick={() => setIngestFormat("json")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  ingestFormat === "json" ? "bg-indigo-600 text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                JSON Array
              </button>
              <button
                type="button"
                onClick={() => setIngestFormat("csv")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  ingestFormat === "csv" ? "bg-indigo-600 text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                CSV
              </button>
            </div>

            {/* Sub-view: Upload */}
            {ingestFormat === "upload" && (
              <div className="border-2 border-dashed border-white/[0.1] rounded-2xl p-8 text-center space-y-3 hover:border-indigo-500/50 transition-all">
                <UploadCloud className="h-10 w-10 text-indigo-400 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-white">Upload National Exam Paper (PDF or Markdown)</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Drag and drop past entrance exams. AI extraction will automatically separate questions, answer keys, and LaTeX math.
                  </p>
                </div>
                <label className="inline-block px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-all">
                  {isExtracting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Extracting Items...
                    </span>
                  ) : (
                    "Select Document"
                  )}
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  />
                </label>
              </div>
            )}

            {/* Sub-view: Plain Text */}
            {ingestFormat === "text" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Paste questions directly from Telegram channels, notes, or scanned OCR:</span>
                  <button
                    type="button"
                    onClick={() => setRawText(SAMPLE_TEXT_INPUT)}
                    className="text-indigo-400 hover:text-indigo-300 font-mono text-[11px]"
                  >
                    Load Sample
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="1. Question prompt... A) ... B) ... Answer: B Explanation: ..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] p-3 text-xs text-white font-mono focus:border-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleParseInput}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-all"
                >
                  Parse Plain Text &rarr;
                </button>
              </div>
            )}

            {/* Sub-view: JSON */}
            {ingestFormat === "json" && (
              <div className="space-y-3">
                <textarea
                  rows={8}
                  value={rawJson}
                  onChange={(e) => setRawJson(e.target.value)}
                  placeholder='[ { "id": "...", "prompt": "...", "options": [...], "correctOptionId": "A", "explanation": "..." } ]'
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] p-3 text-xs text-white font-mono focus:border-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleParseInput}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-all"
                >
                  Parse JSON &rarr;
                </button>
              </div>
            )}

            {/* Sub-view: CSV */}
            {ingestFormat === "csv" && (
              <div className="space-y-3">
                <textarea
                  rows={8}
                  value={rawCsv}
                  onChange={(e) => setRawCsv(e.target.value)}
                  placeholder="prompt,optionA,optionB,optionC,optionD,correctOption,explanation"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] p-3 text-xs text-white font-mono focus:border-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleParseInput}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-all"
                >
                  Parse CSV &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Parsed Preview Queue */}
          {parsedIngestQuestions.length > 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    Parsed Preview ({parsedIngestQuestions.length} Questions Ready)
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleSaveIngestedQuestions}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving to Bank...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Commit {parsedIngestQuestions.length} Questions to Bank</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {parsedIngestQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl bg-[#181A24] border border-white/[0.06] space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                      <span>Item #{idx + 1}</span>
                      <span className="text-emerald-400">Correct: {q.correctOptionId}</span>
                    </div>

                    <div className="text-xs font-medium text-white">
                      <MathRenderer content={q.prompt} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                            opt.id === q.correctOptionId
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold"
                              : "bg-white/[0.02] border-white/[0.04] text-neutral-300"
                          }`}
                        >
                          <span className="font-mono text-[10px]">{opt.id}:</span>
                          <MathRenderer content={opt.text} />
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px] text-neutral-400">
                        <span className="font-mono text-emerald-400 font-bold">Derivation: </span>
                        <MathRenderer content={q.explanation} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: EDIT EXISTING QUESTION */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#11131B] p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Question Item</h3>
                  <p className="text-xs text-neutral-400 font-mono">ID: {editingQuestion.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedQuestion} className="space-y-4">
              {/* LaTeX Shortcut Buttons */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Quick LaTeX Formulas:</span>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {[
                    { label: "\\frac{a}{b}", val: "$\\frac{a}{b}$" },
                    { label: "\\sqrt{x}", val: "$\\sqrt{x}$" },
                    { label: "x^2", val: "$x^2$" },
                    { label: "\\int", val: "$\\int f(x)\\,dx$" },
                    { label: "\\sum", val: "$\\sum_{i=1}^{n}$" },
                    { label: "\\Delta", val: "$\\Delta$" },
                    { label: "\\theta", val: "$\\theta$" },
                    { label: "\\pi", val: "$\\pi$" },
                    { label: "\\pm", val: "$\\pm$" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() =>
                        setEditingQuestion({
                          ...editingQuestion,
                          prompt: editingQuestion.prompt + " " + s.val,
                        })
                      }
                      className="px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Question Prompt (with $math$)</label>
                <textarea
                  rows={3}
                  value={editingQuestion.prompt}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, prompt: e.target.value })}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] p-3 text-xs text-white focus:border-indigo-500 outline-none"
                  required
                />
                <div className="p-2 rounded-lg bg-[#181A24] border border-white/[0.06] text-xs text-neutral-300">
                  <span className="text-[10px] font-mono text-neutral-500 block mb-1">Live Render:</span>
                  <MathRenderer content={editingQuestion.prompt} />
                </div>
              </div>

              {/* Options A-D */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Options (A, B, C, D)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {editingQuestion.options.map((opt, i) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-400 w-4">{opt.id}:</span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...editingQuestion.options];
                          updated[i] = { ...updated[i], text: e.target.value };
                          setEditingQuestion({ ...editingQuestion, options: updated });
                        }}
                        className="flex-1 rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Answer & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Correct Option Key</label>
                  <select
                    value={editingQuestion.correctOptionId}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        correctOptionId: e.target.value as any,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Difficulty Band</label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        difficulty: e.target.value as any,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="foundation">Foundation (Basic Recall)</option>
                    <option value="moderate">Moderate (Standard Entrance)</option>
                    <option value="advanced">Advanced (High-Order Synthesis)</option>
                  </select>
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Step-by-Step Derivation & Explanation</label>
                <textarea
                  rows={3}
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] p-3 text-xs text-white focus:border-indigo-500 outline-none"
                />
                <div className="p-2 rounded-lg bg-[#181A24] border border-white/[0.06] text-xs text-neutral-300">
                  <span className="text-[10px] font-mono text-neutral-500 block mb-1">Live Render:</span>
                  <MathRenderer content={editingQuestion.explanation} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all cursor-pointer"
                >
                  Save Question Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW SINGLE QUESTION */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#11131B] p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Single Entrance Question</h3>
                  <p className="text-xs text-neutral-400">Add an authenticated item directly to the question bank</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewQuestion} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400">Subject</label>
                  <select
                    value={newQuestionForm.subjectId}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, subjectId: e.target.value as any })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="physics">Physics</option>
                    <option value="math-nat">Mathematics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400">Grade</label>
                  <select
                    value={newQuestionForm.grade}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, grade: Number(e.target.value) as any })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value={12}>Grade 12</option>
                    <option value={11}>Grade 11</option>
                    <option value={10}>Grade 10</option>
                    <option value={9}>Grade 9</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400">Unit Number</label>
                  <input
                    type="number"
                    value={newQuestionForm.unitNumber}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, unitNumber: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400">Exam Year</label>
                  <input
                    type="text"
                    value={newQuestionForm.examYear}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, examYear: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* Prompt */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Prompt ($formula$ supported)</label>
                <textarea
                  rows={3}
                  required
                  value={newQuestionForm.prompt}
                  onChange={(e) => setNewQuestionForm({ ...newQuestionForm, prompt: e.target.value })}
                  placeholder="e.g. Which of the following represents the acceleration..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] p-3 text-xs text-white outline-none"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Options (A, B, C, D)</label>
                <div className="grid grid-cols-2 gap-2">
                  {["A", "B", "C", "D"].map((optId, i) => (
                    <div key={optId} className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-400 w-4">{optId}:</span>
                      <input
                        type="text"
                        required
                        value={newQuestionForm.options?.[i]?.text || ""}
                        onChange={(e) => {
                          const opts = [...(newQuestionForm.options || [])];
                          opts[i] = { id: optId as any, text: e.target.value };
                          setNewQuestionForm({ ...newQuestionForm, options: opts });
                        }}
                        className="flex-1 rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-1.5 text-xs text-white outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Option */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Correct Option</label>
                  <select
                    value={newQuestionForm.correctOptionId}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, correctOptionId: e.target.value as any })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Difficulty</label>
                  <select
                    value={newQuestionForm.difficulty}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, difficulty: e.target.value as any })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="foundation">Foundation</option>
                    <option value="moderate">Moderate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Step-by-Step Derivation</label>
                <textarea
                  rows={3}
                  required
                  value={newQuestionForm.explanation}
                  onChange={(e) => setNewQuestionForm({ ...newQuestionForm, explanation: e.target.value })}
                  placeholder="Detailed derivation with equations..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] p-3 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all cursor-pointer"
                >
                  Add Question to Bank
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
