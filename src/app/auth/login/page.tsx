"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectUrl = searchParams.get("redirect");
    const target = redirectUrl
      ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
      : "/login";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-sm text-neutral-500 font-medium">
      Redirecting to candidate portal...
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-sm text-neutral-500">
          Loading sign-in...
        </div>
      }
    >
      <LoginRedirect />
    </Suspense>
  );
}
