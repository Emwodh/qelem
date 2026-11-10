import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

console.log("=== QELEM AUTH0 INTEGRATION VERIFICATION ===");

// 1. Verify environment configuration placeholders in .env.example
console.log("\n[Test 1] Checking .env.example for Auth0 configuration...");
const envExamplePath = path.resolve(".env.example");
assert(fs.existsSync(envExamplePath), ".env.example must exist");
const envExampleContent = fs.readFileSync(envExamplePath, "utf-8");

const requiredEnvVars = [
  "AUTH0_SECRET",
  "APP_BASE_URL",
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
];

for (const envVar of requiredEnvVars) {
  assert(
    envExampleContent.includes(envVar),
    `.env.example is missing required environment variable: ${envVar}`
  );
}
console.log("✓ .env.example defines all required Auth0 environment variable templates.");

// 2. Verify deleted pages are physically absent
console.log("\n[Test 2] Checking that old login and signup pages are removed...");
const deletedPaths = [
  "src/app/(auth)/login/page.tsx",
  "src/app/(auth)/signup/page.tsx",
  "src/app/(auth)/layout.tsx",
  "src/app/auth/login/page.tsx",
  "src/app/auth/register/page.tsx",
  "src/components/auth/AuthModal.tsx",
  "src/components/auth/AuthTransitionSkeleton.tsx",
];

for (const relPath of deletedPaths) {
  const fullPath = path.resolve(relPath);
  assert(
    !fs.existsSync(fullPath),
    `Deleted file should not exist in the codebase: ${relPath}`
  );
}
console.log("✓ All old login, signup, and modal files are confirmed deleted.");

