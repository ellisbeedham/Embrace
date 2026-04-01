type MembershipStatusProps = {
  status: "unlimited" | "class-pack" | "none";
  /** Compact layout for embedding in the bottom booking bar */
  compact?: boolean;
};

const PACK_TOTAL = 10;
const PACK_REMAINING = 4;

export function MembershipStatus({ status, compact = false }: MembershipStatusProps) {
  if (status === "unlimited") {
    if (compact) {
      return (
        <div className="flex max-w-[220px] flex-col gap-0.5 rounded-xl bg-gradient-to-r from-gray-900 to-black px-3 py-2.5 text-white shadow-sm">
          <span className="text-xs font-semibold tracking-tight sm:text-sm">Unlimited Membership</span>
          <p className="text-[10px] leading-snug text-white/85 sm:text-xs">
            <span className="font-medium text-amber-300">Active</span>
            <span className="text-white/50"> • </span>
            Renews May 1st
          </p>
        </div>
      );
    }
    return (
      <div className="mb-8 flex w-full flex-col gap-3 rounded-2xl bg-gradient-to-r from-gray-900 to-black p-5 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
        <span className="text-base font-semibold tracking-tight">Unlimited Membership</span>
        <p className="text-sm text-white/85">
          <span className="font-medium text-amber-300">Active</span>
          <span className="text-white/60"> • </span>
          Renews May 1st
        </p>
      </div>
    );
  }

  if (status === "class-pack") {
    const remainingFraction = PACK_REMAINING / PACK_TOTAL;

    if (compact) {
      return (
        <div className="w-[min(100%,240px)] shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-gray-900 shadow-sm">
          <span className="block text-xs font-semibold tracking-tight">10-Class Pack</span>
          <span className="mt-1 block text-[10px] text-gray-600 sm:text-xs">
            {PACK_REMAINING} of {PACK_TOTAL} left
          </span>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-900"
              style={{ width: `${remainingFraction * 100}%` }}
              role="presentation"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="mb-8 flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-gray-900 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="text-base font-semibold tracking-tight">10-Class Pack</span>
        <div className="flex min-w-0 max-w-md flex-1 flex-col items-stretch gap-2 sm:items-end">
          <span className="text-sm text-gray-600">
            {PACK_REMAINING} of {PACK_TOTAL} Classes Remaining
          </span>
          <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-100 sm:w-48">
            <div
              className="h-full rounded-full bg-gray-900 transition-[width] duration-300"
              style={{ width: `${remainingFraction * 100}%` }}
              role="presentation"
            />
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="max-w-[200px] shrink-0 rounded-xl border border-gray-200/90 bg-white/90 px-3 py-2.5 text-gray-900 shadow-sm backdrop-blur-sm">
        <span className="block text-xs font-semibold tracking-tight">No active plan</span>
        <span className="mt-0.5 block text-[10px] text-gray-500 sm:text-xs">Add membership to book.</span>
      </div>
    );
  }

  return (
    <div className="mb-8 flex w-full flex-col gap-2 rounded-2xl border border-gray-200/90 bg-white/80 p-5 text-gray-900 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-base font-semibold tracking-tight">No active plan</span>
      <span className="text-sm text-gray-500">Add membership to unlock booking.</span>
    </div>
  );
}
