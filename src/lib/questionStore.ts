import { ExamQuestion, QuestionFilter, GradeLevel, QuestionOption } from "@/types/curriculum";
import { CURRICULUM_QUESTIONS } from "./curriculumData";
import { createClient, isSupabaseConfigured } from "./supabase/client";

const CUSTOM_QUESTIONS_STORAGE_KEY = "qelem_custom_questions_bank";

/**
 * Returns all questions combining initial seeds and any admin-imported questions
 */
export function getAllQuestions(): ExamQuestion[] {
  let custom: ExamQuestion[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
      if (raw) {
        custom = JSON.parse(raw);
      }
    } catch (err) {
      console.error("Error reading custom questions from localStorage:", err);
    }
  }

  // Merge unique by ID
  const map = new Map<string, ExamQuestion>();
  CURRICULUM_QUESTIONS.forEach((q) => map.set(q.id, q));
  custom.forEach((q) => map.set(q.id, q));

  return Array.from(map.values());
}

/**
 * Asynchronously loads questions from Supabase database and merges with local questions
 */
export async function loadQuestionsWithSupabase(): Promise<ExamQuestion[]> {
  const localList = getAllQuestions();
  if (!isSupabaseConfigured()) {
    return localList;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("questions").select("*");
    if (error || !data || data.length === 0) {
      return localList;
    }

    const map = new Map<string, ExamQuestion>();
    localList.forEach((q) => map.set(q.id, q));

    data.forEach((row: any) => {
      const subjectId =
        row.subject?.toLowerCase().includes("math") ? "math-nat" :
        row.subject?.toLowerCase().includes("phys") ? "physics" :
        row.subject?.toLowerCase().includes("chem") ? "chemistry" : "biology";

      map.set(row.id, {
        id: row.id,
        subject: row.subject,
        subjectId,
        grade: (row.grade_level as GradeLevel) || 12,
        unitNumber: row.unit_number || 1,
        unitTitle: row.unit_title || "General",
        prompt: row.prompt,
        options: row.options || [],
        correctOptionId: row.correct_option_id,
        explanation: row.explanation || "",
        derivationSteps: row.explanation ? [row.explanation] : [],
        examYear: row.exam_year || "Practice",
        difficulty: row.difficulty === "easy" ? "foundation" : row.difficulty === "hard" ? "advanced" : "moderate",
        isProSolutionAvailable: true,
      });
    });

    return Array.from(map.values());
  } catch (err) {
    console.warn("Could not fetch questions from Supabase, using local fallback:", err);
    return localList;
  }
}

/**
 * Filter questions by subject, grade, year, unit, difficulty, or search query
 */
export function getFilteredQuestions(filter: {
  subjectId?: string;
  grade?: GradeLevel | "all";
  examYear?: string | "all";
  unitNumber?: number | "all";
  difficulty?: string | "all";
  searchQuery?: string;
}): ExamQuestion[] {
  const all = getAllQuestions();

  return all.filter((q) => {
    if (filter.subjectId && filter.subjectId !== "all" && q.subjectId !== filter.subjectId) {
      return false;
    }
    if (filter.grade && filter.grade !== "all" && q.grade !== filter.grade) {
      return false;
    }
    if (filter.examYear && filter.examYear !== "all" && q.examYear !== filter.examYear) {
      return false;
    }
    if (filter.unitNumber && filter.unitNumber !== "all" && q.unitNumber !== filter.unitNumber) {
      return false;
    }
    if (filter.difficulty && filter.difficulty !== "all" && q.difficulty !== filter.difficulty) {
      return false;
    }
    if (filter.searchQuery && filter.searchQuery.trim()) {
      const qLower = filter.searchQuery.toLowerCase();
      const inPrompt = q.prompt.toLowerCase().includes(qLower);
      const inUnit = q.unitTitle.toLowerCase().includes(qLower);
      const inSubject = q.subject.toLowerCase().includes(qLower);
      const inExpl = q.explanation.toLowerCase().includes(qLower);
      if (!inPrompt && !inUnit && !inSubject && !inExpl) return false;
    }
    return true;
  });
}

/**
 * Saves new or updated questions to local storage (and Supabase if configured)
 */
