export type ExamStream = "natural" | "social";

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  stream: ExamStream;
  grade: 9 | 10 | 11 | 12;
  targetScore: number;
  targetUniversity: string;
  latestDiagnosticScore: number;
  diagnosticTotalQuestions: number;
  diagnosticCorrectCount: number;
  diagnosticCompletedAt?: string;
  weakestTopic: string;
  predictedTier: string;
  isAuthenticated?: boolean;
}

export interface SubjectMastery {
  id: string;
  title: string;
  amharicTitle?: string;
  stream: ExamStream | "both";
  gradeCoveragePercent: number;
  unitsCompleted: number;
  totalUnits: number;
  totalQuestions: number;
  accentColor: string; // tailwind color class or hex
  badgeBg: string;
  currentUnit: string;
  lastPracticed?: string;
}

export interface ExamCountdown {
  daysRemaining: number;
  examYearEC: string;
  examMonth: string;
}

/**
 * Database schema representation for public.profiles
 */
export interface DbProfile {
  id: string;
  full_name: string;
  email?: string | null;
  stream: ExamStream;
  grade: number;
  target_score: number;
  target_university: string;
  created_at: string;
  updated_at: string;
}

/**
 * Database schema representation for public.practice_sessions
 */
export interface DbPracticeSession {
  id: string;
  user_id: string;
  stream: ExamStream;
  score_percentage: number;
  total_questions: number;
  correct_count: number;
  time_spent_seconds: number;
  weakest_topic?: string | null;
  predicted_tier?: string | null;
  completed_at: string;
}
