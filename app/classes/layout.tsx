import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classes | Embrace Boxing",
  description:
    "Weekly class schedule and disciplines — women-only boxing, Muay Thai, and more at Embrace Boxing, London.",
};

export default function ClassesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
