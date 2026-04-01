import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Load Inter as the web fallback; system fonts (SF Pro on Apple) take priority via CSS
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Embrace Boxing | Women's Boxing London",
  description:
    "UK's Premier Women's Boxing Training. Train under Muay Thai & Boxing World Champion Ruqsana Begum. Beginner-friendly classes in London.",
  openGraph: {
    title: "Embrace Boxing | Women's Boxing London",
    description:
      "Train under a World Champion. Women-only boxing classes in London.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {
    const supabase = await createClient();
    await supabase.auth.getUser();
  } catch {
    /* ignore: session refresh is optional when Supabase/env is unavailable */
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif" }}>
        <Navbar />
        {/* Hero page: no top-padding (hero is full-screen and handles its own spacing).
            Other pages: add padding equal to the nav height. */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
