"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export type BookingModalClass = {
  id: string;
  time: string;
  title: string;
  coach: string;
  location: string;
  discipline: string;
  date: Date;
};

function disciplineBadgeClass(discipline: string): string {
  const d = discipline.trim();
  if (d === "Boxing") {
    return "bg-blue-50 text-blue-700 border-blue-100/50";
  }
  if (d === "Muay Thai" || d === "Muay Thai Padwork") {
    return "bg-red-50 text-red-700 border-red-100/50";
  }
  if (d === "Strength and Cond.") {
    return "bg-orange-50 text-orange-700 border-orange-100/50";
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
}

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedClasses: any[];
  onConfirm: () => void | Promise<void>;
};

export function BookingModal({ isOpen, onClose, selectedClasses, onConfirm }: BookingModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) setIsProcessing(false);
  }, [isOpen]);

  const handleConfirm = useCallback(async () => {
    setIsProcessing(true);
    try {
      await Promise.resolve(onConfirm());
    } finally {
      setIsProcessing(false);
    }
  }, [onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-5 text-center">
          <h2 id="booking-modal-title" className="text-xl font-semibold tracking-tight text-gray-900">
            Confirm Booking
          </h2>
          <p className="mt-1 text-sm text-gray-500">Review your classes before confirming</p>
        </div>

        <div className="max-h-[min(420px,50vh)] overflow-y-auto px-6 py-5">
          <ul className="flex flex-col gap-4">
            {selectedClasses.map((c: BookingModalClass) => {
              const dayStr = c.date.toLocaleDateString("en-GB", {
                weekday: "long",
                month: "short",
                day: "numeric",
              });
              return (
                <li key={c.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-start gap-2">
                    <span
                      className={`inline-flex shrink-0 items-center rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${disciplineBadgeClass(c.discipline)}`}
                    >
                      {c.title}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-900">{c.discipline}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {c.time}
                    <span className="text-gray-400"> · </span>
                    {dayStr}
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-gray-500">
                    {c.coach ? <p>Coach: {c.coach}</p> : null}
                    {c.location ? <p>Location: {c.location}</p> : null}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">Membership Status: Checking...</div>
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="shrink-0 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={isProcessing}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                <span>Processing…</span>
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
