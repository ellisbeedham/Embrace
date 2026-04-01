"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const [status, setStatus] = useState<"loading" | "redirecting" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plan || !["10class", "unlimited"].includes(plan)) {
      setStatus("error");
      setError("Invalid plan");
      return;
    }

    async function startCheckout() {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          const redirect = encodeURIComponent(
            `/plans-pricing/checkout?plan=${plan}`
          );
          window.location.href = `/login?redirect=${redirect}`;
          return;
        }
        setStatus("error");
        setError(data.error || "Failed to start checkout");
        return;
      }

      if (data.url) {
        setStatus("redirecting");
        window.location.href = data.url;
      } else {
        setStatus("error");
        setError("No checkout URL received");
      }
    }

    startCheckout();
  }, [plan]);

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout Error</h1>
        <p className="text-embrace-muted mb-6">{error}</p>
        <Link
          href="/plans-pricing"
          className="text-embrace-accent hover:underline"
        >
          Back to Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="animate-pulse">
        <h1 className="text-2xl font-bold mb-4">
          {status === "redirecting"
            ? "Redirecting to Stripe..."
            : "Preparing checkout..."}
        </h1>
        <p className="text-embrace-muted">
          You will be redirected to complete your payment securely.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <h1 className="text-2xl font-bold mb-4">Preparing checkout...</h1>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
