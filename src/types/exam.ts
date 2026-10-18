import { ExamQuestion, GradeLevel } from "./curriculum";
import { ExamStream } from "./user";

export interface MockExamDefinition {
  id: string;
  title: string;
  amharicTitle?: string;
  subject: string;
  subjectId: "physics" | "math-nat" | "chemistry" | "biology";
  stream: ExamStream;
  year: string;
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  isOfficialPastPaper: boolean;
  curriculumCoverage: string;
  passingScorePercent: number;
  badge: string;
}

export interface MockExamAttempt {
  examId: string;
  examTitle: string;
  subject: string;
  subjectId: string;
  startedAt: string;
  remainingSeconds: number;
  answers: Record<string, "A" | "B" | "C" | "D">;
  flagged: Record<string, boolean>;
  isSubmitted: boolean;
  completedAt?: string;
  score?: number;
  scorePercentage?: number;
  correctCount?: number;
  incorrectCount?: number;
  unansweredCount?: number;
  totalQuestions?: number;
  gradeBreakdown?: Record<number, { total: number; correct: number; percent: number }>;
}
