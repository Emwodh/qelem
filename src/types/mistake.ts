import { ExamQuestion, GradeLevel } from "./curriculum";

export interface MistakeBankItem {
  id: string;
  userId?: string;
  questionId: string;
  subject: string;
  subjectId: "physics" | "math-nat" | "chemistry" | "biology";
  grade: GradeLevel;
  unitNumber?: number;
  unitTitle?: string;
  failCount: number;
  consecutiveCorrect: number; // 2 consecutive correct answers on separate sessions triggers graduation
  isGraduated: boolean;
  lastAttemptedAt: string;
  createdAt: string;
  notes?: string;
  question: ExamQuestion;
}

export interface MistakeBankStats {
  totalLogged: number;
  activeWeaknesses: number;
  oneStepAway: number; // consecutiveCorrect === 1
  graduatedCount: number;
  bySubject: Record<string, { total: number; active: number; graduated: number }>;
}

export interface MistakeDrillResult {
  questionId: string;
  isCorrect: boolean;
  consecutiveCorrect: number;
  graduatedNow: boolean;
}
