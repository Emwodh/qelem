"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Send } from "lucide-react";
import { FAQS } from "@/lib/landing-data";

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 relative border-t border-neutral-200/70 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-xs">
            <HelpCircle className="h-3.5 w-3.5 text-neutral-800" />
            <span>Got Questions?</span>
          </div>

          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-neutral-950">
            Frequently Asked Questions
          </h2>

          <p className="mt-2.5 text-base text-neutral-600 leading-relaxed">
            Common questions about high school coverage, curriculum, and access.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-12 space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-neutral-200/80 bg-[#FAFAFA] transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left font-semibold text-neutral-950 hover:text-neutral-700 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg pr-4">{faq.question}</span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white border border-neutral-200 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-neutral-100" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4 text-neutral-600" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-neutral-600 leading-relaxed border-t border-neutral-100 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Telegram Support link */}
        <div className="mt-12 rounded-2xl border border-neutral-200/80 bg-[#FAFAFA] p-6 text-center">
          <p className="text-sm text-neutral-600">
            Still have questions? Chat with our academic mentor team directly on Telegram.
          </p>
          <div className="mt-3">
            <a
              href="https://t.me/qelem_matric_prep"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-blue-600 transition-colors"
            >
              <Send className="h-4 w-4 text-sky-500" />
              <span>Join @qelem_matric_prep on Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
