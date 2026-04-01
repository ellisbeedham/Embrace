import Stripe from "stripe";

/* Avoid crashing Next.js build / dev when env is not loaded yet; real routes must set STRIPE_SECRET_KEY. */
const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY ||
  "sk_test_0000000000000000000000000000000000000000000000000000000000000000";

export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
});

export const PLANS = {
  trial: {
    name: "Free Trial",
    price: 0,
    stripePriceId: null,
    type: "trial" as const,
    remainingClasses: 1,
    validMonths: 0,
    validDays: 7,
  },
  "10class": {
    name: "10 Boxing Classes",
    price: 14000, // £140 in pence
    stripePriceId: process.env.STRIPE_PRICE_10CLASS!,
    type: "10class" as const,
    remainingClasses: 10,
    validMonths: 3,
    validDays: 0,
  },
  unlimited: {
    name: "Unlimited Plan",
    price: 9599, // £95.99 in pence
    stripePriceId: process.env.STRIPE_PRICE_UNLIMITED!,
    type: "unlimited" as const,
    remainingClasses: null,
    validMonths: 0,
    validDays: 0,
  },
} as const;
