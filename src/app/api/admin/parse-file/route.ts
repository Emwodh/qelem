import { NextRequest, NextResponse } from "next/server";
import { parsePlainTextQuestions } from "@/lib/questionStore";
import { GradeLevel } from "@/types/curriculum";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    const validAdminKey = process.env.ADMIN_SECRET_KEY;
    const isKeyAuthorized = Boolean(
      validAdminKey && adminKey && adminKey.trim() === validAdminKey.trim()
    );

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAdminUser = Boolean(
      user &&
        (user.app_metadata?.role === "admin" ||
          user.user_metadata?.is_admin === true ||
          (user.email && process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL))
    );

    if (!isAdminUser && !isKeyAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const subject = (formData.get("subject") as string) || "Physics";
    const subjectId = (formData.get("subjectId") as any) || "physics";
    const grade = (Number(formData.get("grade") || 12) as GradeLevel) || 12;
    const unitNumber = Number(formData.get("unitNumber") || 2);
    const unitTitle = (formData.get("unitTitle") as string) || "Electromagnetism & Induction";
    const examYear = (formData.get("examYear") as string) || "2016 E.C.";
    const difficulty = (formData.get("difficulty") as any) || "moderate";

    let textContent = "";
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdf = require("pdf-parse");
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdf(buffer);
      textContent = data.text;
    } else {
      // .md, .txt, or other text files
      textContent = await file.text();
    }

    const questions = parsePlainTextQuestions(textContent, {
      subject,
      subjectId,
      grade,
      unitNumber,
      unitTitle,
      examYear,
      difficulty,
    });

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: fileName.endsWith(".pdf") ? "pdf" : "markdown",
      extractedCharCount: textContent.length,
      rawText: textContent,
      questionsCount: questions.length,
      questions,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to parse file";
    console.error("File parse error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
