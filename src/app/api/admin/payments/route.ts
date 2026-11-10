import { NextRequest, NextResponse } from "next/server";
import { getLocalPayments } from "@/lib/paymentStore";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import { auth0, isAuth0Configured } from "@/lib/auth0";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Admin Credentials (x-admin-key or qelem_admin_token cookie)
    const authCheck = verifyAdminApiRequest(req);
    let isAuthorized = authCheck.authorized;

    // Optional Auth0 admin session check
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
        { error: authCheck.error || "Unauthorized: Administrator privileges required." },
        { status: 401 }
      );
    }

    const statusFilter = req.nextUrl.searchParams.get("status") || "all";
    let payments = getLocalPayments();

    // Try fetching live payments from Supabase if table exists
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Merge Supabase records with local store
        const map = new Map<string, any>();
        payments.forEach((p) => map.set(p.txRef, p));
        data.forEach((row: any) => {
          map.set(row.tx_ref, {
            id: row.id,
            userId: row.user_id,
            candidateName: row.candidate_name,
            phone: row.phone,
            email: row.email,
            txRef: row.tx_ref,
            bankTxRef: row.bank_tx_ref,
            amountETB: Number(row.amount_etb),
            plan: row.plan,
            method: row.method,
            status: row.status,
            receiptImageUrl: row.receipt_image_url,
            adminNotes: row.admin_notes,
            createdAt: row.created_at,
            reviewedAt: row.reviewed_at,
          });
        });
        payments = Array.from(map.values());
      }
    } catch {
      // In dev or offline fallback, continue with local store
    }

    // Filter by status if requested
    if (statusFilter !== "all") {
      payments = payments.filter((p) => p.status === statusFilter);
    }

    return NextResponse.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error fetching payments", details: err?.message },
      { status: 500 }
    );
  }
}
