"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Target,
  School,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  getUserProfile,
  saveUserProfile,
  TARGET_UNIVERSITIES,
  DEFAULT_PROFILE,
} from "@/lib/userStore";
import { UserProfile, ExamStream } from "@/types/user";
import { GradeLevel } from "@/types/curriculum";
import {
  createClient as createBrowserSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [name, setName] = useState("");
  const [stream, setStream] = useState<ExamStream>("natural");
  const [grade, setGrade] = useState<GradeLevel>(12);
  const [targetUniversity, setTargetUniversity] = useState<string>(TARGET_UNIVERSITIES[0]);
  const [targetScore, setTargetScore] = useState<number>(585);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const current = getUserProfile();
    setProfile(current);
    setName(current.name || "");
    setStream(current.stream || "natural");
    setGrade((current.grade as GradeLevel) || 12);
    setTargetUniversity(current.targetUniversity || TARGET_UNIVERSITIES[0]);
    setTargetScore(current.targetScore || 585);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const updated = saveUserProfile({
        name: name.trim() || "Student",
        stream,
        grade,
        targetUniversity,
        targetScore,
      });
      setProfile(updated);

      if (isSupabaseConfigured()) {
        try {
          const supabase = createBrowserSupabaseClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from("profiles")
              .update({
                full_name: name.trim() || "Student",
                stream,
                grade,
                target_university: targetUniversity,
                target_score: targetScore,
                updated_at: new Date().toISOString(),
              })
              .eq("id", user.id);
          }
        } catch (dbErr) {
          console.warn("Could not sync profile settings to Supabase:", dbErr);
        }
      }

      setStatusMessage({ type: "success", text: "Settings updated successfully." });
    } catch {
      setStatusMessage({ type: "error", text: "Failed to save settings. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetHistory = () => {
    if (typeof window === "undefined") return;
    if (confirm("Are you sure you want to reset your local exam attempt history?")) {
      try {
        localStorage.removeItem("qelem_exam_attempts");
        localStorage.removeItem("qelem_active_attempt");
        setStatusMessage({ type: "success", text: "Local exam attempt history cleared." });
      } catch {
        setStatusMessage({ type: "error", text: "Failed to reset history." });
      }
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <section className="pb-6 border-b border-neutral-200/80">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
          Account &amp; Study Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Customize your target university, exam stream, and grade level.
        </p>
      </section>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
            <User className="h-4 w-4 text-neutral-600" />
            <span>Candidate Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Abebe Bikila"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-950 focus:outline-none transition-colors"
              />
            </div>

            {/* Email (read-only / display) */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile.email || "Not linked"}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-100/70 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Academic Stream & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
            {/* Stream */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Academic Stream
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStream("natural")}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    stream === "natural"
                      ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs"
                      : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  Natural Science
                </button>
                <button
                  type="button"
                  onClick={() => setStream("social")}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    stream === "social"
                      ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs"
                      : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  Social Science
                </button>
              </div>
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Current Grade
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {([9, 10, 11, 12] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      grade === g
                        ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    Gr. {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target University & Target Score */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <School className="h-3.5 w-3.5 text-neutral-500" />
                <span>Target University Faculty</span>
              </label>
              <select
                value={targetUniversity}
                onChange={(e) => setTargetUniversity(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-950 focus:outline-none transition-colors cursor-pointer"
              >
                {TARGET_UNIVERSITIES.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-neutral-500" />
                <span>Target Matric Score</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={350}
                  max={700}
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-950 focus:outline-none transition-colors"
                />
                <span className="absolute right-3 top-2.5 text-xs font-mono text-neutral-400">
                  / 700
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetHistory}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-rose-600 hover:bg-rose-50/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Local Exam History</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
