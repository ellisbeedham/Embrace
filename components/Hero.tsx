"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollShift, setScrollShift] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) {
        setScrollShift(window.scrollY);
        return;
      }
      const rect = el.getBoundingClientRect();
      const heroBottom = rect.bottom + window.scrollY;
      const raw = window.scrollY;
      // Parallax only while hero is on screen or just leaving (bounded feel)
      const maxScroll = Math.max(heroBottom * 0.35, 400);
      const t = Math.min(Math.max(raw, 0), maxScroll);
      setScrollShift(t);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const ruqY = scrollShift * 1.1;

  return (
    <section
      ref={sectionRef}
      className="hero-section h-[100svh] min-h-[640px] overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to right, rgba(28,22,21,0.48) 0%, rgba(28,22,21,0.14) 38%, transparent 68%)",
        }}
      />
      <div className="hero-vignette z-0" aria-hidden />

      {/* Ruqsana cutout — absolute layer z-1; parallax on transform */}
      <Image
        src="/roxaa.png"
        alt="Ruqsana Begum — World Champion coach at Embrace Boxing"
        width={1024}
        height={576}
        priority
        unoptimized={true}
        className="hero-ruqsana-img"
        style={{
          willChange: "transform",
          transform: `translate3d(0, ${ruqY}px, 0)`,
        }}
      />

      {/* Copy — z-10 so type sits above cutout */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col md:pointer-events-auto">
        <div className="flex w-full flex-1 flex-col px-6 pb-16 pt-[calc(var(--nav-height)+1.25rem)] sm:px-10 md:justify-end md:pb-24 md:pl-[10%] md:pr-12 md:pt-[calc(var(--nav-height)+4rem)] lg:pr-16">
          <div className="hero-copy pointer-events-auto max-w-[550px] text-left">
            <h1 className="hero-headline animate-fade-up">
              Train like a champion
              <br />
              with a <span className="serif-italic">champion</span>.
            </h1>
            <p
              className="hero-sub-lede animate-fade-up animate-fade-up-delay-1 mb-8 max-w-md text-[15px] font-normal leading-relaxed text-[#f5ebe3]/92 md:mb-12 md:text-base"
              style={{ letterSpacing: "-0.01em" }}
            >
              London&rsquo;s premier women-only boxing and strength studio. Elite coaching in a private,
              high-performance environment.
            </p>
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center animate-fade-up animate-fade-up-delay-2">
              <Link href="/plans-pricing" className="hero-cta-join-glass">
                Join the Club
              </Link>
              <Link href="/classes" className="hero-cta-ghost">
                View Timetable →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-ticker" aria-hidden>
        <div className="hero-ticker-inner">
          <span>WKA World Champ</span>
          <span data-sep>·</span>
          <span>2012 Olympics</span>
          <span data-sep>·</span>
          <span>WBU World Champ</span>
          <span data-sep>·</span>
          <span>4.6★ Born Fighter</span>
        </div>
      </div>
    </section>
  );
}
