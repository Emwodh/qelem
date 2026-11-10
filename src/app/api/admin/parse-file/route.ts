import { NextRequest, NextResponse } from "next/server";
import { parsePlainTextQuestions } from "@/lib/questionStore";
import { GradeLevel } from "@/types/curriculum";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import { auth0, isAuth0Configured } from "@/lib/auth0";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Admin Authorization Gate (x-admin-key or qelem_admin_token cookie)
    const authCheck = verifyAdminApiRequest(req);
    let isAuthorized = authCheck.authorized;

    if (!isAuthorized && isAuth0Configured()) {
      try {
        const session = await auth0.getSession(req);
        const user = session?.user;
        if (
          user &&
          (user.role === "admin" ||
            user["https://qelem.et/roles"]?.includes("admin") ||
            user.user_metadata?.is_admin === true ||
            (user.email && process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL))
        ) {
          isAuthorized = true;
        }
      } catch {
        isAuthorized = false;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: authCheck.error || "Unauthorized: Admin privileges required" },
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

    if (!textContent || textContent.trim().length === 0) {
      return NextResponse.json(
        { error: "Uploaded file is empty or could not be decoded." },
        { status: 400 }
      );
    }

    // Parse extracted text into structured exam questions
    const parsedQuestions = parsePlainTextQuestions(textContent, {
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
      rawText: textContent.slice(0, 5000),
      questionsCount: parsedQuestions.length,
      questions: parsedQuestions,
    });
  } catch (err: any) {
    console.error("Parse-file endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to parse file", details: err?.message },
      { status: 500 }
    );
  }
}
