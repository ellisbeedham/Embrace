import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Embrace Boxing",
  description: "Membership, upcoming classes, and account settings.",
};

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
