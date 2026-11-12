import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Validates whether an incoming HTTP request is authorized for administrative endpoints.
 * Admin auth = Supabase session + database role check ('admin') in profiles table.
 * 
 * Rules:
 * 1. Must have valid Supabase session (from cookie or Bearer token).
 * 2. Reject client-controllable user_metadata.is_admin (admin must be server-verified).
 * 3. Query profiles.role with service role key: if profile?.role !== 'admin', fail closed (403).
 * 4. Fails closed if Supabase or environment is unconfigured.
 */
export async function verifyAdminRequest(
  request: Request | NextRequest
): Promise<{
  authorized: boolean;
  status: number;
  error?: string;
  user?: { id: string; email?: string; role?: string };
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey) {
    return {
      authorized: false,
      status: 500,
      error: "Supabase configuration missing on server (fail-closed).",
    };
  }

  // 1. Extract Bearer token or cookies
  let user: { id: string; email?: string } | null = null;

  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      // Service role key passed directly by trusted internal backend / CLI
      if (serviceKey && token === serviceKey) {
        return {
          authorized: true,
          status: 200,
          user: { id: "service_role", role: "admin" },
        };
      }

      // Verify JWT with Supabase
      const authClient = createServerClient(supabaseUrl, anonKey, {
        cookies: { getAll: () => [], setAll: () => {} },
      });
      const { data, error } = await authClient.auth.getUser(token);
      if (!error && data?.user) {
        user = data.user;
      }
    }

    // If no bearer user, check cookies
    if (!user) {
      let cookiesList: { name: string; value: string }[] = [];
      if ("cookies" in request && typeof (request as NextRequest).cookies?.getAll === "function") {
        cookiesList = (request as NextRequest).cookies.getAll();
      } else {
        const cookieHeader = request.headers.get("cookie") || "";
        cookiesList = cookieHeader
          .split(";")
          .filter(Boolean)
          .map((c) => {
            const [name, ...val] = c.trim().split("=");
            return { name, value: val.join("=") };
          });
      }

      const cookieClient = createServerClient(supabaseUrl, anonKey, {
        cookies: {
          getAll: () => cookiesList,
          setAll: () => {},
        },
      });

      const { data, error } = await cookieClient.auth.getUser();
      if (!error && data?.user) {
        user = data.user;
      }
    }
  } catch {
    return {
      authorized: false,
      status: 401,
      error: "Failed to verify session token.",
    };
  }

  if (!user) {
    return {
      authorized: false,
      status: 401,
      error: "Unauthorized: Active Supabase session required.",
    };
  }

  // Reject user.user_metadata.is_admin! Client metadata is untrusted.
  // Query server database profiles table for role
  try {
    const queryClient = createServerClient(supabaseUrl, serviceKey || anonKey, {
      cookies: { getAll: () => [], setAll: () => {} },
    });

    const { data: profile, error: profileErr } = await queryClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileErr || !profile || profile.role !== "admin") {
      return {
        authorized: false,
        status: 403,
        error: "Forbidden: Administrator role required. Account is not an administrator.",
      };
    }

    return {
      authorized: true,
      status: 200,
      user: { id: user.id, email: user.email, role: profile.role },
    };
  } catch {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Server role verification failed (fail closed).",
    };
  }
}

// Alias for backwards compatibility
export const verifyAdminApiRequest = verifyAdminRequest;
