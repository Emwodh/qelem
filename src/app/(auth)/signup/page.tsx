"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { ExamStream } from "@/types/user";
import { registerCandidate, loginCandidate } from "@/lib/userStore";
import {
  createClient as createBrowserSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { AuthTransitionSkeleton } from "@/components/auth/AuthTransitionSkeleton";

export default function SignupPage() {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stream, setStream] = useState<ExamStream>("natural");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPreparingWorkspace, setIsPreparingWorkspace] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const red = params.get("redirect");
      if (red) setRedirectUrl(red);
      const tab = params.get("tab");
      if (tab === "login") setActiveTab("login");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === "signup" && !name.trim()) {
      setError("Please provide your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createBrowserSupabaseClient();

        if (activeTab === "signup") {
          const { error: signUpError } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: name.trim(),
                stream,
              },
            },
          });

          if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
          }
        } else {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (signInError) {
            setError(signInError.message);
            setLoading(false);
            return;
          }
        }
      }

      if (activeTab === "signup") {
        registerCandidate({
          name: name.trim(),
          email: email.trim(),
          stream,
          grade: 12,
        });
      } else {
        loginCandidate(email.trim(), name || undefined);
      }

      setIsPreparingWorkspace(true);
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 700);
    } catch {
      setError("An unexpected authentication error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: "google" | "telegram") => {
    setError(null);
    if (provider === "google") {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createBrowserSupabaseClient();
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}${redirectUrl}`,
            },
          });
          return;
        } catch (err) {
          console.warn("Google OAuth fallback:", err);
        }
      }
      loginCandidate("google.candidate@qelem.edu.et", "Google Scholar");
      setIsPreparingWorkspace(true);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    } else {
      window.open("https://t.me/qelem_edu", "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative">
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-60" />

      <div className="relative z-10 w-full flex justify-center">
        <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-white shadow-2xl border border-neutral-200/80 grid grid-cols-1 md:grid-cols-2">
          {/* 1. Left Half: Apple-grade Obsidian & Electric Indigo Brand Canvas */}
          <div className="hidden md:flex relative flex-col justify-between p-8 lg:p-9 overflow-hidden select-none bg-[#090D16]">
            {/* Full-bleed luminous backdrop */}
            <Image
              src="/images/auth-backdrop.jpg"
              alt="Qelem Atmosphere"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90"
            />
            {/* Ambient gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#090D16]/60 via-transparent to-[#090D16]/85 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.25),transparent_60%)] pointer-events-none" />

            {/* Top: Brand Badge & Display Headline */}
            <div className="relative z-10 space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.14] text-xs font-semibold text-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span>2017 E.C. Matric Simulator</span>
              </div>
              <h2 className="text-3xl lg:text-[34px] font-black tracking-[-0.03em] text-white leading-[1.12]">
                Master Matric.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-sky-300">
                  Ace Entrance.
                </span>
              </h2>
              <p className="text-xs text-neutral-300/90 leading-relaxed max-w-[280px]">
                10+ years of verified Ethiopian entrance questions with precision diagnostic pacing.
              </p>
            </div>

            {/* Center: Apple-style Glassmorphic Exam HUD Card */}
            <div className="relative z-10 my-auto py-2">
              <div className="rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.14] p-4 shadow-2xl shadow-black/50 space-y-3">
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-300">
                    Physics • Unit 4 Sprint
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Diagnostic Ready
                  </span>
                </div>

                {/* Question Preview */}
                <p className="text-xs text-neutral-100 font-medium leading-snug">
                  A dielectric slab of constant κ is inserted into an isolated charged capacitor...
                </p>

                {/* Verified Choice Chip */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-600/35 border border-indigo-400/50 text-[11px] font-medium text-white shadow-xs">
                    <span>Stored potential energy decreases by 1/κ</span>
                    <span className="text-indigo-200 font-bold text-xs">✓ Verified</span>
                  </div>
                  <div className="flex items-center px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-[11px] text-neutral-400">
                    <span>Electric field remains unchanged</span>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
                  <span className="text-neutral-300 font-medium">Readiness Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="w-[94%] h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
                    </div>
                    <span className="font-bold text-emerald-400 font-mono">94%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Branding & Trust Strip */}
            <div className="relative z-10 pt-3 flex items-center justify-between border-t border-white/[0.12]">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-sans">
                  Qelem
                </span>
                <span className="text-[11px] font-bold text-indigo-200 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  «ቀለም»
                </span>
              </div>
              <span className="text-[11px] font-medium text-neutral-300/80">
                14,000+ candidates
              </span>
            </div>
          </div>

          {/* 2. Right Half: Interactive Tabbed Form Panel */}
          <div className="p-6 sm:p-8 lg:p-9 flex flex-col justify-between overflow-y-auto">
            {isPreparingWorkspace ? (
              <AuthTransitionSkeleton
                candidateName={name.trim() || email.split("@")[0] || "Candidate"}
                stream={stream}
              />
            ) : (
              <>
                <div>
                  <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-2xl border border-neutral-200/70 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setError(null);
                  }}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === "signup"
                      ? "bg-white text-neutral-950 shadow-xs border border-neutral-200/80"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setError(null);
                  }}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === "login"
                      ? "bg-white text-neutral-950 shadow-xs border border-neutral-200/80"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Log in
                </button>
              </div>

              {/* Social Sign-In Stack */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialAuth("google")}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 p-2.5 text-xs sm:text-sm font-semibold text-neutral-800 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth("telegram")}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 p-2.5 text-xs sm:text-sm font-semibold text-neutral-800 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <svg
                    className="h-4 w-4 shrink-0 text-[#229ED9]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                  <span>Continue with Telegram</span>
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200/80" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-neutral-400 font-medium">
                    or email
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs font-medium text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {activeTab === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Candidate Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        disabled={loading}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dawit Yohannes"
                        className="w-full rounded-xl border border-neutral-200/90 bg-neutral-50/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Academic Stream
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200/80">
                      <button
                        type="button"
                        onClick={() => setStream("natural")}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          stream === "natural"
                            ? "bg-white text-indigo-700 shadow-xs border border-indigo-500/30"
                            : "text-neutral-600 hover:text-neutral-950"
                        }`}
                      >
                        Natural Science
                      </button>
                      <button
                        type="button"
                        onClick={() => setStream("social")}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          stream === "social"
                            ? "bg-white text-indigo-700 shadow-xs border border-indigo-500/30"
                            : "text-neutral-600 hover:text-neutral-950"
                        }`}
                      >
                        Social Science
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full rounded-xl border border-neutral-200/90 bg-neutral-50/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Password
                    </label>
                    <span className="text-[10px] text-neutral-400">Min 6 characters</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={loading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-neutral-200/90 bg-neutral-50/80 pl-10 pr-10 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 h-11 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <span>
                        {activeTab === "signup"
                          ? "Create Free Account"
                          : "Sign In to Candidate Portal"}
                      </span>
                      <ArrowRight className="h-4 w-4 text-neutral-300" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-100 text-center">
              <p className="text-[11px] text-neutral-400 leading-normal">
                By continuing, you agree to Qelem&apos;s Terms of Service and Privacy Policy.
              </p>
            </div>
          </>
        )}
      </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 text-center">
        <Link
          href="/"
          className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          ← Back to Qelem homepage
        </Link>
      </div>
    </div>
  );
}
