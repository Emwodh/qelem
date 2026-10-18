import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // 1. Identify protected routes
  const isProtectedAdmin = pathname.startsWith("/admin");
  const isProtectedAdminApi =
    pathname.startsWith("/api/admin") && pathname !== "/api/admin/verify";

  // Check if any Supabase session cookies exist
  const cookies = request.cookies.getAll();
  const hasAuthCookie = cookies.some(
    (c) => c.name.startsWith("sb-") || c.name.includes("auth-token")
  );

  // If this is a public route and there are no auth cookies, pass through instantly (0ms latency)
  if (!isProtectedAdmin && !isProtectedAdminApi && !hasAuthCookie) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // If Supabase is unconfigured or placeholder, pass through gracefully
  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes("placeholder-project") ||
    supabaseKey.includes("dummy_anon_key")
  ) {
    if (isProtectedAdmin) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // 2. Safely attempt to fetch or refresh user with a strict 1.5s timeout
  let user = null;
  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // Timeout after 1.5 seconds so an unresolvable or offline Supabase instance never hangs the proxy
    const userPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase auth timeout")), 1500)
    );

    const result = (await Promise.race([userPromise, timeoutPromise])) as {
      data: { user: any };
      error?: any;
    };
    user = result?.data?.user ?? null;
  } catch {
    // If Supabase is unreachable (DNS error, offline, network failure), fail open for public pages
    user = null;
  }

  // 3. Admin Route Protection
  if (isProtectedAdmin) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isProtectedAdminApi) {
    const adminKey = request.headers.get("x-admin-key");
    const validAdminKey = process.env.ADMIN_SECRET_KEY;
    const isKeyAuthorized = Boolean(
      validAdminKey && adminKey && adminKey.trim() === validAdminKey.trim()
    );
    const isAdminUser = Boolean(
      user &&
        (user.app_metadata?.role === "admin" ||
          user.user_metadata?.is_admin === true ||
          (user.email && process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL))
    );

    if (!isAdminUser && !isKeyAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required" },
        { status: 401 }
      );
    }
  }

  return response;
}

// Next.js 16 supports both 'proxy' (new convention) and 'middleware' alias
export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|workbox-.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
