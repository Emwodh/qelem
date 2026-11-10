"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Upload,
  Lock,
  Layers,
  FileText,
  Activity,
  Sliders,
  Check,
} from "lucide-react";
import {
  getPlatformSettings,
  savePlatformSettings,
  resetPlatformSettings,
  PlatformSettings,
} from "@/lib/settingsStore";
import { getAuditLogs, logAdminAction, clearAuditLogs, AuditLogEntry } from "@/lib/auditStore";
import { getAllQuestions, saveQuestionsBulk } from "@/lib/questionStore";
import { getLocalPayments, saveLocalPayments } from "@/lib/paymentStore";
import { getAllCandidates, saveAllCandidates } from "@/lib/userStore";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(getPlatformSettings());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"finance" | "operations" | "audit" | "backup">("finance");
  const [auditFilter, setAuditFilter] = useState<string>("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSettings(getPlatformSettings());
      setAuditLogs(getAuditLogs());
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const saved = savePlatformSettings(settings);
    setSettings(saved);
    logAdminAction("UPDATE_SETTINGS", "Updated platform banking credentials and operating policies");
    setAuditLogs(getAuditLogs());

    setIsSaving(false);
    setSaveMessage("Platform settings and banking credentials updated successfully.");
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleResetSettings = () => {
    if (confirm("Reset all platform settings to default parameters?")) {
      const reset = resetPlatformSettings();
      setSettings(reset);
      logAdminAction("UPDATE_SETTINGS", "Reset platform configuration to factory defaults");
      setAuditLogs(getAuditLogs());
      setSaveMessage("Settings restored to factory defaults.");
      setTimeout(() => setSaveMessage(null), 3500);
    }
  };

  const handleClearAuditLogs = () => {
    if (confirm("Clear all audit activity logs? This action is irreversible.")) {
      clearAuditLogs();
      setAuditLogs([]);
      setSaveMessage("Audit history cleared.");
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleDownloadBackup = () => {
    const backupData = {
      version: "2.4",
      exportedAt: new Date().toISOString(),
      settings: getPlatformSettings(),
      questions: getAllQuestions(),
      payments: getLocalPayments(),
      candidates: getAllCandidates(),
      auditLogs: getAuditLogs(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qelem_platform_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    logAdminAction("RESTORE_BACKUP", "Generated and exported full platform JSON backup");
    setAuditLogs(getAuditLogs());
    setSaveMessage("Platform backup JSON file downloaded successfully.");
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.settings) savePlatformSettings(parsed.settings);
        if (parsed.payments) saveLocalPayments(parsed.payments);
        if (parsed.candidates) saveAllCandidates(parsed.candidates);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          await saveQuestionsBulk(parsed.questions);
        }

        setSettings(getPlatformSettings());
        logAdminAction("RESTORE_BACKUP", `Restored platform state from backup archive ${file.name}`);
        setAuditLogs(getAuditLogs());
        setSaveMessage("Platform data restored successfully from backup.");
        setTimeout(() => setSaveMessage(null), 4000);
      } catch (err) {
        alert("Invalid backup JSON format. Please verify the file integrity.");
      }
    };
    reader.readAsText(file);
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (auditFilter === "all") return true;
    return log.action === auditFilter;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-mono font-medium text-indigo-300">
              <Settings className="h-3.5 w-3.5 text-indigo-400" />
              <span>Platform Configuration</span>
            </span>
            <span className="text-xs text-neutral-500 font-mono">«የስርዓት ቅንብሮች»</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            System Settings, Financial Gateways & Audit
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Configure CBE and Telebirr recipient details, pricing tiers, exam hall security parameters, and review administrative activity logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-neutral-400" />
            <span>Download Backup</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-medium text-emerald-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("finance")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "finance"
              ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Banking & Pricing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("operations")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "operations"
              ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Exam Hall & Operations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "audit"
              ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Staff Audit Logs ({auditLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("backup")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "backup"
              ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Data Resilience & Backup</span>
        </button>
      </div>

      {/* Tab 1: Banking & Pricing */}
      {activeTab === "finance" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CBE Account Box */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.08]">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Commercial Bank of Ethiopia (CBE)</h3>
                  <p className="text-[11px] text-neutral-400">Presented to candidates on manual payment checkout</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">CBE Account Number</label>
                  <input
                    type="text"
                    value={settings.cbeAccountNumber}
                    onChange={(e) => setSettings({ ...settings, cbeAccountNumber: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2.5 text-xs text-white font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Account Beneficiary Name</label>
                  <input
                    type="text"
                    value={settings.cbeAccountName}
                    onChange={(e) => setSettings({ ...settings, cbeAccountName: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Branch Name</label>
                  <input
                    type="text"
                    value={settings.cbeBranch}
                    onChange={(e) => setSettings({ ...settings, cbeBranch: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Telebirr Box */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.08]">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Telebirr P2P / Merchant Payment</h3>
                  <p className="text-[11px] text-neutral-400">Ethio Telecom mobile wallet receiving account</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Telebirr Receiving Number / Shortcode</label>
                  <input
                    type="text"
                    value={settings.telebirrPhone}
                    onChange={(e) => setSettings({ ...settings, telebirrPhone: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2.5 text-xs text-white font-mono focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Merchant / Account Display Name</label>
                  <input
                    type="text"
                    value={settings.telebirrMerchantName}
                    onChange={(e) => setSettings({ ...settings, telebirrMerchantName: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Config Box */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Subscription Tier Pricing Strategy (ETB)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Full Matric Season Pass (One-Time ETB)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={settings.matricSeasonPassPriceETB}
                    onChange={(e) => setSettings({ ...settings, matricSeasonPassPriceETB: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2.5 text-xs text-white font-mono focus:border-indigo-500 outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                    ETB
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">All-access pass until 2017 E.C. national exam conclusion</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Monthly 30-Day Pass (Recurring ETB)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={settings.monthlyPassPriceETB}
                    onChange={(e) => setSettings({ ...settings, monthlyPassPriceETB: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#181A24] px-3.5 py-2.5 text-xs text-white font-mono focus:border-indigo-500 outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                    ETB
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">Short-term revision access</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetSettings}
              className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              Reset Defaults
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save Banking Configuration"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Operations & Exam Hall */}
      {activeTab === "operations" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-5">
            <h3 className="text-sm font-bold text-white">Platform Operational Policies</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#181A24] border border-white/[0.06]">
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-white">Strict Exam Room Lockdown Mode</div>
                  <div className="text-[11px] text-neutral-400">
                    Forces browser full-screen on exam start and logs tab switches as security violations.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.strictExamHallLockdown}
                  onChange={(e) => setSettings({ ...settings, strictExamHallLockdown: e.target.checked })}
                  className="rounded border-white/[0.1] bg-[#11131B] text-indigo-600 focus:ring-0 cursor-pointer h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#181A24] border border-white/[0.06]">
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-white">Platform Maintenance Window</div>
                  <div className="text-[11px] text-neutral-400">
                    Temporarily shows a maintenance announcement banner to students while exams are being ingested.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="rounded border-white/[0.1] bg-[#11131B] text-indigo-600 focus:ring-0 cursor-pointer h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#181A24] border border-white/[0.06]">
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-white">Offline PWA Unit Caching</div>
                  <div className="text-[11px] text-neutral-400">
                    Allows candidate browsers to store past exam papers offline for regions with intermittent connectivity.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowOfflineCaches}
                  onChange={(e) => setSettings({ ...settings, allowOfflineCaches: e.target.checked })}
                  className="rounded border-white/[0.1] bg-[#11131B] text-indigo-600 focus:ring-0 cursor-pointer h-4 w-4"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#181A24] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-white">AI Tutor Daily Query Limit (Free vs Pro)</div>
                  <span className="font-mono text-xs text-indigo-400">{settings.aiTutorDailyLimit} Queries/Day</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={settings.aiTutorDailyLimit}
                  onChange={(e) => setSettings({ ...settings, aiTutorDailyLimit: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>5 (Conservative)</span>
                  <span>25 (Standard)</span>
                  <span>100 (High Volume)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save Operating Policies"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Staff Audit Logs */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-[#181A24] px-3 py-1.5 text-xs text-neutral-300 focus:border-indigo-500 outline-none"
              >
                <option value="all">All Action Types</option>
                <option value="APPROVE_PAYMENT">Payment Approvals</option>
                <option value="REJECT_PAYMENT">Payment Rejections</option>
                <option value="INGEST_QUESTIONS">Question Ingestions</option>
                <option value="GRANT_PRO_ACCESS">Pro Entitlement Grants</option>
                <option value="UPDATE_SETTINGS">Settings Changes</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleClearAuditLogs}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              Clear Audit Log
            </button>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] overflow-hidden">
            <div className="divide-y divide-white/[0.06] text-xs">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  No administrative actions recorded in the selected category.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-indigo-300">
                          {log.action}
                        </span>
                        <span className="font-semibold text-white">{log.operator}</span>
                      </div>
                      <p className="text-neutral-300">{log.details}</p>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Backup & Restore */}
      {activeTab === "backup" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Backup Box */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Export Platform Archive</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Downloads an encrypted snapshot containing all verified questions, payment slips, registered candidates, and platform configuration in portable JSON.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadBackup}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all cursor-pointer"
              >
                Download Snapshot (.json)
              </button>
            </div>

            {/* Import Backup Box */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#11131B] p-6 space-y-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Restore from Archive</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Import a previously exported JSON backup to synchronize questions, audit trails, and banking settings onto this node.
                </p>
              </div>

              <label className="block w-full py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 text-xs font-semibold text-center cursor-pointer transition-all">
                <span>Select Snapshot File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
