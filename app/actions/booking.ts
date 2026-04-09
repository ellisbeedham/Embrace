"use server";

import { createClient } from "@/lib/supabase/server";
import { isBookingDevBypass } from "@/lib/bookingDevBypass";

export type BookingInput = {
  title: string;
  discipline: string;
  coach: string;
  date: string; // ISO string
  time: string; // e.g. 7:00 PM
};

export type BookClassesResult = {
  success: boolean;
  message: string;
  membershipTier?: string;
  creditsRemaining?: number;
  scheduledAt?: string;
  className?: string;
};

function toScheduledAt(dateIso: string, timeText: string): string {
  const d = new Date(dateIso);
  const [clock, meridiemRaw] = timeText.trim().split(" ");
  const meridiem = meridiemRaw?.toUpperCase() ?? "";
  const [hRaw, mRaw] = clock.split(":");
  let h = Number(hRaw || 0);
  const m = Number(mRaw || 0);
  if (meridiem === "PM" && h < 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export async function bookClasses(classes: BookingInput[]): Promise<BookClassesResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "Please sign in to book classes." };
  }

  const devBypass = isBookingDevBypass();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("membership_tier, class_credits_remaining")
    .eq("id", user.id)
    .single();

  if (!devBypass && (profileError || !profile)) {
    return { success: false, message: "Please Upgrade to Book" };
  }

  const tier = profile?.membership_tier ?? "none";
  const credits = typeof profile?.class_credits_remaining === "number" ? profile.class_credits_remaining : 0;

  let canBook = false;
  let useCredit = false;

  if (devBypass) {
    canBook = true;
    useCredit = false;
  } else if (tier === "unlimited") {
    canBook = true;
  } else if (tier === "class-pack" && credits > 0) {
    canBook = true;
    useCredit = true;
  }

  if (!canBook) {
    return {
      success: false,
      message: "Please Upgrade to Book",
      membershipTier: tier,
      creditsRemaining: credits,
    };
  }

  const first = classes[0];
  if (!first) {
    return { success: false, message: "No class selected." };
  }

  const scheduledAt = toScheduledAt(first.date, first.time);
  const className = first.title.trim();

  const rows = classes.map((c) => ({
    user_id: user.id,
    class_name: c.title.trim(),
    coach: c.coach?.trim() || "Embrace Team",
    scheduled_at: toScheduledAt(c.date, c.time),
  }));

  const { error: insertError } = await supabase.from("bookings").insert(rows);
  if (insertError) {
    return { success: false, message: `Booking failed: ${insertError.message}` };
  }

  let creditsRemaining = credits;
  if (useCredit) {
    creditsRemaining = Math.max(0, credits - 1);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ class_credits_remaining: creditsRemaining })
      .eq("id", user.id);
    if (updateError) {
      return {
        success: false,
        message: `Booked but could not update credits: ${updateError.message}`,
      };
    }
  }

  const effectiveTier = devBypass ? "unlimited" : tier;

  return {
    success: true,
    message: "Booking confirmed!",
    membershipTier: effectiveTier,
    creditsRemaining: useCredit ? creditsRemaining : undefined,
    scheduledAt,
    className,
  };
}
