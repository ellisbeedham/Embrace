"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const uiFont = 'var(--font-inter), "Inter", ui-sans-serif, system-ui, sans-serif';

export default function ChangePasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const emailIdentity = user?.identities?.some((i) => i.provider === "email");
      if (!user || !emailIdentity) router.replace("/account");
    })();
  }, [supabase, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
    window.setTimeout(() => router.push("/account"), 1200);
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f6] px-5 pb-16 pt-[calc(var(--nav-height)+2rem)] md:px-6"
      style={{ fontFamily: uiFont }}
    >
      <div className="mx-auto w-full max-w-md border-t border-gray-200/80 pt-10">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Change password</h1>
        <p className="mt-2 text-sm text-gray-500">Choose a new password for your Embrace account.</p>

        {done ? (
          <p className="mt-8 text-sm font-medium text-gray-700">Password updated. Redirecting…</p>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-4">
            <div>
              <label htmlFor="new-password" className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none ring-gray-900/5 focus:border-gray-400 focus:ring-2"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none ring-gray-900/5 focus:border-gray-400 focus:ring-2"
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-3xl bg-gray-950 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-md transition-opacity hover:opacity-95 disabled:opacity-50"
            >
              {saving ? "Updating…" : "Update password"}
            </button>
          </form>
        )}

        <Link href="/account" className="mt-8 inline-block text-sm font-medium text-gray-500 underline-offset-4 hover:text-gray-800 hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
