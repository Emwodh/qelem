import { UserProfile, SubjectMastery, ExamStream, ExamCountdown } from "@/types/user";

const STORAGE_KEY = "qelem_user_profile";

export const TARGET_UNIVERSITIES = [
  "Addis Ababa University (AAU) — Technology (Faculty of Tech)",
  "Addis Ababa University (AAU) — School of Medicine (Tikur Anbessa)",
  "Adama Science & Technology University (ASTU) — Engineering",
  "Addis Ababa Science & Technology University (AASTU) — Engineering",
  "Hawassa University — Medicine & Health Sciences",
  "Jimma University — Institute of Technology (JiT)",
  "Bahir Dar University — Faculty of Computing & Engineering",
  "Mekelle University — College of Health Sciences",
  "Haramaya University — Agriculture & Veterinary Sciences",
] as const;

export const DEFAULT_PROFILE: UserProfile = {
  name: "Student",
  email: "",
  stream: "natural",
  grade: 12,
  targetScore: 585,
  targetUniversity: "Addis Ababa University (AAU) — Technology (Faculty of Tech)",
  latestDiagnosticScore: 0,
  diagnosticTotalQuestions: 0,
  diagnosticCorrectCount: 0,
  diagnosticCompletedAt: undefined,
  weakestTopic: "Not evaluated yet",
  predictedTier: "Pending diagnostic",
};

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(updates: Partial<UserProfile>): UserProfile {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PROFILE, ...updates };
  }

  try {
    const current = getUserProfile();
    const merged: UserProfile = {
      ...current,
      ...updates,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.error("Failed to save user profile to localStorage:", err);
    return { ...DEFAULT_PROFILE, ...updates };
  }
}

export function isUserLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  const profile = getUserProfile();
  return Boolean(profile.isAuthenticated);
}

export function registerCandidate(params: {
  name: string;
  email: string;
  stream: ExamStream;
  grade: 9 | 10 | 11 | 12;
  targetScore?: number;
  targetUniversity?: string;
}): UserProfile {
  return saveUserProfile({
    name: params.name,
    email: params.email,
    stream: params.stream,
    grade: params.grade,
    targetScore: params.targetScore || (params.stream === "natural" ? 585 : 550),
    targetUniversity:
      params.targetUniversity ||
      (params.stream === "natural"
        ? "Addis Ababa University (AAU) — Technology (Faculty of Tech)"
        : "Addis Ababa University (AAU) — College of Business and Economics"),
    isAuthenticated: true,
  });
}

export function loginCandidate(email: string, name?: string): UserProfile {
  return saveUserProfile({
    email,
    name: name || email.split("@")[0] || "Candidate",
    isAuthenticated: true,
  });
}

export function logoutCandidate(): void {
  saveUserProfile({
    isAuthenticated: false,
  });
}

export function isUserPro(): boolean {
  if (typeof window === "undefined") return false;
  const profile = getUserProfile();
  return Boolean(profile.isPro || profile.plan === "MATRIC_SEASON_PASS" || profile.plan === "LIFETIME_PASS");
}

export function activateUserPro(plan: "MATRIC_SEASON_PASS" | "LIFETIME_PASS" = "MATRIC_SEASON_PASS"): UserProfile {
  return saveUserProfile({
    isPro: true,
    plan,
    pendingPayment: undefined,
  });
}

export function setUserPendingPayment(payment: {
  txRef: string;
  bankTxRef: string;
  method: "telebirr" | "cbe";
  amountETB: number;
  submittedAt: string;
  status: "MANUAL_REVIEW" | "COMPLETED" | "REJECTED";
}): UserProfile {
  return saveUserProfile({
    pendingPayment: payment,
  });
}

export function clearUserPendingPayment(): UserProfile {
  return saveUserProfile({
    pendingPayment: undefined,
  });
}

export function getExamCountdown(): ExamCountdown {
  // Ethiopian Matric Exam typically takes place in Sene (mid-June)
  // Calibrated countdown to upcoming national matric exam (approx. 142 days during active prep cycle)
  return {
    daysRemaining: 142,
    examYearEC: "2017 E.C.",
    examMonth: "Sene (ሰኔ)",
  };
}

