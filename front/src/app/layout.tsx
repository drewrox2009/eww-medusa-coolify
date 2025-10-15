import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils/cn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Octochems - Research-Grade Chemical Compounds",
  description:
    "Premium nootropics and research chemicals for scientific exploration with secure cryptocurrency payments.",
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
    <footer className="bg-gray-800 text-gray-300">
      <div className="container-custom">
        <div className="border-b border-gray-700 py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
            <div className="space-y-8">
              <div className="max-w-xl space-y-4">
                <p className="badge">
                  Trusted International Pharmacy
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  Octochems
                </h3>
                <p className="text-sm text-gray-400">
                  Research-grade chemical compounds for scientific exploration with discreet,
                  trackable shipping and secure cryptocurrency payments.
                  Licensed partners across 40+ countries ensure genuine supply
                  chains you can trust.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span className="rounded-full border border-gray-700 px-4 py-2">
                    ✓ Licensed Pharmacists
                  </span>
                  <span className="rounded-full border border-gray-700 px-4 py-2">
                    ✓ Secure Checkout
                  </span>
                  <span className="rounded-full border border-gray-700 px-4 py-2">
                    ✓ Discreet Packaging
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-700 bg-gray-900/40 p-8 shadow-2xl shadow-primary-900/10">
              <h4 className="text-lg font-semibold text-white">
                Stay informed on new treatments
              </h4>
              <p className="mt-2 text-sm text-gray-400">
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
                  className="h-12 flex-1 rounded-full border border-gray-600 bg-gray-900 px-5 text-sm text-white placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/40"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-3 text-xs text-gray-500">
                We respect your privacy. You can unsubscribe at any time.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
                  {column.title}
                </h5>
                <ul className="space-y-2 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-400 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="space-y-4">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
                Payment Methods
              </h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Bitcoin (BTC) & Lightning Network</li>
                <li>• Solana (SOL)</li>
                <li>• Stablecoins (USDC)</li>
                <li>• Discreet crypto settlements</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-8 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Octochems. All rights
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
          "min-h-screen bg-white text-gray-900",
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
