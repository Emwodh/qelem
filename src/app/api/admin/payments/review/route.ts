import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus } from "@/lib/paymentStore";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    // 1. Admin Authorization Gate (Supabase session + role check)
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error || "Unauthorized: Administrator privileges required." },
        { status: authCheck.status || 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { paymentId, action, adminNotes } = body;

    if (!paymentId || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid review parameters. Required: paymentId and action ('approve' | 'reject')." },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "COMPLETED" : "REJECTED";

    // 2. Update status in Supabase if reachable
    let supabaseRecord: any = null;
    try {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("payments")
        .update({
          status: newStatus,
          admin_notes: adminNotes || null,
          reviewed_at: new Date().toISOString(),
        })
        .or(`id.eq.${paymentId},tx_ref.eq.${paymentId}`)
        .select()
        .single();

      if (!error && data) {
        supabaseRecord = data;

        // If approved and associated with a user, activate Pro subscription
        if (newStatus === "COMPLETED" && data.user_id) {
          await supabase
            .from("profiles")
            .update({
              is_pro: true,
              pro_plan: data.plan,
              pro_activated_at: new Date().toISOString(),
            })
            .eq("id", data.user_id);
        }
      }
    } catch (dbErr) {
      console.warn("Could not sync payment review to Supabase:", dbErr);
    }

    // Also update local store for dev offline capability
    const updated = await updatePaymentStatus(paymentId, newStatus, adminNotes);

    if (!updated && !supabaseRecord) {
      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        newStatus === "COMPLETED"
          ? "Payment verified and candidate upgraded to Pro."
          : "Payment rejected.",
      payment: supabaseRecord || updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error processing review", details: err?.message },
      { status: 500 }
    );
  }
}
