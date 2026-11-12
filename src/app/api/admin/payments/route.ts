import { NextRequest, NextResponse } from "next/server";
import { getLocalPayments } from "@/lib/paymentStore";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    // 1. Enforce Admin Credentials (Supabase session + role check)
    const authCheck = await verifyAdminRequest(req);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error || "Unauthorized: Administrator privileges required." },
        { status: authCheck.status || 401 }
      );
    }

    const statusFilter = req.nextUrl.searchParams.get("status") || "all";
    let payments: any[] = [];

    // Fetch live payments from Supabase using service client
    try {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        payments = data.map((row: any) => ({
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
        }));
      } else if (process.env.NODE_ENV !== "production") {
        payments = getLocalPayments();
      }
    } catch {
      if (process.env.NODE_ENV !== "production") {
        payments = getLocalPayments();
      }
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
