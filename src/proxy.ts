import { NextResponse, type NextRequest } from "next/server";
import { auth0, isAuth0Configured } from "@/lib/auth0";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import { assertProductionConfig } from "@/lib/envConfig";

let hasWarnedAuth0Dev = false;

export async function proxy(request: NextRequest) {
  // 0. Verify production environment integrity
  assertProductionConfig();

  const pathname = request.nextUrl.pathname;

  // 1. Delegate /auth/* routes directly to the Auth0 SDK if configured
  if (pathname.startsWith("/auth")) {
    if (!isAuth0Configured()) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            error:
              "FATAL: Auth0 authentication is not configured in production. Set AUTH0_DOMAIN, AUTH0_CLIENT_ID, and AUTH0_CLIENT_SECRET.",
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          error:
            "Auth0 is not configured in local development. Configure AUTH0_DOMAIN, AUTH0_CLIENT_ID, and AUTH0_CLIENT_SECRET in .env.local to enable live OIDC flows.",
        },
        { status: 503 }
      );
    }
    return await auth0.middleware(request);
  }

  // 2. Redirect legacy /login and /signup routes to Auth0
  if (pathname === "/login") {
    const returnTo =
      request.nextUrl.searchParams.get("redirect") ||
      request.nextUrl.searchParams.get("returnTo") ||
      "/dashboard";
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/signup") {
    const returnTo =
      request.nextUrl.searchParams.get("redirect") ||
      request.nextUrl.searchParams.get("returnTo") ||
      "/dashboard";
    const signupUrl = new URL("/auth/login", request.url);
    signupUrl.searchParams.set("screen_hint", "signup");
    signupUrl.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(signupUrl);
  }

  // 3. Process request with Auth0 middleware for session cookie management if configured
  let response = NextResponse.next({ request });
  if (isAuth0Configured()) {
    try {
      response = await auth0.middleware(request);
    } catch (err) {
      console.warn("Auth0 middleware error; passing through request:", err);
      response = NextResponse.next({ request });
    }
  } else if (process.env.NODE_ENV !== "production" && !hasWarnedAuth0Dev) {
    console.warn(
      "[Qelem Dev] Auth0 environment variables not configured in .env.local; skipping Auth0 session middleware in development."
    );
    hasWarnedAuth0Dev = true;
  }

  // 4. Admin API Route Protection
  const isProtectedAdminApi =
    pathname.startsWith("/api/admin") && pathname !== "/api/admin/verify";

  if (isProtectedAdminApi) {
    // Check timing-safe passkey or HMAC session token
    const authCheck = verifyAdminApiRequest(request);
    let isAuthorized = authCheck.authorized;

    // Secondary check: Auth0 administrator role claims if configured
    if (!isAuthorized && isAuth0Configured()) {
      try {
        const session = await auth0.getSession(request);
        const user = session?.user ?? null;
        if (
          user &&
          (user.role === "admin" ||
            user["https://qelem.et/roles"]?.includes("admin") ||
            user.user_metadata?.is_admin === true ||
            (user.email &&
              process.env.ADMIN_EMAIL &&
              user.email === process.env.ADMIN_EMAIL))
        ) {
          isAuthorized = true;
        }
      } catch {
        isAuthorized = false;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: authCheck.error || "Unauthorized: Admin privileges required" },
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
