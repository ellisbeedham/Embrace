"use server";

import { createClient } from "@/lib/supabase/server";
import type { BookClassesResult, BookingInput } from "@/app/actions/booking";

export type CheckoutOption = "unlimited" | "class-pack" | "single";

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

/**
 * Placeholder checkout: records booking + updates profile as if payment succeeded.
 * Wire Stripe Checkout + webhook later for production charges.
 */
export async function completeCheckoutBooking(
  option: CheckoutOption,
  booking: BookingInput
): Promise<BookClassesResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "Please sign in to continue." };
  }

  const scheduledAt = toScheduledAt(booking.date, booking.time);
  const className = booking.title.trim();
  const coach = booking.coach?.trim() || "Embrace Team";

  const { error: insertError } = await supabase.from("bookings").insert({
    user_id: user.id,
    class_name: className,
    coach,
    scheduled_at: scheduledAt,
  });

  if (insertError) {
    return { success: false, message: `Booking failed: ${insertError.message}` };
  }

  if (option === "unlimited") {
    const { error: uErr } = await supabase
      .from("profiles")
      .update({ membership_tier: "unlimited" })
      .eq("id", user.id);
    if (uErr) {
      return { success: false, message: `Payment recorded but profile update failed: ${uErr.message}` };
    }
    return {
      success: true,
      message: "Welcome to Unlimited — you’re booked in.",
      membershipTier: "unlimited",
      scheduledAt,
      className,
    };
  }

  if (option === "class-pack") {
    // 10-pack: first class is this booking → 9 credits remain.
    const { error: uErr } = await supabase
      .from("profiles")
      .update({ membership_tier: "class-pack", class_credits_remaining: 9 })
      .eq("id", user.id);
    if (uErr) {
      return { success: false, message: `Booking saved but pack could not be activated: ${uErr.message}` };
    }
    return {
      success: true,
      message: "10-Class Pack active — you’re booked in.",
      membershipTier: "class-pack",
      creditsRemaining: 9,
      scheduledAt,
      className,
    };
  }

  // single pass — booking only; membership unchanged
  return {
    success: true,
    message: "Single class booked — see you at the gym.",
    membershipTier: "none",
    scheduledAt,
    className,
  };
}
