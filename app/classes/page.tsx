"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { bookClasses } from "@/app/actions/booking";
import { BookingModal } from "@/components/BookingModal";
import { MembershipStatus } from "@/components/MembershipStatus";
import styles from "./classes.module.css";

const UI_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Uniform day-column card height: fits two class rows without scrolling */
const DAY_BOX_H = "h-[400px]";

type WeekEntry = {
  discipline: string;
  label: string;
  time: string;
  coach: string;
  location: string;
};

type DayColumn = {
  name: string;
  date: Date;
  entries: WeekEntry[];
};

type DisciplineCard = {
  heading: string;
  sub: string;
  image: string;
  syllabus: string[];
};

/** One selected booking slot (id is stable per date + entry) */
type SelectedClass = {
  id: string;
  date: Date;
  time: string;
  title: string;
  coach: string;
  location: string;
  discipline: string;
};

function disciplineBadgeClass(discipline: string): string {
  const d = discipline.trim();
  if (d === "Boxing") {
    return "bg-blue-50 text-blue-700 border-blue-100/50";
  }
  if (d === "Muay Thai" || d === "Muay Thai Padwork") {
    return "bg-red-50 text-red-700 border-red-100/50";
  }
  if (d === "Strength and Cond.") {
    return "bg-orange-50 text-orange-700 border-orange-100/50";
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function shortWeekLabel(start: Date): string {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const aMon = start.toLocaleString("en-GB", { month: "short" });
  const bMon = end.toLocaleString("en-GB", { month: "short" });
  const year = end.getFullYear();
  return `${aMon} ${start.getDate()} – ${bMon} ${end.getDate()}, ${year}`;
}

function coachLocationSummary(c: SelectedClass): string {
  const parts = [c.coach.trim(), c.location.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "—";
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
    heading: "Strength & Cond.",
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

/** getDay(): 0 Sun … 6 Sat — mapped to rolling week from Today */
const WEEKDAY_CLASSES: Record<number, WeekEntry[]> = {
  0: [
    {
      discipline: "Muay Thai",
      label: "Muay Thai",
      time: "12:00 PM",
      coach: "Ruqsana Begum",
      location: "Embrace",
    },
    {
      discipline: "Strength and Cond.",
      label: "Strength and Cond.",
      time: "1:00 PM",
      coach: "Embrace Team",
      location: "",
    },
  ],
  1: [],
  2: [
    {
      discipline: "Boxing",
      label: "Boxing",
      time: "7:00 PM",
      coach: "Embrace Team",
      location: "Lion",
    },
  ],
  3: [
    {
      discipline: "Muay Thai Padwork",
      label: "Muay Thai Padwork",
      time: "7:00 PM",
      coach: "Embrace Team",
      location: "",
    },
  ],
  4: [
    {
      discipline: "Boxing",
      label: "Boxing",
      time: "7:00 PM",
      coach: "Embrace Team",
      location: "Lion",
    },
  ],
  5: [],
  6: [
    {
      discipline: "Boxing",
      label: "Boxing",
      time: "10:30 AM",
      coach: "Embrace Team",
      location: "KO",
    },
  ],
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function classId(date: Date, entry: WeekEntry): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${entry.time}-${entry.label}-${entry.coach}-${entry.location}`;
}

function entryToSelected(colDate: Date, entry: WeekEntry): SelectedClass {
  return {
    id: classId(colDate, entry),
    date: new Date(colDate),
    time: entry.time,
    title: entry.label,
    coach: entry.coach,
    location: entry.location,
    discipline: entry.discipline,
  };
}

export default function ClassesPage() {
  const now = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  });
  const [openDrawer, setOpenDrawer] = useState<number | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<SelectedClass[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = useMemo<DayColumn[]>(() => {
    return Array.from({ length: 7 }, (_, idx) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + idx);
      const name = date
        .toLocaleDateString("en-GB", { weekday: "short" })
        .toUpperCase();
      return {
        name,
        date,
        entries: WEEKDAY_CLASSES[date.getDay()] ?? [],
      };
    });
  }, [weekStart]);

  const columnHasSelectedClass = (colDate: Date) =>
    selectedClasses.some((c) => isSameDay(c.date, colDate));

  const toggleSelectedClass = (item: SelectedClass) => {
    setSelectedClasses((prev) => {
      const exists = prev.some((s) => s.id === item.id);
      if (exists) return prev.filter((s) => s.id !== item.id);
      return [...prev, item];
    });
  };

  useEffect(() => {
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const entries = WEEKDAY_CLASSES[date.getDay()];
      if (entries && entries.length > 0) {
        const entry = entries[0];
        setSelectedClasses([entryToSelected(date, entry)]);
        break;
      }
    }
  }, [now]);

  const goPrev = () => {
    const x = new Date(weekStart);
    x.setDate(weekStart.getDate() - 7);
    setWeekStart(x);
  };

  const goNext = () => {
    const x = new Date(weekStart);
    x.setDate(weekStart.getDate() + 7);
    setWeekStart(x);
  };

  const handleBookingConfirm = useCallback(async () => {
    const payload = selectedClasses.map((c) => ({
      ...c,
      date: c.date.toISOString(),
    }));
    const result = await bookClasses(payload);
    if (result.success) {
      setSelectedClasses([]);
      setIsModalOpen(false);
      window.alert(result.message);
    }
  }, [selectedClasses]);

  return (
    <div className={styles.page} style={{ fontFamily: UI_FONT }}>
      {/* Use div, not <main> — root layout already provides a single <main> landmark */}
      <div className={styles.appleSchedulePage}>
        <header className={styles.scheduleHeaderCentered}>
          <h1 className={styles.pageTitle}>Class Schedule</h1>

          <div className={styles.scheduleControls}>
            <button className={styles.navArrowHuge} aria-label="Previous Week" onClick={goPrev}>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className={styles.currentWeekDisplay}>
              <span className={styles.weekLabel}>
                {isSameDay(weekStart, now) ? "Next 7 Days" : "Upcoming"}
              </span>
              <span className={styles.weekDates}>{shortWeekLabel(weekStart)}</span>
            </div>

            <button className={styles.navArrowHuge} aria-label="Next Week" onClick={goNext}>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
          <div className={styles.weeklyGrid}>
            {columns.map((col) => {
              const hasSelection = columnHasSelectedClass(col.date);
              return (
                <div
                  key={`${col.name}-${col.date.getFullYear()}-${col.date.getMonth()}-${col.date.getDate()}`}
                  className={`${styles.dayCol} ${hasSelection ? "!bg-[#E5EFFF] rounded-[2rem] !p-3" : ""}`}
                >
                  <div className={styles.dayHeader}>
                    <span className={styles.dayName}>{col.name}</span>
                    <span className={styles.dayNum}>{col.date.getDate()}</span>
                  </div>
                  <div className={`${styles.cardStack} gap-4`}>
                    {col.entries.length === 0 ? (
                      <div
                        className={`flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-4 ${DAY_BOX_H}`}
                      >
                        <span className="text-center text-xs font-medium text-gray-400">No classes scheduled</span>
                      </div>
                    ) : (
                      <div
                        className={`flex w-full min-h-0 flex-col justify-start overflow-hidden ${DAY_BOX_H}`}
                      >
                        {/* Passive shell — only segment <button>s are interactive; no inner scroll */}
                        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
                          <div className="flex min-h-0 flex-1 flex-col justify-start overflow-hidden">
                            <div className="flex min-w-0 shrink-0 flex-col divide-y divide-gray-100">
                              {col.entries.map((entry) => {
                                const id = classId(col.date, entry);
                                const isSelected = selectedClasses.some((s) => s.id === id);
                                const parts = entry.time.split(" ");
                                const clock = parts[0] ?? "";
                                const ampm = parts[1] ?? "";

                                return (
                                  <button
                                    key={id}
                                    type="button"
                                    onClick={() => toggleSelectedClass(entryToSelected(col.date, entry))}
                                    className={`w-full p-5 text-left transition-colors focus-visible:outline-none ${
                                      isSelected ? "bg-blue-50/80" : "bg-white hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex flex-col items-start">
                                      <span
                                        className={`mb-3 inline-block rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${disciplineBadgeClass(entry.discipline)}`}
                                      >
                                        {entry.label}
                                      </span>
                                      <div className="flex items-baseline gap-1 whitespace-nowrap">
                                        <span className="text-2xl font-bold tracking-tight text-gray-900">{clock}</span>
                                        <span className="text-sm font-semibold text-gray-400">{ampm}</span>
                                      </div>
                                      {(entry.coach || entry.location) && (
                                        <div className="mt-4 flex w-full min-w-0 flex-col gap-1.5">
                                          {entry.coach ? (
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                              <svg
                                                className="h-3.5 w-3.5 shrink-0 text-gray-400"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                aria-hidden
                                              >
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                              </svg>
                                              <span className="truncate">{entry.coach}</span>
                                            </div>
                                          ) : null}
                                          {entry.location ? (
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
                                              <span className="truncate">{entry.location}</span>
                                            </div>
                                          ) : null}
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="min-h-0 flex-1 bg-white" aria-hidden />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <section className="mx-auto flex w-full max-w-5xl flex-col items-stretch gap-4 rounded-2xl border border-gray-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <MembershipStatus status="unlimited" compact />
            <div className="hidden h-8 w-px shrink-0 bg-gray-200 sm:block" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col gap-2 text-left">
              {selectedClasses.length === 0 ? (
                <span className="text-sm text-gray-400">Select a class to continue</span>
              ) : (
                selectedClasses.map((c) => (
                  <div key={c.id} className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span
                      className={`inline-flex shrink-0 items-center rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${disciplineBadgeClass(c.discipline)}`}
                    >
                      {c.title}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {c.time}
                      <span className="font-normal text-gray-500"> • {coachLocationSummary(c)}</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => selectedClasses.length > 0 && setIsModalOpen(true)}
            className={`inline-flex w-full shrink-0 items-center justify-center self-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-200 sm:w-auto ${
              selectedClasses.length > 0
                ? "bg-black hover:scale-[1.02] active:scale-[0.98]"
                : "cursor-not-allowed bg-black/25"
            }`}
            disabled={selectedClasses.length === 0}
          >
            Book Class
          </button>
        </section>

        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedClasses={selectedClasses}
          onConfirm={handleBookingConfirm}
        />

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
    </div>
  );
}
