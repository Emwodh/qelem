export interface AuditLogEntry {
  id: string;
  action: "APPROVE_PAYMENT" | "REJECT_PAYMENT" | "RECORD_MANUAL_PAYMENT" | "INGEST_QUESTIONS" | "UPDATE_QUESTION" | "DELETE_QUESTION" | "GRANT_PRO_ACCESS" | "REVOKE_PRO_ACCESS" | "RESET_DEVICES" | "UPDATE_SETTINGS" | "RESTORE_BACKUP";
  operator: string;
  details: string;
  targetId?: string;
  timestamp: string;
}

const AUDIT_STORAGE_KEY = "qelem_admin_audit_logs";

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit_init_001",
    action: "INGEST_QUESTIONS",
    operator: "Chief Examiner (Admin)",
    details: "Ingested 40 verified items for 2016 E.C. Physics (Electromagnetism & Induction)",
    targetId: "physics-g12-u2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "audit_init_002",
    action: "APPROVE_PAYMENT",
    operator: "Registrar (Staff)",
    details: "Approved CBE Mobile Banking slip FT24288VERIFIED for Yared Bekele (349 ETB)",
    targetId: "pay_demo_003",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "audit_init_003",
    action: "UPDATE_SETTINGS",
    operator: "Lead Admin",
    details: "Configured CBE Primary Account 1000123456789 and Telebirr Merchant +251911223344",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === "undefined") return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function logAdminAction(
  action: AuditLogEntry["action"],
  details: string,
  targetId?: string,
  operator: string = "Staff Administrator"
): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    action,
    operator,
    details,
    targetId,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const current = getAuditLogs();
      const updated = [newEntry, ...current].slice(0, 150); // Keep latest 150
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to append audit log:", err);
    }
  }

  return newEntry;
}

export function clearAuditLogs(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(AUDIT_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear audit logs:", err);
    }
  }
}
