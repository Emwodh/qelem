import { NextRequest, NextResponse } from "next/server";
import { getLocalPayments } from "@/lib/paymentStore";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Admin Credentials
    const adminKey = req.headers.get("x-admin-key");
    const validKey = process.env.ADMIN_SECRET_KEY;
    const isAuthorized = Boolean(validKey && adminKey && adminKey.trim() === validKey.trim());

    if (!isAuthorized) {
      // Also check if admin session cookie exists in Supabase
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
          { error: "Unauthorized: Administrator privileges required." },
          { status: 401 }
        );
      }
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
      // Fallback cleanly to local store
    }

    if (statusFilter !== "all") {
      payments = payments.filter((p) => p.status === statusFilter);
    }

    return NextResponse.json({ payments });
  } catch (error: any) {
    console.error("Error retrieving admin payment queue:", error);
    return NextResponse.json(
      { error: "Failed to load payment receipts", details: error?.message },
      { status: 500 }
    );
  }
}
