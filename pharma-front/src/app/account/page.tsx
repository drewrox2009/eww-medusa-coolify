"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, CreditCard, LogOut, Settings } from "lucide-react";
import { useUserStore } from "@/lib/store/user-store";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loadUser } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Load user data if needed
    loadUser();
  }, [isAuthenticated, router, loadUser]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-custom">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome back, {user.first_name || user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-primary-100 rounded-full p-3">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.phone && (
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  )}
                </div>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/account"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md"
                >
                  <User className="h-4 w-4 mr-3" />
                  Account Overview
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  <Package className="h-4 w-4 mr-3" />
                  Order History
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Addresses
                </Link>
                <Link
                  href="/account/payment"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Payment Methods
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Account Overview */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Account Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-primary-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Total Orders
                        </p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CreditCard className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Account Status
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h2>

                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No orders yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    When you place your first order, it will appear here.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/products"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Browse Products
                    </Link>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Account Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Email Address
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Password
                      </p>
                      <p className="text-sm text-gray-500">
                        Last updated recently
                      </p>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Phone Number
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      {user.phone ? "Change" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
        <div className="container-custom">
          <div className="text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Oceanica Pharma. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
