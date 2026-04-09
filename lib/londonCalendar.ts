/** Calendar arithmetic and formatting in Europe/London (UK). */

export const LONDON_TZ = "Europe/London";

export type LondonYmd = { y: number; m: number; d: number };

export function getLondonYmd(instant: Date = new Date()): LondonYmd {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(instant);
  const map: Record<string, number> = {};
  for (const p of parts) {
    if (p.type === "year" || p.type === "month" || p.type === "day") {
      map[p.type] = Number(p.value);
    }
  }
  return { y: map.year!, m: map.month!, d: map.day! };
}

/** Anchor instant for a London calendar day (stable for booking date parts). */
export function londonYmdToUtcNoon(y: number, m: number, d: number): Date {
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

/** Sunday = 0 … Saturday = 6, for the given London calendar day. */
export function getLondonWeekdaySun0(y: number, m: number, d: number): number {
  const w = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    weekday: "short",
  }).format(londonYmdToUtcNoon(y, m, d));
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[w] ?? 0;
}

export function addCalendarDaysLondon(y: number, m: number, d: number, delta: number): LondonYmd {
  const base = londonYmdToUtcNoon(y, m, d);
  const next = new Date(base.getTime() + delta * 86400000);
  return getLondonYmd(next);
}

/** Signed day difference (a − b) on the London calendar. */
export function londonCalendarDiffDays(a: LondonYmd, b: LondonYmd): number {
  const ta = londonYmdToUtcNoon(a.y, a.m, a.d).getTime();
  const tb = londonYmdToUtcNoon(b.y, b.m, b.d).getTime();
  return Math.round((ta - tb) / 86400000);
}

export function formatLongDateLondon(date: Date): string {
  const weekday = date.toLocaleDateString("en-GB", { weekday: "long", timeZone: LONDON_TZ });
  const month = date.toLocaleDateString("en-GB", { month: "long", timeZone: LONDON_TZ });
  const n = Number(date.toLocaleDateString("en-GB", { day: "numeric", timeZone: LONDON_TZ }));
  const suffix =
    n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th";
  return `${weekday}, ${month} ${n}${suffix}`;
}

export function formatMonthYearLondon(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: LONDON_TZ });
}
