"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  ShieldCheck,
  Compass,
  Lock,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col font-sans antialiased">
      {/* Standalone Admin Navigation Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Administrative Stage */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Admin Header */}
        <header className="sticky top-0 z-20 flex h-14 sm:h-16 items-center justify-between border-b border-neutral-200/90 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          {/* Left: Mobile Toggle & Context */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Open admin menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-bold text-neutral-950 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Qelem Administration</span>
              </span>
              <span className="text-neutral-300">/</span>
              <span className="font-medium text-neutral-500">Executive Console</span>
            </div>

            <div className="sm:hidden flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-white shadow-2xs">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-bold text-sm text-neutral-950">Qelem Admin</span>
            </div>
          </div>

          {/* Right: Security Status & Student Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-neutral-900 text-white px-3 py-1 text-[11px] font-mono font-bold shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ADMIN SESSION</span>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Student View</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Admin View */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8">{children}</main>

        {/* Admin Footer */}
        <footer className="border-t border-neutral-200/80 bg-white py-5 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900">Qelem Education Inc.</span>
              <span>&bull;</span>
              <span>Platform Administrative Operations</span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              Role-Based Access Control & Bull-Proof Payment Verification
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
