"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Code,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Database,
  Trash2,
  BookOpen,
  ArrowRight,
  Eye,
  FileUp,
  Loader2,
  Paperclip,
  Lock,
  ShieldCheck,
  KeyRound,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { ExamQuestion, GradeLevel } from "@/types/curriculum";
import {
  getAllQuestions,
  saveQuestionsBulk,
  parsePlainTextQuestions,
  parseCSVQuestions,
} from "@/lib/questionStore";
import { MathRenderer } from "@/components/ui/MathRenderer";

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
  const [activeTab, setActiveTab] = useState<"upload" | "text" | "json" | "csv">("upload");

  // Metadata Defaults
  const [subjectId, setSubjectId] = useState<"physics" | "math-nat" | "chemistry" | "biology">("physics");
  const [grade, setGrade] = useState<GradeLevel>(12);
  const [unitNumber, setUnitNumber] = useState<number>(2);
  const [unitTitle, setUnitTitle] = useState<string>("Electromagnetism & Induction");
  const [examYear, setExamYear] = useState<string>("2016 E.C.");
  const [difficulty, setDifficulty] = useState<"foundation" | "moderate" | "advanced">("moderate");

  // File Upload & Input States
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [rawText, setRawText] = useState(SAMPLE_TEXT_INPUT);
  const [rawJson, setRawJson] = useState("");
  const [rawCsv, setRawCsv] = useState("");

  // Parsed Questions for Preview
  const [parsedQuestions, setParsedQuestions] = useState<ExamQuestion[]>([]);
  const [totalDbCount, setTotalDbCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Admin Security Gate States
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [adminKeyError, setAdminKeyError] = useState("");
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [isCheckingSavedKey, setIsCheckingSavedKey] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("qelem_admin_key");
      if (saved) {
        setIsAdminUnlocked(true);
      }
    }
    setIsCheckingSavedKey(false);
  }, []);

  const handleUnlockAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKeyInput.trim()) {
      setAdminKeyError("Please enter the administrator security passkey.");
      return;
    }
    setIsValidatingKey(true);
    setAdminKeyError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminKeyInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        sessionStorage.setItem("qelem_admin_key", adminKeyInput.trim());
        setIsAdminUnlocked(true);
        setAdminKeyInput("");
      } else {
        setAdminKeyError(data.error || "Incorrect admin passkey. Access denied.");
      }
    } catch {
      setAdminKeyError("Connection error while validating credentials.");
    } finally {
      setIsValidatingKey(false);
    }
  };

  const handleLockSession = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("qelem_admin_key");
    }
    setIsAdminUnlocked(false);
  };

  // Sync unit title based on subject & grade
  useEffect(() => {
    if (subjectId === "physics") {
      if (grade === 12) setUnitTitle("Electromagnetism & Induction");
      else if (grade === 11) setUnitTitle("Two-Dimensional Kinematics & Vectors");
      else setUnitTitle("General Physics Foundations");
    } else if (subjectId === "math-nat") {
      if (grade === 12) setUnitTitle("Integration & Applications of Calculus");
      else if (grade === 11) setUnitTitle("Vectors and 3D Analytic Geometry");
      else setUnitTitle("Polynomials and Rational Functions");
    } else if (subjectId === "chemistry") {
      setUnitTitle("Chemical Equilibrium and Phase Changes");
    } else {
      setUnitTitle("Genetics and Molecular Biology");
    }
  }, [subjectId, grade]);

  // Load current bank total
  useEffect(() => {
    setTotalDbCount(getAllQuestions().length);
  }, []);

  // Parse questions live as input changes
  useEffect(() => {
    const subjectName =
      subjectId === "physics"
        ? "Physics"
        : subjectId === "math-nat"
        ? "Mathematics (Natural)"
        : subjectId === "chemistry"
        ? "Chemistry"
        : "Biology";

    try {
      if (activeTab === "text") {
        const parsed = parsePlainTextQuestions(rawText, {
          subject: subjectName,
          subjectId,
          grade,
          unitNumber,
          unitTitle,
          examYear,
          difficulty,
        });
        setParsedQuestions(parsed);
      } else if (activeTab === "json") {
        if (!rawJson.trim()) {
          setParsedQuestions([]);
          return;
        }
        const json = JSON.parse(rawJson);
        const list = Array.isArray(json) ? json : [json];
        setParsedQuestions(list);
      } else if (activeTab === "csv") {
        const parsed = parseCSVQuestions(rawCsv, {
          subject: subjectName,
          subjectId,
          grade,
          unitNumber,
          unitTitle,
          examYear,
        });
        setParsedQuestions(parsed);
      }
    } catch {
      // Ignore parsing errors while typing
    }
  }, [rawText, rawJson, rawCsv, activeTab, subjectId, grade, unitNumber, unitTitle, examYear, difficulty]);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsExtracting(true);
    setStatusMessage(null);

    const subjectName =
      subjectId === "physics"
        ? "Physics"
        : subjectId === "math-nat"
        ? "Mathematics (Natural)"
        : subjectId === "chemistry"
        ? "Chemistry"
        : "Biology";

    try {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".pdf")) {
        // Send to server-side PDF extraction API
        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", subjectName);
        formData.append("subjectId", subjectId);
        formData.append("grade", String(grade));
        formData.append("unitNumber", String(unitNumber));
        formData.append("unitTitle", unitTitle);
        formData.append("examYear", examYear);
        formData.append("difficulty", difficulty);

        const adminSecretKey =
          typeof window !== "undefined"
            ? sessionStorage.getItem("qelem_admin_key") || ""
            : "";

        const res = await fetch("/api/admin/parse-file", {
          method: "POST",
          headers: adminSecretKey ? { "x-admin-key": adminSecretKey } : undefined,
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to parse PDF");

        setRawText(data.rawText || "");
        setParsedQuestions(data.questions || []);
        setStatusMessage({
          type: "success",
          text: `Extracted ${data.questionsCount} questions from "${file.name}"! Review them in the live preview on the right and click Save All.`,
        });
      } else {
        // .md, .txt, .json, or .csv
        const text = await file.text();
        setRawText(text);

        if (fileName.endsWith(".json")) {
          const json = JSON.parse(text);
          const list = Array.isArray(json) ? json : [json];
          setParsedQuestions(list);
          setActiveTab("json");
        } else if (fileName.endsWith(".csv")) {
          const parsed = parseCSVQuestions(text, {
            subject: subjectName,
            subjectId,
            grade,
            unitNumber,
            unitTitle,
            examYear,
          });
          setParsedQuestions(parsed);
          setActiveTab("csv");
        } else {
          // Markdown (.md) or .txt
          const parsed = parsePlainTextQuestions(text, {
            subject: subjectName,
            subjectId,
            grade,
            unitNumber,
            unitTitle,
            examYear,
            difficulty,
          });
          setParsedQuestions(parsed);
        }

        setStatusMessage({
          type: "success",
          text: `Loaded "${file.name}" (${(file.size / 1024).toFixed(1)} KB) — detected questions ready in live preview!`,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error reading file";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveAll = async () => {
    if (parsedQuestions.length === 0) {
      setStatusMessage({ type: "error", text: "No valid questions detected to save." });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const savedCount = await saveQuestionsBulk(parsedQuestions);
      setTotalDbCount(getAllQuestions().length);
      setStatusMessage({
        type: "success",
        text: `Successfully saved ${savedCount} authentic questions to the Qelem Question Bank!`,
      });
      // Clear inputs
      if (activeTab === "text") setRawText("");
      if (activeTab === "json") setRawJson("");
      if (activeTab === "csv") setRawCsv("");
      setParsedQuestions([]);
    } catch {
      setStatusMessage({ type: "error", text: "Failed to persist questions. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isCheckingSavedKey) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="flex items-center gap-2.5 text-xs text-neutral-500 font-medium">
          <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
          <span>Verifying admin security session...</span>
        </div>
      </div>
    );
  }

  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-neutral-900/5 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-md">
              <Lock className="h-5 w-5" />
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                Admin Security
              </span>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Restricted Area
              </span>
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-neutral-950">
              Curriculum Ingestion Gate
            </h1>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed max-w-sm">
              Enter your master administrator passkey to access Ethiopian matric exam ingestion, OCR extraction, and bulk dataset management.
            </p>
          </div>

          <form onSubmit={handleUnlockAdmin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
                Master Security Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminKeyInput}
                  onChange={(e) => {
                    setAdminKeyInput(e.target.value);
                    if (adminKeyError) setAdminKeyError("");
                  }}
                  placeholder="Enter administrator passkey..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 pl-10 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white focus:outline-none transition-all"
                  autoFocus
                />
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            {adminKeyError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-700">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{adminKeyError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isValidatingKey}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 disabled:opacity-50"
            >
              {isValidatingKey ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                  <span>Validating Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Unlock Curriculum Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
            <Link
              href="/dashboard"
              className="text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
            >
              &larr; Return to Student Dashboard
            </Link>
            <span className="text-neutral-400">Qelem v2.4</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                Admin
              </span>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Curriculum Ingestion Portal
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Session Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mt-1">
              Multi-Format Question Ingestion
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Paste Ethiopian exam questions from Telegram or PDFs, preview KaTeX formulas live, and ingest to database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white border border-neutral-200/80 px-3.5 py-2 shadow-sm">
              <Database className="h-4 w-4 text-emerald-600" />
              <div className="text-xs">
                <span className="text-neutral-500">Bank Total: </span>
                <span className="font-bold text-neutral-950">{totalDbCount} Questions</span>
              </div>
            </div>

            <button
              onClick={handleLockSession}
              title="Lock Admin Session"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 hover:text-neutral-900"
            >
              <LogOut className="h-3.5 w-3.5 text-neutral-500" />
              <span>Lock Portal</span>
            </button>

            <Link
              href="/bank"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-neutral-950 px-4 text-xs font-medium text-white shadow-sm transition-all hover:bg-neutral-800"
            >
              <span>View Bank Explorer</span>
              <ArrowRight className="h-3.5 w-3.5 text-neutral-300" />
            </Link>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mt-6 flex items-center gap-2.5 rounded-2xl p-4 text-xs sm:text-sm font-medium border ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Metadata & Input Panel */}
          <div className="lg:col-span-6 space-y-6">
            {/* Metadata Selection Card */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-neutral-500" />
                Target Curriculum Metadata
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {/* Subject */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value as any)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                  >
                    <option value="physics">Physics</option>
                    <option value="math-nat">Mathematics (Natural)</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                  </select>
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                    Grade Level
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                  >
                    <option value={12}>Grade 12 (Matric Target)</option>
                    <option value={11}>Grade 11 (Advanced)</option>
                    <option value={10}>Grade 10 (Core)</option>
                    <option value={9}>Grade 9 (Foundation)</option>
                  </select>
                </div>

                {/* Unit Number & Title */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                    Unit Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(Number(e.target.value))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Exam Year */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                    Exam Year / Code
                  </label>
                  <select
                    value={examYear}
                    onChange={(e) => setExamYear(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                  >
                    <option value="2016 E.C.">2016 E.C. National Exam</option>
                    <option value="2015 E.C.">2015 E.C. National Exam</option>
                    <option value="2014 E.C.">2014 E.C. National Exam</option>
                    <option value="2013 E.C.">2013 E.C. National Exam</option>
                    <option value="Model Exam">National Model Exam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                  Unit Title
                </label>
                <input
                  type="text"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Input Formats Card */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm space-y-4">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 flex-wrap gap-2">
                <div className="inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200/60 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "upload"
                        ? "bg-white text-neutral-950 shadow-sm"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    <FileUp className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Upload File (.md / .pdf)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("text")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "text"
                        ? "bg-white text-neutral-950 shadow-sm"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Markdown / Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("json")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "json"
                        ? "bg-white text-neutral-950 shadow-sm"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    <Code className="h-3.5 w-3.5" />
                    <span>JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("csv")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "csv"
                        ? "bg-white text-neutral-950 shadow-sm"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRawText("");
                    setRawJson("");
                    setRawCsv("");
                    setUploadedFile(null);
                    setParsedQuestions([]);
                  }}
                  className="text-xs text-neutral-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Upload File (.md / .pdf) Tab */}
              {activeTab === "upload" && (
                <div className="space-y-4">
                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                      isDragOver
                        ? "border-indigo-600 bg-indigo-50/50"
                        : "border-neutral-300 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".md,.markdown,.pdf,.txt,.json,.csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />

                    {isExtracting ? (
                      <div className="flex flex-col items-center gap-3 py-4">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                        <div className="text-xs font-semibold text-neutral-800">
                          Extracting & parsing exam questions...
                        </div>
                        <p className="text-[11px] text-neutral-500 max-w-xs">
                          Processing document, recognizing math equations ($v=u+at$), and extracting options A–D.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 py-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-neutral-200/80 shadow-xs group-hover:scale-105 transition-transform">
                          <FileUp className="h-6 w-6 text-neutral-800" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-950">
                            Click to upload or drag & drop
                          </span>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Supports <strong className="text-neutral-700">.md</strong> (Markdown), <strong className="text-neutral-700">.pdf</strong> (Ethiopian exam papers), <strong className="text-neutral-700">.txt</strong>, or <strong className="text-neutral-700">.json</strong>
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-100">
                          Auto-detects formulas, options & answers
                        </span>
                      </div>
                    )}
                  </div>

                  {/* File status if uploaded */}
                  {uploadedFile && (
                    <div className="flex items-center justify-between rounded-xl bg-neutral-100/80 border border-neutral-200 px-3.5 py-2.5 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="h-4 w-4 text-neutral-500 shrink-0" />
                        <span className="font-semibold text-neutral-900 truncate">
                          {uploadedFile.name}
                        </span>
                        <span className="text-[11px] text-neutral-500 shrink-0">
                          ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("text")}
                        className="text-[11px] font-semibold text-indigo-600 hover:underline shrink-0"
                      >
                        Inspect Extracted Text &rarr;
                      </button>
                    </div>
                  )}

                  {/* Format Hint Guide */}
                  <div className="rounded-xl border border-neutral-200/60 bg-neutral-50/70 p-3.5 space-y-1.5 text-[11px] text-neutral-600">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Supported Exam Markdown Format:</span>
                    </div>
                    <pre className="font-mono text-[10px] text-neutral-700 bg-white p-2.5 rounded-lg border border-neutral-200/80 overflow-x-auto leading-relaxed">
{`1. A projectile is launched with $v_0 = 40\\,\\text{m/s}$ at $30^\\circ$...
A) 10 m
B) 20 m
C) 40 m
D) 80 m
Answer: B
Explanation: Using maximum height $$H_{\\max} = \\frac{v_{0y}^2}{2g} = 20\\,\\text{m}$$`}
                    </pre>
                  </div>
                </div>
              )}

              {/* Text Input Area */}
              {activeTab === "text" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Supports math equations like $F = ma$ or $$\\int x dx$$</span>
                    <button
                      type="button"
                      onClick={() => setRawText(SAMPLE_TEXT_INPUT)}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Load Sample Physics/Maths
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder={`1. Question prompt with $math$...
A) Option A
B) Option B
C) Option C
D) Option D
Answer: B
Explanation: Step by step derivation...`}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 font-mono text-xs text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                  />
                </div>
              )}

              {activeTab === "json" && (
                <div className="space-y-2">
                  <span className="text-[11px] text-neutral-500 block">
                    Paste an array of ExamQuestion objects matching the schema.
                  </span>
                  <textarea
                    rows={12}
                    value={rawJson}
                    onChange={(e) => setRawJson(e.target.value)}
                    placeholder='[
  {
    "id": "phy-sample-1",
    "prompt": "What is the speed of light in vacuum?",
    "options": [
      { "id": "A", "text": "3.0 x 10^8 m/s" },
      { "id": "B", "text": "1.5 x 10^8 m/s" }
    ],
    "correctOptionId": "A",
    "explanation": "Speed of light is constant $c = 3 \\times 10^8\\,\\text{m/s}$."
  }
]'
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 font-mono text-xs text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                  />
                </div>
              )}

              {activeTab === "csv" && (
                <div className="space-y-2">
                  <span className="text-[11px] text-neutral-500 block">
                    Format: Prompt, Option A, Option B, Option C, Option D, Correct (A-D), Explanation
                  </span>
                  <textarea
                    rows={12}
                    value={rawCsv}
                    onChange={(e) => setRawCsv(e.target.value)}
                    placeholder={`"What is the SI unit of electric current?","Ampere","Volt","Ohm","Watt","A","The SI unit is Ampere (A)."`}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 font-mono text-xs text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live KaTeX Preview & Commit Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-600" />
                  <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Live KaTeX Preview ({parsedQuestions.length} Detected)
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={parsedQuestions.length === 0 || isSaving}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-4 text-xs font-medium shadow-sm transition-all active:scale-[0.98] disabled:opacity-40"
                >
                  {isSaving ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-neutral-300" />
                      <span>Ingest to Question Bank ({parsedQuestions.length})</span>
                    </>
                  )}
                </button>
              </div>

              {parsedQuestions.length === 0 ? (
                <div className="py-16 text-center text-neutral-400">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                  <p className="text-xs">No questions parsed yet. Enter or paste text on the left.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                  {parsedQuestions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="rounded-xl border border-neutral-200/90 bg-[#FAFAFA] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 border-b border-neutral-200/60 pb-2">
                        <span className="font-bold text-neutral-900">
                          #{idx + 1} • {q.subject} (Gr. {q.grade})
                        </span>
                        <span className="rounded bg-neutral-200/70 px-2 py-0.5 font-medium text-neutral-700">
                          {q.examYear}
                        </span>
                      </div>

                      {/* Prompt */}
                      <div className="text-xs font-medium text-neutral-950 leading-relaxed">
                        <MathRenderer content={q.prompt} />
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt) => {
                          const isCorrect = opt.id === q.correctOptionId;
                          return (
                            <div
                              key={opt.id}
                              className={`flex items-start gap-2 rounded-lg p-2 text-xs border ${
                                isCorrect
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                                  : "bg-white border-neutral-200 text-neutral-700"
                              }`}
                            >
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                  isCorrect ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-600"
                                }`}
                              >
                                {opt.id}
                              </span>
                              <div className="flex-1">
                                <MathRenderer content={opt.text} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="rounded-lg bg-neutral-100/70 p-2.5 text-[11px] text-neutral-700 border border-neutral-200/60">
                        <span className="font-semibold text-neutral-900 block mb-0.5">
                          Derivation & Explanation:
                        </span>
                        <MathRenderer content={q.explanation} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
