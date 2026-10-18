import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CURRICULUM_QUESTIONS } from "@/lib/curriculumData";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET(request: Request) {
  const isDev = process.env.NODE_ENV === "development";
  const authHeader = request.headers.get("authorization");
  const seedSecret = process.env.ADMIN_SEED_SECRET;

  if (!isDev) {
    if (!seedSecret || authHeader !== `Bearer ${seedSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing authorization secret" },
        { status: 401 }
      );
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured in .env.local" },
      { status: 500 }
    );
  }

  // Create an admin client bypassing RLS using the service role key if available, 
  // otherwise use anon key. (Assuming the user has RLS disabled or anon can insert).
  // Wait, in 002_questions_schema.sql: 
  // CREATE POLICY "Admins can insert questions" ON public.questions FOR INSERT WITH CHECK (true);
  // Actually, wait, it says "WITH CHECK (true)", meaning anyone can insert if using that policy!
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formattedQuestions = CURRICULUM_QUESTIONS.map((q) => ({
      id: q.id,
      subject: q.subject,
      stream: "natural", // Defaulting based on provided data
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

    // Perform an upsert to avoid duplicate key errors if run multiple times
    const { data, error } = await supabase
      .from("questions")
      .upsert(formattedQuestions, { onConflict: "id" });

    if (error) {
      console.error("Supabase insert error:", error);
      const isKeyTypeError = error.message?.includes("Secret API key required") || error.message?.includes("INVALID_API_KEY_TYPE");
      return NextResponse.json(
        {
          error: error.message,
          suggestion: isKeyTypeError
            ? "Your .env.local uses a publishable key. To sync directly to your remote Supabase questions table, add SUPABASE_SERVICE_ROLE_KEY from your Supabase Dashboard (Settings > API) to .env.local. Note: All 97 questions are already loaded and fully functional in Qelem's offline engine!"
            : undefined,
          localQuestionsCount: formattedQuestions.length,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${formattedQuestions.length} questions into Supabase!`,
    });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
