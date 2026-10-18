import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus, getLocalPayments } from "@/lib/paymentStore";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Admin Authorization Gate
    const adminKey = req.headers.get("x-admin-key");
    const validKey = process.env.ADMIN_SECRET_KEY;
    const isAuthorized = Boolean(validKey && adminKey && adminKey.trim() === validKey.trim());

    if (!isAuthorized) {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      const isAdminUser = Boolean(
        user &&
          (user.app_metadata?.role === "admin" ||
            user.user_metadata?.is_admin === true ||
            (user.email && process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL))
      );

      if (!isAdminUser) {
        return NextResponse.json(
          { error: "Unauthorized: Admin privileges required." },
          { status: 401 }
        );
      }
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
    const updated = await updatePaymentStatus(paymentId, newStatus, adminNotes);

    if (!updated) {
      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
    }

    // 2. If approved and associated with a Supabase user, activate their Pro subscription
    if (action === "approve") {
      try {
        const supabase = await createServerSupabaseClient();
        if (updated.userId) {
          await supabase
            .from("profiles")
            .update({
              is_pro: true,
              plan: updated.plan || "MATRIC_SEASON_PASS",
              updated_at: new Date().toISOString(),
            })
            .eq("id", updated.userId);
        } else if (updated.email) {
          // If signed up via email
          await supabase
            .from("profiles")
            .update({
              is_pro: true,
              plan: updated.plan || "MATRIC_SEASON_PASS",
              updated_at: new Date().toISOString(),
            })
            .eq("email", updated.email);
        }
      } catch (dbErr) {
        console.warn("Could not update candidate profile to Pro in Supabase:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: action === "approve" ? "Payment verified and candidate upgraded to Pro." : "Payment marked as rejected.",
      payment: updated,
    });
  } catch (error: any) {
    console.error("Error reviewing payment receipt:", error);
    return NextResponse.json(
      { error: "Failed to process payment review", details: error?.message },
      { status: 500 }
    );
  }
}
