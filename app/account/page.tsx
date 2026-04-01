import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountDashboard } from "@/components/AccountDashboard";

export const metadata: Metadata = {
  title: "My Account | Embrace Boxing",
  description: "Manage your subscription and class bookings.",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <AccountDashboard user={user} />
    </div>
  );
}
