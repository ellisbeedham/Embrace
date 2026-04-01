import type { Metadata } from "next";
import { PlanCard } from "@/components/PlanCard";

export const metadata: Metadata = {
  title: "Plans & Pricing | Embrace Boxing",
  description:
    "Choose your perfect boxing class package. Free trial, 10-class pack, or unlimited monthly membership.",
};

export default function PlansPricingPage() {
  return (
    <div className="bg-white pt-24 pb-32 px-6 lg:px-12">
      <div className="max-w-8xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-xs font-medium tracking-widest uppercase text-embrace-muted mb-5">
            Membership
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter leading-tight mb-6">
            Choose Your Plan.
          </h1>
          <p className="text-lg text-embrace-muted">
            Flexible packages designed to fit your schedule and commitment level.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <PlanCard
            name="Free Trial"
            price={0}
            description="Your first class, on us. No commitment needed — just show up."
            features={["1 free class", "Valid for 7 days", "New members only"]}
            cta="Book Free Trial"
            ctaHref="/book?trial=1"
            highlight={false}
          />
          <PlanCard
            name="10 Class Pack"
            price={140}
            description="The most flexible way to train. Use your credits whenever suits you."
            features={[
              "10 class credits",
              "Valid for 3 months",
              "Any class on the timetable",
              "Boxing & Muay Thai",
            ]}
            cta="Get Started"
            ctaHref="/plans-pricing/checkout?plan=10class"
            highlight={true}
          />
          <PlanCard
            name="Unlimited"
            price={95.99}
            period="/month"
            description="Train as much as you like. Full access to every class, every week."
            features={[
              "Unlimited classes",
              "1 day free trial",
              "Cancel anytime",
              "All class types included",
            ]}
            cta="Start Free Trial"
            ctaHref="/plans-pricing/checkout?plan=unlimited"
            highlight={false}
          />
        </div>

        {/* FAQ teaser */}
        <div className="mt-24 pt-16 border-t border-embrace-border text-center">
          <p className="text-embrace-muted text-sm">
            Questions?&nbsp;
            <a
              href="/personal-training"
              className="text-embrace-black font-medium underline underline-offset-4 hover:text-embrace-muted"
            >
              Contact us via WhatsApp →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