// 3. Verify no broken references or dead links to deleted pages in source code
console.log("\n[Test 3] Checking for dead links or broken imports in src/...");
function scanDirectory(dir, filterExts) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanDirectory(full, filterExts));
    } else if (filterExts.some((ext) => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const srcFiles = scanDirectory(path.resolve("src"), [".ts", ".tsx", ".js", ".jsx"]);
for (const file of srcFiles) {
  if (file.endsWith("proxy.ts")) continue; // proxy handles legacy backward-compat redirects

  const content = fs.readFileSync(file, "utf-8");
  assert(
    !content.includes('href="/login"') && !content.includes("href='/login'"),
    `Found dead link href="/login" in ${file}`
  );
  assert(
    !content.includes('href="/signup"') && !content.includes("href='/signup'"),
    `Found dead link href="/signup" in ${file}`
  );
  assert(
    !content.includes("@/components/auth/AuthModal"),
    `Found broken import to AuthModal in ${file}`
  );
  assert(
    !content.includes("@/components/auth/AuthTransitionSkeleton"),
    `Found broken import to AuthTransitionSkeleton in ${file}`
  );
}
console.log("✓ No dead links href='/login', href='/signup', or broken AuthModal imports in src/.");

// 4. Test Auth0 SDK client and endpoint mounting
console.log("\n[Test 4] Testing Auth0Client and authentication endpoints...");
const auth0Client = new Auth0Client({
  domain: "example.auth0.com",
  clientId: "test_client_id",
  clientSecret: "test_client_secret",
  secret: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  appBaseUrl: "http://localhost:3000",
});

// 4a. /auth/login initiates Auth0 authentication flow
{
  const req = new Request("http://localhost:3000/auth/login");
  const res = await auth0Client.middleware(req);
  assert(
    res.status === 307 || res.status === 302,
    `Expected 307/302 redirect for /auth/login, got ${res.status}`
  );
  const location = res.headers.get("location");
  assert(location, "Location header must be present on /auth/login response");
  assert(
    location.includes("/authorize"),
    `Redirect location should target Auth0 /authorize endpoint: ${location}`
  );
  assert(
    location.includes("response_type=code"),
    `Redirect should use authorization code flow: ${location}`
  );
  console.log("✓ /auth/login initiates Auth0 authorization code flow.");
}

// 4b. /auth/login?screen_hint=signup initiates Auth0 signup flow
{
  const req = new Request("http://localhost:3000/auth/login?screen_hint=signup");
  const res = await auth0Client.middleware(req);
  assert(
    res.status === 307 || res.status === 302,
    `Expected 307/302 redirect for signup trigger, got ${res.status}`
  );
  const location = res.headers.get("location");
  assert(location, "Location header must be present on signup trigger");
  assert(
    location.includes("screen_hint=signup"),
    `Redirect location must include screen_hint=signup: ${location}`
  );
  console.log("✓ /auth/login?screen_hint=signup initiates Auth0 signup flow.");
}

// 4c. /auth/logout initiates Auth0 logout flow
{
  const req = new Request("http://localhost:3000/auth/logout");
  const res = await auth0Client.middleware(req);
  assert(
    res.status === 307 || res.status === 302,
    `Expected 307/302 redirect for logout trigger, got ${res.status}`
  );
  const location = res.headers.get("location");
  assert(location, "Location header must be present on logout trigger");
  assert(
    location.includes("/logout"),
    `Redirect location must target Auth0 logout endpoint: ${location}`
  );
  console.log("✓ /auth/logout initiates Auth0 session clearance and logout.");
}

// 4d. Normal application requests pass through
{
  const req = new Request("http://localhost:3000/dashboard");
  const res = await auth0Client.middleware(req);
  assert(
    res.status === 200,
    `Expected 200 pass-through for non-auth paths, got ${res.status}`
  );
  console.log("✓ Non-auth application routes pass through Auth0 middleware smoothly.");
}

// 5. Test RootLayout Auth0Provider wrapping
console.log("\n[Test 5] Checking RootLayout has Auth0Provider...");
const layoutContent = fs.readFileSync(path.resolve("src/app/layout.tsx"), "utf-8");
assert(
  layoutContent.includes("<Auth0Provider>"),
  "RootLayout must wrap tree with <Auth0Provider>"
);
assert(
  layoutContent.includes("from \"@auth0/nextjs-auth0/client\""),
  "RootLayout must import Auth0Provider from client SDK"
);
console.log("✓ RootLayout correctly wraps the application with Auth0Provider.");

// 6. Test Navbar and Sidebar authentication triggers
console.log("\n[Test 6] Checking navigation elements for Auth0 triggers...");
const navbarContent = fs.readFileSync(path.resolve("src/components/landing/Navbar.tsx"), "utf-8");
assert(
  navbarContent.includes('href="/auth/login"'),
  "Navbar must provide Sign In link pointing to /auth/login"
);
assert(
  navbarContent.includes('href="/auth/login?screen_hint=signup"'),
  "Navbar must provide Sign Up link pointing to /auth/login?screen_hint=signup"
);
assert(
  navbarContent.includes('href="/auth/logout"'),
  "Navbar must provide Sign Out link pointing to /auth/logout"
);

const sidebarContent = fs.readFileSync(path.resolve("src/components/dashboard/Sidebar.tsx"), "utf-8");
assert(
  sidebarContent.includes('href="/auth/login?returnTo=/dashboard"'),
  "Sidebar must provide Candidate Sign In link pointing to /auth/login"
);

const dashLayoutContent = fs.readFileSync(path.resolve("src/app/(dashboard)/layout.tsx"), "utf-8");
assert(
  dashLayoutContent.includes('href="/auth/login?returnTo=/dashboard"'),
  "Dashboard layout header must provide Sign In link pointing to /auth/login"
);
assert(
  dashLayoutContent.includes('window.location.href = "/auth/logout"'),
  "Dashboard layout sign out must redirect to /auth/logout"
);

const pricingContent = fs.readFileSync(path.resolve("src/components/landing/Pricing.tsx"), "utf-8");
assert(
  pricingContent.includes('/auth/login?screen_hint=signup'),
  "Pricing CTA must trigger Auth0 signup flow"
);
console.log("✓ All navigation elements and action triggers target Auth0 flows.");

console.log("\n=============================================");
console.log("ALL AUTH0 INTEGRATION VERIFICATION CHECKS PASSED!");
console.log("=============================================\n");
