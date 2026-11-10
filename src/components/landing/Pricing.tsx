"use client";

import React, { useState } from "react";
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, Rocket } from "lucide-react";
import { PRICING_PLANS } from "@/lib/landing-data";

export const Pricing: React.FC = () => {
  const handleCta = (_planId: string) => {
    window.location.href = "/auth/login?screen_hint=signup&returnTo=/dashboard";
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 relative border-t border-neutral-200/70 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-xs">
            <Zap className="h-3.5 w-3.5 text-neutral-800" />
            <span>Grades 9–12 Pricing</span>
          </div>

          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-neutral-950">
            Simple High School Plans
          </h2>

          <p className="mt-2.5 text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            One-time payment for the academic year. Built for all high school students in Grades 9–12.
          </p>
        </div>

        {/* 3-Tier Pricing Cards Grid */}
        <div className="mt-14 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isDark = plan.popular;
            const isFuture = plan.isFutureTier;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 transition-all duration-200 ${
                  isDark
                    ? "bg-neutral-950 text-white border border-neutral-800 shadow-xl lg:-translate-y-2"
                    : isFuture
                    ? "bg-gradient-to-b from-indigo-50/40 via-white to-white text-neutral-950 border-2 border-indigo-500/50 shadow-studio hover:border-indigo-600 hover:shadow-studio-md"
                    : "bg-white text-neutral-950 border border-neutral-200/80 shadow-studio"
                }`}
              >
                {/* Floating Top Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide shadow-sm ${
                        isDark
                          ? "bg-emerald-500 text-neutral-950"
                          : isFuture
                          ? "bg-indigo-600 text-white"
                          : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                      }`}
                    >
                      {isFuture ? <Rocket className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight">
                      {plan.name}
                    </h3>
                  </div>

                  <p
                    className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Price Display */}
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono tracking-tight">
                      {plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span
                        className={`text-sm line-through font-mono ${
                          isDark ? "text-neutral-500" : "text-neutral-400"
                        }`}
                      >
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs block mt-1 ${
                      isDark ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {plan.period}
                  </span>

                  {/* Core Features List */}
                  <div className="mt-7 space-y-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider block ${
                        isDark ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      What&apos;s Included:
                    </span>
                    <ul className="space-y-2.5 text-xs sm:text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <div
                            className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                              isDark
                                ? "bg-emerald-500/20 text-emerald-400"
                                : isFuture
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            }`}
                          >
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </div>
                          <span
                            className={
                              isDark ? "text-neutral-200" : "text-neutral-700"
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Future Roadmap Features Section for 1,200 ETB Tier */}
                  {plan.upcomingFeatures && plan.upcomingFeatures.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-indigo-100/90">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                          Future Features Included:
                        </span>
                      </div>
                      <ul className="space-y-2 text-xs">
                        {plan.upcomingFeatures.map((futureFeature) => (
                          <li key={futureFeature} className="flex items-start gap-2 text-neutral-800">
                            <span className="inline-flex items-center justify-center shrink-0 rounded-md bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-800 border border-indigo-200 mt-0.5">
                              SOON
                            </span>
                            <span className="leading-snug">{futureFeature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-6 border-t border-neutral-200/30">
                  <button
                    type="button"
                    onClick={() => handleCta(plan.id)}
                    className={`w-full h-11 sm:h-12 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
                      isDark
                        ? "bg-white hover:bg-neutral-100 text-neutral-950 font-semibold shadow-sm"
                        : isFuture
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm shadow-indigo-500/20"
                        : "bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Local Payment Badges */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 rounded-2xl bg-white border border-neutral-200/80 px-6 py-3.5 shadow-xs text-xs text-neutral-600">
            <span className="flex items-center gap-1.5 font-semibold text-neutral-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Ethiopian Gateways (Coming Soon):
            </span>
            <span className="font-medium text-neutral-700">Telebirr</span>
            <span className="text-neutral-300">•</span>
            <span className="font-medium text-neutral-700">CBE Birr</span>
            <span className="text-neutral-300">•</span>
            <span className="font-medium text-neutral-700">Awash Bank</span>
            <span className="text-neutral-300">•</span>
            <span className="font-medium text-neutral-700">Chapa Debit Cards</span>
          </div>
        </div>
      </div>
    </section>
  );
};
