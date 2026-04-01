"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f5f5f7] text-[#1d1d1f]" style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="max-w-md text-sm text-gray-600">
            {error.message || "Please refresh the page or try again."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
