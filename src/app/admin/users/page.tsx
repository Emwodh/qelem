"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Smartphone,
  Award,
  Download,
  Plus,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  Check,
  Trash2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  X,
} from "lucide-react";
import {
  getAllCandidates,
  updateCandidateProAccess,
  resetCandidateDevices,
  registerCandidateRecord,
  CandidateItem,
} from "@/lib/userStore";
import { logAdminAction } from "@/lib/auditStore";

export default function AdminUsersPage() {
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [streamFilter, setStreamFilter] = useState<"all" | "natural" | "social">("all");
  const [gradeFilter, setGradeFilter] = useState<"all" | "9" | "10" | "11" | "12">("all");
  const [planFilter, setPlanFilter] = useState<"all" | "pro" | "free">("all");

  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [inspectCandidate, setInspectCandidate] = useState<CandidateItem | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New Candidate Form State
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("+2519");
  const [newEmail, setNewEmail] = useState("");
  const [newStream, setNewStream] = useState<"natural" | "social">("natural");
  const [newGrade, setNewGrade] = useState<9 | 10 | 11 | 12>(12);
  const [newSchool, setNewSchool] = useState("");
  const [newRegion, setNewRegion] = useState("Addis Ababa");
  const [newGrantPro, setNewGrantPro] = useState(true);

  const loadCandidates = () => {
    if (typeof window !== "undefined") {
      setCandidates(getAllCandidates());
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleTogglePro = (candidate: CandidateItem) => {
    const nextPro = !candidate.isPro;
    updateCandidateProAccess(candidate.id, nextPro, nextPro ? "MATRIC_SEASON_PASS" : "FREE");
    logAdminAction(
      nextPro ? "GRANT_PRO_ACCESS" : "REVOKE_PRO_ACCESS",
      `${nextPro ? "Granted Matric Season Pass" : "Revoked Pro access"} for ${candidate.name}`,
      candidate.id
    );
    loadCandidates();
    showNotice(
      nextPro
        ? `Activated Matric Season Pass for ${candidate.name}`
        : `Switched ${candidate.name} to Free access`
    );
  };

  const handleResetDevices = (candidate: CandidateItem) => {
    resetCandidateDevices(candidate.id);
    logAdminAction("RESET_DEVICES", `Reset active devices count for ${candidate.name}`, candidate.id);
    loadCandidates();
    showNotice(`Reset device authorization locks for ${candidate.name}`);
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created = registerCandidateRecord({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, ".")}@qelem.et`,
      stream: newStream,
      grade: newGrade,
      school: newSchool.trim() || "Secondary School",
      region: newRegion,
      isPro: newGrantPro,
      plan: newGrantPro ? "MATRIC_SEASON_PASS" : "FREE",
    });

    logAdminAction(
      "GRANT_PRO_ACCESS",
      `Manually registered candidate ${created.name} (${created.stream.toUpperCase()} Grade ${created.grade})`,
      created.id
    );

    loadCandidates();
    setIsRegisterModalOpen(false);
    setNewName("");
    setNewPhone("+2519");
    setNewEmail("");
    setNewSchool("");
    showNotice(`Successfully enrolled ${created.name} into the candidate roster.`);
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Full Name",
      "Phone",
      "Email",
      "Stream",
      "Grade",
      "Target University",
      "Target Score",
      "Diagnostic %",
      "Weakest Topic",
      "Is Pro",
      "Plan",
      "School",
      "Region",
      "Registered At",
    ];

    const rows = candidates.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      c.stream,
      c.grade,
      `"${c.targetUniversity}"`,
      c.targetScore,
      c.latestDiagnosticScore,
      `"${c.weakestTopic}"`,
      c.isPro ? "YES" : "NO",
      c.plan,
      `"${c.school || ""}"`,
      `"${c.region || ""}"`,
      c.registeredAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `qelem_candidates_roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      if (streamFilter !== "all" && c.stream !== streamFilter) return false;
      if (gradeFilter !== "all" && String(c.grade) !== gradeFilter) return false;
      if (planFilter === "pro" && !c.isPro) return false;
      if (planFilter === "free" && c.isPro) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inName = c.name.toLowerCase().includes(query);
        const inPhone = c.phone.toLowerCase().includes(query);
        const inEmail = c.email.toLowerCase().includes(query);
        const inUni = c.targetUniversity.toLowerCase().includes(query);
        const inSchool = (c.school || "").toLowerCase().includes(query);
        if (!inName && !inPhone && !inEmail && !inUni && !inSchool) return false;
      }

      return true;
    });
  }, [candidates, streamFilter, gradeFilter, planFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = candidates.length;
    const pro = candidates.filter((c) => c.isPro).length;
    const natural = candidates.filter((c) => c.stream === "natural").length;
    const social = candidates.filter((c) => c.stream === "social").length;
    return { total, pro, natural, social };
  }, [candidates]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-mono font-medium text-indigo-300">
              <Users className="h-3.5 w-3.5 text-indigo-400" />
              <span>National Candidate Roster</span>
            </span>
            <span className="text-xs text-neutral-500 font-mono">«የተማሪዎች መዝገብ»</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Candidate Roster & Access Entitlements
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Supervise enrolled Grade 9–12 students, grant manual Pro Season passes for scholarships or offline payments, and manage device authorizations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.16] text-neutral-200 px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-neutral-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Enroll Candidate</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-medium text-emerald-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Total Registered</span>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <span className="text-[11px] text-neutral-400">Enrolled nationwide</span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Pro Entitlements</span>
          <div className="text-2xl font-black text-emerald-400">{stats.pro}</div>
          <span className="text-[11px] text-neutral-400">Season & Monthly passes</span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Natural Stream</span>
          <div className="text-2xl font-black text-indigo-400">{stats.natural}</div>
          <span className="text-[11px] text-neutral-400">Physics, Math, Chem, Bio</span>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Social Stream</span>
          <div className="text-2xl font-black text-amber-400">{stats.social}</div>
          <span className="text-[11px] text-neutral-400">History, Geo, Econ, Social Math</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, phone (+251), school, university..."
            className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value as any)}
            className="rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-neutral-300 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Streams</option>
            <option value="natural">Natural Science</option>
            <option value="social">Social Science</option>
          </select>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value as any)}
            className="rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-neutral-300 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Grades</option>
            <option value="12">Grade 12</option>
            <option value="11">Grade 11</option>
            <option value="10">Grade 10</option>
            <option value="9">Grade 9</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as any)}
            className="rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-neutral-300 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Plans</option>
            <option value="pro">Pro Active Only</option>
            <option value="free">Free Candidates Only</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-mono uppercase text-neutral-400">
                <th className="py-3 px-4">Candidate & Origin</th>
                <th className="py-3 px-4">Academic Stream</th>
                <th className="py-3 px-4">Target Institution</th>
                <th className="py-3 px-4">Diagnostic Score</th>
                <th className="py-3 px-4">Entitlement Plan</th>
                <th className="py-3 px-4">Devices</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    No candidates found matching the active search or filters.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Candidate & Origin */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{c.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {c.phone} &bull; {c.email}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {c.school || "Secondary"} &bull; {c.region || "Addis Ababa"}
                      </div>
                    </td>

                    {/* Academic Stream */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                            c.stream === "natural"
                              ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                              : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                          }`}
                        >
                          {c.stream}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">G{c.grade}</span>
                      </div>
                    </td>

                    {/* Target Institution */}
                    <td className="py-3.5 px-4 max-w-[200px] truncate text-neutral-300">
                      <div className="truncate font-medium" title={c.targetUniversity}>
                        {c.targetUniversity}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        Target Score: {c.targetScore}/700
                      </div>
                    </td>

                    {/* Diagnostic Score & Weakness */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold ${
                            c.latestDiagnosticScore >= 75
                              ? "text-emerald-400"
                              : c.latestDiagnosticScore >= 50
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          {c.latestDiagnosticScore > 0 ? `${c.latestDiagnosticScore}%` : "Not Taken"}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate max-w-[150px]" title={c.weakestTopic}>
                        {c.weakestTopic}
                      </div>
                    </td>

                    {/* Plan Status */}
                    <td className="py-3.5 px-4">
                      {c.isPro ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                            PRO ACTIVE
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                          FREE TIER
                        </span>
                      )}
                    </td>

                    {/* Devices */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Smartphone className="h-3 w-3 text-neutral-400" />
                        <span className={c.activeDevicesCount >= 2 ? "text-amber-400 font-bold" : "text-neutral-400"}>
                          {c.activeDevicesCount}/2
                        </span>
                      </div>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePro(c)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                          c.isPro
                            ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/20"
                            : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/20"
                        }`}
                        title={c.isPro ? "Revoke Pro Access" : "Grant Pro Matric Season Pass"}
                      >
                        {c.isPro ? "Revoke Pro" : "Grant Pro"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResetDevices(c)}
                        className="px-2 py-1 rounded-lg text-[11px] font-semibold text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
                        title="Reset 2-Device Lock"
                      >
                        <RefreshCw className="h-3 w-3 inline" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setInspectCandidate(c)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 transition-all cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Enroll / Add Candidate Manually */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#11131B] p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Enroll Candidate Manually</h3>
                  <p className="text-xs text-neutral-400">Add an offline applicant or scholarship recipient</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Alazar Mengistu"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+2519..."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Academic Stream</label>
                  <select
                    value={newStream}
                    onChange={(e) => setNewStream(e.target.value as any)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="natural">Natural Science</option>
                    <option value="social">Social Science</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Grade Level</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value) as any)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value={12}>Grade 12 (Matric Year)</option>
                    <option value={11}>Grade 11</option>
                    <option value={10}>Grade 10</option>
                    <option value={9}>Grade 9</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">School Name</label>
                  <input
                    type="text"
                    value={newSchool}
                    onChange={(e) => setNewSchool(e.target.value)}
                    placeholder="e.g. Bole Secondary"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Region</label>
                  <input
                    type="text"
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    placeholder="e.g. Addis Ababa / Oromia"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="grantProCheck"
                  checked={newGrantPro}
                  onChange={(e) => setNewGrantPro(e.target.checked)}
                  className="rounded border-white/[0.1] bg-[#181A24] text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="grantProCheck" className="text-xs text-neutral-300 cursor-pointer">
                  Immediately grant Full Matric Season Pass (All-Access)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all cursor-pointer"
                >
                  Enroll Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inspect Candidate Details */}
      {inspectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#11131B] p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-sm">
                  {inspectCandidate.stream === "natural" ? "NAT" : "SOC"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{inspectCandidate.name}</h3>
                  <p className="text-xs text-neutral-400 font-mono">{inspectCandidate.phone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectCandidate(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#181A24] border border-white/[0.06] space-y-1">
                <span className="text-neutral-500 font-mono text-[10px] uppercase">Plan Entitlement</span>
                <div className="font-bold text-white">{inspectCandidate.plan}</div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  {inspectCandidate.isPro ? "Full Unlocked Access" : "Standard Free"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#181A24] border border-white/[0.06] space-y-1">
                <span className="text-neutral-500 font-mono text-[10px] uppercase">Target Score</span>
                <div className="font-bold text-white">{inspectCandidate.targetScore} / 700</div>
                <div className="text-[11px] text-indigo-300 truncate">
                  {inspectCandidate.targetUniversity}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#181A24] border border-white/[0.06] space-y-1">
                <span className="text-neutral-500 font-mono text-[10px] uppercase">Diagnostic Score</span>
                <div className="font-bold text-white">{inspectCandidate.latestDiagnosticScore}%</div>
                <div className="text-[11px] text-amber-300 truncate">
                  Weakness: {inspectCandidate.weakestTopic}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#181A24] border border-white/[0.06] space-y-1">
                <span className="text-neutral-500 font-mono text-[10px] uppercase">Device Guard</span>
                <div className="font-bold text-white">{inspectCandidate.activeDevicesCount} / 2 Active</div>
                <div className="text-[11px] text-neutral-400">
                  {inspectCandidate.examAttemptsCount} exam simulations
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  handleResetDevices(inspectCandidate);
                  setInspectCandidate(null);
                }}
                className="px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-neutral-300 transition-all"
              >
                Reset Devices
              </button>
              <button
                type="button"
                onClick={() => {
                  handleTogglePro(inspectCandidate);
                  setInspectCandidate(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  inspectCandidate.isPro
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {inspectCandidate.isPro ? "Revoke Pro Access" : "Upgrade to Pro Season Pass"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
