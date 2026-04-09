/**
 * Dev-only: treat every signed-in user as Unlimited for booking (no paywall / checkout).
 * Set NEXT_PUBLIC_BOOKING_DEV_BYPASS=true in .env.local and restart dev.
 * Remove or set to false before production with real Stripe checkout.
 */
export function isBookingDevBypass(): boolean {
  return process.env.NEXT_PUBLIC_BOOKING_DEV_BYPASS === "true";
}
