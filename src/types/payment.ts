export type PaymentMethod = "telebirr" | "cbe";
export type PaymentStatus = "MANUAL_REVIEW" | "COMPLETED" | "REJECTED";
export type SubscriptionPlan = "FREE" | "MONTHLY_PASS" | "MATRIC_SEASON_PASS" | "LIFETIME_PASS";

export interface ManualPaymentSubmission {
  candidateName: string;
  phone: string;
  email?: string;
  method: PaymentMethod;
  amountETB: number;
  plan: SubscriptionPlan;
  bankTxRef: string;
  receiptImageUrl?: string;
}

export interface PaymentRecord {
  id: string;
  userId?: string;
  candidateName: string;
  phone: string;
  email?: string;
  txRef: string;
  bankTxRef: string;
  amountETB: number;
  plan: SubscriptionPlan;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptImageUrl?: string;
  adminNotes?: string;
  createdAt: string;
  reviewedAt?: string;
}
