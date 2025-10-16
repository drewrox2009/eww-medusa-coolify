"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  CreditCard,
  LogOut,
  Settings,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import { useUserStore } from "@/lib/store/user-store";

const quickLinks = [
  { href: "/account", label: "Account Overview", icon: User },
  { href: "/account/orders", label: "Order History", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: Settings },
  { href: "/account/payment", label: "Payment Methods", icon: CreditCard },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loadUser } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    loadUser();
  }, [isAuthenticated, loadUser, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-slate-500">Preparing your account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <section className="section-padding pt-0">
        <div className="container-custom space-y-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <span className="badge-soft bg-primary-100 text-primary-800">
                Welcome back
              </span>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Account dashboard
              </h1>
              <p className="text-sm text-slate-600">
                Manage your orders, secure payment preferences, and personal
                information.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-primary-600"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.33fr)_minmax(0,1fr)]">
            <aside className="card-surface h-full space-y-6 p-6">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600">
                  <User className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  {user.phone && (
                    <p className="text-xs text-slate-500">{user.phone}</p>
                  )}
                </div>
              </div>

              <nav className="space-y-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = link.href === "/account";
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-primary-500/15 text-primary-700 shadow-subtle"
                          : "text-slate-600 hover:bg-slate-100 hover:text-primary-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <div className="space-y-6">
              <div className="card-surface grid gap-6 p-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-primary-100 bg-white/70 p-5">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600">
                      <Package className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Orders placed
                      </p>
                      <p className="text-2xl font-semibold text-primary-600">
                        0
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    Once you place your first order, status updates and tracking
                    will appear here.
                  </p>
                </div>

                <div className="rounded-2xl border border-primary-100 bg-white/70 p-5">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Account status
                      </p>
                      <p className="text-2xl font-semibold text-emerald-500">
                        Active
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    Your account is verified and ready for secure transactions.
                  </p>
                </div>
              </div>

              <div className="card-surface p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Recent activity
                    </h2>
                    <p className="text-sm text-slate-500">
                      Order confirmations, shipment tracking, and account
                      updates appear in this timeline.
                    </p>
                  </div>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-500"
                  >
                    Browse products
                  </Link>
                </div>
                <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
                  <CalendarCheck className="h-10 w-10 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-700">
                    You have no recent orders yet
                  </p>
                  <p className="text-xs text-slate-500">
                    Place your first order to activate real-time status updates.
                  </p>
                </div>
              </div>

              <div className="card-surface p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Account preferences
                </h2>
                <div className="mt-6 space-y-5">
                  <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Email address
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-500">
                      Update
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Password
                      </p>
                      <p className="text-xs text-slate-500">
                        Last updated within the past 90 days
                      </p>
                    </div>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-500">
                      Manage
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Phone number
                      </p>
                      <p className="text-xs text-slate-500">
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-500">
                      {user.phone ? "Edit" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
