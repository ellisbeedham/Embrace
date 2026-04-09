"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { ChevronRight, MapPin, Star } from "lucide-react";
import { bookClasses } from "@/app/actions/booking";
import { BookingCheckoutModal } from "@/components/BookingCheckoutModal";
import { BookingSuccessTicket } from "@/components/BookingSuccessTicket";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { isBookingDevBypass } from "@/lib/bookingDevBypass";
import {
  addCalendarDaysLondon,
  formatLongDateLondon,
  formatMonthYearLondon,
  getLondonYmd,
  getLondonWeekdaySun0,
  LONDON_TZ,
  londonCalendarDiffDays,
  londonYmdToUtcNoon,
} from "@/lib/londonCalendar";
import styles from "./classes.module.css";

const UI_FONT = 'var(--font-inter), "Inter", ui-sans-serif, system-ui, sans-serif';

type WeekEntry = {
  discipline: string;
  label: string;
  time: string;
  duration: string;
  coach: string;
  coachImage?: string;
  location: string;
};

type DayColumn = {
  name: string;
  date: Date;
  entries: WeekEntry[];
  isToday: boolean;
  londonYmd: { y: number; m: number; d: number };
};

type DisciplineCard = {
  heading: string;
  sub: string;
  image: string;
  syllabus: string[];
};

/** One booking slot (id is stable per date + entry) */
type SelectedClass = {
  id: string;
  date: Date;
  time: string;
  duration: string;
  title: string;
  coach: string;
  location: string;
  discipline: string;
};

function disciplineBadgeClass(discipline: string): string {
  const d = discipline.trim();
  if (d === "Boxing") {
    return "border border-blue-100 bg-blue-50/70 text-blue-800";
  }
  if (d === "Muay Thai" || d === "Muay Thai Padwork") {
    return "border border-rose-100 bg-rose-50/70 text-rose-800";
  }
  if (d === "Strength & Conditioning") {
    return "border border-amber-100 bg-amber-50/70 text-amber-900";
  }
  return "border border-gray-200 bg-gray-50 text-gray-800";
}

function renderClassTitle(label: string) {
  if (label !== "Strength & Conditioning") return label;
  return (
    <>
      Strength <span className="italic font-medium">&</span> Conditioning
    </>
  );
}

/** Normalize to the two valid studio locations. */
function displayLocation(raw: string): "Lion Club" | "KO Combat Academy" {
  const s = raw.trim().toLowerCase();
  if (s.includes("lion")) return "Lion Club";
  return "KO Combat Academy";
}

const DISCIPLINES: DisciplineCard[] = [
  {
    heading: "Boxing",
    sub: "The Sweet Science",
    image:
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      "Warmup (15m): Skipping & Shadowboxing",
      "Main Drill (30m): Partner Combinations",
      "Finisher (15m): Heavy Bag Burnout",
    ],
  },
  {
    heading: "Muay Thai",
    sub: "The Art of 8 Limbs",
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      "Warmup (10m): Dynamic Mobility",
      "Main Drill (30m): Clinch Work & Knees",
      "Finisher (20m): Thai Pad Conditioning",
    ],
  },
  {
    heading: "Strength & Conditioning",
    sub: "Build Unbreakable Power",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      "Warmup (10m): Joint Activation",
      "Main Drill (35m): Kettlebells & Resistance",
      "Finisher (15m): HIIT Circuits",
    ],
  },
  {
    heading: "Padwork",
    sub: "Speed, Timing & Accuracy",
    image:
      "https://images.unsplash.com/photo-1517838503506-3b561adabdb0?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      "Warmup (10m): Footwork Drills",
      "Main Drill (35m): 1-on-1 Focus Mitts",
      "Finisher (15m): Reaction Defense",
    ],
  },
  {
    heading: "Live Sparring",
    sub: "Test Your Skills (Invite Only)",
    image:
      "https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      "Warmup (15m): Coach-led Rules Review",
      "Main Drill (35m): Controlled 3-Min Rounds",
      "Finisher (10m): Feedback & Review",
    ],
  },
];

