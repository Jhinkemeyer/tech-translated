import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Tech Translated",
  description:
    "Complex tech, translated. Practical advice and insights for your digital life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-50 antialiased min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <header className="border-b border-zinc-800 pb-4 pt-6 mb-8">
          {/* UPDATED: Changed to flex-col on mobile, sm:flex-row on desktop, added gap for mobile spacing */}
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
            {/* The Custom Typography Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {/* "Tech" */}
              <div className="flex items-center">
                <div className="relative w-10 h-10 z-10">
                  <Image
                    src="/logo-clear.png"
                    alt="T"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                {/* The -ml-3 pulls the text to the left, overlapping the transparent space */}
                <span className="text-3xl font-bold tracking-tight text-zinc-50 -ml-3 z-20">
                  ech
                </span>
              </div>

              {/* "Translated" */}
              <div className="flex items-center">
                <div className="relative w-10 h-10 z-10">
                  <Image
                    src="/logo-clear.png"
                    alt="T"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-3xl font-bold tracking-tight text-zinc-50 -ml-3 z-20">
                  ranslated
                </span>
              </div>
            </Link>

            {/* UPDATED: Added flex-wrap and responsive gaps so links don't break on tiny screens */}
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-medium text-zinc-400">
              <Link href="/" className="hover:text-zinc-50 transition-colors">
                Home
              </Link>
              <Link
                href="/archive"
                className="hover:text-zinc-50 transition-colors"
              >
                Archive
              </Link>
              <Link
                href="/bio"
                className="hover:text-zinc-50 transition-colors"
              >
                Bio
              </Link>
              <Link
                href="/contact"
                className="hover:text-zinc-50 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area (Where your pages inject) */}
        <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
          {children}
        </main>

        {/* Footer with Hidden Admin Link */}
        <footer className="border-t border-zinc-900 py-8 mt-auto">
          <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-xs text-zinc-600">
            <p>© {new Date().getFullYear()} Joshua H. All rights reserved.</p>
            <Link
              href="/admin"
              className="hover:text-zinc-400 transition-colors"
            >
              Admin
            </Link>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
