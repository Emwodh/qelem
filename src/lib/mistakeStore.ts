import { ExamQuestion } from "@/types/curriculum";
import { MistakeBankItem, MistakeBankStats, MistakeDrillResult } from "@/types/mistake";
import { getAllQuestions } from "./questionStore";
import { createClient, isSupabaseConfigured } from "./supabase/client";

const MISTAKE_STORAGE_KEY = "qelem_mistake_bank_v1";

/**
 * Loads all mistake items from localStorage
 */
export function getMistakeItems(): MistakeBankItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MISTAKE_STORAGE_KEY);
    if (!raw) return [];
    const parsed: MistakeBankItem[] = JSON.parse(raw);
    
    // Ensure questions are fully hydrated from question bank if stripped
    const allQuestions = getAllQuestions();
    const qMap = new Map<string, ExamQuestion>();
    allQuestions.forEach((q) => qMap.set(q.id, q));

    return parsed.map((item) => ({
      ...item,
      question: qMap.get(item.questionId) || item.question,
    }));
  } catch (err) {
    console.error("Failed to load mistake items from localStorage:", err);
    return [];
  }
}

/**
 * Saves all mistake items to localStorage
 */
export function saveMistakeItems(items: MistakeBankItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MISTAKE_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save mistake items to localStorage:", err);
  }
}

/**
 * Records a single incorrect question to the mistake bank
 */
export function recordMistake(question: ExamQuestion): MistakeBankItem {
  const items = getMistakeItems();
  const existingIdx = items.findIndex((i) => i.questionId === question.id);
  const now = new Date().toISOString();

  let updatedItem: MistakeBankItem;

  if (existingIdx >= 0) {
    const existing = items[existingIdx];
    updatedItem = {
      ...existing,
      failCount: existing.failCount + 1,
      consecutiveCorrect: 0, // Reset graduation streak
      isGraduated: false,
      lastAttemptedAt: now,
      question,
    };
    items[existingIdx] = updatedItem;
  } else {
    updatedItem = {
      id: `mistake-${question.id}-${Date.now()}`,
      questionId: question.id,
      subject: question.subject,
      subjectId: question.subjectId,
      grade: question.grade,
      unitNumber: question.unitNumber,
      unitTitle: question.unitTitle,
      failCount: 1,
      consecutiveCorrect: 0,
      isGraduated: false,
      lastAttemptedAt: now,
      createdAt: now,
      question,
    };
    items.unshift(updatedItem);
  }

  saveMistakeItems(items);
  syncMistakeToSupabase(updatedItem);
  return updatedItem;
}

/**
 * Synchronizes batch exam results with Mistake Bank:
 * - Incorrect questions get upserted/incremented
 * - Correct questions advance consecutiveCorrect (graduating if >= 2)
 */
export function recordMistakeBatch(
  incorrectQuestions: ExamQuestion[],
  correctQuestions: ExamQuestion[]
): { addedCount: number; graduatedCount: number } {
  const items = getMistakeItems();
  const itemMap = new Map<string, MistakeBankItem>();
  items.forEach((item) => itemMap.set(item.questionId, item));

  let addedCount = 0;
  let graduatedCount = 0;
  const now = new Date().toISOString();

  // 1. Process Incorrect Questions
  incorrectQuestions.forEach((q) => {
    const existing = itemMap.get(q.id);
    if (existing) {
      existing.failCount += 1;
      existing.consecutiveCorrect = 0;
      existing.isGraduated = false;
      existing.lastAttemptedAt = now;
      existing.question = q;
    } else {
      const newItem: MistakeBankItem = {
        id: `mistake-${q.id}-${Date.now()}`,
        questionId: q.id,
        subject: q.subject,
        subjectId: q.subjectId,
        grade: q.grade,
        unitNumber: q.unitNumber,
        unitTitle: q.unitTitle,
        failCount: 1,
        consecutiveCorrect: 0,
        isGraduated: false,
        lastAttemptedAt: now,
        createdAt: now,
        question: q,
      };
      itemMap.set(q.id, newItem);
      addedCount++;
    }
  });

  // 2. Process Correct Questions (advance Spaced Repetition streak for previously failed questions)
  correctQuestions.forEach((q) => {
    const existing = itemMap.get(q.id);
    if (existing && !existing.isGraduated) {
      existing.consecutiveCorrect += 1;
      existing.lastAttemptedAt = now;
      if (existing.consecutiveCorrect >= 2) {
        existing.isGraduated = true;
        graduatedCount++;
      }
    }
  });

  const updatedItems = Array.from(itemMap.values());
  saveMistakeItems(updatedItems);

  // Sync updated list to cloud asynchronously
  if (isSupabaseConfigured()) {
    updatedItems.forEach((item) => syncMistakeToSupabase(item));
  }

  return { addedCount, graduatedCount };
}

