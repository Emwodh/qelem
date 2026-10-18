"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bookmark,
  Clock,
  LogOut,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { getUserProfile, getExamCountdown } from "@/lib/userStore";
import { UserProfile } from "@/types/user";
import {
  createClient as createBrowserSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = Boolean(pathname?.startsWith("/admin"));

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const countdown = getExamCountdown();

  useEffect(() => {
    setProfile(getUserProfile());

    if (isSupabaseConfigured()) {
      const supabase = createBrowserSupabaseClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setIsAuthenticated(true);
          const metaName = user.user_metadata?.full_name;
          if (metaName) {
            setProfile((prev) => (prev ? { ...prev, name: metaName } : prev));
          }
        }
      });
    }
  }, []);

  const handleSignOut = async () => {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createBrowserSupabaseClient();
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn("Sign out notice:", err);
    } finally {
      setIsAuthenticated(false);
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white antialiased">
      {/* Collapsible Navigation Sidebar Component */}
      <Sidebar
        profile={profile}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Universal Sticky Top Header */}
        <header className="sticky top-0 z-20 flex h-14 sm:h-16 items-center justify-between border-b border-neutral-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          {/* Left: Mobile Toggle & Context */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {isAdminRoute ? (
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="font-bold text-neutral-950 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Qelem Administration</span>
                </span>
                <span className="text-neutral-300">/</span>
                <span className="font-medium text-neutral-500">Executive Console</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-900">
                  {profile?.grade === 12 ? "National Matric Prep" : "High School Prep"}
                </span>
                <span className="text-neutral-300">/</span>
                <span className="font-medium text-neutral-600 capitalize">
                  {profile?.stream || "Natural"} Science
                </span>
                <span className="text-neutral-300">/</span>
                <span className="text-neutral-500 font-mono">Grade {profile?.grade || 12}</span>
              </div>
            )}

            <div className="sm:hidden flex items-center gap-2">
              <Link href={isAdminRoute ? "/admin" : "/dashboard"} className="flex items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-white shadow-2xs">
                  {isAdminRoute ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Bookmark className="h-3.5 w-3.5 fill-white/20 text-white" />
                  )}
                </div>
                <span className="font-bold text-sm text-neutral-950">
                  {isAdminRoute ? "Admin" : "Qelem"}
                </span>
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isAdminRoute ? (
              <>
                <div className="hidden md:flex items-center gap-1.5 rounded-full bg-neutral-900 text-white px-3 py-1 text-[11px] font-mono font-bold shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ADMIN SESSION</span>
                </div>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs transition-colors"
                >
                  <Compass className="h-3.5 w-3.5 text-neutral-500" />
                  <span>Student View</span>
                </Link>
              </>
            ) : (
              <>
                {/* Countdown or Grade Status Pill */}
                <div className="hidden md:flex items-center gap-1.5 rounded-full bg-neutral-100/80 border border-neutral-200/70 px-3 py-1 text-xs font-mono font-bold text-neutral-900">
                  <Clock className="h-3.5 w-3.5 text-neutral-500" />
                  <span>{profile?.grade === 12 ? `${countdown.daysRemaining}d` : `Grade ${profile?.grade || 10}`}</span>
                </div>

                {/* Normal Right Top Account Status */}
                <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-neutral-200">
                  {/* Avatar Circle */}
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white font-bold text-xs sm:text-sm shadow-xs">
                    {profile?.name ? profile.name.trim().charAt(0).toUpperCase() : "D"}
                  </div>

                  {/* Name & Stream details */}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-neutral-950 leading-tight truncate max-w-[130px]">
                      {profile?.name || "Candidate"}
                    </span>
                    <span className="text-[10px] font-medium text-neutral-500 capitalize">
                      {profile?.stream || "Natural"} &bull; Gr. {profile?.grade || 12}
                    </span>
                  </div>

                  {/* Sign Out Button if logged in, or Sign In if guest */}
                  {isAuthenticated || profile?.isAuthenticated ? (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="ml-1 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="ml-1 inline-flex items-center rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white px-2.5 py-1 text-[11px] font-semibold transition-all shadow-xs"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Dynamic Page Stage */}
        <main className="flex-1 w-full">{children}</main>

        {/* Clean Editorial Footer */}
        <footer className="border-t border-neutral-200/80 bg-white py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900">Qelem (ቀለም)</span>
              <span>&bull;</span>
              <span>Ethiopian Matric & University Entrance Revision Platform</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              FDRE Ministry of Education Standardized National Syllabus (Grades 9–12)
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
