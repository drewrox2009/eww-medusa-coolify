import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils/cn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oceanica Pharma - Affordable Generic Medications",
  description:
    "Trusted international pharmacy offering affordable generic medications with secure cryptocurrency payments.",
};

const footerColumns = [
  {
    title: "Care & Support",
    links: [
      { href: "/contact", label: "Contact Support" },
      { href: "/faq", label: "FAQs" },
      { href: "/shipping", label: "Shipping & Delivery" },
      { href: "/returns", label: "Returns & Refunds" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Oceanica" },
      { href: "/categories", label: "Browse Categories" },
      { href: "/products", label: "Shop Medications" },
      { href: "/blog", label: "Health Insights" },
    ],
  },
  {
    title: "Compliance",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/refund", label: "Refund Policy" },
      { href: "/legal", label: "Legal Notice" },
    ],
  },
];

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container-custom">
        <div className="border-b border-slate-800 py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
            <div className="space-y-8">
              <div className="max-w-xl space-y-4">
                <p className="badge-soft bg-primary-100 text-primary-800">
                  Trusted International Pharmacy
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  Oceanica Pharma
                </h3>
                <p className="text-sm text-slate-400">
                  Delivering quality-assured generic medications with discreet,
                  trackable shipping and secure cryptocurrency payments.
                  Licensed partners across 40+ countries ensure genuine supply
                  chains you can trust.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="rounded-full border border-slate-800 px-4 py-2">
                    ✓ Licensed Pharmacists
                  </span>
                  <span className="rounded-full border border-slate-800 px-4 py-2">
                    ✓ Secure Checkout
                  </span>
                  <span className="rounded-full border border-slate-800 px-4 py-2">
                    ✓ Discreet Packaging
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl shadow-primary-900/10">
              <h4 className="text-lg font-semibold text-white">
                Stay informed on new treatments
              </h4>
              <p className="mt-2 text-sm text-slate-400">
                Clinical updates, shipping alerts, and exclusive savings. No
                spam.
              </p>
              <form className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-12 flex-1 rounded-full border border-slate-700 bg-slate-950/60 px-5 text-sm text-white placeholder:text-slate-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/40"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary-500 px-6 text-sm font-semibold text-white transition hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/40"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-3 text-xs text-slate-500">
                We respect your privacy. You can unsubscribe at any time.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                  {column.title}
                </h5>
                <ul className="space-y-2 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-slate-400 transition hover:text-primary-100"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="space-y-4">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                Payment Methods
              </h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Bitcoin (BTC) & Lightning Network</li>
                <li>• Solana (SOL)</li>
                <li>• Stablecoins (USDC)</li>
                <li>• Discreet crypto settlements</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Oceanica Pharma. All rights
            reserved.
          </p>
          <p>
            This website provides demonstration content and is not a pharmacy of
            record.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-slate-50 text-slate-900",
          inter.className
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1 pb-24 pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
