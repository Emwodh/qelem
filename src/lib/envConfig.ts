/**
 * Production environment configuration assertions.
 * Verifies that all mandatory environment variables are present in production.
 * In development, logs a warning and allows local-first operation.
 */

let hasAssertedConfig = false;

export function assertProductionConfig(): void {
  if (hasAssertedConfig) return;

  const isProduction = process.env.NODE_ENV === "production";

  const requiredKeys = [
    { key: "AUTH0_SECRET", value: process.env.AUTH0_SECRET },
    { key: "AUTH0_DOMAIN", value: process.env.AUTH0_DOMAIN },
    { key: "AUTH0_CLIENT_ID", value: process.env.AUTH0_CLIENT_ID },
    { key: "AUTH0_CLIENT_SECRET", value: process.env.AUTH0_CLIENT_SECRET },
    { key: "APP_BASE_URL", value: process.env.APP_BASE_URL },
    { key: "ADMIN_SECRET_KEY", value: process.env.ADMIN_SECRET_KEY },
    { key: "NEXT_PUBLIC_SUPABASE_URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
  ];

  const missing = requiredKeys.filter((item) => {
    const val = item.value;
    return (
      !val ||
      val.trim().length === 0 ||
      val.includes("your-") ||
      val.includes("placeholder-project") ||
      val.includes("dummy_anon_key")
    );
  });

  if (isProduction && missing.length > 0) {
    const missingNames = missing.map((m) => m.key).join(", ");
    throw new Error(
      `[FATAL CONFIGURATION ERROR] Missing required production environment variables: [${missingNames}]. ` +
        `Qelem cannot boot in production without verified security and database credentials. ` +
        `Ensure all secrets are configured in deployment settings.`
    );
  }

  if (!isProduction && missing.length > 0) {
    const missingNames = missing.map((m) => m.key).join(", ");
    console.warn(
      `[QELEM DEV WARNING] Running in development mode with unconfigured variables: [${missingNames}]. ` +
        `Operating on local-first fallback stores.`
    );
  }

  hasAssertedConfig = true;
}
