import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET || "7d9c6f2a4e8b1d3c5f7a9b2d4e6f8a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f",
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
});

export function isAuth0Configured(): boolean {
  return Boolean(
    process.env.AUTH0_DOMAIN &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET
  );
}
