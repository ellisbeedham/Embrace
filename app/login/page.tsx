"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Apple } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AUTH_NEXT_COOKIE, safeInternalRedirectPath } from "@/lib/authRedirect";

function setAuthNextCookie(path: string) {
  const safe = safeInternalRedirectPath(path);
  if (!globalThis.document || !safe) return;
  document.cookie = `${AUTH_NEXT_COOKIE}=${encodeURIComponent(safe)}; path=/; max-age=600; SameSite=Lax`;
}

function LoginForm() {
  const supabase = useMemo(() => createClient(), []);
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);
  const [magicLoading, setMagicLoading] = useState(false);

  const configured = isSupabaseConfigured();
  const redirectTo = searchParams.get("redirectTo");

  useEffect(() => {
    if (redirectTo) setAuthNextCookie(redirectTo);
  }, [redirectTo]);

  async function handleGoogle() {
    if (!configured) {
      setError("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
      return;
    }
    setError(null);
    if (redirectTo) setAuthNextCookie(redirectTo);
    setOauthLoading("google");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setOauthLoading(null);
    if (err) setError(err.message);
  }

  async function handleApple() {
    if (!configured) {
      setError("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
      return;
    }
    setError(null);
    if (redirectTo) setAuthNextCookie(redirectTo);
    setOauthLoading("apple");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setOauthLoading(null);
    if (err) setError(err.message);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) {
      setError("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
      return;
    }
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email address.");
      return;
    }
    setError(null);
    if (redirectTo) setAuthNextCookie(redirectTo);
    setMagicLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setMagicLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    window.alert("Check your email for the sign-in link.");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-[calc(var(--nav-height)+2.5rem)]">
        <div className="w-full max-w-[400px]">
          <p className="text-center text-sm font-semibold tracking-[0.12em] text-gray-400">Embrace</p>

          <h1 className="mt-6 text-center text-3xl font-semibold tracking-tight text-gray-900">
            Sign in to Embrace
          </h1>

          <div className="mt-10 flex flex-col gap-3">
            <button
              type="button"
              disabled={!!oauthLoading}
              onClick={() => void handleGoogle()}
              className="flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white text-[15px] font-semibold text-gray-900 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50/80 disabled:opacity-50"
            >
              {oauthLoading === "google" ? (
                <span className="text-sm text-gray-500">Opening Google…</span>
              ) : (
                <>
                  <svg className="h-[22px] w-[22px] shrink-0" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button
              type="button"
              disabled={!!oauthLoading}
              onClick={() => void handleApple()}
              className="flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white text-[15px] font-semibold text-gray-900 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50/80 disabled:opacity-50"
            >
              {oauthLoading === "apple" ? (
                <span className="text-sm text-gray-500">Opening Apple…</span>
              ) : (
                <>
                  <Apple className="h-[22px] w-[22px] shrink-0 text-gray-900" strokeWidth={1.5} aria-hidden />
                  Continue with Apple
                </>
              )}
            </button>
          </div>

          <div className="my-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">or</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleMagicLink} className="space-y-3">
            {error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            ) : null}
            <label className="block">
              <span className="sr-only">Email</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-gray-50/80 px-5 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition-shadow focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-900/8"
              />
            </label>
            <button
              type="submit"
              disabled={magicLoading}
              className="w-full rounded-full bg-gray-900 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-92 disabled:opacity-50"
            >
              {magicLoading ? "Sending…" : "Send Magic Link"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            New here?{" "}
            <Link href="/signup" className="font-medium text-gray-900 underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <footer className="border-t border-gray-100 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 text-[13px] text-gray-500">
          <Link href="/privacy" className="transition-colors hover:text-gray-900">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-gray-900">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white pb-24 pt-[calc(var(--nav-height)+2.5rem)] text-sm text-gray-500">
      Loading sign-in…
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
