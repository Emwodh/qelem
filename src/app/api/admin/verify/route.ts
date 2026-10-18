import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const key = body?.key;
    const validKey = process.env.ADMIN_SECRET_KEY;
    if (!validKey) {
      return NextResponse.json(
        { valid: false, error: "ADMIN_SECRET_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    if (key && typeof key === "string" && key.trim() === validKey.trim()) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json(
      { valid: false, error: "Invalid admin passkey" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { valid: false, error: "Malformed request payload" },
      { status: 400 }
    );
  }
}
