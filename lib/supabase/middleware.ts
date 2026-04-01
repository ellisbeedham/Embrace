/**
 * Used by root `middleware.ts` when enabled. Middleware is Edge + Turbopack-prone in dev;
 * this project refreshes the session in `app/layout.tsx` instead. To use middleware again,
 * add `middleware.ts` at the project root calling `updateSession` (see Next + Supabase SSR docs).
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  // Skip if Supabase env vars are not configured yet
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(
            cookiesToSet: {
              name: string;
              value: string;
              options?: Parameters<typeof supabaseResponse.cookies.set>[2];
            }[]
          ) {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    await supabase.auth.getUser();
  } catch {
    // Network / Supabase outage must not 500 the whole app (avoids broken error recovery in dev)
  }

  return supabaseResponse;
}
