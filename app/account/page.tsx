"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type BookingRow = {
  id: string;
  class_name: string;
  coach: string | null;
  scheduled_at: string;
};

function formatBookingTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBookingDateLine(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function formatCardMemberName(email: string, fullName: string | null): string {
  const trimmed = fullName?.trim();
  if (trimmed) return trimmed.toUpperCase();
  const local = email.split("@")[0]?.trim() ?? "MEMBER";
  const spaced = local.replace(/[._-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.toUpperCase() || "MEMBER";
}

function resolveMembershipNumber(raw: string | null | undefined, userId: string | null): string {
  if (raw?.trim()) return raw.trim();
  if (!userId) return "EB-••••••";
  const hex = userId.replace(/-/g, "");
  const parsed = Number.parseInt(hex.slice(0, 8), 16);
  const n = Number.isFinite(parsed) ? (parsed % 900000) + 100000 : 456789;
  return `EB-${n}`;
}

type CardVariant = "unlimited" | "pack" | "none";

function DigitalMembershipCard({
  variant,
  displayName,
  membershipNumber,
  classesRemaining,
  signedIn,
}: {
  variant: CardVariant;
  displayName: string;
  membershipNumber: string;
  classesRemaining: number;
  signedIn: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const centerTitle =
    variant === "unlimited"
      ? "ELITE UNLIMITED"
      : variant === "pack"
        ? "10-CLASS PASS"
        : signedIn
          ? "NO ACTIVE PLAN"
          : "GUEST";

  const shell =
    variant === "unlimited"
      ? "border border-white/55 bg-[#f0e8dc]/55 shadow-[0_24px_56px_-24px_rgba(139,90,70,0.45)]"
      : variant === "pack"
        ? "border border-white/10 bg-[#0c0c0e]/75 shadow-[0_28px_64px_-28px_rgba(0,0,0,0.85)]"
        : "border border-white/20 bg-[#5c6370]/45 shadow-[0_20px_48px_-20px_rgba(40,45,55,0.5)]";

  const titleGradient =
    variant === "unlimited"
      ? "from-[#c4808a] via-[#d4a574] to-[#b8892e]"
      : variant === "pack"
        ? "from-[#9ca3af] via-[#e2e8f0] to-[#64748b]"
        : "from-white via-white to-white/90";

  const subText =
    variant === "unlimited"
      ? "text-[#6b5344]/85"
      : variant === "pack"
        ? "text-[#94a3b8]"
        : "text-white/80";

  const nameColor =
    variant === "unlimited"
      ? "text-[#4a3428]"
      : variant === "pack"
        ? "text-[#cbd5e1]"
        : "text-white";

  const numberColor =
    variant === "unlimited" ? "text-[#7a5348]/90" : variant === "pack" ? "text-[#94a3b8]" : "text-white/90";

  return (
    <div
      className="mx-auto w-full max-w-md [perspective:1200px]"
      style={{ fontFamily: 'var(--font-inter), "Inter", ui-sans-serif, system-ui, sans-serif' }}
    >
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        className="group relative w-full cursor-pointer border-none bg-transparent p-0 text-left transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        aria-pressed={flipped}
      >
        <div className="relative w-full overflow-visible pt-[62.97%]">
          <div
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]"
            style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            {/* Front */}
            <div
              className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[24px] p-5 backdrop-blur-xl sm:p-6 [backface-visibility:hidden] ${shell}`}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
                aria-hidden
              />
              {variant === "unlimited" ? (
                <div
                  className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-50"
                  style={{
                    background:
                      "linear-gradient(125deg, rgba(255,120,180,0.12) 0%, rgba(120,200,255,0.08) 35%, rgba(255,220,160,0.15) 70%, rgba(200,160,255,0.1) 100%)",
                  }}
                  aria-hidden
                />
              ) : null}
              <div className="pointer-events-none absolute -inset-px overflow-hidden rounded-[24px] opacity-40" aria-hidden>
                <div
                  className={`membership-card-shimmer absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent ${
                    variant === "none" ? "opacity-30" : ""
                  }`}
                />
              </div>

              <div className="relative flex items-start justify-between">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${
                    variant === "unlimited"
                      ? "text-[#6b5344]/75"
                      : variant === "pack"
                        ? "text-white/45"
                        : "text-white/55"
                  }`}
                >
                  Digital Member
                </span>
                <span
                  className={`text-right text-[11px] font-semibold uppercase tracking-[0.2em] ${
                    variant === "unlimited"
                      ? "text-[#5c4a3d]/85"
                      : variant === "pack"
                        ? "text-[#cbd5e1]/90"
                        : "text-white/90"
                  }`}
                >
                  Embrace
                </span>
              </div>

              <div className="relative flex flex-1 flex-col items-center justify-center py-2 text-center">
                <p
                  className={`max-w-[16rem] bg-gradient-to-br ${titleGradient} bg-clip-text font-serif text-lg font-semibold uppercase leading-snug tracking-[0.14em] text-transparent sm:text-xl`}
                >
                  {centerTitle}
                </p>
                {variant === "pack" ? (
                  <p className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>
                    {classesRemaining} classes remaining
                  </p>
                ) : null}
              </div>

              <div className="relative flex items-end justify-between gap-3">
                <p className={`min-w-0 flex-1 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-[11px] ${nameColor}`}>
                  {displayName}
                </p>
                <p className={`shrink-0 text-[10px] font-semibold tabular-nums tracking-wide sm:text-[11px] ${numberColor}`}>
                  {membershipNumber}
                </p>
              </div>
            </div>

            {/* Back */}
            <div
              className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[24px] p-5 backdrop-blur-xl sm:p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] ${shell}`}
            >
              <div className="relative text-center">
                <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${subText}`}>Embrace</p>
                {variant === "unlimited" ? (
                  <p className="mt-4 text-sm leading-relaxed text-black/60">
                    Unlimited training, full club access, and priority booking — you’re all set.
                  </p>
                ) : null}
                {variant === "pack" ? (
                  <p className="mt-4 text-sm leading-relaxed text-white/55">
                    Use your passes on any eligible class. Top up when you’re running low.
                  </p>
                ) : null}
                {variant === "none" && signedIn ? (
                  <p className="mt-4 text-sm leading-relaxed text-white/85">
                    Choose a plan to unlock booking and member benefits.
                  </p>
                ) : null}
                {!signedIn ? (
                  <p className="mt-4 text-sm leading-relaxed text-white/85">Sign in to view your membership card.</p>
                ) : null}
              </div>
              <div className="relative flex justify-center pb-1">
                {variant === "none" && signedIn ? (
                  <Link
                    href="/membership"
                    className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  >
                    View plans
                  </Link>
                ) : !signedIn ? (
                  <Link
                    href="/login"
                    className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  >
                    Sign in
                  </Link>
                ) : (
                  <p className={`text-[10px] font-medium uppercase tracking-widest ${subText}`}>Tap to flip</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

function CoachAvatar({ coach }: { coach: string | null }) {
  const name = coach?.trim() || "Coach";
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gray-100 via-white to-gray-100 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-100"
      title={name}
    >
      {initial}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState<string>("Loading…");
  const [membershipTier, setMembershipTier] = useState<string>("none");
  const [creditsRemaining, setCreditsRemaining] = useState<number>(0);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hasEmailIdentity, setHasEmailIdentity] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [freezeDuration, setFreezeDuration] = useState("1 Month");
  const [freezeReason, setFreezeReason] = useState("Injury");
  const [membershipUpdating, setMembershipUpdating] = useState(false);
  const [localMembershipStatus, setLocalMembershipStatus] = useState<"active" | "frozen">("active");
  const [freezeResumeDateLabel, setFreezeResumeDateLabel] = useState<string | null>(null);
  const [profileFullName, setProfileFullName] = useState<string | null>(null);
  const [membershipNumberDisplay, setMembershipNumberDisplay] = useState<string | null>(null);
  const profileChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const bookingsChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const loadBookingsAndProfile = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setEmail("Supabase not configured");
      setBookingsLoading(false);
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    setUserId(user?.id ?? null);
    setEmail(user?.email ?? "Not signed in");
    setHasEmailIdentity(user?.identities?.some((i) => i.provider === "email") ?? false);
    if (!user) {
      setMembershipTier("none");
      setCreditsRemaining(0);
      setProfileFullName(null);
      setMembershipNumberDisplay(null);
      setHasEmailIdentity(false);
      setBookings([]);
      setBookingsLoading(false);
      return;
    }

    setBookingsLoading(true);
    const [{ data: profileData, error: profileErr }, { data: bookingData, error: bookingErr }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("membership_tier, class_credits, class_credits_remaining, membership_number, full_name")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("bookings")
          .select("id, class_name, coach, scheduled_at")
          .eq("user_id", user.id)
          .order("scheduled_at", { ascending: false })
          .limit(40),
      ]);

    if (profileErr) {
      console.warn("Profile fetch:", profileErr.message);
    }
    if (bookingErr) {
      console.warn("Bookings fetch:", bookingErr.message);
    }

    setMembershipTier(profileData?.membership_tier ?? "none");
    const profileRow = profileData as {
      class_credits?: unknown;
      class_credits_remaining?: unknown;
      membership_number?: unknown;
      full_name?: unknown;
    } | null;
    setProfileFullName(typeof profileRow?.full_name === "string" ? profileRow.full_name : null);
    setMembershipNumberDisplay(typeof profileRow?.membership_number === "string" ? profileRow.membership_number : null);
    const packCreditsRaw = profileRow;
    const fromClassCredits = packCreditsRaw?.class_credits;
    const fromRemaining = packCreditsRaw?.class_credits_remaining;
    const packCredits =
      typeof fromClassCredits === "number"
        ? fromClassCredits
        : typeof fromRemaining === "number"
          ? fromRemaining
          : 0;
    setCreditsRemaining(Math.max(0, packCredits));
    setBookings((bookingData as BookingRow[] | null) ?? []);
    if ((profileData?.membership_tier ?? "none") === "none") {
      setLocalMembershipStatus("active");
      setFreezeResumeDateLabel(null);
    }
    setBookingsLoading(false);
  }, [supabase]);

  const stopRealtimeChannels = useCallback(() => {
    if (profileChannelRef.current) {
      void supabase.removeChannel(profileChannelRef.current);
      profileChannelRef.current = null;
    }
    if (bookingsChannelRef.current) {
      void supabase.removeChannel(bookingsChannelRef.current);
      bookingsChannelRef.current = null;
    }
  }, [supabase]);

  useEffect(() => {
    void loadBookingsAndProfile();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION") return;
      void loadBookingsAndProfile();
    });
    return () => subscription.unsubscribe();
  }, [supabase, loadBookingsAndProfile]);

  useEffect(() => {
    stopRealtimeChannels();
    if (!userId) return;

    const profileChannel = supabase
      .channel(`account-profile-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        () => {
          void loadBookingsAndProfile();
        }
      )
      .subscribe();
    profileChannelRef.current = profileChannel;

    const bookingsChannel = supabase
      .channel(`account-bookings-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void loadBookingsAndProfile();
        }
      )
      .subscribe();
    bookingsChannelRef.current = bookingsChannel;

    return () => stopRealtimeChannels();
  }, [supabase, userId, loadBookingsAndProfile, stopRealtimeChannels]);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    router.push("/");
    router.refresh();
  }

  async function handleCancel(bookingId: string) {
    if (!userId || cancellingId) return;
    setCancellingId(bookingId);
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId)
      .eq("user_id", userId);
    setCancellingId(null);
    if (error) {
      setToast(`Could not cancel class: ${error.message}`);
      window.setTimeout(() => setToast(null), 2200);
      return;
    }
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    setToast("Class Cancelled.");
    window.setTimeout(() => setToast(null), 1800);
  }

  async function handleConfirmFreeze() {
    if (!userId || membershipUpdating) return;
    const freezeMonths = Number.parseInt(freezeDuration, 10) || 1;
    const startDate = new Date();
    const resumeDate = addMonths(startDate, freezeMonths);
    const resumeDateLabel = resumeDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    setMembershipUpdating(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        membership_status: "frozen",
        freeze_start_date: startDate.toISOString().slice(0, 10),
      })
      .eq("id", userId);
    setMembershipUpdating(false);
    if (error) {
      setToast(`Could not freeze membership: ${error.message}`);
      window.setTimeout(() => setToast(null), 2600);
      return;
    }

    setLocalMembershipStatus("frozen");
    setFreezeResumeDateLabel(resumeDateLabel);
    setShowFreezeModal(false);
    setToast(`Account Paused. We look forward to having you back on ${resumeDateLabel}.`);
    window.setTimeout(() => setToast(null), 4200);
    await loadBookingsAndProfile();
  }

  async function handleConfirmCancellation() {
    if (!userId || membershipUpdating) return;
    setMembershipUpdating(true);
    const { error } = await supabase
      .from("profiles")
      .update({ membership_tier: "none" })
      .eq("id", userId);
    setMembershipUpdating(false);
    if (error) {
      setToast(`Could not cancel membership: ${error.message}`);
      window.setTimeout(() => setToast(null), 2600);
      return;
    }

    setMembershipTier("none");
    setLocalMembershipStatus("active");
    setFreezeResumeDateLabel(null);
    setShowCancelModal(false);
    const memberName = email.includes("@")
      ? `${email.split("@")[0].charAt(0).toUpperCase()}${email.split("@")[0].slice(1)}`
      : "Ellis";
    setToast(
      `We're sorry to see you go, ${memberName}. We hope to see you again soon. Thank you for being part of Embrace.`
    );
    window.setTimeout(() => setToast(null), 5200);
    await loadBookingsAndProfile();
  }

  const now = Date.now();
  const upcoming = bookings.filter((b) => new Date(b.scheduled_at).getTime() >= now);
  const past = bookings.filter((b) => new Date(b.scheduled_at).getTime() < now);

  const uiFont = 'var(--font-inter), "Inter", ui-sans-serif, system-ui, sans-serif';

  const planLabel =
    membershipTier === "unlimited"
      ? "Unlimited"
      : membershipTier === "class-pack" || membershipTier === "10-pack"
        ? "Class pack"
        : "None";

  const cardVariant: CardVariant =
    membershipTier === "unlimited"
      ? "unlimited"
      : membershipTier === "10-pack" || membershipTier === "class-pack"
        ? "pack"
        : "none";

  const cardMemberName = formatCardMemberName(email, profileFullName);
  const cardMembershipNumber = resolveMembershipNumber(membershipNumberDisplay, userId);

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f5f5f6] pt-[calc(var(--nav-height)+2rem)]"
      style={{ fontFamily: uiFont }}
    >
      <div className="mx-auto w-full max-w-[800px] flex-1 px-5 pb-12 md:px-6">
        <header className="pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Embrace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            Member Dashboard
          </h1>
        </header>

        <section className="pb-2">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
            Your membership
          </p>
          <div className="mt-5">
            <DigitalMembershipCard
              variant={cardVariant}
              displayName={cardMemberName}
              membershipNumber={cardMembershipNumber}
              classesRemaining={creditsRemaining}
              signedIn={!!userId}
            />
          </div>
        </section>

        <section className="border-t border-gray-200/80 pt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Profile</h2>
          {userId ? (
            <>
              <p className="mt-3 break-all text-sm font-medium text-gray-900">{email}</p>
              {hasEmailIdentity ? (
                <Link
                  href="/account/change-password"
                  className="mt-4 inline-flex text-xs font-semibold uppercase tracking-wider text-gray-700 underline-offset-4 transition-colors hover:text-gray-950 hover:underline"
                >
                  Change password
                </Link>
              ) : null}
            </>
          ) : (
            <p className="mt-3 text-sm text-gray-600">
              <Link href="/login" className="font-medium text-gray-900 underline-offset-4 hover:underline">
                Sign in
              </Link>{" "}
              to view your profile and schedule.
            </p>
          )}
        </section>

        <section className="mt-8 border-t border-gray-200/80 pt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Your Upcoming Training</h2>
          <p className="mt-1 text-xs text-gray-400">Your next sessions on the timetable</p>

          {bookingsLoading ? (
            <p className="mt-8 text-sm text-gray-500">Loading your schedule…</p>
          ) : !userId ? (
            <div className="mt-10 rounded-3xl border border-gray-100 bg-gray-50/80 px-6 py-12 text-center shadow-inner">
              <p className="text-sm font-medium text-gray-600">Sign in to see your training schedule.</p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gray-950 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Sign in
              </Link>
            </div>
          ) : bookings.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-gray-100 bg-gray-50/80 px-6 py-12 text-center shadow-inner">
              <p className="text-sm font-medium leading-relaxed text-gray-600 md:text-base">
                You haven&apos;t scheduled your next session.
              </p>
              <Link
                href="/classes"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gray-950 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                View Timetable
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              {upcoming.length > 0 ? (
                <div>
                  <ul className="space-y-3">
                    {upcoming.map((booking) => {
                      const coachName = booking.coach?.trim() || "Embrace Team";
                      return (
                        <li
                          key={booking.id}
                          className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-3xl border border-gray-100 bg-gray-50/50 px-4 py-4 shadow-sm sm:flex-nowrap sm:gap-x-5 sm:px-5"
                        >
                          <div className="flex w-full shrink-0 flex-col border-b border-gray-100 pb-3 sm:w-[92px] sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
                            <span className="text-lg font-semibold tabular-nums text-gray-900">
                              {formatBookingTime(booking.scheduled_at)}
                            </span>
                            <span className="text-[11px] font-medium text-gray-500">
                              {formatBookingDateLine(booking.scheduled_at)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 basis-[40%] sm:basis-auto">
                            <p className="font-semibold leading-snug text-gray-900">{booking.class_name}</p>
                          </div>
                          <div className="flex min-w-0 max-w-[200px] flex-1 items-center gap-2.5 sm:flex-initial sm:shrink-0">
                            <CoachAvatar coach={booking.coach} />
                            <span className="truncate text-sm font-medium text-gray-800" title={coachName}>
                              {coachName}
                            </span>
                          </div>
                          <button
                            type="button"
                            disabled={cancellingId === booking.id}
                            onClick={() => void handleCancel(booking.id)}
                            className="ml-auto shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-500 underline-offset-4 transition-colors hover:text-red-600 hover:underline disabled:opacity-50 sm:ml-0"
                          >
                            {cancellingId === booking.id ? "Cancelling…" : "Cancel"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {past.length > 0 ? (
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Recent sessions
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {past.map((booking) => {
                      const coachName = booking.coach?.trim() || "Embrace Team";
                      return (
                        <li
                          key={booking.id}
                          className="flex flex-wrap items-center gap-x-3 gap-y-3 rounded-3xl border border-gray-100 bg-white px-4 py-4 opacity-90 shadow-sm sm:flex-nowrap sm:gap-x-5 sm:px-5"
                        >
                          <div className="flex w-full shrink-0 flex-col border-b border-gray-100 pb-3 sm:w-[92px] sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
                            <span className="text-lg font-semibold tabular-nums text-gray-700">
                              {formatBookingTime(booking.scheduled_at)}
                            </span>
                            <span className="text-[11px] font-medium text-gray-400">
                              {formatBookingDateLine(booking.scheduled_at)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 basis-[40%] sm:basis-auto">
                            <p className="font-semibold leading-snug text-gray-800">{booking.class_name}</p>
                          </div>
                          <div className="flex min-w-0 max-w-[200px] flex-1 items-center gap-2.5 sm:flex-initial sm:shrink-0">
                            <CoachAvatar coach={booking.coach} />
                            <span className="truncate text-sm font-medium text-gray-600" title={coachName}>
                              {coachName}
                            </span>
                          </div>
                          <span className="ml-auto shrink-0 text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:ml-0">
                            Complete
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </section>

        {userId ? (
          <section className="mt-8 border-t border-gray-200/80 pt-8">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Account management</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
              <div className="md:pr-6 lg:pr-8">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Current plan</h3>
                <p className="mt-3 text-base font-semibold text-gray-900">{planLabel}</p>
                {localMembershipStatus === "frozen" ? (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Frozen {freezeResumeDateLabel ? `· Returns ${freezeResumeDateLabel}` : ""}
                  </p>
                ) : null}
                <p className="mt-2 text-sm text-gray-600">
                  {membershipTier === "unlimited" ? (
                    <>
                      Next billing date:{" "}
                      <span className="font-medium text-gray-900">May 1st</span>
                    </>
                  ) : membershipTier === "class-pack" || membershipTier === "10-pack" ? (
                    <>
                      Billing:{" "}
                      <span className="font-medium text-gray-900">Bundle-based — no renewal date</span>
                    </>
                  ) : (
                    <>
                      Next billing date: <span className="font-medium text-gray-900">—</span>
                    </>
                  )}
                </p>
                {membershipTier === "class-pack" || membershipTier === "10-pack" ? (
                  <p className="mt-1 text-xs text-gray-500">{Math.max(0, creditsRemaining)} classes remaining</p>
                ) : null}
              </div>

              <div className="border-t border-gray-200/80 pt-8 md:border-l md:border-t-0 md:px-6 md:pt-0 lg:px-8">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Payment method</h3>
                <p className="mt-3 text-sm font-medium tabular-nums text-gray-900">
                  {membershipTier === "unlimited" ? "Visa ****1234" : "—"}
                </p>
                {membershipTier !== "unlimited" ? (
                  <p className="mt-1 text-xs text-gray-500">Saved when you subscribe.</p>
                ) : null}
                <Link
                  href="/membership"
                  className="mt-4 inline-flex rounded-full border border-gray-300 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
                >
                  Update card
                </Link>
              </div>

              <div className="border-t border-gray-200/80 pt-8 md:border-l md:border-t-0 md:pl-6 md:pt-0 lg:pl-8">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Account actions</h3>
                <div className="mt-3 flex flex-col items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFreezeModal(true)}
                    className="text-sm font-medium text-gray-800 underline-offset-4 transition-colors hover:text-gray-950 hover:underline"
                  >
                    Freeze membership
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="text-sm font-medium text-gray-800 underline-offset-4 transition-colors hover:text-red-700 hover:underline"
                  >
                    Cancel membership
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <footer className="border-t border-gray-200/80 py-10">
        <div className="mx-auto max-w-[800px] px-5 text-center md:px-6">
          {userId ? (
            <button
              type="button"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
              className="text-[13px] font-medium text-gray-400 underline-offset-4 transition-colors hover:text-gray-600 hover:underline disabled:opacity-50"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          ) : null}
        </div>
      </footer>

      {showFreezeModal ? (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-[32px] bg-white p-7 shadow-2xl ring-1 ring-black/5"
            style={{ fontFamily: uiFont }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="freeze-title"
          >
            <h3 id="freeze-title" className="text-2xl font-semibold tracking-tight text-gray-900">
              Freeze Membership
            </h3>
            <p className="mt-2 text-sm text-gray-600">Pause your membership for a short period.</p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Duration</span>
                <select
                  value={freezeDuration}
                  onChange={(e) => setFreezeDuration(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none ring-gray-900/5 focus:border-gray-400 focus:ring-2"
                >
                  <option>1 Month</option>
                  <option>2 Months</option>
                  <option>3 Months</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Reason</span>
                <select
                  value={freezeReason}
                  onChange={(e) => setFreezeReason(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none ring-gray-900/5 focus:border-gray-400 focus:ring-2"
                >
                  <option>Injury</option>
                  <option>Travel</option>
                  <option>Work/Busy</option>
                  <option>Financial</option>
                  <option>Medical</option>
                </select>
              </label>
            </div>

            <div className="mt-7 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => void handleConfirmFreeze()}
                disabled={membershipUpdating}
                className="w-full rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:opacity-50"
              >
                {membershipUpdating ? "Saving…" : "Confirm Freeze"}
              </button>
              <button
                type="button"
                onClick={() => setShowFreezeModal(false)}
                className="w-full rounded-full py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showCancelModal ? (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-[32px] bg-white p-7 shadow-2xl ring-1 ring-black/5"
            style={{ fontFamily: uiFont }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
          >
            <h3 id="cancel-title" className="text-2xl font-semibold tracking-tight text-gray-900">
              Confirm Cancellation
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Are you sure you want to end your membership? You will have access until the end of your current billing period.
            </p>
            <div className="mt-7 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="w-full rounded-full bg-gradient-to-r from-[#ebd08b] via-[#d8b26b] to-[#bf9348] px-4 py-3 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
              >
                Stay a Member
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmCancellation()}
                disabled={membershipUpdating}
                className="w-full rounded-full py-2 text-sm font-semibold text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
              >
                {membershipUpdating ? "Processing…" : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 right-6 z-[80] rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
