"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Database,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

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
      active: pathname === "/admin/payments",
      badge: "CBE/Tele",
    },
    {
      name: "Question Bank",
      href: "/admin/questions",
      icon: Database,
      active: pathname === "/admin/questions",
    },
    {
      name: "Platform Telemetry",
      href: "/admin/analytics",
      icon: BarChart3,
      active: pathname === "/admin/analytics",
    },
  ];

  const handleLockAdminSession = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("qelem_admin_key");
      window.location.href = "/admin";
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto">
      {/* Top Section: Brand + Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 p-4 sm:p-5">
          <Link
            href="/admin"
            onClick={onMobileClose}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-white shadow-sm transition-transform group-hover:scale-105">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>

            {!isCollapsed && (
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">
                  Qelem Admin
                </span>
                <span className="rounded-md bg-neutral-800 px-1.5 py-0.5 text-[10px] font-bold text-neutral-300">
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
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
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
              className="lg:hidden rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-3 sm:px-4 space-y-4">
          <div className="px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
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
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    item.active
                      ? "bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                  } ${isCollapsed ? "justify-center px-2" : ""}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      item.active
                        ? "text-emerald-400"
                        : "text-neutral-500 group-hover:text-neutral-300"
                    }`}
                  />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
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
          <div className="pt-4 border-t border-neutral-800">
            <Link
              href="/dashboard"
              onClick={onMobileClose}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all ${
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

      {/* Bottom Section: Lock Admin Session */}
      <div className="p-3 sm:p-4 border-t border-neutral-800">
        <button
          type="button"
          onClick={handleLockAdminSession}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-neutral-400 hover:bg-neutral-900 hover:text-rose-400 transition-all cursor-pointer ${
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
        className={`hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:flex-col border-r border-neutral-800 bg-neutral-950 transition-all duration-300 ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-neutral-950 text-white transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
