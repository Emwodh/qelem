import { NextResponse, type NextRequest } from "next/server";
import { auth0, isAuth0Configured } from "@/lib/auth0";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { env } from "@/lib/env";

export async function proxy(request: NextRequest) {
  void env;
  const pathname = request.nextUrl.pathname;

  // 1. Enforce Admin Protection for /api/admin/* routes
  if (pathname.startsWith("/api/admin")) {
    const adminCheck = await verifyAdminRequest(request);
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { error: adminCheck.error || "Unauthorized: Administrator privileges required." },
        { status: adminCheck.status || 401 }
      );
    }
  }

  // 2. Enforce Admin Protection for /admin/* pages
  if (pathname.startsWith("/admin")) {
    const adminCheck = await verifyAdminRequest(request);
    if (!adminCheck.authorized) {
      if (adminCheck.status === 401) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("returnTo", pathname);
        return NextResponse.redirect(loginUrl);
      }
      return new NextResponse(
        "Forbidden: Administrator privileges required.",
        { status: 403, headers: { "Content-Type": "text/plain" } }
      );
    }
  }

  // 3. Delegate /auth/* routes directly to the Auth0 SDK if configured
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

  // 4. Redirect legacy /login and /signup routes to Auth0
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

  // 5. Process request with Auth0 middleware for session cookie management if configured
  let response = NextResponse.next({ request });
  if (isAuth0Configured()) {
    try {
      response = await auth0.middleware(request);
    } catch (err) {
      console.warn("Auth0 middleware error; passing through request:", err);
      response = NextResponse.next({ request });
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
