import Link from "next/link";
import Image from "next/image";

const secondaryLinks = [
  { href: "/about", label: "About" },
  { href: "/personal-training", label: "Personal Training" },
  { href: "/coaches", label: "Coaches" },
  { href: "/account", label: "Account" },
];

export function Footer() {
  return (
    <footer className="border-t border-embrace-border bg-white">
      <div className="mx-auto max-w-8xl px-8 lg:px-16" style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>
        <div className="mb-16">
          <div className="relative h-10 w-36" style={{ filter: "invert(1)" }}>
            <Image
              src="/embrace-logo-white.png"
              alt="Embrace Boxing"
              fill
              style={{ objectFit: "contain", objectPosition: "left" }}
            />
          </div>
        </div>

        {/* Shop · Plans · Schedule — primary destinations */}
        <div className="mb-16 grid gap-10 border-b border-embrace-border pb-16 md:grid-cols-3 md:gap-6">
          <div className="md:border-r md:border-embrace-border md:pr-8">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-embrace-muted">Shop</p>
            <Link
              href="https://embraceshop.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold tracking-tight text-embrace-black transition-colors hover:text-embrace-muted"
            >
              Shop the Collection
            </Link>
            <p className="mt-2 text-sm text-embrace-muted">Performance wear · Embrace Boutique</p>
          </div>
          <div className="md:border-r md:border-embrace-border md:px-2 md:pr-8 lg:px-4">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-embrace-muted">Plans</p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/plans-pricing"
                  className="text-lg font-semibold tracking-tight text-embrace-black transition-colors hover:text-embrace-muted"
                >
                  Membership &amp; pricing
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-sm text-embrace-muted transition-colors hover:text-embrace-black">
                  Book a class
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-embrace-muted">Schedule</p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/classes"
                  className="text-lg font-semibold tracking-tight text-embrace-black transition-colors hover:text-embrace-muted"
                >
                  Class timetable
                </Link>
              </li>
              <li>
                <Link href="/classes" className="text-sm text-embrace-muted transition-colors hover:text-embrace-black">
                  Women-only sessions · London
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-14 md:grid-cols-3">
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-embrace-muted">About</p>
            <p className="text-sm text-embrace-muted" style={{ lineHeight: 1.7 }}>
              UK&rsquo;s Premier Women&rsquo;s Boxing Training. Train under World Champion Ruqsana Begum in a safe,
              empowering, women-only environment.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-embrace-muted">More</p>
            <ul className="space-y-3">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-embrace-black transition-colors hover:text-embrace-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-embrace-muted">Contact</p>
            <p className="mb-5 text-sm text-embrace-muted" style={{ lineHeight: 1.7 }}>
              Book 1-1 personal training sessions directly with Ruqsana via WhatsApp.
            </p>
            <Link
              href="/personal-training"
              className="text-sm font-medium text-embrace-black underline-offset-4 hover:underline"
            >
              Personal Training →
            </Link>
          </div>
        </div>

        <div
          className="flex flex-col gap-3 pt-8 md:flex-row md:items-center md:justify-between"
          style={{ borderTop: "1px solid #d2d2d7" }}
        >
          <p className="text-xs text-embrace-muted">© {new Date().getFullYear()} Embrace Boxing. All rights reserved.</p>
          <p className="text-xs text-embrace-muted">Women-Only Boxing · London, UK</p>
        </div>
      </div>
    </footer>
  );
}
