"use client";

import { ChevronRight } from "lucide-react";

const UPCOMING = [
  {
    id: "1",
    when: "Tue, Apr 7 • 7:00 PM",
    title: "Boxing with Ruqsana Begum",
  },
  {
    id: "2",
    when: "Sun, Apr 12 • 12:00 PM",
    title: "Muay Thai with Ruqsana Begum",
  },
] as const;

const SETTINGS_ROWS = ["Payment Methods", "Billing History", "Personal Info"] as const;

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-[var(--nav-height)]">
      <header className="sticky top-[var(--nav-height)] z-10 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3.5">
          <span className="text-[15px] font-semibold tracking-tight text-gray-900">My Account</span>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-8 mt-12 text-center text-3xl font-semibold tracking-tight text-gray-900">
          Welcome back, Ellis
        </h1>

        {/* Status hero */}
        <section
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E8C57A] to-[#C99C33] p-8 text-black shadow-md"
          aria-labelledby="membership-heading"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <h2 id="membership-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Unlimited Membership
            </h2>
            <p className="mt-2 text-[15px] font-medium text-black/75">
              Active<span className="text-black/50"> • </span>Renews May 1, 2026
            </p>
            <button
              type="button"
              className="mt-8 rounded-full bg-black/85 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:bg-black hover:opacity-95"
            >
              Manage Subscription
            </button>
          </div>
        </section>

        {/* Upcoming */}
        <section aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading" className="mb-4 mt-12 text-lg font-medium text-gray-900">
            Upcoming Classes
          </h2>
          <div className="flex flex-col gap-3">
            {UPCOMING.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{c.when}</p>
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <p className="text-sm text-gray-700">{c.title}</p>
                </div>
                <div className="flex shrink-0 justify-end sm:justify-end">
                  <button
                    type="button"
                    className="rounded-full border border-gray-200/80 bg-white px-4 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick settings */}
        <section className="mt-12" aria-label="Account settings">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white divide-y divide-gray-100">
            {SETTINGS_ROWS.map((label) => (
              <button
                key={label}
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50/80"
              >
                <span className="text-[15px] font-medium text-gray-900">{label}</span>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" strokeWidth={1.75} aria-hidden />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
