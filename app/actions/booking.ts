"use server";

// TODO: Integrate Supabase DB insert and Stripe checkout here
export async function bookClasses(classes: any[]) {
  void classes;
  await new Promise((r) => setTimeout(r, 1500));
  return { success: true, message: "Booking confirmed!" };
}