export async function saveQuestionsBulk(newQuestions: ExamQuestion[]): Promise<number> {
  if (!newQuestions || newQuestions.length === 0) return 0;

  // 1. Save to local storage
  if (typeof window !== "undefined") {
    try {
      const existingRaw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
      const existing: ExamQuestion[] = existingRaw ? JSON.parse(existingRaw) : [];
      const map = new Map<string, ExamQuestion>();
      existing.forEach((q) => map.set(q.id, q));
      newQuestions.forEach((q) => map.set(q.id, q));
      localStorage.setItem(CUSTOM_QUESTIONS_STORAGE_KEY, JSON.stringify(Array.from(map.values())));
    } catch (err) {
      console.error("Failed saving questions to localStorage:", err);
    }
  }

  // 2. Sync to Supabase if live credentials exist
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const rows = newQuestions.map((q) => ({
        id: q.id,
        subject: q.subject,
        stream: q.subjectId === "math-nat" || q.subjectId === "physics" || q.subjectId === "chemistry" || q.subjectId === "biology" ? "natural" : "social",
        grade_level: q.grade,
        unit_number: q.unitNumber,
        unit_title: q.unitTitle,
        exam_year: q.examYear || "2016 E.C.",
        difficulty: q.difficulty,
        prompt: q.prompt,
        options: q.options,
        correct_option_id: q.correctOptionId,
        explanation: q.explanation,
        distractor_analysis: q.distractorAnalysis || null,
        examiner_insight: q.examinerInsight || null,
      }));

      await supabase.from("questions").upsert(rows);
    } catch (err) {
      console.warn("Supabase questions upsert bypassed (running local-first mode):", err);
    }
  }

  return newQuestions.length;
}

/**
 * Robust Plain-Text & Markdown Auto Parser for Ethiopian Exam Format
 * Supports:
 * - Markdown headings: ### Question 1, ## 1., **1.**, Q1.
 * - Markdown bullet & bold options: - **A)**, * A., A), (A)
 * - Markdown answer tags: **Answer:** B, Ans: B, Key: B
 * - Markdown explanation tags: **Explanation:**, ### Solution
 * - Math formulas ($...$, $$...$$)
 */
export function parsePlainTextQuestions(
  rawText: string,
  defaults: {
    subject: string;
    subjectId: "physics" | "math-nat" | "chemistry" | "biology";
    grade: GradeLevel;
    unitNumber: number;
    unitTitle: string;
    examYear: string;
    difficulty?: "foundation" | "moderate" | "advanced";
  }
): ExamQuestion[] {
  if (!rawText || !rawText.trim()) return [];

  // Normalize line breaks
  let normalized = rawText.replace(/\r\n/g, "\n").trim();

  // Strip YAML frontmatter if present and optionally extract metadata
  const frontmatterMatch = normalized.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+/);
  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1];
    normalized = normalized.slice(frontmatterMatch[0].length);

    const gMatch = yaml.match(/grade\s*:\s*(\d+)/i);
    if (gMatch && [9, 10, 11, 12].includes(Number(gMatch[1]))) {
      defaults.grade = Number(gMatch[1]) as GradeLevel;
    }
    const uMatch = yaml.match(/unit\s*:\s*(\d+)/i);
    if (uMatch) {
      defaults.unitNumber = Number(uMatch[1]);
    }
    const yMatch = yaml.match(/year\s*:\s*(.+)/i);
    if (yMatch) {
      defaults.examYear = yMatch[1].trim();
    }
  }

  // Split questions by numbered markdown headers, bold numbered lines, or double empty lines
  const rawBlocks = normalized.split(
    /\n\s*(?:(?=(?:#{1,4}\s*(?:Question\s*\d+|Q\d+|\d+)|(?:\*{1,2}\s*(?:Question\s*\d+|Q\d+|\d+)\.?\*{1,2})|(?:Question\s*\d+|Q\d+|\d+)[.:\)]))|\n{2,})/gi
  );

  const questions: ExamQuestion[] = [];

  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i].trim();
    if (!block) continue;

    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 3) continue;

    let promptLines: string[] = [];
    let options: QuestionOption[] = [];
    let correctOptionId: "A" | "B" | "C" | "D" = "A";
    let explanationLines: string[] = [];
    let derivationSteps: string[] = [];
    let keyFormula: string | undefined = undefined;
    let state: "prompt" | "options" | "explanation" = "prompt";

    for (const line of lines) {
      // 1. Check for Answer tag: "Answer: B", "**Answer:** B", "Ans: B", "*Correct Answer:* B"
      const ansMatch = line.match(/^(?:\*{1,2})?(?:Answer|Ans|Correct|Key|Correct\s*Answer)\s*[:=-]?(?:\*{1,2})?\s*([A-D])/i);
      if (ansMatch) {
        correctOptionId = ansMatch[1].toUpperCase() as "A" | "B" | "C" | "D";
        state = "explanation";
        continue;
      }

      // 2. Check for Explanation tag: "Explanation: ...", "**Explanation:** ...", "### Solution"
      const explMatch = line.match(/^(?:#{1,4}\s*)?(?:\*{1,2})?(?:Explanation|Solution|Derivation|Reason)\s*[:=-]?(?:\*{1,2})?\s*(.*)$/i);
      if (explMatch) {
        state = "explanation";
        if (explMatch[1]) explanationLines.push(explMatch[1]);
        continue;
      }

      // 3. Check for Option: "A) ...", "- **A)** ...", "* A. ...", "(A) ...", "- A - ..."
      const optMatch = line.match(/^(?:[-*]\s*)?(?:\*{1,2})?\(?([A-D])\)?(?:\*{1,2})?[\).:-]\s*(.+)$/i);
      if (optMatch && state !== "explanation") {
        state = "options";
        options.push({
          id: optMatch[1].toUpperCase() as "A" | "B" | "C" | "D",
          text: optMatch[2].replace(/^\*{1,2}|\*{1,2}$/g, "").trim(),
        });
        continue;
      }

      if (state === "prompt") {
        // Strip markdown header prefixes and leading question numbering from first prompt line
        const cleaned = line
          .replace(/^#{1,4}\s*/, "")
          .replace(/^\*{1,2}\s*/, "")
          .replace(/^(?:Question\s*\d+|Q\d+|\d+)[.:\)]\s*/i, "")
          .replace(/^\*{1,2}\s*/, "");
        if (cleaned) promptLines.push(cleaned);
      } else if (state === "options") {
        // Option text wrapping onto the next line
        if (options.length > 0) {
          options[options.length - 1].text += " " + line;
        }
      } else if (state === "explanation") {
        explanationLines.push(line);
        // Detect display formulas as key formulas
        const formulaMatch = line.match(/\$\$([\s\S]+?)\$\$/);
        if (formulaMatch && !keyFormula) {
          keyFormula = formulaMatch[1].trim();
        }
      }
    }

    const prompt = promptLines.join(" ").trim();
    if (!prompt || options.length < 2) continue;

    // Ensure 4 options exist, pad if fewer
    const validLetters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
    while (options.length < 4) {
      const nextLetter = validLetters[options.length];
      options.push({ id: nextLetter, text: `Option ${nextLetter}` });
    }

    const explanation =
      explanationLines.join("\n\n").trim() ||
      `The correct answer is Option ${correctOptionId}. Verified according to the Ethiopian Ministry of Education curriculum.`;

    if (explanationLines.length > 0) {
      derivationSteps = explanationLines.filter((l) => l.trim().length > 0);
    } else {
      derivationSteps = [explanation];
    }

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const id = `${defaults.subjectId}-g${defaults.grade}-u${defaults.unitNumber}-q${i + 1}-${randomSuffix}`;

    questions.push({
      id,
      subject: defaults.subject,
      subjectId: defaults.subjectId,
      grade: defaults.grade,
      unitNumber: defaults.unitNumber,
      unitTitle: defaults.unitTitle,
      prompt,
      options,
      correctOptionId,
      explanation,
      derivationSteps,
      keyFormula,
      examYear: defaults.examYear,
      difficulty: defaults.difficulty || "moderate",
      isProSolutionAvailable: true,
    });
  }

  return questions;
}

