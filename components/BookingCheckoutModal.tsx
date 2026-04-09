"use client";

import { useCallback, useState } from "react";
import { completeCheckoutBooking, type CheckoutOption } from "@/app/actions/checkoutBooking";
import type { SuccessTicketClass } from "@/components/BookingSuccessTicket";

type ClassForCheckout = SuccessTicketClass;

const OPTIONS: {
  id: CheckoutOption;
  title: string;
  subtitle?: string;
  price: string;
  highlight?: boolean;
}[] = [
  {
    id: "unlimited",
    title: "Unlimited Membership",
    subtitle: "Best value",
    price: "From £95.99/mo",
    highlight: true,
  },
  {
    id: "class-pack",
    title: "10-Class Package",
    subtitle: "Flexible pack · 3-month window",
    price: "£140.00",
  },
  {
    id: "single",
    title: "Single Class Pass",
    subtitle: "One session",
    price: "£16.00",
  },
];

type BookingCheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  classItem: ClassForCheckout;
  onSuccess: (payload: {
    classItem: ClassForCheckout;
    scheduledAtIso: string;
    creditsRemaining?: number;
    tier: string;
  }) => void;
};

export function BookingCheckoutModal({ open, onClose, classItem, onSuccess }: BookingCheckoutModalProps) {
  const [selected, setSelected] = useState<CheckoutOption | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setSelected(null);
    setError(null);
    setPaying(false);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handlePay = async () => {
    if (!selected) return;
    setError(null);
    setPaying(true);
    const result = await completeCheckoutBooking(selected, {
      title: classItem.title,
      discipline: classItem.discipline,
      coach: classItem.coach,
      date: classItem.date.toISOString(),
      time: classItem.time,
    });
    setPaying(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    onSuccess({
      classItem,
      scheduledAtIso: result.scheduledAt!,
      creditsRemaining: result.creditsRemaining,
      tier: result.membershipTier ?? "none",
    });
    reset();
    onClose();
  };

  if (!open) return null;

  const headerCoach = classItem.coach?.trim() || "Embrace Team";

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[6px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !paying) handleClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#0c0c0e] shadow-2xl">
        <button
          type="button"
          onClick={() => !paying && handleClose()}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="border-b border-white/10 px-8 pb-6 pt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a44a]">Checkout & join</p>
          <h2 id="checkout-title" className="mt-3 text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
            Complete Your Booking: {classItem.title} with {headerCoach}
          </h2>
          <p className="mt-2 text-sm text-white/55">
            Choose how you&apos;d like to train. You&apos;ll confirm payment on the next step.
          </p>
        </div>

        <div className="space-y-3 px-6 py-6 sm:px-8">
          {OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelected(opt.id)}
                className={`w-full rounded-2xl border px-5 py-4 text-left transition-all ${
                  active
                    ? "border-[#c9a44a] bg-[#c9a44a]/[0.12] ring-1 ring-[#c9a44a]/40"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-semibold text-white">{opt.title}</span>
                      {opt.highlight ? (
                        <span className="rounded-full bg-[#c9a44a]/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#f1d48f]">
                          Best value
                        </span>
                      ) : null}
                    </div>
                    {opt.subtitle ? <p className="mt-1 text-xs text-white/45">{opt.subtitle}</p> : null}
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[#e8c57a]">{opt.price}</span>
                </div>
              </button>
            );
          })}
        </div>

        {error ? (
          <div className="mx-6 mb-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 sm:mx-8">
            {error}
          </div>
        ) : null}

        <div className="border-t border-white/10 px-6 py-6 sm:px-8">
          {selected ? (
            <div className="space-y-3">
              <p className="text-center text-xs text-white/40">
                Placeholder checkout — no card charged. Connect Stripe for live payments.
              </p>
              <button
                type="button"
                disabled={paying}
                onClick={() => void handlePay()}
                className="w-full rounded-full bg-gradient-to-r from-[#c9a44a] to-[#a8842e] py-3.5 text-[15px] font-semibold text-black shadow-lg shadow-black/30 transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {paying ? "Processing…" : "Pay now"}
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-white/45">Select an option to continue</p>
          )}
          <button
            type="button"
            disabled={paying}
            onClick={() => !paying && handleClose()}
            className="mt-3 w-full py-2 text-sm font-medium text-white/45 hover:text-white/70 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
