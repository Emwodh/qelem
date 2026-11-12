import { NextRequest, NextResponse } from "next/server";
import { submitPaymentRecord, getLocalPayments } from "@/lib/paymentStore";
import { ManualPaymentSubmission } from "@/types/payment";
import { createClient as createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { enforceRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // 1. Enforce Rate Limiting (5 payment submissions per 10 minutes per IP)
  const rl = await enforceRateLimit(req, 5, 600, "pay_submit");
  if (!rl.success) {
    const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many payment submission attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const {
      candidateName,
      phone,
      email,
      method,
      amountETB,
      plan,
      bankTxRef,
      receiptImageUrl,
    } = body;

    // 2. Mandatory Input Validation
    if (!candidateName || typeof candidateName !== "string" || !candidateName.trim()) {
      return NextResponse.json(
        { error: "Candidate full name is required." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 9) {
      return NextResponse.json(
        { error: "A valid Ethiopian phone number (e.g. 09... or 07...) is required." },
        { status: 400 }
      );
    }

    if (!["telebirr", "cbe"].includes(method)) {
      return NextResponse.json(
        { error: "Invalid payment method. Only 'telebirr' or 'cbe' transfers are accepted." },
        { status: 400 }
      );
    }

    if (!bankTxRef || typeof bankTxRef !== "string" || bankTxRef.trim().length < 4) {
      return NextResponse.json(
        { error: "Bank or Telebirr transaction reference code is required." },
        { status: 400 }
      );
    }

    // 3. Production safety check
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction && !isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            "Payment service unavailable: Database persistence is unconfigured in production. Cannot silently store payment record.",
        },
        { status: 503 }
      );
    }

    // Resolve authenticated user if logged in
    let authenticatedUserId: string | null = null;
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        authenticatedUserId = user.id;
      }
    } catch {
      // Unauthenticated guest submission allowed in dev or initial registration
    }

    const submission: ManualPaymentSubmission = {
      candidateName: candidateName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      method: method as "telebirr" | "cbe",
      amountETB: Number(amountETB) || 349,
      plan: plan || "MATRIC_SEASON_PASS",
      bankTxRef: bankTxRef.trim(),
      receiptImageUrl: receiptImageUrl || undefined,
    };

    // 4. Persist to payment store (dev offline fallback)
    const payment = await submitPaymentRecord(submission);

    // 5. Record in Supabase server (Postgres source of truth)
    if (isSupabaseConfigured()) {
      try {
        const serviceSupabase = createServiceClient();
        const { error: insertErr } = await serviceSupabase.from("payments").insert({
          user_id: authenticatedUserId,
          candidate_name: submission.candidateName,
          phone: submission.phone,
          email: submission.email || null,
          tx_ref: payment.txRef,
          bank_tx_ref: submission.bankTxRef,
          amount_etb: submission.amountETB,
          plan: submission.plan,
          method: submission.method,
          status: "MANUAL_REVIEW", // Forced initial pending status
          receipt_image_url: submission.receiptImageUrl || null,
        });

        if (insertErr && isProduction) {
          throw new Error("Supabase insert error: " + insertErr.message);
        }
      } catch (dbErr: any) {
        if (isProduction) {
          return NextResponse.json(
            { error: "Database error persisting payment receipt", details: dbErr?.message },
            { status: 500 }
          );
        }
        console.warn("[Qelem Dev] Could not insert payment to Supabase directly in route:", dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment receipt submitted successfully. Verification takes 15–30 minutes.",
        payment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error processing manual payment slip:", error);
    return NextResponse.json(
      { error: "Failed to submit manual payment receipt", details: error?.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments/manual?txRef=...
 * Owner-scoped single lookup by txRef only (authenticated).
 * List mode is completely removed.
 */
export async function GET(req: NextRequest) {
  // 1. Rate Limiting (30 status lookups per minute)
  const rl = await enforceRateLimit(req, 30, 60, "pay_lookup");
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many payment lookup requests. Please slow down." },
      { status: 429 }
    );
  }

  try {
    const txRef = req.nextUrl.searchParams.get("txRef");

    // List mode is forbidden: txRef is mandatory
    if (!txRef || txRef.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing required parameter: txRef. List mode has been removed." },
        { status: 400 }
      );
    }

    // Authentication is mandatory: only owner can inspect their payment
    let user: { id: string } | null = null;
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        user = data.user;
      }
    } catch {
      // Auth check failure
    }

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Active session required to view transaction details." },
        { status: 401 }
      );
    }

    // Query payment scoped to this user only
    if (isSupabaseConfigured()) {
      try {
        const serviceClient = createServiceClient();
        const { data, error } = await serviceClient
          .from("payments")
          .select("*")
          .eq("user_id", user.id)
          .or(`tx_ref.eq.${txRef.trim()},bank_tx_ref.eq.${txRef.trim()}`)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          return NextResponse.json({
            payment: {
              id: data.id,
              userId: data.user_id,
              candidateName: data.candidate_name,
              phone: data.phone,
              email: data.email,
              txRef: data.tx_ref,
              bankTxRef: data.bank_tx_ref,
              amountETB: Number(data.amount_etb),
              plan: data.plan,
              method: data.method,
              status: data.status,
              receiptImageUrl: data.receipt_image_url,
              createdAt: data.created_at,
              reviewedAt: data.reviewed_at,
            },
          });
        }
      } catch (dbErr) {
        console.warn("[Qelem] Supabase lookup error in GET /api/payments/manual:", dbErr);
      }
    }

    // Dev offline store fallback (owner-scoped)
    if (process.env.NODE_ENV !== "production") {
      const payments = getLocalPayments();
      const match = payments.find(
        (p) => (p.txRef === txRef || p.bankTxRef === txRef) && (p.userId === user?.id || !p.userId)
      );
      if (match) {
        return NextResponse.json({ payment: match });
      }
    }

    return NextResponse.json(
      { error: "Payment transaction not found." },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to retrieve payment record", details: error?.message },
      { status: 500 }
    );
  }
}
