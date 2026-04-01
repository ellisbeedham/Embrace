import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookPageClient } from "@/components/BookPageClient";

export const metadata: Metadata = {
  title: "Book a Class | Embrace Boxing",
  description: "Book your women's boxing or Muay Thai class in London.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ trial?: string }>;
}) {
  const { trial } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isTrial = trial === "1";

  if (isTrial && !user) {
    redirect("/signup?redirect=/book?trial=1");
  }

  const { data: classes } = await supabase
    .from("class_slots")
    .select("*")
    .order("day_of_week");

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Book a Class</h1>
      <p className="text-embrace-muted mb-8">
        {isTrial
          ? "You're booking your free trial class. Choose a date below."
          : "Select a class and date to book your spot."}
      </p>
      <BookPageClient
        classes={classes || []}
        user={user}
        isTrial={!!isTrial}
      />
    </div>
  );
}
