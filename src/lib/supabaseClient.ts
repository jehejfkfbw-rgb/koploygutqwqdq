/**
 * Supabase connection layer for منصة نبراس (Nebras).
 *
 * This file follows the architecture requested for the platform: a single,
 * organized connection point that reads credentials exclusively from
 * environment variables and never throws at import time (so the app never
 * crashes with a blank error screen just because Supabase hasn't been
 * connected yet in a given environment).
 *
 * NOTE: The primary data layer that powers authentication, courses and
 * lectures in this deployment is PostgreSQL via Drizzle ORM (see `src/db`),
 * which guarantees the platform works end-to-end inside this sandbox without
 * requiring external Supabase credentials. This client is fully wired and
 * ready to use for things like file storage / realtime features as soon as
 * `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are
 * configured in the environment.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (error) {
    console.error("[supabaseClient] Failed to initialize Supabase client:", error);
    client = null;
  }
} else {
  console.warn(
    "[supabaseClient] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set. " +
      "Supabase features are disabled; the platform relies on PostgreSQL via Drizzle ORM instead.",
  );
}

export const supabase = client;

export function isSupabaseConfigured(): boolean {
  return client !== null;
}
