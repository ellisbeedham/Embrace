"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 px-6 pt-[calc(var(--nav-height,48px)+2rem)] pb-16 text-center">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900">Something went wrong</h1>
      <p className="max-w-md text-sm text-gray-500">
        {error.message || "An unexpected error occurred. You can try again or refresh the page."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
