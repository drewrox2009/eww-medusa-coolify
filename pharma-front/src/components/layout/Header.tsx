"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, X, Headphones } from "lucide-react";
import { useUserStore } from "@/lib/store/user-store";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Support" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useUserStore();
  const { itemCount } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        "backdrop-blur-lg",
        isScrolled
          ? "border-primary-100/70 bg-white/95 shadow-[0_8px_30px_rgba(37,99,235,0.12)]"
          : "border-transparent bg-white/70"
      )}
    >
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-primary-700">
              Oceanica Pharma
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-primary-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-100 bg-white text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[11px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/contact"
              className="hidden items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-medium text-primary-700 transition hover:border-primary-200 hover:bg-primary-50 lg:inline-flex"
            >
              <Headphones className="h-4 w-4" />
              Live Support
            </Link>

            {isAuthenticated ? (
              <Link
                href="/account"
                className="hidden items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-500 lg:inline-flex"
              >
                <User className="h-4 w-4" />
                {user?.first_name || "Account"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-full border border-primary-200 bg-white px-5 py-2 text-sm font-semibold text-primary-600 shadow-sm transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 lg:inline-flex"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((state) => !state)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary-100 bg-white text-slate-600 transition hover:border-primary-200 hover:text-primary-600 lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="pb-6 lg:hidden">
            <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-lg shadow-primary-100/40">
              <nav className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-medium text-slate-700 transition hover:text-primary-600"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                  >
                    <User className="h-4 w-4" />
                    Manage Account
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                    >
                      <User className="h-4 w-4" />
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-full border border-primary-200 bg-white px-5 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
                    >
                      Create Account
                    </Link>
                  </div>
                )}

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary-50 px-5 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
                >
                  <Headphones className="h-4 w-4" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
