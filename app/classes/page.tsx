"use client";

import { useMemo, useState } from "react";
import styles from "./classes.module.css";

const UI_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';

type WeekEntry = {
  time: string;
  badge: "boxing" | "sc";
  label: string;
  coach: string;
};

type DayColumn = {
  name: string;
  day: number;
  active?: boolean;
  entries: WeekEntry[];
};

type DisciplineCard = {
  heading: string;
  sub: string;
  image: string;
  syllabus: string[];
};

function shortWeekLabel(start: Date): string {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const aMon = start.toLocaleString("en-GB", { month: "short" });
  const bMon = end.toLocaleString("en-GB", { month: "short" });
  const year = end.getFullYear();
  return `${aMon} ${start.getDate()} – ${bMon} ${end.getDate()}, ${year}`;
}

function startOfWeekMonday(d: Date): Date {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  const dow = x.getDay();
  const delta = dow === 0 ? -6 : 1 - dow;
  x.setDate(x.getDate() + delta);
  return x;
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

export default function ClassesPage() {
  const now = useMemo(() => new Date(), []);
  const [weekStart, setWeekStart] = useState(() => startOfWeekMonday(now));
  const [openDrawer, setOpenDrawer] = useState<number | null>(null);

  const columns = useMemo<DayColumn[]>(() => {
    const tue = new Date(weekStart);
    tue.setDate(weekStart.getDate() + 1);
    const wed = new Date(weekStart);
    wed.setDate(weekStart.getDate() + 2);
    const thu = new Date(weekStart);
    thu.setDate(weekStart.getDate() + 3);

    return [
      { name: "MON", day: weekStart.getDate(), entries: [] },
      {
        name: "TUE",
        day: tue.getDate(),
        entries: [
          {
            time: "7:00 PM",
            badge: "boxing",
            label: "Boxing",
            coach: "Ruqsana Begum",
          },
        ],
      },
      {
        name: "WED",
        day: wed.getDate(),
        active: true,
        entries: [
          {
            time: "6:30 PM",
            badge: "sc",
            label: "S&C",
            coach: "Embrace Team",
          },
        ],
      },
      {
        name: "THU",
        day: thu.getDate(),
        entries: [
          {
            time: "7:00 PM",
            badge: "boxing",
            label: "Boxing",
            coach: "Ruqsana Begum",
          },
        ],
      },
    ];
  }, [weekStart]);

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

  const goToday = () => setWeekStart(startOfWeekMonday(new Date()));

  return (
    <div className={styles.page} style={{ fontFamily: UI_FONT }}>
      <main className={styles.appleSchedulePage}>
        <header className={styles.scheduleHeaderCentered}>
          <h1 className={styles.pageTitle}>Class Schedule</h1>

          <div className={styles.scheduleControls}>
            <button className={styles.navArrowHuge} aria-label="Previous Week" onClick={goPrev}>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className={styles.currentWeekDisplay}>
              <span className={styles.weekLabel}>This Week</span>
              <span className={styles.weekDates}>{shortWeekLabel(weekStart)}</span>
            </div>

            <button className={styles.navArrowHuge} aria-label="Next Week" onClick={goNext}>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <button className={styles.btnToday} onClick={goToday}>Today</button>
          </div>
        </header>

        <div className={styles.weeklyGrid}>
          {columns.map((col) => (
            <div key={`${col.name}-${col.day}`} className={`${styles.dayCol} ${col.active ? styles.activeDay : ""}`}>
              <div className={styles.dayHeader}>
                <span className={styles.dayName}>{col.name}</span>
                <span className={styles.dayNum}>{col.day}</span>
              </div>
              <div className={styles.cardStack}>
                {col.entries.map((entry) => (
                  <button key={`${col.name}-${entry.time}`} className={styles.classCard}>
                    <div className={styles.cardTop}>
                      <span className={styles.cTime}>
                        {entry.time.split(" ")[0]} <span className={styles.cAmpm}>{entry.time.split(" ")[1]}</span>
                      </span>
                      <span className={`${styles.cBadge} ${entry.badge === "boxing" ? styles.bBoxing : styles.bSc}`}>
                        {entry.label}
                      </span>
                    </div>
                    <div className={styles.cardBottom}>
                      <svg className={styles.cIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span className={styles.cCoach}>{entry.coach}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
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
      </main>
    </div>
  );
}
