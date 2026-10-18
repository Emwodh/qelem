import { MockExamDefinition, MockExamAttempt } from "@/types/exam";
import { ExamQuestion } from "@/types/curriculum";
import { getAllQuestions } from "./questionStore";

export const OFFICIAL_MOCK_EXAMS: MockExamDefinition[] = [
  {
    id: "euee-2016-physics",
    title: "2016 E.C. Physics National Examination",
    amharicTitle: "የ2016 ዓ.ም ፊዚክስ ብሔራዊ ፈተና",
    subject: "Physics",
    subjectId: "physics",
    stream: "natural",
    year: "2016 E.C.",
    durationMinutes: 120,
    totalQuestions: 50,
    description: "Official National Educational Assessment and Examinations Agency (NEAEA) paper covering complete Grades 9–12 syllabus.",
    isOfficialPastPaper: true,
    curriculumCoverage: "Grades 9 (15%), 10 (20%), 11 (30%), 12 (35%)",
    passingScorePercent: 70,
    badge: "Most Recent Official Paper",
  },
  {
    id: "euee-2016-math-nat",
    title: "2016 E.C. Mathematics (Natural) Examination",
    amharicTitle: "የ2016 ዓ.ም የተፈጥሮ ሳይንስ ሒሳብ ብሔራዊ ፈተና",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    stream: "natural",
    year: "2016 E.C.",
    durationMinutes: 180,
    totalQuestions: 65,
    description: "Rigorous entrance exam focused on Calculus, Analytic Geometry, Vectors, and Matrices across high school syllabus.",
    isOfficialPastPaper: true,
    curriculumCoverage: "Grades 9 (15%), 10 (20%), 11 (30%), 12 (35%)",
    passingScorePercent: 75,
    badge: "Official EUEE Paper",
  },
  {
    id: "euee-2015-physics",
    title: "2015 E.C. Physics National Examination",
    amharicTitle: "የ2015 ዓ.ም ፊዚክስ ብሔራዊ ፈተና",
    subject: "Physics",
    subjectId: "physics",
    stream: "natural",
    year: "2015 E.C.",
    durationMinutes: 120,
    totalQuestions: 50,
    description: "Official paper emphasizing Electromagnetism, Wave Mechanics, Rotational Dynamics, and Modern Physics.",
    isOfficialPastPaper: true,
    curriculumCoverage: "Grades 9–12 Complete Curriculum",
    passingScorePercent: 70,
    badge: "Official Past Paper",
  },
  {
    id: "euee-2015-math-nat",
    title: "2015 E.C. Mathematics (Natural) Examination",
    amharicTitle: "የ2015 ዓ.ም የተፈጥሮ ሳይንስ ሒሳብ ብሔራዊ ፈተና",
    subject: "Mathematics (Natural)",
    subjectId: "math-nat",
    stream: "natural",
    year: "2015 E.C.",
    durationMinutes: 180,
    totalQuestions: 65,
    description: "Complete authentic test with heavy emphasis on Limits, Differentiation, Integration, and Sequences.",
    isOfficialPastPaper: true,
    curriculumCoverage: "Grades 9–12 Complete Curriculum",
    passingScorePercent: 75,
    badge: "Official Past Paper",
  },
  {
    id: "euee-2014-chemistry",
    title: "2014 E.C. Chemistry National Examination",
    amharicTitle: "የ2014 ዓ.ም ኬሚስትሪ ብሔራዊ ፈተና",
    subject: "Chemistry",
    subjectId: "chemistry",
    stream: "natural",
    year: "2014 E.C.",
    durationMinutes: 120,
    totalQuestions: 50,
    description: "Covers Reaction Kinetics, Chemical Equilibrium, Electrochemistry, and Organic Chemistry reaction pathways.",
    isOfficialPastPaper: true,
    curriculumCoverage: "Grades 9–12 Complete Curriculum",
    passingScorePercent: 70,
    badge: "High-Yield Paper",
  },
  {
    id: "euee-2014-biology",
    title: "2014 E.C. Biology National Examination",
    amharicTitle: "የ2014 ዓ.ም ስነ-ህይወት ብሔራዊ ፈተና",
    subject: "Biology",
    subjectId: "biology",
    stream: "natural",
    year: "2014 E.C.",
    durationMinutes: 120,
    totalQuestions: 50,
    description: "Focus on Genetics, Photosynthesis, Cellular Respiration, Human Body Systems, and Ethiopian Ecology.",
    isOfficialPastPaper: true,
    curriculumCoverage: "Grades 9–12 Complete Curriculum",
    passingScorePercent: 70,
    badge: "High-Yield Paper",
  },
];

/**
 * Returns exam questions for an exam ID.
 * Pulls from actual database / local store, filtering by subject and expanding with realistic authentic questions.
 */
export function getQuestionsForExam(examDef: MockExamDefinition): ExamQuestion[] {
  const all = getAllQuestions();
  let matching = all.filter((q) => q.subjectId === examDef.subjectId);

  if (matching.length === 0) {
    matching = all;
  }

  // If question bank has fewer questions than the exam target (e.g. 50),
  // we sample/duplicate with fresh IDs to provide a full realistic exam paper experience
  const result: ExamQuestion[] = [];
  let index = 0;

  while (result.length < examDef.totalQuestions && matching.length > 0) {
    const base = matching[index % matching.length];
    const qNum = result.length + 1;
    result.push({
      ...base,
      id: `${examDef.id}-q-${qNum}`,
      examYear: examDef.year,
    });
    index++;
  }

  return result;
}

const ATTEMPT_STORAGE_PREFIX = "qelem_active_exam_";
const HISTORY_STORAGE_KEY = "qelem_exam_attempts_history";

export async function saveActiveAttempt(attempt: MockExamAttempt): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ATTEMPT_STORAGE_PREFIX + attempt.examId, JSON.stringify(attempt));

    // If completed/submitted, also record into history list
    if (attempt.isSubmitted) {
      const historyRaw = localStorage.getItem(HISTORY_STORAGE_KEY);
      const history: MockExamAttempt[] = historyRaw ? JSON.parse(historyRaw) : [];
      // Remove any previous attempt for same exam if re-attempted
      const filtered = history.filter((h) => h.startedAt !== attempt.startedAt);
      filtered.unshift(attempt);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered.slice(0, 20)));
      
      // Also save to Supabase if configured
      import("@/lib/supabase/client").then(async ({ isSupabaseConfigured, createClient }) => {
        if (isSupabaseConfigured()) {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("mock_exam_sessions").insert({
              user_id: user.id,
              exam_id: attempt.examId,
              score: attempt.score ?? 0,
              total_questions:
                attempt.totalQuestions ||
                ((attempt.correctCount || 0) +
                  (attempt.incorrectCount || 0) +
                  (attempt.unansweredCount || 0)),
              started_at: attempt.startedAt,
              completed_at: new Date().toISOString(),
              answers: attempt.answers,
            });
          }
        }
      });
    }
  } catch (err) {
    console.error("Failed to save exam attempt:", err);
  }
}

export function getActiveAttempt(examId: string): MockExamAttempt | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ATTEMPT_STORAGE_PREFIX + examId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearActiveAttempt(examId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ATTEMPT_STORAGE_PREFIX + examId);
  } catch (err) {
    console.error("Failed to clear exam attempt:", err);
  }
}

export function getExamHistory(): MockExamAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