/**
 * Updates question after a practice drill attempt
 */
export function recordDrillAnswer(questionId: string, isCorrect: boolean): MistakeDrillResult {
  const items = getMistakeItems();
  const existingIdx = items.findIndex((i) => i.questionId === questionId);
  const now = new Date().toISOString();

  let consecutiveCorrect = 0;
  let graduatedNow = false;

  if (existingIdx >= 0) {
    const item = items[existingIdx];
    if (isCorrect) {
      item.consecutiveCorrect += 1;
      consecutiveCorrect = item.consecutiveCorrect;
      if (item.consecutiveCorrect >= 2) {
        item.isGraduated = true;
        graduatedNow = true;
      }
    } else {
      item.failCount += 1;
      item.consecutiveCorrect = 0;
      item.isGraduated = false;
      consecutiveCorrect = 0;
    }
    item.lastAttemptedAt = now;
    items[existingIdx] = item;
    saveMistakeItems(items);
    syncMistakeToSupabase(item);
  }

  return {
    questionId,
    isCorrect,
    consecutiveCorrect,
    graduatedNow,
  };
}

/**
 * Returns comprehensive statistics for Mistake Bank dashboard
 */
export function getMistakeStats(): MistakeBankStats {
  const items = getMistakeItems();
  
  let activeWeaknesses = 0;
  let oneStepAway = 0;
  let graduatedCount = 0;
  const bySubject: Record<string, { total: number; active: number; graduated: number }> = {};

  items.forEach((item) => {
    const sub = item.subjectId || "physics";
    if (!bySubject[sub]) {
      bySubject[sub] = { total: 0, active: 0, graduated: 0 };
    }

    bySubject[sub].total += 1;

    if (item.isGraduated) {
      graduatedCount += 1;
      bySubject[sub].graduated += 1;
    } else {
      activeWeaknesses += 1;
      bySubject[sub].active += 1;
      if (item.consecutiveCorrect === 1) {
        oneStepAway += 1;
      }
    }
  });

  return {
    totalLogged: items.length,
    activeWeaknesses,
    oneStepAway,
    graduatedCount,
    bySubject,
  };
}

/**
 * Returns questions for targeted Spaced Repetition drill
 */
export function getQuestionsForDrill(options?: {
  subjectId?: string;
  count?: number;
  status?: "active" | "all" | "graduated";
}): ExamQuestion[] {
  const items = getMistakeItems();
  const sub = options?.subjectId;
  const status = options?.status || "active";
  const limit = options?.count || 10;

  const filtered = items.filter((item) => {
    if (sub && sub !== "all" && item.subjectId !== sub) return false;
    if (status === "active" && item.isGraduated) return false;
    if (status === "graduated" && !item.isGraduated) return false;
    return true;
  });

  // Sort: questions with 1 consecutive correct first (high priority to graduate!), then by highest fail count
  filtered.sort((a, b) => {
    if (a.consecutiveCorrect === 1 && b.consecutiveCorrect !== 1) return -1;
    if (b.consecutiveCorrect === 1 && a.consecutiveCorrect !== 1) return 1;
    return b.failCount - a.failCount;
  });

  return filtered.slice(0, limit).map((i) => i.question);
}

/**
 * Background sync to Supabase public.mistake_bank
 */
async function syncMistakeToSupabase(item: MistakeBankItem): Promise<void> {
  if (!isSupabaseConfigured() || typeof window === "undefined") return;

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("mistake_bank").upsert(
      {
        user_id: user.id,
        question_id: item.questionId,
        subject: item.subject,
        subject_id: item.subjectId,
        grade: item.grade,
        fail_count: item.failCount,
        consecutive_correct: item.consecutiveCorrect,
        is_graduated: item.isGraduated,
        last_attempted_at: item.lastAttemptedAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,question_id" }
    );
  } catch (err) {
    // Non-blocking offline fallback
    console.warn("Could not sync mistake item to Supabase:", err);
  }
}
