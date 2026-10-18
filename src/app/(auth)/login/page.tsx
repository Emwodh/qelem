"use client";

import React, { useState, useEffect } from "react";
import AuthModal from "@/components/auth/AuthModal";

export default function LoginPage() {
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const red = params.get("redirect");
      if (red) setRedirectUrl(red);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative">
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-60" />

      {/* Render the full split-screen modal in persistent open mode for direct /login route */}
      <AuthModal
        isOpen={true}
        onClose={() => {
          window.location.href = "/";
        }}
        initialTab="login"
        redirectUrl={redirectUrl}
      />
    </div>
  );
}
