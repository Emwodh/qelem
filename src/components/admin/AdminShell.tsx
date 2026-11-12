"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ShieldCheck,
  Compass,
  Lock,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const getSectionTitle = () => {
    if (pathname === "/admin") return "Executive Command Center";
    if (pathname.startsWith("/admin/payments")) return "Payment Slips Verification";
    if (pathname.startsWith("/admin/questions")) return "Question Bank & Ingestion";
    if (pathname.startsWith("/admin/users")) return "Candidate Roster & Access";
    if (pathname.startsWith("/admin/analytics")) return "Platform Telemetry & Insights";
    if (pathname.startsWith("/admin/settings")) return "System Settings & Audit";
    return "Administrative Console";
  };

  const handleSignOut = () => {
    window.location.href = "/auth/logout";
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-neutral-100 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Ambient Top Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.12),rgba(9,10,15,0))] z-0" />

      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Administrative Stage */}
      <div
        className={`relative z-10 flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#11131B]/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Toggle & Context */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden rounded-xl p-2 text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-colors cursor-pointer"
              aria-label="Open admin menu"
            >
              <Menu className="h-5 w-5" />
            </button>

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

          {/* Right: Security Badge, Switcher & Sign Out */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#181A24] border border-white/[0.08] text-neutral-300 px-3 py-1 text-[11px] font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SERVER VERIFIED ADMIN</span>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-all hover:border-white/[0.16]"
            >
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden md:inline">Student View</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 px-3 py-1.5 text-xs font-semibold text-neutral-400 transition-all cursor-pointer"
              title="Sign Out of Admin Console"
            >
              <Lock className="h-3.5 w-3.5 sm:hidden" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Body Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
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
  );
}
