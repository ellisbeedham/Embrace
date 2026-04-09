"use client";

import { useMemo } from "react";

export type SuccessTicketClass = {
  id: string;
  date: Date;
  time: string;
  duration: string;
  title: string;
  coach: string;
  location: string;
  discipline: string;
};

type BookingSuccessTicketProps = {
  classItem: SuccessTicketClass;
  scheduledAtIso: string;
  creditsLine?: string | null;
  onClose: () => void;
};

function parseDurationMinutes(duration: string): number {
  const m = duration.match(/(\d+)\s*min/i);
  return m ? Math.max(15, Number(m[1])) : 60;
}

function formatUtcCompact(d: Date): string {
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}00Z`;
}

function buildGoogleCalendarUrl(start: Date, end: Date, title: string, details: string, loc: string): string {
  const dates = `${formatUtcCompact(start)}/${formatUtcCompact(end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
    details,
    location: loc,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function BookingSuccessTicket({ classItem, scheduledAtIso, creditsLine, onClose }: BookingSuccessTicketProps) {
  const start = useMemo(() => new Date(scheduledAtIso), [scheduledAtIso]);
  const end = useMemo(() => {
    const e = new Date(start);
    e.setMinutes(e.getMinutes() + parseDurationMinutes(classItem.duration));
    return e;
  }, [start, classItem.duration]);

  const dayLine = useMemo(
    () =>
      classItem.date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [classItem.date]
  );

  const loc = [classItem.coach, classItem.location].filter(Boolean).join(" · ");

  const gCalUrl = buildGoogleCalendarUrl(
    start,
    end,
    classItem.title,
    `${classItem.discipline} — ${classItem.time} (${classItem.duration})`,
    loc
  );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-ticket-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5"
        style={{ fontFamily: 'var(--font-inter), "Inter", ui-sans-serif, system-ui, sans-serif' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="border-b border-gray-100 bg-gradient-to-br from-gray-900 via-gray-900 to-black px-8 pb-6 pt-7 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e1c07a]">CONFIRMED</p>
          <h2 id="success-ticket-title" className="mt-2 text-2xl font-bold tracking-tight text-white">
            You&apos;re in
          </h2>
          <p className="mt-2 text-sm text-white/75">Your spot is reserved.</p>
          {creditsLine ? <p className="mt-3 text-xs text-white/60">{creditsLine}</p> : null}
        </div>

        <div className="px-8 py-8">
          <div className="space-y-5">
            <p className="text-3xl font-semibold tracking-tight text-gray-950">{classItem.title}</p>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-gray-400">{dayLine}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 text-gray-400">
                  <path
                    fill="currentColor"
                    d="M10 2.25a.75.75 0 0 1 .75.75v6.69l3.28 1.89a.75.75 0 1 1-.75 1.3l-3.65-2.1a.75.75 0 0 1-.38-.65V3a.75.75 0 0 1 .75-.75Zm0 15a7.25 7.25 0 1 0 0-14.5 7.25 7.25 0 0 0 0 14.5Z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-700">
                  {classItem.time} <span className="text-gray-400">•</span> {classItem.duration}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 text-gray-400">
                  <path
                    fill="currentColor"
                    d="M10 1.75a5.75 5.75 0 0 0-5.75 5.75c0 4.1 4.58 9.8 5.1 10.43a.84.84 0 0 0 1.3 0c.52-.63 5.1-6.33 5.1-10.43A5.75 5.75 0 0 0 10 1.75Zm0 7.9a2.15 2.15 0 1 1 0-4.3 2.15 2.15 0 0 1 0 4.3Z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-700">{classItem.location || "Embrace"}</p>
              </div>
              <p className="text-sm text-gray-500">Coach: <span className="font-medium text-gray-800">{classItem.coach || "Embrace Team"}</span></p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <a
              href={gCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] hover:bg-black/90"
            >
              Add to Google Calendar
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-full py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            Back to schedule
          </button>
        </div>
      </div>
    </div>
  );
}
