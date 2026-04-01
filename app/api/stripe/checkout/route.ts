import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to purchase a plan" },
        { status: 401 }
      );
    }

    const { plan } = await request.json();

    if (!plan || !["10class", "unlimited"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planConfig = PLANS[plan as "10class" | "unlimited"];
    const origin = request.headers.get("origin") || "http://localhost:3000";

    if (plan === "unlimited") {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: planConfig.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: `${origin}/account?success=1`,
        cancel_url: `${origin}/plans-pricing?canceled=1`,
        customer_email: user.email!,
        metadata: {
          user_id: user.id,
          plan_type: "unlimited",
        },
        subscription_data: {
          metadata: {
            user_id: user.id,
            plan_type: "unlimited",
          },
          trial_period_days: 1,
        },
      });
      return NextResponse.json({ url: session.url });
    }

    if (plan === "10class") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price: planConfig.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: `${origin}/account?success=1`,
        cancel_url: `${origin}/plans-pricing?canceled=1`,
        customer_email: user.email!,
        metadata: {
          user_id: user.id,
          plan_type: "10class",
        },
      });
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
