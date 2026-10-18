"use client";

import React from "react";
import Link from "next/link";
import {
  Bookmark,
  ArrowRight,
  Sparkles,
  Send,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { FOOTER_LINKS } from "@/lib/landing-data";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-neutral-200/80 bg-white relative">
      {/* High-Energy Call to Action Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -translate-y-16">
        <div className="relative rounded-3xl border border-neutral-800 bg-neutral-950 p-8 sm:p-14 shadow-studio-float overflow-hidden">
          {/* Subtle architectural grid backdrop inside banner */}
          <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold text-neutral-200">
              <Sparkles className="h-3.5 w-3.5 text-neutral-300" />
              <span>Free Diagnostic Exam Included</span>
            </div>

            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white leading-[1.12]">
              Take control of your high school success.
            </h2>

            <p className="mt-3 text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Master 4 years of curriculum, practice verified past papers, and walk into exam day prepared.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/practice"
                className="w-full sm:w-auto h-11 sm:h-12 px-8 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-sm sm:text-base shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://t.me/qelem_matric_prep"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-12 px-7 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4 text-sky-400" />
                <span>Join Telegram Community</span>
              </a>
            </div>

            <div className="mt-7 flex items-center justify-center gap-6 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Immediate diagnostic report
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Directory */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-sm">
                <Bookmark className="h-4.5 w-4.5 fill-white/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-neutral-950">
                    Qelem
                  </span>
                  <span className="rounded-md bg-neutral-100 px-1.5 py-0.2 text-[10px] font-medium text-neutral-600 border border-neutral-200">
                    ቀለም
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  Ethiopian High School Learning Portal
                </span>
              </div>
            </Link>

            <p className="text-sm text-neutral-600 max-w-sm leading-relaxed">
              Dedicated learning platform for Ethiopian high school students to master Grades 9–12 and excel in exams.
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-600 pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Aligned with Ethiopian Ministry of Education Syllabus</span>
            </div>

            {/* Telegram Community Callout Card */}
            <div className="mt-4 rounded-xl bg-neutral-50 border border-neutral-200/80 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-sky-600">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">
                    Telegram Study Group
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Daily past questions & explanations
                  </div>
                </div>
              </div>
              <a
                href="https://t.me/qelem_matric_prep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
              >
                Join
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {FOOTER_LINKS.slice(0, 3).map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-neutral-600 hover:text-neutral-950 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="rounded bg-neutral-100 px-1.5 py-0.2 text-[10px] font-semibold text-neutral-700 border border-neutral-200">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-12 pt-6 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Qelem Education Platform. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="#terms" className="hover:text-neutral-900 transition-colors">
              Terms of Use
            </Link>
            <Link href="#privacy" className="hover:text-neutral-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#curriculum" className="hover:text-neutral-900 transition-colors">
              Curriculum Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
