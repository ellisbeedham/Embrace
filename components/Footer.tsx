import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/plans-pricing",    label: "Plans & Pricing" },
  { href: "/book",             label: "Book a Class" },
  { href: "/about",            label: "About" },
  { href: "/personal-training",label: "Personal Training" },
  { href: "/coaches",          label: "Coaches" },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-embrace-border">
      <div className="max-w-8xl mx-auto px-8 lg:px-16" style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>

        {/* Logo (add `/public/embrace-logo-white.png`) */}
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

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mb-16">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-embrace-muted mb-5">
              About
            </p>
            <p className="text-sm text-embrace-muted" style={{ lineHeight: 1.7 }}>
              UK&rsquo;s Premier Women&rsquo;s Boxing Training. Train under World Champion
              Ruqsana Begum in a safe, empowering, women-only environment.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-embrace-muted mb-5">
              Quick Links
            </p>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-embrace-black hover:text-embrace-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-embrace-muted mb-5">
              Contact
            </p>
            <p className="text-sm text-embrace-muted mb-5" style={{ lineHeight: 1.7 }}>
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

        {/* Bottom row */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-8"
          style={{ borderTop: "1px solid #d2d2d7" }}
        >
          <p className="text-xs text-embrace-muted">
            © {new Date().getFullYear()} Embrace Boxing. All rights reserved.
          </p>
          <p className="text-xs text-embrace-muted">
            Women-Only Boxing · London, UK
          </p>
        </div>

      </div>
    </footer>
  );
}
