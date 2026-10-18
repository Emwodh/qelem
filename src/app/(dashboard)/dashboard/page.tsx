import { createClient } from "@/lib/supabase/server";
import { UserProfile, DbProfile, DbPracticeSession } from "@/types/user";
import { DEFAULT_PROFILE } from "@/lib/userStore";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let dbProfile: DbProfile | null = null;
  let latestSession: DbPracticeSession | null = null;
  let isAuthenticated = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      isAuthenticated = true;

      const { data: pData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      dbProfile = pData;

      const { data: sData } = await supabase
        .from("practice_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      latestSession = sData;
    }
  } catch (err) {
    // Graceful fallback if Supabase credentials are placeholder or offline
    console.warn("Supabase dashboard server query fallback:", err);
  }

  let initialProfile: UserProfile | null = null;

  if (dbProfile) {
    initialProfile = {
      name: dbProfile.full_name,
      email: dbProfile.email || undefined,
      stream: dbProfile.stream,
      grade: 12,
      targetScore: dbProfile.target_score || 585,
      targetUniversity: dbProfile.target_university || DEFAULT_PROFILE.targetUniversity,
      latestDiagnosticScore: latestSession?.score_percentage ?? DEFAULT_PROFILE.latestDiagnosticScore,
      diagnosticTotalQuestions: latestSession?.total_questions ?? DEFAULT_PROFILE.diagnosticTotalQuestions,
      diagnosticCorrectCount: latestSession?.correct_count ?? DEFAULT_PROFILE.diagnosticCorrectCount,
      diagnosticCompletedAt: latestSession?.completed_at ?? DEFAULT_PROFILE.diagnosticCompletedAt,
      weakestTopic: latestSession?.weakest_topic || DEFAULT_PROFILE.weakestTopic,
      predictedTier: latestSession?.predicted_tier || DEFAULT_PROFILE.predictedTier,
    };
  }

  return (
    <DashboardClient
      initialProfile={initialProfile}
      isAuthenticated={isAuthenticated}
    />
  );
}
