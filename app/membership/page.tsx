"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const TIERS = [
  { name: "Basic", price: "£39/mo", perks: ["2 classes / week", "Community access"] },
  { name: "Pro", price: "£79/mo", perks: ["5 classes / week", "Progress check-ins"] },
  { name: "Unlimited", price: "£95.99/mo", perks: ["Unlimited classes", "Priority booking"] },
] as const;

export default function MembershipPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      if (!isSupabaseConfigured()) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
      setLoading(false);
    }

    void loadUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (loading || !user) return;
    router.replace("/account");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] pt-[var(--nav-height)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm text-white/60">Loading…</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] pt-[var(--nav-height)] text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-32 text-center">
          <p className="text-sm text-white/60">Taking you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] pt-[var(--nav-height)] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c99c33]">Membership</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Join the Club</h1>
        <p className="mt-4 max-w-2xl text-base text-white/70">
          Train in a premium women-only environment. Choose a tier that matches your rhythm.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.name}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur-sm"
            >
              <p className="text-sm font-medium text-white/70">{tier.name}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">{tier.price}</h2>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                {tier.perks.map((perk) => (
                  <li key={perk}>• {perk}</li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-7 inline-flex rounded-full border border-[#c99c33]/70 px-4 py-2 text-sm font-medium text-[#f1d48f] transition-colors hover:bg-[#c99c33]/15"
              >
                Choose {tier.name}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
