import { PaymentRecord, ManualPaymentSubmission, PaymentStatus } from "@/types/payment";
import { createClient as createBrowserSupabaseClient, isSupabaseConfigured } from "./supabase/client";

const PAYMENTS_STORAGE_KEY = "qelem_manual_payments_store";

// Sample pre-seeded payment submissions for admin demonstration
const INITIAL_DEMO_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay_demo_001",
    candidateName: "Dawit Yohannes",
    phone: "+251911458921",
    email: "dawit.y@gmail.com",
    txRef: "TX_MAN_1729249001",
    bankTxRef: "FT24289QLEM99",
    amountETB: 349,
    plan: "MATRIC_SEASON_PASS",
    method: "cbe",
    status: "MANUAL_REVIEW",
    receiptImageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    adminNotes: "CBE mobile banking slip submitted via Bole branch.",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "pay_demo_002",
    candidateName: "Selamawit Tadesse",
    phone: "+251922334455",
    email: "selam.t@yahoo.com",
    txRef: "TX_MAN_1729249002",
    bankTxRef: "TLB984521034",
    amountETB: 349,
    plan: "MATRIC_SEASON_PASS",
    method: "telebirr",
    status: "MANUAL_REVIEW",
    adminNotes: "Telebirr P2P transfer confirmation SMS screenshot attached.",
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: "pay_demo_003",
    candidateName: "Yared Bekele",
    phone: "+251933778899",
    email: "yared.b@gmail.com",
    txRef: "TX_MAN_1729249003",
    bankTxRef: "FT24288VERIFIED",
    amountETB: 349,
    plan: "MATRIC_SEASON_PASS",
    method: "cbe",
    status: "COMPLETED",
    adminNotes: "Verified via CBE branch statement.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

/**
 * Returns all payment records from local store or merged with Supabase
 */
export function getLocalPayments(): PaymentRecord[] {
  if (typeof window === "undefined") return INITIAL_DEMO_PAYMENTS;
  try {
    const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PAYMENTS));
      return INITIAL_DEMO_PAYMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_PAYMENTS;
  }
}

export function saveLocalPayments(records: PaymentRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to save payments to localStorage:", err);
  }
}

/**
 * Submits a new manual payment record (Telebirr or CBE)
 */
export async function submitPaymentRecord(submission: ManualPaymentSubmission): Promise<PaymentRecord> {
  const txRef = `TX_MAN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const newRecord: PaymentRecord = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    candidateName: submission.candidateName,
    phone: submission.phone,
    email: submission.email,
    txRef,
    bankTxRef: submission.bankTxRef,
    amountETB: submission.amountETB,
    plan: submission.plan,
    method: submission.method,
    status: "MANUAL_REVIEW",
    receiptImageUrl: submission.receiptImageUrl,
    createdAt: new Date().toISOString(),
  };

  // 1. Save to local storage for instant availability
  const current = getLocalPayments();
  const updated = [newRecord, ...current.filter((p) => p.bankTxRef !== submission.bankTxRef)];
  saveLocalPayments(updated);

  // 2. Sync to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from("payments").insert({
        user_id: user?.id || null,
        candidate_name: submission.candidateName,
        phone: submission.phone,
        email: submission.email || user?.email || null,
        tx_ref: txRef,
        bank_tx_ref: submission.bankTxRef,
        amount_etb: submission.amountETB,
        plan: submission.plan,
        method: submission.method,
        status: "MANUAL_REVIEW",
        receipt_image_url: submission.receiptImageUrl || null,
      });
    } catch (err) {
      console.warn("Could not sync payment record to Supabase, stored locally:", err);
    }
  }

  return newRecord;
}

/**
 * Updates payment status (Approve / Reject)
 */
export async function updatePaymentStatus(
  paymentId: string,
  newStatus: PaymentStatus,
  adminNotes?: string
): Promise<PaymentRecord | null> {
  const payments = getLocalPayments();
  const target = payments.find((p) => p.id === paymentId || p.txRef === paymentId);
  if (!target) return null;

  target.status = newStatus;
  target.reviewedAt = new Date().toISOString();
  if (adminNotes) {
    target.adminNotes = adminNotes;
  }

  saveLocalPayments(payments);

  // Sync to Supabase if available
  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase
        .from("payments")
        .update({
          status: newStatus,
          reviewed_at: target.reviewedAt,
          admin_notes: adminNotes || target.adminNotes,
        })
        .or(`id.eq.${paymentId},tx_ref.eq.${paymentId}`);
    } catch (err) {
      console.warn("Could not sync status update to Supabase:", err);
    }
  }

  return target;
}
