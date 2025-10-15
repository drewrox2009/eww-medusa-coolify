import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Octochems - Research-Grade Chemical Compounds",
  description: "Premium nootropics and research chemicals for scientific exploration. Quality-verified compounds with transparent sourcing and discreet shipping worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <img
                    src="/octochems-logo.svg"
                    alt="Octochems"
                    className="h-8 w-8 brightness-0 invert"
                  />
                  <span className="text-xl font-bold text-white">Octochems</span>
                </div>
                <p className="text-sm text-gray-400 max-w-md">
                  Research-grade chemical compounds for scientific exploration.
                  Quality-verified with transparent sourcing and discreet worldwide shipping.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Products</h3>
                <ul className="space-y-2">
                  <li><a href="/products" className="text-sm text-gray-400 hover:text-white transition-colors">All Compounds</a></li>
                  <li><a href="/categories" className="text-sm text-gray-400 hover:text-white transition-colors">Categories</a></li>
                  <li><a href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">Quality Standards</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a></li>
                  <li><a href="/shipping" className="text-sm text-gray-400 hover:text-white transition-colors">Shipping</a></li>
                  <li><a href="/returns" className="text-sm text-gray-400 hover:text-white transition-colors">Returns</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-400 text-center">
                © 2025 Octochems. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
