"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  LayoutDashboard,
  Layers,
  Compass,
  CalendarCheck2,
  Send,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Target,
  GraduationCap,
  BookOpen,
  Clock,
  CreditCard,
} from "lucide-react";
import { UserProfile } from "@/types/user";
import AuthModal from "@/components/auth/AuthModal";

interface SidebarProps {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  onSignOut: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  profile,
  isAuthenticated,
  onSignOut,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const generalNav = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "Learning",
      href: "/learn",
      icon: BookOpen,
      active: pathname?.startsWith("/learn"),
    },
    {
      name: "Question Bank",
      href: "/bank",
      icon: Layers,
      active: pathname?.startsWith("/bank"),
    },
    {
      name: "Mock Exams",
      href: "/mock-exams",
      icon: Clock,
      active: pathname?.startsWith("/mock-exams"),
    },
    {
      name: "Test",
      href: "/practice",
      icon: Compass,
      active: pathname?.startsWith("/practice"),
    },
    {
      name: "Study Plans",
      href: "/study-plan",
      icon: CalendarCheck2,
      active: pathname?.startsWith("/study-plan"),
    },
  ];

  const candidateName = profile?.name || "Student";
  const streamLabel =
    profile?.stream === "social" ? "Social Science" : "Natural Science";
  const targetScore = profile?.targetScore || 585;

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto">
      {/* Top Section: Brand + Navigation */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 p-4 sm:p-5">
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-sm transition-transform group-hover:scale-105">
              <Bookmark className="h-4.5 w-4.5 fill-white/20 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            {!isCollapsed && (
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-neutral-950">
                  Qelem
                </span>
                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600 border border-neutral-200/70">
                  «ቀለም»
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle Button (Simple, rounded-full, no boxy edges) */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
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
              className="lg:hidden rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>


        {/* Navigation Groups */}
        <div className="px-3 sm:px-4 space-y-5">
          {/* General Section */}
          <div className="space-y-1">
            <nav className="space-y-1">
              {generalNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                      item.active
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-950"
                    } ${isCollapsed ? "justify-center px-2" : ""}`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        item.active
                          ? "text-white"
                          : "text-neutral-400 group-hover:text-neutral-700"
                      }`}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Community & Help Section */}
          <div className="space-y-1 pt-2 border-t border-neutral-100">
            <nav className="space-y-1">
              {/* Telegram Community */}
              <a
                href="https://t.me/qelem_edu"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-950 transition-all ${
                  isCollapsed ? "justify-center px-2" : ""
                }`}
                title="Join @qelem_edu on Telegram"
              >
                <Send className="h-4 w-4 shrink-0 text-blue-500 transition-transform group-hover:scale-105" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Telegram Community</span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      @qelem_edu
                    </span>
                  </div>
                )}
              </a>

              {/* Settings */}
              <Link
                href="/settings"
                onClick={onMobileClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  pathname === "/settings"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-950"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
                title={isCollapsed ? "Settings" : undefined}
              >
                <Settings
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    pathname === "/settings"
                      ? "text-white"
                      : "text-neutral-400 group-hover:text-neutral-700"
                  }`}
                />
                {!isCollapsed && <span>Settings</span>}
              </Link>

              {/* Admin Payment Verification */}
              <Link
                href="/admin/payments"
                onClick={onMobileClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  pathname?.startsWith("/admin/payments")
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-950"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
                title={isCollapsed ? "Payment Verification" : undefined}
              >
                <CreditCard
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    pathname?.startsWith("/admin/payments")
                      ? "text-white"
                      : "text-neutral-400 group-hover:text-neutral-700"
                  }`}
                />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Payment Slips</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                      CBE/Tele
                    </span>
                  </div>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Section: Sign In / Sign Out */}
      <div className="p-3 sm:p-4 border-t border-neutral-200/80">
        {isAuthenticated ? (
          <button
            type="button"
            onClick={onSignOut}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50/80 transition-all cursor-pointer ${
              isCollapsed ? "justify-center px-2" : ""
            }`}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4 shrink-0 text-rose-500 transition-transform group-hover:-translate-x-0.5" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className={`group flex w-full items-center gap-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-3 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              isCollapsed ? "justify-center px-2" : "justify-center"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            {!isCollapsed && <span>Candidate Sign In</span>}
          </button>
        )}
      </div>

      {/* Auth Modal Trigger for Sidebar */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab="login"
        redirectUrl="/dashboard"
      />
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 bottom-0 z-30 flex-col border-r border-neutral-200/80 bg-white transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
