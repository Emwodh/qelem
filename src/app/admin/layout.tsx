"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ShieldCheck,
  Compass,
  Lock,
  KeyRound,
  AlertCircle,
  Loader2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminSessionContextType {
  isUnlocked: boolean;
  unlockAdmin: (key: string) => Promise<boolean>;
  lockAdmin: () => void;
}

const AdminSessionContext = createContext<AdminSessionContextType>({
  isUnlocked: false,
  unlockAdmin: async () => false,
  lockAdmin: () => {},
});

export const useAdminSession = () => useContext(AdminSessionContext);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isCheckingSavedKey, setIsCheckingSavedKey] = useState<boolean>(true);
  const [passkeyInput, setPasskeyInput] = useState<string>("");
  const [passkeyError, setPasskeyError] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Check saved session on mount
  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/verify");
        if (res.ok && isMounted) {
          setIsUnlocked(true);
        } else if (typeof window !== "undefined" && sessionStorage.getItem("qelem_admin_unlocked") === "true") {
          // If session storage had it, re-verify or keep until server check finishes
          setIsUnlocked(false);
        }
      } catch {
        if (isMounted) setIsUnlocked(false);
      } finally {
        if (isMounted) setIsCheckingSavedKey(false);
      }
    }
    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const unlockAdmin = async (key: string): Promise<boolean> => {
    setPasskeyError("");
    setIsValidating(true);

    const trimmed = key.trim();

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.valid) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("qelem_admin_unlocked", "true");
        }
        setIsUnlocked(true);
        setIsValidating(false);
        return true;
      } else {
        setPasskeyError(data.error || "Invalid passkey. Access to administrative node denied.");
      }
    } catch {
      setPasskeyError("Network error contacting security node. Try again.");
    }

    setIsValidating(false);
    return false;
  };

  const lockAdmin = async () => {
    try {
      await fetch("/api/admin/verify", { method: "DELETE" });
    } catch {
      // Ignore network failure on logout
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("qelem_admin_unlocked");
      sessionStorage.removeItem("qelem_admin_key");
    }
    setIsUnlocked(false);
    setPasskeyInput("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;
    await unlockAdmin(passkeyInput);
  };

  // Determine section name for breadcrumbs
  const getSectionTitle = () => {
    if (pathname === "/admin") return "Executive Command Center";
    if (pathname.startsWith("/admin/payments")) return "Payment Slips Verification";
    if (pathname.startsWith("/admin/questions")) return "Question Bank & Ingestion";
    if (pathname.startsWith("/admin/users")) return "Candidate Roster & Access";
    if (pathname.startsWith("/admin/analytics")) return "Platform Telemetry & Insights";
    if (pathname.startsWith("/admin/settings")) return "System Settings & Audit";
    return "Administrative Console";
  };

  return (
    <AdminSessionContext.Provider value={{ isUnlocked, unlockAdmin, lockAdmin }}>
      <div className="min-h-screen bg-[#090A0F] text-neutral-100 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
        {/* Ambient Top Glow per DESIGN.md */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.12),rgba(9,10,15,0))] z-0" />

        {isUnlocked && (
          <AdminSidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            isMobileOpen={isMobileOpen}
            onMobileClose={() => setIsMobileOpen(false)}
          />
        )}

        {/* Main Administrative Stage */}
        <div
          className={`relative z-10 flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            isUnlocked ? (isCollapsed ? "lg:pl-20" : "lg:pl-64") : ""
          }`}
        >
          {/* Header */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#11131B]/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
            {/* Left: Mobile Toggle & Context */}
            <div className="flex items-center gap-3">
              {isUnlocked && (
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(true)}
                  className="lg:hidden rounded-xl p-2 text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-colors cursor-pointer"
                  aria-label="Open admin menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline">Qelem Administration</span>
                  <span className="sm:hidden">Qelem Admin</span>
                </span>
                <span className="text-neutral-600">/</span>
                <span className="font-medium text-neutral-400 truncate max-w-[160px] sm:max-w-none">
                  {getSectionTitle()}
                </span>
              </div>
            </div>

            {/* Right: Security Badge, Switcher & Lock */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#181A24] border border-white/[0.08] text-neutral-300 px-3 py-1 text-[11px] font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isUnlocked ? "CONSOLE UNLOCKED" : "LOCKED"}</span>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-all hover:border-white/[0.16]"
              >
                <Compass className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden md:inline">Student View</span>
              </Link>

              {isUnlocked && (
                <button
                  type="button"
                  onClick={lockAdmin}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 px-3 py-1.5 text-xs font-semibold text-neutral-400 transition-all cursor-pointer"
                  title="Lock Admin Session"
                >
                  <Lock className="h-3.5 w-3.5 sm:hidden" />
                  <span className="hidden sm:inline">Lock</span>
                </button>
              )}
            </div>
          </header>

          {/* Body Content or Global Lock Screen */}
          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
            {isCheckingSavedKey ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                  <span className="text-xs font-mono text-neutral-400">Verifying security node credentials...</span>
                </div>
              </div>
            ) : !isUnlocked ? (
              <div className="mx-auto max-w-md pt-12 pb-24 px-4">
                <div className="rounded-3xl border border-white/[0.08] bg-[#11131B]/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.5)] text-center space-y-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
                    <Lock className="h-7 w-7 text-indigo-400" />
                  </div>

                  <div className="space-y-1.5">
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Qelem Admin Console
                    </h1>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Restricted operational node for Ethiopian national exam question ingestion, slip approvals, candidate rosters, and telemetry.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                        <KeyRound className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Security Passkey</span>
                      </label>
                      <input
                        type="password"
                        value={passkeyInput}
                        onChange={(e) => setPasskeyInput(e.target.value)}
                        placeholder="Enter master passkey..."
                        required
                        className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>

                    {passkeyError && (
                      <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs font-semibold text-rose-300 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                        <span>{passkeyError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isValidating || !passkeyInput}
                      className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isValidating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <span>Authenticate & Enter Console</span>
                      )}
                    </button>
                  </form>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>Protocol: SHA-256 HMAC</span>
                    <Link
                      href="/dashboard"
                      className="text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Return to Student App &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              children
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-white/[0.08] bg-[#090A0F] py-6 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Qelem Education Inc.</span>
                <span className="text-neutral-600">&bull;</span>
                <span className="text-neutral-400">Matric Operations & Institutional Oversight</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                EAES / NEAEA Matrix Ingestion &bull; CBE / Telebirr Verification Node
              </div>
            </div>
          </footer>
        </div>
      </div>
    </AdminSessionContext.Provider>
  );
}
