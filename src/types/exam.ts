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
  questionResults?: Record<string, GradedQuestionDetail>;
}

export type SanitizedExamQuestion = Omit<
  ExamQuestion,
  "correctOptionId" | "explanation" | "derivationSteps" | "distractorAnalysis"
>;

export interface GradedQuestionDetail {
  questionId: string;
  selectedOptionId: "A" | "B" | "C" | "D" | null;
  correctOptionId: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  explanation: string;
  derivationSteps?: string[];
  keyFormula?: string;
  distractorAnalysis?: any[];
}

export interface ExamStartResponse {
  sessionId: string;
  examDef: MockExamDefinition;
  questions: SanitizedExamQuestion[];
  startedAt: string;
  durationMinutes: number;
}

