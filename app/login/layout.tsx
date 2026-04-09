import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Embrace Boxing",
  description: "Sign in to Embrace Boxing with Google, Apple, or email.",
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
