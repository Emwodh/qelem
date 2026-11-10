"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { NAV_ITEMS } from "@/lib/landing-data";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setIsScrolled(scrollPos > 15);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Floating dual-state header with smooth transition */}
      <header
        className={`fixed top-0 inset-x-0 z-50 pointer-events-none flex flex-col items-center transition-all duration-300 ease-out ${
          isScrolled ? "pt-3 sm:pt-4" : "pt-0"
        }`}
      >
        <div
          className={`pointer-events-auto flex items-center justify-between transition-all duration-300 ease-out ${
            isScrolled
              ? "w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] max-w-5xl h-14 px-4 sm:px-6 rounded-full border border-neutral-200/90 bg-white/95 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.04)]"
              : "w-full max-w-full h-16 sm:h-20 px-6 sm:px-10 lg:px-14 xl:px-16 rounded-none border border-transparent border-b-neutral-200/80 bg-white/85 backdrop-blur-md shadow-none"
          }`}
        >
          {/* Brand Logo & Academic Bookmark Motif */}
          <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
            <div
              className={`relative flex items-center justify-center rounded-xl bg-neutral-950 text-white shadow-sm transition-all duration-300 group-hover:scale-105 ${
                isScrolled ? "h-8 w-8" : "h-9 w-9"
              }`}
            >
              <Bookmark
                className={`fill-white/20 text-white transition-transform duration-300 group-hover:-translate-y-0.5 ${
                  isScrolled ? "h-4 w-4" : "h-4.5 w-4.5"
                }`}
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-bold tracking-tight text-neutral-950 transition-all duration-300 ${
                  isScrolled ? "text-base" : "text-lg"
                }`}
              >
                Qelem
              </span>
              <span className="rounded-md bg-neutral-100 px-1.5 py-0.2 text-[10px] font-medium text-neutral-600 border border-neutral-200/80">
                ቀለም
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative px-3 py-1.5 text-xs sm:text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 rounded-full hover:bg-neutral-100/80"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1.5 inline-flex items-center rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-700 border border-neutral-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-950 px-2.5 sm:px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Dashboard
                </Link>
                <a
                  href="/auth/logout"
                  className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-800 shadow-2xs transition-all active:scale-[0.98] cursor-pointer ${
                    isScrolled
                      ? "h-9 px-4 text-xs font-semibold"
                      : "h-10 px-5 text-sm font-medium"
                  }`}
                >
                  <span>Sign Out</span>
                </a>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-950 px-2.5 sm:px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Sign In
                </a>
                <a
                  href="/auth/login?screen_hint=signup"
                  className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-neutral-950 text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98] cursor-pointer ${
                    isScrolled
                      ? "h-9 px-4 text-xs font-semibold"
                      : "h-10 px-5 text-sm font-medium"
                  }`}
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5" />
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-full p-2 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 focus:outline-none transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div
            className={`w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] max-w-5xl mt-2 border border-neutral-200/90 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl transition-all animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto md:hidden`}
          >
            <div className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 border border-neutral-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-200 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 cursor-pointer"
                  >
                    <span>Dashboard</span>
                  </Link>
                  <a
                    href="/auth/logout"
                    className="flex h-10 items-center justify-center rounded-full bg-white border border-neutral-200 px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950 transition-all shadow-sm cursor-pointer"
                  >
                    Sign Out
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/auth/login?screen_hint=signup"
                    className="flex h-10 items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Get Started Free</span>
                  </a>
                  <a
                    href="/auth/login"
                    className="flex h-10 items-center justify-center rounded-full bg-white border border-neutral-200 px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950 transition-all shadow-sm cursor-pointer"
                  >
                    Sign In
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Invisible static layout spacer so document content flow starts beneath the navbar */}
      <div className="h-16 sm:h-20 w-full pointer-events-none" aria-hidden="true" />
    </>
  );
};
