import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { StreamSelector } from "@/components/landing/StreamSelector";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Top Studio Navbar */}
      <Navbar />

      <main className="relative flex-1">
        {/* Hero Section with Floating App Canvas */}
        <Hero />

        {/* Studio-Crafted Features Grid (#features) */}
        <Features />

        {/* Stream Selector Strip with Segmented Controls (#curriculum) */}
        <StreamSelector />

        {/* How It Works 3-Step Methodology (#how-it-works) */}
        <HowItWorks />

        {/* Transparent Matric Pricing (#pricing) */}
        <Pricing />

        {/* Frequently Asked Questions (#faq) */}
        <FAQ />
      </main>

      {/* High-Energy Banner & Directory Footer */}
      <Footer />
    </div>
  );
}
