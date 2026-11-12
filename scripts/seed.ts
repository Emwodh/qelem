import { createClient } from "@supabase/supabase-js";
import { CURRICULUM_QUESTIONS } from "../src/lib/curriculumData";

/**
 * Qelem Question Bank Database Seeder (CLI)
 * 
 * Securely seeds curriculum questions into PostgreSQL using the service-role key.
 * Usage:
 *   node --experimental-strip-types scripts/seed.ts
 */
async function main() {
  console.log("=== QELEM QUESTION BANK SEEDER (SERVICE ROLE CLI) ===");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error("FATAL: NEXT_PUBLIC_SUPABASE_URL environment variable is missing.");
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.error("FATAL: SUPABASE_SERVICE_ROLE_KEY environment variable is missing.");
    console.error("The seeder requires full service-role authority to populate protected question rows.");
    process.exit(1);
  }

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const formattedQuestions = CURRICULUM_QUESTIONS.map((q) => ({
    id: q.id,
    subject: q.subject,
    stream: "natural",
    grade_level: q.grade,
    unit_number: q.unitNumber,
    unit_title: q.unitTitle,
    exam_year: q.examYear || "Practice",
    difficulty: q.difficulty === "foundation" ? "easy" : q.difficulty === "moderate" ? "medium" : "hard",
    prompt: q.prompt,
    options: q.options,
    correct_option_id: q.correctOptionId,
    explanation: q.explanation,
    distractor_analysis: q.distractorAnalysis || null,
    examiner_insight: q.examinerInsight || null,
  }));

  console.log(`Prepared ${formattedQuestions.length} curriculum questions for upsert...`);

  try {
    const { error } = await supabase
      .from("questions")
      .upsert(formattedQuestions, { onConflict: "id" });

    if (error) {
      console.error("Database seed error:", error.message);
      process.exit(1);
    }

    console.log(`✓ Successfully seeded ${formattedQuestions.length} questions into public.questions!`);
  } catch (err: any) {
    console.error("Unexpected error during seeding:", err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error running seeder:", err);
  process.exit(1);
});
