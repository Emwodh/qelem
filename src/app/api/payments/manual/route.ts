import { NextRequest, NextResponse } from "next/server";
import { submitPaymentRecord, getLocalPayments } from "@/lib/paymentStore";
import { ManualPaymentSubmission } from "@/types/payment";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
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

    // 1. Mandatory Input Validation
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

    // 2. Persist to payment store
    const payment = await submitPaymentRecord(submission);

    // 3. Attempt to record on Supabase server if session active
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("payments").insert({
          user_id: user.id,
          candidate_name: submission.candidateName,
          phone: submission.phone,
          email: submission.email || user.email || null,
          tx_ref: payment.txRef,
          bank_tx_ref: submission.bankTxRef,
          amount_etb: submission.amountETB,
          plan: submission.plan,
          method: submission.method,
          status: "MANUAL_REVIEW",
          receipt_image_url: submission.receiptImageUrl || null,
        });
      }
    } catch (dbErr) {
      // Non-fatal: local store persists submission
      console.warn("Could not insert payment to Supabase directly in route:", dbErr);
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

export async function GET(req: NextRequest) {
  try {
    const txRef = req.nextUrl.searchParams.get("txRef");
    const payments = getLocalPayments();

    if (txRef) {
      const match = payments.find((p) => p.txRef === txRef || p.bankTxRef === txRef);
      if (!match) {
        return NextResponse.json({ error: "Payment transaction not found." }, { status: 404 });
      }
      return NextResponse.json({ payment: match });
    }

    return NextResponse.json({ payments });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to retrieve payments", details: error?.message },
      { status: 500 }
    );
  }
}
