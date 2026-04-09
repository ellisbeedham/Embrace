import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { AUTH_NEXT_COOKIE, safeInternalRedirectPath } from "@/lib/authRedirect";

export const dynamic = "force-dynamic";

/**
 * OAuth / email-link callback: exchange `code` for a session and attach cookies to the redirect.
 */
export async function GET(request: NextRequest) {
  console.log("FULL URL RECEIVED:", request.url);
  try {
    const origin = request.nextUrl.origin;
    const searchParams = request.nextUrl.searchParams;
    const oauthError = searchParams.get("error");
    const oauthErrorDescription = searchParams.get("error_description");
    const code = searchParams.get("code");

    if (oauthError) {
      const clearMessage = oauthErrorDescription ?? oauthError;
      return NextResponse.json(
        {
          error: `OAuth provider returned an error: ${clearMessage}`,
          raw_error: oauthError,
          raw_description: oauthErrorDescription,
          full_url: request.url,
        },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        {
          error: "Missing OAuth code in callback URL.",
          hint: "Expected '?code=...' from provider redirect.",
          full_url: request.url,
        },
        { status: 400 }
      );
    }

    const rawNext = request.cookies.get(AUTH_NEXT_COOKIE)?.value;
    const nextPath = safeInternalRedirectPath(rawNext ?? null) ?? "/account";
    const response = NextResponse.redirect(`${origin}${nextPath}`);
    response.cookies.set(AUTH_NEXT_COOKIE, "", { path: "/", maxAge: 0 });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Parameters<typeof response.cookies.set>[2];
          }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.json(
        {
          error: `Session exchange failed: ${error.message}`,
          full_url: request.url,
        },
        { status: 500 }
      );
    }

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown auth callback error";
    return NextResponse.json({ error: message, full_url: request.url }, { status: 500 });
  }
}