const WEEKDAY_CLASSES: Record<number, WeekEntry[]> = {
  0: [
    {
      discipline: "Muay Thai",
      label: "Muay Thai",
      time: "12:00 PM",
      duration: "60 min",
      coach: "Ruqsana Begum",
      location: "KO Combat Academy",
    },
    {
      discipline: "Strength & Conditioning",
      label: "Strength & Conditioning",
      time: "1:00 PM",
      duration: "45 min",
      coach: "Embrace Team",
      location: "Lion Club",
    },
  ],
  1: [],
  2: [
    {
      discipline: "Boxing",
      label: "Boxing",
      time: "7:00 PM",
      duration: "60 min",
      coach: "Embrace Team",
      location: "Lion Club",
    },
  ],
  3: [
    {
      discipline: "Muay Thai Padwork",
      label: "Muay Thai Padwork",
      time: "7:00 PM",
      duration: "60 min",
      coach: "Embrace Team",
      location: "KO Combat Academy",
    },
  ],
  4: [
    {
      discipline: "Boxing",
      label: "Boxing",
      time: "7:00 PM",
      duration: "60 min",
      coach: "Embrace Team",
      location: "Lion Club",
    },
  ],
  5: [],
  6: [
    {
      discipline: "Boxing",
      label: "Boxing",
      time: "10:30 AM",
      duration: "60 min",
      coach: "Embrace Team",
      location: "KO Combat Academy",
    },
  ],
};

function classId(anchor: Date, entry: WeekEntry): string {
  const { y, m, d } = getLondonYmd(anchor);
  return `${y}-${m}-${d}-${entry.time}-${entry.label}-${entry.coach}-${entry.location}`;
}

function entryToSelected(anchor: Date, entry: WeekEntry): SelectedClass {
  return {
    id: classId(anchor, entry),
    date: new Date(anchor),
    time: entry.time,
    duration: entry.duration,
    title: entry.label,
    coach: entry.coach,
    location: entry.location,
    discipline: entry.discipline,
  };
}

/** Rolling search in London dates; returns offset from UK today (0 = today). */
function findSlotByIdLondon(slotId: string): { dayIndex: number; selected: SelectedClass } | null {
  const today = getLondonYmd(new Date());
  for (let delta = -42; delta <= 42; delta++) {
    const { y, m, d } = addCalendarDaysLondon(today.y, today.m, today.d, delta);
    const anchor = londonYmdToUtcNoon(y, m, d);
    const wd = getLondonWeekdaySun0(y, m, d);
    const entries = WEEKDAY_CLASSES[wd] ?? [];
    for (const entry of entries) {
      const sel = entryToSelected(anchor, entry);
      if (sel.id === slotId) {
        const idx = londonCalendarDiffDays({ y, m, d }, today);
        return { dayIndex: idx, selected: sel };
      }
    }
  }
  return null;
}

function buildLondonWeekColumns(): DayColumn[] {
  const t = getLondonYmd(new Date());
  return Array.from({ length: 7 }, (_, idx) => {
    const { y, m, d } = addCalendarDaysLondon(t.y, t.m, t.d, idx);
    const anchor = londonYmdToUtcNoon(y, m, d);
    const wd = getLondonWeekdaySun0(y, m, d);
    const name = anchor
      .toLocaleDateString("en-GB", { weekday: "short", timeZone: LONDON_TZ })
      .toUpperCase();
    return {
      name,
      date: anchor,
      entries: WEEKDAY_CLASSES[wd] ?? [],
      isToday: idx === 0,
      londonYmd: { y, m, d },
    };
  });
}

function membershipStatusView(tier: string, credits: number, signedIn: boolean, devBypass: boolean) {
  if (!signedIn) {
    return {
      label: "GUEST PASS",
      tone: "border border-gray-200/80 bg-white/70 text-gray-700 backdrop-blur-sm",
      star: false,
    };
  }
  if (devBypass || tier === "unlimited") {
    return {
      label: "UNLIMITED ACCESS",
      tone:
        "border border-amber-200/60 bg-gradient-to-r from-[#1b1a18]/95 via-[#2a261f]/95 to-[#1b1a18]/95 text-[#f1d48f] shadow-lg shadow-black/20 backdrop-blur-sm",
      star: true,
    };
  }
  if (tier === "10-pack" || tier === "class-pack") {
    return {
      label: `${Math.max(0, credits)} CLASSES REMAINING`,
      tone: "border border-gray-200/80 bg-white/75 text-gray-800 backdrop-blur-sm",
      star: false,
    };
  }
  return {
    label: "NO ACTIVE PLAN",
    tone: "border border-gray-200/80 bg-white/70 text-gray-700 backdrop-blur-sm",
    star: false,
  };
}

function ClassesScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookParam = searchParams.get("book");

  const [openDrawer, setOpenDrawer] = useState<number | null>(null);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  /** Rebuild London "today" strip when the calendar day may have changed. */
  const [stripVersion, setStripVersion] = useState(0);
  const [fastBookingId, setFastBookingId] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<string>("none");
  const [credits, setCredits] = useState(0);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [successTicket, setSuccessTicket] = useState<{
    classItem: SelectedClass;
    scheduledAtIso: string;
    creditsRemaining?: number;
    tier: string;
  } | null>(null);
  const [checkoutClass, setCheckoutClass] = useState<SelectedClass | null>(null);

  const devBypass = useMemo(() => isBookingDevBypass(), []);

  const supabase = useMemo(() => createClient(), []);
  /** Prevents duplicate auto-book for the same URL param in one session (success only). */
  const autoBookSucceededKeys = useRef<Set<string>>(new Set());
  const autoBookInFlight = useRef(false);
  const profileChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const tick = () => setStripVersion((v) => v + 1);
    const id = window.setInterval(tick, 60_000);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const columns = useMemo<DayColumn[]>(() => buildLondonWeekColumns(), [stripVersion]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setProfileLoaded(true);
      return;
    }
    let mounted = true;

    async function syncMembershipForUser(userId: string) {
      const { data: p } = await supabase
        .from("profiles")
        .select("membership_tier, class_credits_remaining")
        .eq("id", userId)
        .maybeSingle();
      if (!mounted) return;
      setTier(p?.membership_tier ?? "none");
      setCredits(typeof p?.class_credits_remaining === "number" ? p.class_credits_remaining : 0);
      setProfileLoaded(true);
    }

    function stopProfileChannel() {
      if (!profileChannelRef.current) return;
      void supabase.removeChannel(profileChannelRef.current);
      profileChannelRef.current = null;
    }

    function startProfileChannel(userId: string) {
      stopProfileChannel();
      const channel = supabase
        .channel(`classes-profile-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${userId}`,
          },
          () => {
            void syncMembershipForUser(userId);
          }
        )
        .subscribe();
      profileChannelRef.current = channel;
    }

    async function load() {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(u);
      if (!u) {
        setTier("none");
        setCredits(0);
        setProfileLoaded(true);
        stopProfileChannel();
        return;
      }
      await syncMembershipForUser(u.id);
      startProfileChannel(u.id);
    }

    void load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;
      const u = session?.user ?? null;
      setUser(u);
      if (!u) {
        setTier("none");
        setCredits(0);
        setProfileLoaded(true);
        stopProfileChannel();
        return;
      }
      void syncMembershipForUser(u.id);
      startProfileChannel(u.id);
    });

    return () => {
      mounted = false;
      stopProfileChannel();
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!bookParam || !profileLoaded || !user) return;
    const dedupeKey = `${user.id}:${bookParam}`;
    if (autoBookSucceededKeys.current.has(dedupeKey)) return;
    if (autoBookInFlight.current) return;

    const tierOk =
      devBypass || tier === "unlimited" || (tier === "class-pack" && credits > 0);
    const found = findSlotByIdLondon(bookParam);
    if (!found) {
      setBookingNotice("That class isn’t on the schedule for visible weeks.");
      router.replace("/classes", { scroll: false });
      return;
    }
    if (found.dayIndex < 0 || found.dayIndex > 6) {
      setBookingNotice("That class isn’t in the current 7-day window (today through next 6 days).");
      if (!tierOk) {
        setCheckoutClass(found.selected);
      }
      router.replace("/classes", { scroll: false });
      return;
    }
    setSelectedDayIndex(found.dayIndex);
    if (!tierOk) {
      setCheckoutClass(found.selected);
      router.replace("/classes", { scroll: false });
      return;
    }
    const item = found.selected;
    setFastBookingId(item.id);
    autoBookInFlight.current = true;
    void (async () => {
      try {
        const result = await bookClasses([
          {
            title: item.title,
            discipline: item.discipline,
            coach: item.coach,
            date: item.date.toISOString(),
            time: item.time,
          },
        ]);
        setFastBookingId(null);
        router.replace("/classes", { scroll: false });
        if (result.success) {
          autoBookSucceededKeys.current.add(dedupeKey);
          setSuccessTicket({
            classItem: item,
            scheduledAtIso: result.scheduledAt!,
            creditsRemaining: result.creditsRemaining,
            tier: result.membershipTier ?? tier,
          });
          if ((result.membershipTier ?? tier) === "class-pack" && typeof result.creditsRemaining === "number") {
            setCredits(result.creditsRemaining);
          }
        } else {
          setBookingNotice(result.message);
        }
      } finally {
        autoBookInFlight.current = false;
      }
    })();
  }, [bookParam, profileLoaded, user, tier, credits, router, devBypass]);

  const canBookWithMembership =
    devBypass || tier === "unlimited" || (tier === "class-pack" && credits > 0);

  const handleBook = useCallback(
    async (item: SelectedClass) => {
      setBookingNotice(null);
      if (!isSupabaseConfigured()) {
        setBookingNotice("Add Supabase keys to book classes.");
        return;
      }
      if (!user) {
        const next = `/classes?book=${encodeURIComponent(item.id)}`;
        router.push(`/login?redirectTo=${encodeURIComponent(next)}`);
        return;
      }
      if (!canBookWithMembership) {
        setCheckoutClass(item);
        return;
      }

      setFastBookingId(item.id);
      const result = await bookClasses([
        {
          title: item.title,
          discipline: item.discipline,
          coach: item.coach,
          date: item.date.toISOString(),
          time: item.time,
        },
      ]);
      setFastBookingId(null);

      if (result.success) {
        setSuccessTicket({
          classItem: item,
          scheduledAtIso: result.scheduledAt!,
          creditsRemaining: result.creditsRemaining,
          tier: result.membershipTier ?? tier,
        });
        if ((result.membershipTier ?? tier) === "class-pack" && typeof result.creditsRemaining === "number") {
          setCredits(result.creditsRemaining);
        }
      } else {
        setBookingNotice(result.message);
      }
    },
    [user, tier, credits, router, canBookWithMembership]
  );

  const handleCheckoutSuccess = useCallback(
    (payload: {
      classItem: SelectedClass;
      scheduledAtIso: string;
      creditsRemaining?: number;
      tier: string;
    }) => {
      setCheckoutClass(null);
      setTier(payload.tier);
      if (payload.tier === "class-pack" && typeof payload.creditsRemaining === "number") {
        setCredits(payload.creditsRemaining);
      } else if (payload.tier === "unlimited") {
        setCredits(0);
      }
      setSuccessTicket({
        classItem: payload.classItem,
        scheduledAtIso: payload.scheduledAtIso,
        creditsRemaining: payload.creditsRemaining,
        tier: payload.tier,
      });
    },
    []
  );

  const selectedColumn = columns[selectedDayIndex] ?? columns[0];
  const statusBadge = membershipStatusView(tier, credits, !!user, devBypass);

  const creditsLine =
    successTicket?.tier === "class-pack" && typeof successTicket.creditsRemaining === "number"
      ? `This class used 1 credit. ${successTicket.creditsRemaining} remaining.`
      : null;

  return (
    <div className={styles.page} style={{ fontFamily: UI_FONT }}>
      <div className={styles.appleSchedulePage}>
        <header className="mx-auto w-full max-w-5xl px-4 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">London (UK)</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {selectedColumn ? formatMonthYearLondon(selectedColumn.date) : ""}
              </h1>
            </div>
            <div className={`shrink-0 rounded-2xl px-4 py-3 ${statusBadge.tone}`}>
              <div className="flex items-center gap-2">
                {statusBadge.star ? (
                  <Star className="h-3.5 w-3.5 fill-current text-[#f1d48f]" strokeWidth={1.8} aria-hidden />
                ) : null}
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">{statusBadge.label}</p>
              </div>
              <Link
                href="/account"
                className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.14em] text-current/75 transition-colors hover:text-current"
              >
                Manage
                <ChevronRight className="h-3 w-3" strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="mt-6 flex flex-1 gap-2 overflow-x-auto pb-2 md:gap-3">
            {columns.map((col, idx) => {
              const active = idx === selectedDayIndex;
              const dayNum = Number(
                col.date.toLocaleDateString("en-GB", { day: "numeric", timeZone: LONDON_TZ })
              );
              return (
                <button
                  key={`${col.londonYmd.y}-${col.londonYmd.m}-${col.londonYmd.d}`}
                  type="button"
                  onClick={() => setSelectedDayIndex(idx)}
                  className="flex min-w-[52px] shrink-0 flex-col items-center gap-1.5 rounded-2xl px-2 py-2 transition-colors hover:bg-gray-50"
                >
                  <span
                    className={
                      col.isToday
                        ? "text-[9px] font-bold uppercase tracking-[0.18em] text-[#b08c2e]"
                        : "text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400"
                    }
                  >
                    {col.isToday ? "Today" : col.name}
                  </span>
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full text-sm font-semibold transition-all md:h-12 md:w-12 md:text-base ${
                      col.isToday
                        ? active
                          ? "bg-gray-950 text-white shadow-lg shadow-black/25 ring-2 ring-[#c9a44a]/80 ring-offset-2 ring-offset-white"
                          : "bg-white text-gray-950 ring-2 ring-gray-900 ring-offset-2 ring-offset-[#fafafa] shadow-sm"
                        : active
                          ? "bg-black text-white shadow-sm"
                          : "border border-gray-100 bg-white text-gray-800 hover:border-gray-200"
                    }`}
                  >
                    {dayNum}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
          <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5 md:px-8">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                {selectedColumn ? formatLongDateLondon(selectedColumn.date) : "Weekly Agenda"}
              </h2>
              {bookingNotice ? (
                <p className="mt-2 text-xs font-medium text-amber-800">{bookingNotice}</p>
              ) : null}
            </div>

            {!selectedColumn || selectedColumn.entries.length === 0 ? (
              <div className="px-6 py-10 text-sm text-gray-400 md:px-8">No classes scheduled</div>
            ) : (
              selectedColumn.entries.map((entry) => {
                const item = entryToSelected(selectedColumn.date, entry);
                const loading = fastBookingId === item.id;
                const venue = displayLocation(entry.location);
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5 border-t border-gray-100 px-6 py-6 md:flex-row md:items-center md:px-8"
                  >
                    <div className="shrink-0 text-sm font-semibold tabular-nums text-gray-900 md:w-[128px]">
                      {entry.time}
                      <span className="block text-xs font-medium text-gray-500 md:mt-1">{entry.duration}</span>
                    </div>

                    <div className="shrink-0">
                      <img
                        src={
                          entry.coachImage ||
                          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop"
                        }
                        alt={entry.coach || "Coach"}
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-100"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div>
                        <p className="text-base font-semibold tracking-tight text-gray-900">
                          {renderClassTitle(entry.label)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">{entry.coach || "Embrace Team"}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${disciplineBadgeClass(entry.discipline)}`}
                        >
                          {entry.discipline}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
                          {venue}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 md:justify-end">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => void handleBook(item)}
                        className="min-w-[168px] rounded-full border border-[#1f1f22] bg-black px-7 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-md shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/35 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {loading ? "Booking…" : "Book"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </div>

        <section className={styles.appleDisciplinesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Explore Our Disciplines.</h2>
            <p className={styles.sectionSubtitle}>Find the perfect class to match your goals.</p>
          </div>

          <div className={styles.disciplinesTrack}>
            {DISCIPLINES.map((card, idx) => {
              const open = openDrawer === idx;
              return (
                <div key={card.heading} className={styles.tallCard}>
                  <div className={styles.cardImage} style={{ backgroundImage: `url('${card.image}')` }} />
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardHeading}>{card.heading}</h3>
                    <p className={styles.cardSub}>{card.sub}</p>
                    <button className={styles.appleBtnSmall} onClick={() => setOpenDrawer(open ? null : idx)}>
                      View Details
                    </button>
                  </div>
                  <div className={`${styles.cardDrawer} ${open ? styles.cardDrawerOpen : ""}`}>
                    <button className={styles.closeDrawer} onClick={() => setOpenDrawer(open ? null : idx)}>
                      ✕
                    </button>
                    <h4>Class Syllabus</h4>
                    <ul className={styles.syllabusList}>
                      {card.syllabus.map((line) => {
                        const [t, ...rest] = line.split(":");
                        return (
                          <li key={line}>
                            <strong>{t}:</strong> {rest.join(":").trim()}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {checkoutClass ? (
        <BookingCheckoutModal
          open
          classItem={checkoutClass}
          onClose={() => setCheckoutClass(null)}
          onSuccess={handleCheckoutSuccess}
        />
      ) : null}

      {successTicket ? (
        <BookingSuccessTicket
          classItem={successTicket.classItem}
          scheduledAtIso={successTicket.scheduledAtIso}
          creditsLine={creditsLine}
          onClose={() => setSuccessTicket(null)}
        />
      ) : null}
    </div>
  );
}

function ClassesScheduleFallback() {
  return (
    <div className={styles.page} style={{ fontFamily: UI_FONT }}>
      <div className={`${styles.appleSchedulePage} flex min-h-[40vh] items-center justify-center px-6 text-sm text-gray-500`}>
        Loading schedule…
      </div>
    </div>
  );
}

export default function ClassesPage() {
  return (
    <Suspense fallback={<ClassesScheduleFallback />}>
      <ClassesScheduleContent />
    </Suspense>
  );
}
