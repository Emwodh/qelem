"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectUrl = searchParams.get("redirect");
    const target = redirectUrl
      ? `/signup?redirect=${encodeURIComponent(redirectUrl)}`
      : "/signup";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-sm text-neutral-500 font-medium">
      Redirecting to candidate registration...
    </div>
  );
}

export default function AuthRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-sm text-neutral-500">
          Loading registration...
        </div>
      }
    >
      <RegisterRedirect />
    </Suspense>
  );
}
