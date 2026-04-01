import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DAY_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const weeks = parseInt(searchParams.get("weeks") || "4", 10);

  const supabase = await createClient();

  const { data: slot, error: slotError } = await supabase
    .from("class_slots")
    .select("*")
    .eq("id", id)
    .single();

  if (slotError || !slot) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const dayNum = DAY_MAP[slot.day_of_week];
  if (dayNum === undefined) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const dates: { date: string; available: number }[] = [];
  let found = 0;

  for (let w = 0; found < weeks; w++) {
    const d = new Date(today);
    const currentDay = d.getDay();
    let daysToAdd = dayNum - currentDay;
    if (daysToAdd < 0) daysToAdd += 7;
    else if (daysToAdd === 0 && w === 0) {
      const [hours, mins] = slot.end_time.split(":").map(Number);
      const classEnd = new Date(now);
      classEnd.setHours(hours, mins, 0, 0);
      if (now >= classEnd) daysToAdd = 7;
    }
    d.setDate(d.getDate() + daysToAdd + w * 7);

    const dateStr = d.toISOString().split("T")[0];

    const { count } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("class_slot_id", id)
      .eq("booking_date", dateStr)
      .eq("status", "confirmed");

    const booked = count || 0;
    const available = Math.max(0, slot.capacity - booked);

    dates.push({ date: dateStr, available });
    found++;
  }

  return NextResponse.json({ slot, dates });
}
