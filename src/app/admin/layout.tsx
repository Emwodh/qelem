import React from "react";
import { redirect } from "next/navigation";
import { createClient as createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: { id: string; email?: string } | null = null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      user = data.user;
    }
  } catch (err) {
    console.error("Error retrieving Supabase user session:", err);
  }

  if (!user) {
    redirect("/auth/login?returnTo=/admin");
  }

  // Reject client-controllable metadata (user.user_metadata.is_admin is ignored)
  // Verify server-side role check ('admin') from profiles table
  let role: string | null = null;

  try {
    const serviceClient = createServiceClient();
    const { data: profile, error: profileErr } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profileErr && profile?.role) {
      role = profile.role;
    }
  } catch (err) {
    console.error("Error checking admin profile role:", err);
  }

  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-[#090A0F] text-neutral-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-rose-500/20 bg-[#11131B] p-8 text-center space-y-4 shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <span className="text-xl font-bold">403</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Access Denied</h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Your account does not have administrative permissions. Only verified administrators may access the Qelem operations console.
          </p>
          <div className="pt-2">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all"
            >
              Return to Student Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