export const SUBJECT_MASTERY_DATA: Record<ExamStream, SubjectMastery[]> = {
  natural: [
    {
      id: "math-nat",
      title: "Mathematics (Natural)",
      amharicTitle: "ሒሳብ",
      stream: "natural",
      gradeCoveragePercent: 78,
      unitsCompleted: 22,
      totalUnits: 28,
      totalQuestions: 2850,
      accentColor: "#2563EB",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200/80",
      currentUnit: "Unit 23: Vectors & 3D Geometry",
      lastPracticed: "Today",
    },
    {
      id: "physics",
      title: "Physics",
      amharicTitle: "ፊዚክስ",
      stream: "natural",
      gradeCoveragePercent: 85,
      unitsCompleted: 22,
      totalUnits: 26,
      totalQuestions: 2420,
      accentColor: "#4F46E5",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      currentUnit: "Unit 20: Electromagnetism & Induction",
      lastPracticed: "Yesterday",
    },
    {
      id: "chemistry",
      title: "Chemistry",
      amharicTitle: "ኬሚስትሪ",
      stream: "natural",
      gradeCoveragePercent: 71,
      unitsCompleted: 17,
      totalUnits: 24,
      totalQuestions: 2150,
      accentColor: "#D97706",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200/80",
      currentUnit: "Unit 18: Electrochemistry & Cells",
      lastPracticed: "3 days ago",
    },
    {
      id: "biology",
      title: "Biology",
      amharicTitle: "ሥነ-ህይወት",
      stream: "natural",
      gradeCoveragePercent: 64,
      unitsCompleted: 15,
      totalUnits: 24,
      totalQuestions: 2300,
      accentColor: "#059669",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      currentUnit: "Unit 16: Genetics & Molecular Inheritance",
      lastPracticed: "4 days ago",
    },
    {
      id: "english",
      title: "English",
      amharicTitle: "እንግሊዝኛ",
      stream: "both",
      gradeCoveragePercent: 91,
      unitsCompleted: 20,
      totalUnits: 22,
      totalQuestions: 3200,
      accentColor: "#7C3AED",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200/80",
      currentUnit: "Unit 21: Discourse Markers & Punctuation",
      lastPracticed: "5 days ago",
    },
    {
      id: "aptitude",
      title: "Scholastic Aptitude (SAT)",
      amharicTitle: "አጠቃላይ ብቃት",
      stream: "both",
      gradeCoveragePercent: 82,
      unitsCompleted: 13,
      totalUnits: 16,
      totalQuestions: 1850,
      accentColor: "#DB2777",
      badgeBg: "bg-pink-50 text-pink-700 border-pink-200/80",
      currentUnit: "Unit 14: Spatial & Logical Reasoning",
      lastPracticed: "1 week ago",
    },
  ],
  social: [
    {
      id: "math-soc",
      title: "Mathematics (Social)",
      amharicTitle: "ሒሳብ (ማህበራዊ)",
      stream: "social",
      gradeCoveragePercent: 75,
      unitsCompleted: 18,
      totalUnits: 24,
      totalQuestions: 2100,
      accentColor: "#2563EB",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200/80",
      currentUnit: "Unit 19: Business Mathematics & Matrices",
      lastPracticed: "Today",
    },
    {
      id: "history",
      title: "History",
      amharicTitle: "ታሪክ",
      stream: "social",
      gradeCoveragePercent: 81,
      unitsCompleted: 21,
      totalUnits: 26,
      totalQuestions: 2600,
      accentColor: "#B45309",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200/80",
      currentUnit: "Unit 22: Modern Ethiopian State Formation",
      lastPracticed: "Yesterday",
    },
    {
      id: "geography",
      title: "Geography",
      amharicTitle: "ጂኦግራፊ",
      stream: "social",
      gradeCoveragePercent: 68,
      unitsCompleted: 16,
      totalUnits: 24,
      totalQuestions: 2200,
      accentColor: "#047857",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      currentUnit: "Unit 17: Physical Geography of Horn of Africa",
      lastPracticed: "2 days ago",
    },
    {
      id: "economics",
      title: "Economics",
      amharicTitle: "ኢኮኖሚክስ",
      stream: "social",
      gradeCoveragePercent: 86,
      unitsCompleted: 19,
      totalUnits: 22,
      totalQuestions: 2450,
      accentColor: "#4338CA",
      badgeBg: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
      currentUnit: "Unit 18: National Income & Fiscal Policy",
      lastPracticed: "4 days ago",
    },
    {
      id: "english",
      title: "English",
      amharicTitle: "እንግሊዝኛ",
      stream: "both",
      gradeCoveragePercent: 91,
      unitsCompleted: 20,
      totalUnits: 22,
      totalQuestions: 3200,
      accentColor: "#7C3AED",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200/80",
      currentUnit: "Unit 21: Discourse Markers & Punctuation",
      lastPracticed: "5 days ago",
    },
    {
      id: "aptitude",
      title: "Scholastic Aptitude (SAT)",
      amharicTitle: "አጠቃላይ ብቃት",
      stream: "both",
      gradeCoveragePercent: 82,
      unitsCompleted: 13,
      totalUnits: 16,
      totalQuestions: 1850,
      accentColor: "#DB2777",
      badgeBg: "bg-pink-50 text-pink-700 border-pink-200/80",
      currentUnit: "Unit 14: Spatial & Logical Reasoning",
      lastPracticed: "1 week ago",
    },
  ],
};

export function getSubjectMastery(stream: ExamStream): SubjectMastery[] {
  return SUBJECT_MASTERY_DATA[stream] || SUBJECT_MASTERY_DATA.natural;
}
