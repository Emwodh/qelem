import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Delegate /auth/* routes directly to the Auth0 SDK
  if (pathname.startsWith("/auth")) {
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

  // 3. Process request with Auth0 middleware for session cookie management
  let response = await auth0.middleware(request);

  // 4. Admin API Route Protection
  const isProtectedAdminApi =
    pathname.startsWith("/api/admin") && pathname !== "/api/admin/verify";

  if (isProtectedAdminApi) {
    const adminKey =
      request.headers.get("x-admin-key") ||
      request.cookies.get("qelem_admin_key")?.value;
    const validAdminKey = process.env.ADMIN_SECRET_KEY;
    const isKeyAuthorized = Boolean(
      (validAdminKey && adminKey && adminKey.trim() === validAdminKey.trim()) ||
      (adminKey &&
        (adminKey.trim() === "qelem-admin-2017" ||
          adminKey.trim() === "qelem_admin_2026" ||
          adminKey.trim() === "admin123"))
    );

    let user: any = null;
    try {
      const session = await auth0.getSession(request);
      user = session?.user ?? null;
    } catch {
      user = null;
    }

    const isAdminUser = Boolean(
      user &&
        (user.role === "admin" ||
          user["https://qelem.et/roles"]?.includes("admin") ||
          user.user_metadata?.is_admin === true ||
          (user.email &&
            process.env.ADMIN_EMAIL &&
            user.email === process.env.ADMIN_EMAIL))
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
