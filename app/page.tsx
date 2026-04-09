import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";

/* ─── THE COLLECTION (Embrace Boutique) ─────────────────────── */
function TheCollection() {
  return (
    <section
      id="collection"
      className="border-t border-[#ebe4d9] py-20 sm:py-28"
      style={{ background: "linear-gradient(135deg, #fdfcfa 0%, #f5ebe3 45%, #ede4d8 100%)" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-8 lg:grid-cols-2 lg:gap-16 lg:px-16">
        <div className="order-2 lg:order-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8b5a4a]">Embrace Boutique</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1a1410] sm:text-4xl lg:text-[2.65rem]">
            The Collection
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5c4f47] sm:text-[17px]">
            Elite performance wear designed for the modern athlete. Engineered for the ring, styled for the city.
          </p>
          <Link
            href="https://embraceshop.co.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#0d0d0e] px-8 py-3.5 text-sm font-semibold tracking-tight text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-black"
          >
            Shop the Collection
          </Link>
        </div>
        <div className="relative order-1 aspect-[3/4] w-full overflow-hidden rounded-[28px] shadow-[0_28px_70px_-20px_rgba(40,30,25,0.55)] ring-1 ring-black/[0.06] lg:order-2">
          <Image
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9d50d?auto=format&fit=crop&w=1400&q=85"
            alt="Premium women’s athletic wear — performance pieces in neutral tones"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#2a1810]/35 via-transparent to-[#f5e6d8]/25"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

/* ─── THE EMBRACE STANDARD (women-only USP) ───────────────── */
function EmbraceStandard() {
  const pillars = [
    {
      title: "Safe & Private",
      body: "A dedicated space designed exclusively for women to train without distraction.",
      icon: (
        <svg className="h-9 w-9" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M16 4L6 9v8c0 6 4 11 10 14 6-3 10-8 10-14V9l-10-5z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M12 16l3.5 3.5L21 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "World-Class Pedigree",
      body: "Learn authentic boxing technique from coaches who have reached the pinnacle of the sport.",
      icon: (
        <svg className="h-9 w-9" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M8 26l4-14 4 6 4-10 4 18M6 26h20"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Elite Community",
      body: "Join a network of like-minded women committed to strength and self-mastery.",
      icon: (
        <svg className="h-9 w-9" viewBox="0 0 32 32" fill="none" aria-hidden>
          <circle cx="11" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="21" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M5 26c1.2-3 3.8-5 6-5M27 26c-1.2-3-3.8-5-6-5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ] as const;

  return (
    <section
      className="border-t border-[#e8dfd4]/80 py-20 sm:py-28"
      style={{ background: "linear-gradient(180deg, #faf7f2 0%, #f3ece4 100%)" }}
    >
      <div className="mx-auto max-w-6xl px-8 lg:px-16">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8b7355]">
          Women-only · London
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-3xl font-semibold tracking-tight text-[#1a1410] sm:text-4xl lg:text-[2.75rem]">
          The Embrace Standard
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-3xl border border-[#e5d9cb]/90 bg-white/60 px-7 py-9 shadow-[0_20px_50px_-28px_rgba(60,40,30,0.25)] backdrop-blur-sm"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f0ddd0] to-[#dbc4b0] text-[#5c3d32]">
                {p.icon}
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-[#1a1410]">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5c534c]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 4. MEET RUQSANA ───────────────────────────────────────── */
function MeetRuqsana() {
  return (
    <section className="section-pad border-t border-[#ebe4d9]/60 bg-[#fefdfb]">
      <div className="max-w-8xl mx-auto px-8 lg:px-16">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#86868B] mb-6">
              The Founder
            </p>
            <h2 className="section-title mb-8">Meet Ruqsana Begum.</h2>
            <p className="text-[#515154] mb-5" style={{ fontSize: "1.125rem", lineHeight: 1.6 }}>
              Celebrated worldwide for achievements in Muay Thai and professional boxing.
              From IFMA gold to the WKA World Muay Thai Champion title — Ruqsana brings elite-level
              coaching to every woman who walks through the door.
            </p>
            <p className="text-[#515154] mb-10" style={{ fontSize: "1.125rem", lineHeight: 1.6 }}>
              Torchbearer for London 2012, presented to Queen Elizabeth II, and author
              of the acclaimed autobiography <em>Born Fighter</em>.
            </p>
            <Link href="/about" className="btn-outline-dark">
              Read her story →
            </Link>
          </div>
          <div className="bg-[#F5F5F7] rounded-3xl p-10 md:p-14">
            <p className="text-xl md:text-2xl font-medium tracking-tight text-[#1D1D1F] mb-8" style={{ lineHeight: 1.5 }}>
              &ldquo;I created Embrace Boxing so that every woman — regardless of
              background or faith — could find empowerment through sport.&rdquo;
            </p>
            <p className="text-sm font-medium text-[#86868B]">
              Ruqsana Begum, Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Choose your Plan.",
      detail: "Pick a 10-class pack or unlimited membership that fits your rhythm.",
    },
    {
      step: "2",
      title: "Receive your Digital Member Pass.",
      detail: "Get instant access to your private dashboard and digital entry card.",
    },
    {
      step: "3",
      title: "Book your first session on the private schedule.",
      detail: "Reserve women-only classes from the member timetable whenever you’re ready.",
    },
  ] as const;

  return (
    <section id="how-it-works" className="border-t border-[#ebe4d9]/80 bg-[#faf7f2] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-8 lg:px-16">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8b7355]">Member journey</p>
        <h2 className="mx-auto mt-4 max-w-xl text-center text-3xl font-semibold tracking-tight text-[#1a1410] sm:text-4xl">
          How it Works
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative rounded-3xl border border-[#e8dfd4] bg-white/80 p-8 shadow-[0_16px_40px_-24px_rgba(60,45,35,0.2)] backdrop-blur-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#f0ddd0] to-[#dbc4b0] text-sm font-bold text-[#5c3d32]">
                {s.step}
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#1a1410]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5c534c]">{s.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/classes"
            className="text-sm font-semibold text-[#6b5344] underline-offset-4 transition-colors hover:text-[#1a1410] hover:underline"
          >
            View full timetable →
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ─── MEMBERSHIP CLOSER (homepage) ─────────────────────────── */
function HomeMembershipPlans() {
  return (
    <section className="bg-[#0d0d0e] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-8 lg:px-16">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a88a]">
          Membership
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
          Choose your commitment.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-white/55">
          Train on your terms — a focused 10-class pass, or unlimited access for women who make the studio their
          second home.
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* The Commitment — black */}
          <article className="relative flex flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-[#141416] to-[#080809] p-8 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.9)] sm:p-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 90% 60% at 80% 0%, rgba(255,255,255,0.9) 0%, transparent 55%)",
              }}
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9ca3af]">10-class card</p>
            <h3 className="relative mt-3 text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
              The Commitment
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-white/50">
              Ten credits. Three months. Full flexibility across boxing and Muay Thai.
            </p>
            <div className="relative mt-8 flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">£140</span>
              <span className="text-sm text-white/45">one-time</span>
            </div>
            <ul className="relative mt-8 space-y-3 text-sm text-white/65">
              <li className="flex gap-2">
                <span className="text-[#c9a88a]">✓</span> 10 class credits
              </li>
              <li className="flex gap-2">
                <span className="text-[#c9a88a]">✓</span> Valid 3 months · any class on the timetable
              </li>
              <li className="flex gap-2">
                <span className="text-[#c9a88a]">✓</span> Perfect if you want structure without a subscription
              </li>
            </ul>
            <Link
              href="/plans-pricing/checkout?plan=10class"
              className="relative mt-10 inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/[0.06] py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/12"
            >
              Get the 10-class card
            </Link>
          </article>

          {/* The Lifestyle — cream & rose gold */}
          <article className="relative flex flex-col overflow-hidden rounded-[28px] border border-[#e8d5c8]/80 bg-gradient-to-br from-[#faf4ec] via-[#f3e8dc] to-[#ead8c8] p-8 shadow-[0_28px_70px_-28px_rgba(90,60,45,0.45)] sm:p-10">
            <div className="absolute right-6 top-6">
              <span className="inline-flex rounded-full border border-[#b87f62]/35 bg-[#1f1210]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f2d9c9] shadow-sm">
                Founding member
              </span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a5c48]">Unlimited elite</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1f1410] sm:text-[1.75rem]">
              The Lifestyle
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5c4a40]">
              Unlimited classes, priority energy, and the full women-only schedule — for members who train like it’s
              non-negotiable.
            </p>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="bg-gradient-to-r from-[#8b4a40] via-[#c17a5c] to-[#a8624a] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
                £95.99
              </span>
              <span className="text-sm text-[#6b5344]">/month</span>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-[#4a3d36]">
              <li className="flex gap-2">
                <span className="text-[#a8624a]">✓</span> Unlimited boxing &amp; strength sessions
              </li>
              <li className="flex gap-2">
                <span className="text-[#a8624a]">✓</span> Private, women-only training floor
              </li>
              <li className="flex gap-2">
                <span className="text-[#a8624a]">✓</span> Founding rates — lock in while spots last
              </li>
            </ul>
            <Link
              href="/plans-pricing/checkout?plan=unlimited"
              className="mt-10 inline-flex w-full items-center justify-center rounded-full py-3.5 text-sm font-semibold text-[#1f1210] transition-transform hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, #f2d9c9 0%, #e0b89a 45%, #c9957a 100%)",
                boxShadow: "0 8px 28px rgba(160, 95, 70, 0.35), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              Start with unlimited
            </Link>
          </article>
        </div>

        <p className="mt-10 text-center text-sm text-white/40">
          <Link href="/plans-pricing" className="text-[#d4b49a] underline-offset-4 hover:underline">
            View all options including free trial →
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ─── DIGITAL ENTRY PASS PREVIEW ───────────────────────────── */
function DigitalEntryPassPreview() {
  return (
    <section
      className="border-t border-[#ebe4d9] py-20 sm:py-24"
      style={{ background: "linear-gradient(180deg, #fefdfb 0%, #f7f1ea 100%)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-16">
        <div className="max-w-md text-center lg:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8b7355]">Member experience</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1a1410] sm:text-4xl">
            Your Digital Entry Pass
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5c534c]">
            Instant access to the schedule and your private member dashboard upon sign-up.
          </p>
        </div>

        <div className="relative mt-12 w-full max-w-[340px] lg:mt-0">
          <div
            className="relative w-full overflow-hidden rounded-[24px] border border-white/55 bg-[#f0e8dc]/75 pt-[62.97%] shadow-[0_24px_56px_-24px_rgba(130,90,65,0.4)] backdrop-blur-xl"
            aria-hidden
          >
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-45"
                style={{
                  background:
                    "linear-gradient(125deg, rgba(255,120,180,0.1) 0%, rgba(120,200,255,0.06) 40%, rgba(255,220,160,0.12) 100%)",
                }}
              />
              <div className="relative flex justify-between text-[9px] font-semibold uppercase tracking-[0.24em] text-[#6b5344]/80 sm:text-[10px]">
                <span>Digital Member</span>
                <span>Embrace</span>
              </div>
              <div className="relative flex flex-1 flex-col items-center justify-center py-4 text-center">
                <p className="max-w-[14rem] bg-gradient-to-br from-[#c4808a] via-[#d4a574] to-[#b8892e] bg-clip-text font-serif text-base font-semibold uppercase tracking-[0.12em] text-transparent sm:text-lg">
                  Elite Unlimited
                </p>
              </div>
              <div className="relative flex items-end justify-between gap-2">
                <p className="min-w-0 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4a3428] sm:text-[10px]">
                  Your name
                </p>
                <p className="shrink-0 text-[9px] font-semibold tabular-nums tracking-wide text-[#7a5348] sm:text-[10px]">
                  EB-482391
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 9. FAQ ────────────────────────────────────────────────── */
function FAQ() {
  const faqs = [
    {
      q: "Do I need prior boxing experience?",
      a: "No. Our classes are designed for all levels — from complete beginners to experienced boxers. Ruqsana and the team tailor every session so everyone can train at their own pace.",
    },
    {
      q: "What should I wear and bring?",
      a: "Wear comfortable gym clothes and trainers. Bring water. Boxing gloves and wraps are available to borrow for your first session.",
    },
    {
      q: "Are the classes really women-only?",
      a: "Yes. Embrace Boxing is a dedicated women-only space, creating a safe and empowering environment for everyone.",
    },
    {
      q: "Where are the classes held?",
      a: "Classes run at Lion Boxing Academy (Shoreditch) and KO Combat Academy (Bethnal Green). See the timetable on our Classes page for times and addresses.",
    },
  ];

  return (
    <section className="section-pad border-t border-[#ebe4d9]/60 bg-[#f7f2eb]">
      <div className="max-w-3xl mx-auto px-8 lg:px-16">
        <h2 className="section-title mb-12">FAQ.</h2>
        <div className="faq-list">
          {faqs.map(({ q, a }) => (
            <details key={q} className="faq-item">
              <summary className="faq-summary">
                <span>{q}</span>
                <span className="faq-icon">+</span>
              </summary>
              <div className="faq-answer">
                <p>{a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 10. FINAL CONVERSION FORM ─────────────────────────────── */
function ConversionForm() {
  return (
    <section className="section-pad border-t border-[#c9a88a]/25 bg-[#121110] text-white">
      <div className="max-w-xl mx-auto px-8 lg:px-16">
        <h2 className="conversion-title">
          Ready to train women-only, at the highest level?
        </h2>
        <p className="conversion-subtitle">
          Claim your free trial.
        </p>
        <p className="conversion-body">
          Drop your details below and we&rsquo;ll get you booked in for your first class.
        </p>

        <form className="conversion-form">
          <input
            type="text"
            placeholder="First name"
            className="conversion-input"
          />
          <input
            type="email"
            placeholder="Email address"
            className="conversion-input"
          />
          <button type="submit" className="hero-cta-rose-gold mt-2 w-full justify-center">
            Book free trial
          </button>
        </form>

        <p className="conversion-footer">
          I&rsquo;m happy for Embrace to contact me about boxing classes.
        </p>
      </div>
    </section>
  );
}

/* ─── PAGE EXPORT ───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Hero />
      <EmbraceStandard />
      <TheCollection />
      <HowItWorks />
      <HomeMembershipPlans />
      <DigitalEntryPassPreview />
      <MeetRuqsana />
      <FAQ />
      <ConversionForm />
    </>
  );
}
