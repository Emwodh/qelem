import { createBrowserClient } from "@supabase/ssr";

/**
 * Checks whether live Supabase credentials are configured in environment variables.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return Boolean(
    url &&
    key &&
    !url.includes("your-project-ref") &&
    !url.includes("placeholder-project") &&
    !key.includes("your-supabase-anon-key") &&
    !key.includes("dummy_anon_key")
  );
}

/**
 * Creates a singleton-safe Supabase client for Client Components.
 * Fails closed if Supabase credentials are not configured.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase credentials: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
