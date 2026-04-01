import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Missing Supabase configuration" },
      { status: 500 }
    );
  }
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook config" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature failed: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const planType = session.metadata?.plan_type;

        if (!userId || !planType) {
          console.error("Missing metadata in checkout session");
          break;
        }

        const validUntil = new Date();
        if (planType === "10class") {
          validUntil.setMonth(validUntil.getMonth() + 3);
        } else if (planType === "unlimited") {
          validUntil.setFullYear(validUntil.getFullYear() + 10);
        }

        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            plan_type: planType,
            remaining_classes: planType === "10class" ? 10 : null,
            valid_until: validUntil.toISOString().split("T")[0],
            stripe_customer_id: session.customer as string,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;

        if (!userId) break;

        if (subscription.status === "active") {
          await supabaseAdmin.from("subscriptions").upsert(
            {
              user_id: userId,
              plan_type: "unlimited",
              remaining_classes: null,
              valid_until: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );
        } else {
          await supabaseAdmin
            .from("subscriptions")
            .delete()
            .eq("user_id", userId)
            .eq("plan_type", "unlimited");
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
