import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Translated",
  description: "Signal. No noise. A tech blog by Joshua Hinkemeyer.",
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
        <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:text-zinc-300 transition-colors"
            >
              Tech Translated
            </Link>
            <nav className="flex gap-6 text-sm font-medium text-zinc-400">
              <Link href="/" className="hover:text-zinc-50 transition-colors">
                Home
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
            <p>
              © {new Date().getFullYear()} Joshua Hinkemeyer. All rights
              reserved.
            </p>
            <Link
              href="/admin"
              className="hover:text-zinc-400 transition-colors"
            >
              Admin
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