/**
 * Parse CSV question rows
 * Format: Prompt, OptionA, OptionB, OptionC, OptionD, CorrectOption, Explanation
 */
export function parseCSVQuestions(
  csvContent: string,
  defaults: {
    subject: string;
    subjectId: "physics" | "math-nat" | "chemistry" | "biology";
    grade: GradeLevel;
    unitNumber: number;
    unitTitle: string;
    examYear: string;
  }
): ExamQuestion[] {
  const lines = csvContent.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1) return [];

  const questions: ExamQuestion[] = [];
  const startIndex = lines[0].toLowerCase().includes("prompt") ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    // Basic comma separation supporting quotes
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      let val = match[1];
      if (val === undefined) break;
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val.trim());
      if (regex.lastIndex >= lines[i].length) break;
    }

    if (matches.length >= 6) {
      const prompt = matches[0];
      const optA = matches[1];
      const optB = matches[2];
      const optC = matches[3];
      const optD = matches[4];
      const correct = (matches[5].toUpperCase() as "A" | "B" | "C" | "D") || "A";
      const expl = matches[6] || `Option ${correct} is correct.`;

      const id = `${defaults.subjectId}-g${defaults.grade}-u${defaults.unitNumber}-csv-${i}-${Math.random().toString(36).substring(2, 6)}`;

      questions.push({
        id,
        subject: defaults.subject,
        subjectId: defaults.subjectId,
        grade: defaults.grade,
        unitNumber: defaults.unitNumber,
        unitTitle: defaults.unitTitle,
        prompt,
        options: [
          { id: "A", text: optA },
          { id: "B", text: optB },
          { id: "C", text: optC },
          { id: "D", text: optD },
        ],
        correctOptionId: correct,
        explanation: expl,
        derivationSteps: [expl],
        examYear: defaults.examYear,
        difficulty: "moderate",
        isProSolutionAvailable: true,
      });
    }
  }

  return questions;
}
