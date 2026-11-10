"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function DevFallbackBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only display in development when Supabase is not live
    if (process.env.NODE_ENV !== "production" && !isSupabaseConfigured()) {
      const dismissed = sessionStorage.getItem("qelem_dev_banner_dismissed");
      if (!dismissed) {
        setShow(true);
      }
    }
  }, []);

  if (!show) return null;

  return (
    <aside
      aria-label="Development environment notice"
      className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-200 px-4 py-1.5 text-xs font-mono flex items-center justify-between z-50 sticky top-0 backdrop-blur-md"
    >
      <div className="flex items-center gap-2 max-w-6xl mx-auto flex-1">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          <strong className="font-semibold">Local Fallback Active:</strong> Running in development mode with local-first stores. Remote database persistence is offline.
        </span>
      </div>
      <button
        type="button"
        onClick={() => {
          setShow(false);
          sessionStorage.setItem("qelem_dev_banner_dismissed", "true");
        }}
        className="p-1 hover:bg-amber-500/20 rounded transition-colors text-amber-700 dark:text-amber-300"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
