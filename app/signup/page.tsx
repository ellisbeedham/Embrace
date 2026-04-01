"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tighter mb-2">Create Account</h1>
          <p className="text-sm text-embrace-muted">
            Join Embrace Boxing and start booking classes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="fullName" className="block text-xs font-medium text-embrace-muted uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input id="fullName" type="text" value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required className="eb-input" placeholder="Jane Doe" />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-embrace-muted uppercase tracking-widest mb-2">
              Email
            </label>
            <input id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required className="eb-input" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-embrace-muted uppercase tracking-widest mb-2">
              Password
            </label>
            <input id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              required minLength={6} className="eb-input" placeholder="Min 6 characters" />
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-50">
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-embrace-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-embrace-black font-medium underline underline-offset-4 hover:text-embrace-muted">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
