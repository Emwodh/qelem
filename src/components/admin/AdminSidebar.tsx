"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Database,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  ArrowLeft,
  Radio,
} from "lucide-react";
import { getLocalPayments } from "@/lib/paymentStore";

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const payments = getLocalPayments();
      const pending = payments.filter((p) => p.status === "MANUAL_REVIEW").length;
      setPendingCount(pending);
    }
  }, [pathname]);

  const adminNav = [
    {
      name: "Admin Command",
      href: "/admin",
      icon: ShieldCheck,
      active: pathname === "/admin",
    },
    {
      name: "Payment Slips",
      href: "/admin/payments",
      icon: CreditCard,
      active: pathname.startsWith("/admin/payments"),
      badge: pendingCount > 0 ? `${pendingCount} new` : undefined,
      badgeColor: "amber",
    },
    {
      name: "Question Bank",
      href: "/admin/questions",
      icon: Database,
      active: pathname.startsWith("/admin/questions"),
    },
    {
      name: "Candidate Roster",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      name: "Platform Telemetry",
      href: "/admin/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/admin/analytics"),
    },
    {
      name: "System & Settings",
      href: "/admin/settings",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
    },
  ];

  const handleLockAdminSession = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("qelem_admin_key");
      window.location.href = "/admin";
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-[#11131B] text-neutral-200">
      {/* Top Section: Brand + Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] p-4 sm:p-5">
          <Link
            href="/admin"
            onClick={onMobileClose}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-transform group-hover:scale-105">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
            </div>

            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white">
                  Qelem Admin
                </span>
                <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[9px] font-mono font-bold text-indigo-300">
                  STAFF
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-colors cursor-pointer"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Mobile Close Button */}
          {onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="lg:hidden rounded-lg p-1.5 text-neutral-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-3 space-y-3">
          <div className="px-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Operations & Control
            </span>
          </div>
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onMobileClose}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                    item.active
                      ? "bg-indigo-600/15 text-white border border-indigo-500/30 shadow-[0_0_12px_rgba(79,70,229,0.2)]"
                      : "text-neutral-400 hover:bg-white/[0.04] hover:text-white border border-transparent"
                  } ${isCollapsed ? "justify-center px-2" : ""}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      item.active
                        ? "text-indigo-400"
                        : "text-neutral-400 group-hover:text-neutral-200"
                    }`}
                  />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span className={item.active ? "font-semibold text-white" : ""}>
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Switch to Student Portal */}
          <div className="pt-3 border-t border-white/[0.08]">
            <Link
              href="/dashboard"
              onClick={onMobileClose}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200 transition-all border border-transparent ${
                isCollapsed ? "justify-center px-2" : ""
              }`}
              title="Return to Student Portal"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-neutral-500 group-hover:text-neutral-300" />
              {!isCollapsed && <span>Return to Student App</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Status & Lock */}
      <div className="p-3 border-t border-white/[0.08] space-y-2">
        {!isCollapsed && (
          <div className="rounded-xl bg-[#181A24] border border-white/[0.06] p-2.5 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-neutral-300 font-medium">Node: Production</span>
            </div>
            <span className="text-neutral-500">v2.4</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleLockAdminSession}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-neutral-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer ${
            isCollapsed ? "justify-center px-2" : ""
          }`}
          title="Lock Admin Console"
        >
          <Lock className="h-4 w-4 shrink-0 text-neutral-500 group-hover:text-rose-400" />
          {!isCollapsed && <span>Lock Console</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:flex-col border-r border-white/[0.08] bg-[#11131B] transition-all duration-300 ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#11131B] border-r border-white/[0.08] text-white transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
