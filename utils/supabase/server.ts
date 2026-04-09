import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for Server Components, Server Actions, and Route Handlers.
 * Cookie patterns match @supabase/ssr guidance so sessions persist (including non-:3000 ports).
 */
export async function createClient() {
  const cookieStore = await cookies();
  const setCookie = (
    name: string,
    value: string,
    options?: Parameters<typeof cookieStore.set>[2]
  ) => cookieStore.set(name, value, options);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Parameters<typeof cookieStore.set>[2];
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              setCookie(name, value, options);
            });
          } catch {
            // setAll can be invoked from a Server Component where mutating cookies throws;
            // middleware / Route Handlers perform the refresh in those paths.
          }
        },
      },
    }
  );
}
