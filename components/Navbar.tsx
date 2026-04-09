"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/#shop",            label: "Shop" },
  { href: "/plans-pricing",    label: "Plans" },
  { href: "/classes",          label: "Classes" },
  { href: "/about",            label: "About" },
  { href: "/coaches",          label: "Coaches" },
  { href: "/personal-training",label: "PT" },
];

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  /* Detect hero page to use transparent-then-solid nav */
  const isHero = pathname === "/";

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHero && !scrolled && !mobileOpen;
  const textWhite   = transparent;

  return (
    <nav
      className={`site-navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? "nav-transparent" : "nav-solid"
      }`}
      style={{ height: "var(--nav-height, 48px)" }}
    >
      <div className="max-w-8xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">

        {/* ── Logo (add `/public/embrace-menu-logo.png`) ── */}
        <Link href="/" className="flex items-center shrink-0" style={{ height: "1.5rem" }}>
          <div
            className="relative h-full w-[10.5rem]"
            style={{
              filter: textWhite ? "none" : "invert(1)",
            }}
          >
            <Image
              src="/embrace-menu-logo.png"
              alt="Embrace Boxing"
              fill
              style={{ objectFit: "contain", objectPosition: "left center" }}
              priority
            />
          </div>
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium transition-colors ${
                pathname === link.href
                  ? textWhite ? "text-white/60" : "text-embrace-black/50"
                  : textWhite
                    ? "text-white hover:text-white/70"
                    : "text-embrace-black hover:text-embrace-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <Link
              href="/account"
              className={`text-[13px] font-medium px-4 py-1.5 rounded-full border transition-colors ${
                textWhite
                  ? "border-white/60 text-white hover:bg-white/10"
                  : "border-embrace-black text-embrace-black hover:bg-embrace-black hover:text-white"
              }`}
            >
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className={`text-[13px] font-medium px-4 py-1.5 rounded-full border transition-colors ${
                textWhite
                  ? "border-white/60 text-white hover:bg-white/10"
                  : "border-embrace-black text-embrace-black hover:bg-embrace-black hover:text-white"
              }`}
            >
              Sign In
            </Link>
          )}
        </div>

        {/* ── Mobile: account + burger ── */}
        <div className="md:hidden flex items-center gap-4">
          {user ? (
            <Link
              href="/account"
              className={`text-[13px] font-medium rounded-full border px-3 py-1.5 transition-colors ${
                textWhite
                  ? "border-white/60 text-white hover:bg-white/10"
                  : "border-embrace-black text-embrace-black hover:bg-embrace-black hover:text-white"
              }`}
            >
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className={`text-[13px] font-medium ${textWhite ? "text-white" : "text-embrace-black"}`}
            >
              Sign In
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className={`p-1 ${textWhite ? "text-white" : "text-embrace-black"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-embrace-border px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-embrace-black hover:text-embrace-muted"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
