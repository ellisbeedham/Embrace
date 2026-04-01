"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

type ClassSlot = {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  location: string;
  location_address: string;
  class_type: string;
  capacity: number;
};

type DateAvailability = {
  date: string;
  available: number;
};

export function BookPageClient({
  classes,
  user,
  isTrial,
}: {
  classes: ClassSlot[];
  user: User | null;
  isTrial: boolean;
}) {
  const [selectedSlot, setSelectedSlot] = useState<ClassSlot | null>(null);
  const [dates, setDates] = useState<DateAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (selectedSlot) {
      setLoading(true);
      fetch(`/api/classes/${selectedSlot.id}/availability?weeks=4`)
        .then((res) => res.json())
        .then((data) => {
          setDates(data.dates || []);
        })
        .catch(() => setDates([]))
        .finally(() => setLoading(false));
    } else {
      setDates([]);
    }
  }, [selectedSlot]);

  async function bookClass(date: string) {
    if (!selectedSlot || !user) return;
    setBookingLoading(date);
    setMessage(null);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isTrial && { "x-trial": "true" }),
      },
      body: JSON.stringify({
        class_slot_id: selectedSlot.id,
        booking_date: date,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Booking failed" });
      setBookingLoading(null);
      return;
    }

    setMessage({ type: "success", text: "Class booked successfully!" });
    setBookingLoading(null);
    setDates((prev) =>
      prev.map((d) =>
        d.date === date ? { ...d, available: d.available - 1 } : d
      )
    );
  }

  if (!user) {
    return (
      <div className="p-8 rounded-xl bg-embrace-light dark:bg-white/5 border border-white/10 text-center">
        <p className="mb-4">You need to sign in to book a class.</p>
        <Link
          href="/login?redirect=/book"
          className="inline-block px-6 py-2 bg-embrace-accent text-white font-medium rounded-lg hover:bg-embrace-accent/90"
        >
          Log In
        </Link>
        <span className="mx-2 text-embrace-muted">or</span>
        <Link
          href="/signup?redirect=/book"
          className="inline-block px-6 py-2 border-2 border-embrace-accent text-embrace-accent font-medium rounded-lg hover:bg-embrace-accent hover:text-white"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Class Schedule</h2>
        <div className="grid gap-4">
          {classes.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot)}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                selectedSlot?.id === slot.id
                  ? "border-embrace-accent bg-embrace-accent/5"
                  : "border-white/10 hover:border-embrace-muted"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">
                    {slot.day_of_week} {slot.class_type === "muay_thai" ? "Muay Thai" : "Boxing"}
                  </h3>
                  <p className="text-sm text-embrace-muted">
                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                  </p>
                  <p className="text-sm mt-1">{slot.location}</p>
                  <p className="text-xs text-embrace-muted">{slot.location_address}</p>
                </div>
                <span className="text-embrace-accent text-sm font-medium">
                  Select
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedSlot && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Dates</h2>
          {message && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-600"
                  : "bg-red-500/10 text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}
          {loading ? (
            <div className="animate-pulse flex gap-4 flex-wrap">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-12 w-28 bg-embrace-muted/20 rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => bookClass(d.date)}
                  disabled={d.available <= 0 || bookingLoading !== null}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    d.available <= 0
                      ? "bg-embrace-muted/20 text-embrace-muted cursor-not-allowed"
                      : "bg-embrace-accent/10 text-embrace-accent hover:bg-embrace-accent hover:text-white"
                  }`}
                >
                  {bookingLoading === d.date
                    ? "Booking..."
                    : new Date(d.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
