import Image from "next/image";
import Link from "next/link";

/* ─── 1. HERO ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero-section relative h-screen min-h-[640px] overflow-hidden">
      <Image
        src="/hero-boxer.png"
        alt="Embrace Boxing – Train Like a Champion"
        fill
        priority
        quality={95}
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "right center" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%), linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.10) 35%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.80) 100%)",
        }}
      />
      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-8xl mx-auto px-8 lg:px-16 pb-20 md:pb-28">
          <div className="max-w-2xl">
            <h1
              className="text-white leading-none animate-fade-up"
              style={{
                fontSize: "clamp(2.6rem, 6.5vw, 5.2rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                fontFamily: "inherit",
                marginBottom: "16px",
              }}
            >
              Train Like a Champion
              <br />
              With a Champion.
            </h1>
            <p
              className="animate-fade-up animate-fade-up-delay-1"
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.95)",
                letterSpacing: "0.01em",
                lineHeight: 1.6,
                marginBottom: "40px",
                fontFamily: "inherit",
                textShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
              }}
            >
              Women&rsquo;s Only Boxing Classes&nbsp;&middot;&nbsp;London
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up animate-fade-up-delay-2">
              <Link href="/book" className="hero-primary-btn">
                Book Free Trial
              </Link>
              <Link href="/plans-pricing" className="hero-secondary-btn">
                View Plans ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 right-10 hidden md:flex items-center gap-2 text-white/40 text-[10px] tracking-[0.2em] uppercase">
        <span>Scroll</span>
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
          <rect x="1" y="1" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1"/>
          <circle cx="6" cy="5.5" r="1.5" fill="currentColor" className="animate-bounce"/>
        </svg>
      </div>

      <div className="hero-bottom-bar">
        <div className="bar-container">
          <div className="bar-stat">
            <span className="bar-val">WKA</span>
            <span className="bar-lab">World Champ</span>
          </div>
          <div className="bar-divider"></div>
          <div className="bar-stat">
            <span className="bar-val">2012</span>
            <span className="bar-lab">Olympics</span>
          </div>
          <div className="bar-divider"></div>
          <div className="bar-stat">
            <span className="bar-val">WBU</span>
            <span className="bar-lab">World Champ</span>
          </div>
          <div className="bar-divider"></div>
          <div className="bar-stat">
            <span className="bar-val">4.6★</span>
            <span className="bar-lab">Born Fighter</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 2. GODS PLAN BANNER ───────────────────────────────────── */
function AppleBanner() {
  return (
    <section id="shop" className="apple-banner-section relative">
      <div className="apple-banner-overlay" />
      <div className="apple-banner-content">
        <h2 className="apple-banner-title">Shop &ldquo;Gods Plan&rdquo;</h2>
        <p className="apple-banner-subtitle">Autumn Collection.</p>
        <Link href="https://embraceshop.co.uk/" target="_blank" rel="noopener noreferrer" className="apple-btn-primary">
          Shop Now
        </Link>
      </div>
    </section>
  );
}

