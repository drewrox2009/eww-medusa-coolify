import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Octochems - Research Compounds",
  description: "Lab-tested research compounds for scientific exploration. Third-party verified quality with transparent sourcing and discreet worldwide shipping.",
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
        <footer className="relative bg-gray-900 text-gray-300 pt-24 pb-12">
          {/* Logo Overlap */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white rounded-full p-6 shadow-xl border-4 border-gray-900">
              <img
                src="/octochems_hex_no_bottom_text.svg"
                alt="Octochems"
                className="h-16 w-16 sm:h-20 sm:w-20"
              />
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">Octochems</h3>
                <p className="text-sm text-gray-400 max-w-md">
                  Research-grade compounds for scientific exploration.
                  Lab-tested quality with transparent sourcing and worldwide delivery.
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
                  <li><a href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800">
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
