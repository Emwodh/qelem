import { Auth0Client } from "@auth0/nextjs-auth0/server";

if (!process.env.AUTH0_SECRET || process.env.AUTH0_SECRET.trim().length === 0) {
  throw new Error(
    "AUTH0_SECRET environment variable is missing or empty. Application failed closed."
  );
}

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
});

export function isAuth0Configured(): boolean {
  return Boolean(
    process.env.AUTH0_DOMAIN &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET &&
      process.env.AUTH0_SECRET
  );
}
