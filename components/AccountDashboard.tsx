"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

type Subscription = {
  id: string;
  plan_type: "trial" | "10class" | "unlimited";
  remaining_classes: number | null;
  valid_until: string | null;
};

type Booking = {
  id: string;
  booking_date: string;
  class_slots: {
    day_of_week: string;
    start_time: string;
    location: string;
    class_type: string;
  };
};

export function AccountDashboard({ user }: { user: User }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const [subRes, bookRes] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single(),
        fetch("/api/bookings").then((r) => r.json()),
      ]);
      setSubscription(subRes.data);
      setBookings(Array.isArray(bookRes) ? bookRes : []);
      setLoading(false);
    }
    fetchData();
  }, [user.id]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const fullName = user.user_metadata?.full_name as string | undefined;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-embrace-muted/20 rounded w-1/3" />
        <div className="h-24 bg-embrace-muted/20 rounded" />
        <div className="h-32 bg-embrace-muted/20 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-xl bg-white dark:bg-white/5 border border-white/10">
        <h2 className="font-bold text-lg mb-2">Profile</h2>
        <p className="text-embrace-muted">
          {fullName || "Member"} · {user.email}
        </p>
        <button
          onClick={handleSignOut}
          className="mt-4 text-sm text-embrace-accent hover:underline"
        >
          Sign out
        </button>
      </div>

      <div className="p-6 rounded-xl bg-white dark:bg-white/5 border border-white/10">
        <h2 className="font-bold text-lg mb-2">Subscription</h2>
        {subscription ? (
          <div className="space-y-2">
            <p>
              <span className="text-embrace-muted">Plan:</span>{" "}
              <span className="capitalize font-medium">
                {subscription.plan_type === "10class"
                  ? "10 Class Pack"
                  : subscription.plan_type === "unlimited"
                  ? "Unlimited"
                  : "Free Trial"}
              </span>
            </p>
            {subscription.remaining_classes !== null && (
              <p>
                <span className="text-embrace-muted">Remaining classes:</span>{" "}
                {subscription.remaining_classes}
              </p>
            )}
            {subscription.valid_until && (
              <p>
                <span className="text-embrace-muted">Valid until:</span>{" "}
                {new Date(subscription.valid_until).toLocaleDateString()}
              </p>
            )}
            <Link
              href="/book"
              className="inline-block mt-4 px-4 py-2 bg-embrace-accent text-white text-sm font-medium rounded-lg hover:bg-embrace-accent/90"
            >
              Book a Class
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-embrace-muted mb-4">
              No active subscription. Choose a plan to start booking classes.
            </p>
            <Link
              href="/plans-pricing"
              className="inline-block px-4 py-2 bg-embrace-accent text-white text-sm font-medium rounded-lg hover:bg-embrace-accent/90"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>

      <div className="p-6 rounded-xl bg-white dark:bg-white/5 border border-white/10">
        <h2 className="font-bold text-lg mb-2">Upcoming Bookings</h2>
        {bookings.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {bookings.slice(0, 5).map((b) => (
              <li
                key={b.id}
                className="flex justify-between items-center py-2 border-b border-white/10 last:border-0"
              >
                <div>
                  <span className="font-medium">
                    {b.class_slots.day_of_week} {b.class_slots.class_type === "muay_thai" ? "Muay Thai" : "Boxing"}
                  </span>
                  <span className="text-embrace-muted text-sm ml-2">
                    {new Date(b.booking_date).toLocaleDateString("en-GB")} · {b.class_slots.location}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-embrace-muted mb-4">No upcoming bookings.</p>
        )}
        <Link
          href="/book"
          className="text-embrace-accent hover:underline text-sm"
        >
          View timetable and book classes →
        </Link>
      </div>
    </div>
  );
}
