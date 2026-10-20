"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress: Ultra-lightweight top-edge shimmer progress bar.
 * Provides instant 0ms visual feedback on any route transition or Next.js compile step.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // When pathname or searchParams change, the new route has landed
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept internal route clicks to show instant progress bar
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Only track internal app transitions
      if (
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !href.startsWith("/api") &&
        target.target !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        // If clicking current path without search change, ignore
        const currentFull = window.location.pathname + window.location.search;
        if (href !== currentFull) {
          setIsNavigating(true);
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-1 bg-transparent overflow-hidden">
      <div className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600 animate-shimmer w-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
    </div>
  );
}

export default NavigationProgress;
