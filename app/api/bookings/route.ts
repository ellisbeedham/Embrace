import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*, class_slots(*)")
    .eq("user_id", user.id)
    .eq("status", "confirmed")
    .gte("booking_date", new Date().toISOString().split("T")[0])
    .order("booking_date", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { class_slot_id, booking_date } = await request.json();

  if (!class_slot_id || !booking_date) {
    return NextResponse.json(
      { error: "Missing class_slot_id or booking_date" },
      { status: 400 }
    );
  }

  const supabaseAdmin = (await import("@/lib/supabase/admin")).supabaseAdmin;

  const { data: slot } = await supabaseAdmin
    .from("class_slots")
    .select("*")
    .eq("id", class_slot_id)
    .single();

  if (!slot) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const isTrial = request.headers.get("x-trial") === "true";

  if (isTrial) {
    const { data: existingSub } = await supabaseAdmin
      .from("subscriptions")
      .select("id, plan_type")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingSub) {
      if (existingSub.plan_type === "trial") {
        return NextResponse.json(
          { error: "You have already used your free trial" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "You already have an active subscription" },
        { status: 400 }
      );
    }

    await supabaseAdmin.from("subscriptions").insert({
      user_id: user.id,
      plan_type: "trial",
      remaining_classes: 1,
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });
  } else if (!subscription) {
    return NextResponse.json(
      { error: "No active subscription. Please choose a plan first." },
      { status: 400 }
    );
  } else {
    const validUntil = subscription.valid_until
      ? new Date(subscription.valid_until)
      : null;
    if (validUntil && new Date(booking_date) > validUntil) {
      return NextResponse.json(
        { error: "Your subscription has expired" },
        { status: 400 }
      );
    }

    if (subscription.plan_type === "10class") {
      if (
        subscription.remaining_classes === null ||
        subscription.remaining_classes <= 0
      ) {
        return NextResponse.json(
          { error: "No classes remaining. Please upgrade your plan." },
          { status: 400 }
        );
      }
    }
  }

  const { count } = await supabaseAdmin
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("class_slot_id", class_slot_id)
    .eq("booking_date", booking_date)
    .eq("status", "confirmed");

  if ((count || 0) >= slot.capacity) {
    return NextResponse.json(
      { error: "This class is fully booked" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("user_id", user.id)
    .eq("class_slot_id", class_slot_id)
    .eq("booking_date", booking_date)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "You already have a booking for this class" },
      { status: 400 }
    );
  }

  const { data: booking, error: bookingError } = await supabaseAdmin
    .from("bookings")
    .insert({
      user_id: user.id,
      class_slot_id,
      booking_date,
      status: "confirmed",
    })
    .select()
    .single();

  if (bookingError) {
    return NextResponse.json(
      { error: bookingError.message },
      { status: 500 }
    );
  }

  if (isTrial) {
    await supabaseAdmin
      .from("subscriptions")
      .update({
        remaining_classes: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("plan_type", "trial");
  } else if (subscription?.plan_type === "10class") {
    await supabaseAdmin
      .from("subscriptions")
      .update({
        remaining_classes: subscription.remaining_classes - 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  }

  return NextResponse.json(booking);
}
