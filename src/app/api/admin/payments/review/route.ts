import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus } from "@/lib/paymentStore";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import { auth0, isAuth0Configured } from "@/lib/auth0";

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
        { error: authCheck.error || "Unauthorized: Admin privileges required." },
        { status: 401 }
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
    const updated = await updatePaymentStatus(paymentId, newStatus, adminNotes);

    if (!updated) {
      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
    }

    // 2. If approved and associated with a user, activate their Pro subscription in Supabase if reachable
    if (newStatus === "COMPLETED" && updated.userId) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase
          .from("profiles")
          .update({
            is_pro: true,
            pro_plan: updated.plan,
            pro_activated_at: new Date().toISOString(),
          })
          .eq("id", updated.userId);
      } catch (dbErr) {
        console.warn("Could not sync Pro entitlement to Supabase profile:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        newStatus === "COMPLETED"
          ? "Payment verified and candidate upgraded to Pro."
          : "Payment rejected.",
      payment: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error processing review", details: err?.message },
      { status: 500 }
    );
  }
}