/* ─── 4. WHY EMBRACE BOXING ─────────────────────────────────── */
function ApplePhilosophy() {
  return (
    <section className="apple-philosophy-section">
      <div className="philosophy-container">
        <h2 className="philosophy-manifesto">
          Leave the intimidation at the door.<br />
          <span className="manifesto-sub">Build unbreakable confidence in a sanctuary designed exclusively for women.</span>
        </h2>

        <div className="philosophy-pillars">
          <div className="pillar">
            <div className="pillar-line"></div>
            <h3>A Safe Sanctuary</h3>
            <p>Train entirely without the male gaze. Step into a welcoming, intimidation-free zone where you can focus strictly on your own growth.</p>
          </div>

          <div className="pillar">
            <div className="pillar-line"></div>
            <h3>Zero Judgment</h3>
            <p>Whether it’s your first time wrapping your hands or you’re stepping back into the ring, you belong here. Start, sweat, and thrive at your own pace.</p>
          </div>

          <div className="pillar">
            <div className="pillar-line"></div>
            <h3>True Empowerment</h3>
            <p>We teach world-class boxing, but we build real resilience. Transform your mind and body alongside a supportive sisterhood of like-minded women.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. MEET RUQSANA ───────────────────────────────────────── */
function MeetRuqsana() {
  return (
    <section className="section-pad bg-white">
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

const WEEKLY_CLASSES = [
  {
    day: "Tuesday",
    time: "7:00",
    ampm: "PM",
    title: "Women's Boxing",
    tags: [
      { label: "Boxing", className: "bg-[#E5E5EA] border-black/[0.06] text-embrace-black" },
      {
        label: "Padwork & Technique",
        className: "bg-white/70 border-black/[0.08] text-embrace-black",
      },
    ],
    location: "Lion Boxing Academy · N1 6JR",
  },
  {
    day: "Thursday",
    time: "7:00",
    ampm: "PM",
    title: "Women's Boxing",
    tags: [
      { label: "Boxing", className: "bg-[#E5E5EA] border-black/[0.06] text-embrace-black" },
      {
        label: "Conditioning",
        className: "bg-white/70 border-black/[0.08] text-embrace-black",
      },
    ],
    location: "Lion Boxing Academy · N1 6JR",
  },
  {
    day: "Saturday",
    time: "10:30",
    ampm: "AM",
    title: "Women's Boxing",
    tags: [
      { label: "Boxing", className: "bg-[#E5E5EA] border-black/[0.06] text-embrace-black" },
      {
        label: "Footwork & Drills",
        className: "bg-white/70 border-black/[0.08] text-embrace-black",
      },
    ],
    location: "KO Combat Academy · E1 4ET",
  },
  {
    day: "Sunday",
    time: "12:00",
    ampm: "PM",
    title: "Muay Thai",
    tags: [
      {
        label: "Muay Thai",
        className:
          "bg-[rgba(10,132,255,0.12)] border-[rgba(10,132,255,0.18)] text-[#007aff]",
      },
      {
        label: "Advanced / All Levels",
        className: "bg-white/70 border-black/[0.08] text-embrace-black",
      },
    ],
    location: "KO Combat Academy · E1 4ET",
  },
] as const;

function Schedule() {
  return (
    <section
      id="weekly-schedule"
      className="bg-[#F5F5F7] py-20 sm:py-28 text-embrace-black"
    >
      <div className="max-w-[980px] mx-auto px-8 lg:px-16">
        <header className="mb-9 sm:mb-10">
          <h2 className="m-0 mb-2.5 text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[#1d1d1f]">
            The Weekly Lineup.
          </h2>
          <p className="m-0 text-[17px] leading-snug font-normal tracking-tight text-[#86868b]">
            World-class training, every day of the week.
          </p>
        </header>

        <div className="flex flex-col gap-8 sm:gap-[34px]">
          {WEEKLY_CLASSES.map((session) => (
            <div key={session.day}>
              <h3 className="m-0 mb-3.5 text-[13px] font-bold tracking-[0.18em] uppercase text-[#6e6e73]">
                {session.day}
              </h3>
              <div className="bg-white border border-black/[0.08] rounded-[20px] shadow-[0_14px_30px_rgba(0,0,0,0.06)] p-5 sm:p-[22px] grid grid-cols-1 md:grid-cols-[96px_1fr_auto] gap-4 md:gap-[18px] items-center transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(0,0,0,0.10)] hover:border-black/[0.14]">
                <div className="w-full max-w-[6rem] mx-auto md:mx-0 min-h-[72px] rounded-2xl bg-[#F5F5F7] border border-black/[0.06] grid place-content-center text-center py-3 md:py-0">
                  <span className="block text-[22px] font-extrabold tracking-tight text-[#1d1d1f] leading-none">
                    {session.time}
                  </span>
                  <span className="block mt-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-[#86868b]">
                    {session.ampm}
                  </span>
                </div>
                <div className="text-center md:text-left min-w-0">
                  <h4 className="m-0 mb-2.5 text-xl font-bold tracking-tight text-[#1d1d1f]">
                    {session.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2.5">
                    {session.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className={`inline-flex items-center h-[26px] px-3 rounded-full text-xs font-semibold tracking-tight border ${tag.className}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <p className="m-0 text-sm leading-snug text-[#6e6e73]">
                    Instructor: <strong className="font-semibold text-[#1d1d1f]">Ruqsana Begum</strong>
                  </p>
                  <p className="m-0 mt-1 text-sm leading-snug text-[#86868b]">
                    {session.location}
                  </p>
                </div>
                <div className="flex md:justify-end">
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center h-11 px-[18px] rounded-full bg-[#1d1d1f] text-white text-[15px] font-semibold tracking-tight w-full md:w-auto no-underline transition-all duration-200 hover:-translate-y-px hover:opacity-[0.92]"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 8. PLANS & PRICING ────────────────────────────────────── */
function PlansPricing() {
  const plans = [
    {
      name: "Drop-in",
      price: "£18",
      period: "per class",
      features: [
        "Single class pass",
        "Any class on the timetable",
        "Perfect for trying out",
        "No commitment",
      ],
      cta: "Book a Class",
      href: "/book",
      highlight: false,
    },
    {
      name: "Monthly",
      price: "£95.99",
      period: "/month",
      features: [
        "Unlimited classes",
        "Boxing & Muay Thai",
        "1 day free trial",
        "Cancel anytime",
      ],
      cta: "Get Started",
      href: "/plans-pricing",
      highlight: true,
    },
    {
      name: "Personal Training",
      price: "From £60",
      period: "/session",
      features: [
        "1-1 with Ruqsana",
        "Tailored to your goals",
        "Flexible scheduling",
        "Book via WhatsApp",
      ],
      cta: "Contact Us",
      href: "/personal-training",
      highlight: false,
    },
  ];

  return (
    <section className="section-pad bg-white">
      <div className="max-w-8xl mx-auto px-8 lg:px-16">
        <h2 className="section-title mb-16">Plans & Pricing.</h2>
        <div className="plans-grid">
          {plans.map((p) => (
            <div key={p.name} className={`plan-card ${p.highlight ? "plan-card--highlight" : ""}`}>
              <h3 className="plan-card-title">{p.name}</h3>
              <div className="plan-card-price">
                <span>{p.price}</span>
                <span className="plan-card-period">{p.period}</span>
              </div>
              <ul className="plan-card-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link href={p.href} className="plan-card-cta">
                {p.cta}
              </Link>
            </div>
          ))}
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
      a: "Classes run at Lion Boxing Academy (Shoreditch) and KO Combat Academy (Bethnal Green). See The Schedule above for times and addresses.",
    },
  ];

  return (
    <section className="section-pad bg-[#F5F5F7]">
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
    <section className="section-pad bg-[#1D1D1F] text-white">
      <div className="max-w-xl mx-auto px-8 lg:px-16">
        <h2 className="conversion-title">
          Ready to Step into the Ring?
        </h2>
        <p className="conversion-subtitle">
          Claim Your Free Trial.
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
          <button type="submit" className="conversion-btn">
            Book Free Trial
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
      <Schedule />
      <AppleBanner />
      <ApplePhilosophy />
      <MeetRuqsana />
      <PlansPricing />
      <FAQ />
      <ConversionForm />
    </>
  );
}
