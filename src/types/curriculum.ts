export type GradeLevel = 9 | 10 | 11 | 12;

export interface QuestionOption {
  id: "A" | "B" | "C" | "D";
  text: string;
}

export interface DistractorTrap {
  optionId: "A" | "B" | "C" | "D";
  trapExplanation: string;
  commonErrorType: string;
}

export interface ExamQuestion {
  id: string;
  subject: string;
  subjectId: "physics" | "math-nat" | "chemistry" | "biology";
  grade: GradeLevel;
  unitNumber: number;
  unitTitle: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: "A" | "B" | "C" | "D";
  explanation: string;
  derivationSteps: string[];
  keyFormula?: string;
  examYear?: string;
  difficulty: "foundation" | "moderate" | "advanced";
  distractorAnalysis?: DistractorTrap[];
  examinerInsight?: string;
  isProSolutionAvailable?: boolean;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionId: "A" | "B" | "C" | "D" | null;
  isSubmitted: boolean;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface PracticeSessionSummary {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  scorePercentage: number;
  totalTimeSeconds: number;
  averageTimePerQuestion: number;
  predictedTier: string;
}

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  unitTitle: string;
  subject: string;
  subjectId: "physics" | "math-nat" | "chemistry" | "biology";
  grade: GradeLevel;
  totalQuestions: number;
  solvedQuestions: number;
  description: string;
  keyTopics: string[];
}

export interface QuestionFilter {
  subjectId: "all" | "physics" | "math-nat" | "chemistry" | "biology";
  grade: GradeLevel | "all";
  examYear: string | "all";
  searchQuery: string;
  difficulty: "all" | "foundation" | "moderate" | "advanced";
}

export interface FormulaVariable {
  symbol: string;
  meaning: string;
  unit?: string;
}

export interface FormulaItem {
  id: string;
  name: string;
  latex: string;
  description: string;
  variables: FormulaVariable[];
  highYieldTip?: string;
}

export interface CoreLawItem {
  id: string;
  title: string;
  statement: string;
  latexFormula?: string;
  keyApplication: string;
}

export interface CommonTrapItem {
  id: string;
  trap: string;
  correction: string;
  exampleFormula?: string;
}

export interface UnitCheatSheet {
  id: string;
  unitId: string;
  unitNumber: number;
  unitTitle: string;
  subject: string;
  subjectId: "physics" | "math-nat" | "chemistry" | "biology";
  grade: GradeLevel;
  estimatedReadTime: string;
  summary: string;
  isProOnly?: boolean;
  essentialFormulas: FormulaItem[];
  coreLaws: CoreLawItem[];
  commonTraps: CommonTrapItem[];
}
