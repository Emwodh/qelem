import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: examId } = await params;
    const body = await request.json().catch(() => ({}));
    const answers = body.answers || {};
    const remainingSeconds = body.remainingSeconds ?? 0;
    const timeElapsedSec = body.timeElapsedSec ?? 0;

    // Resilient heartbeat: acknowledge synchronization
    return NextResponse.json(
      {
        status: "synced",
        examId,
        answersCount: Object.keys(answers).length,
        remainingSeconds,
        timeElapsedSec,
        syncedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Heartbeat sync failed", details: error?.message },
      { status: 500 }
    );
  }
}
