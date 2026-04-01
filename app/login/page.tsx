"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tighter mb-2">Log In</h1>
          <p className="text-sm text-embrace-muted">
            Access your account to book classes and manage your subscription
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-embrace-muted uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required className="eb-input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-embrace-muted uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              required className="eb-input"
            />
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-50">
            {loading ? "Signing in…" : "Log In →"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-embrace-muted">
          No account?{" "}
          <Link href="/signup" className="text-embrace-black font-medium underline underline-offset-4 hover:text-embrace-muted">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
