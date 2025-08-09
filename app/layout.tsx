import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import ConsentBanner from "../components/ConsentBanner";
import ToolMenuWrapper from "../components/ToolMenuWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import { Space_Grotesk } from "next/font/google";

export const metadata: Metadata = {
  title: "PocketKit — All-in-One Web Toolkit",
  description: "Quick, private web tools including QR, password, PDF and image utilities.",
  manifest: "/manifest.json",
  themeColor: "#3B82F6",
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`theme-light ${spaceGrotesk.className}`}>
            <body suppressHydrationWarning className="bg-[var(--bg)] text-[var(--text)]">
        {/* Floating sidebar */}
        <ToolMenuWrapper />

        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header
            role="banner"
            className="sticky top-0 z-30 border-b border-[color:var(--stroke)] bg-[color:var(--bg)]/95 backdrop-blur"
          >
            <div className="container-pk h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
                <span className="text-xl leading-none">🧰</span>
                <span>Pocket<span className="text-[color:var(--brand)]">Kit</span></span>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1 container-pk py-8">
            <ConsentBanner />
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-[color:var(--stroke)] bg-[color:var(--bg-soft)]/60">
            <div className="container-pk py-6 text-sm text-[color:var(--text-muted)] flex flex-wrap items-center gap-4">
              <span>© {new Date().getFullYear()} PocketKit</span>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/terms" className="hover:underline">Terms</Link>
              <Link href="/cookies" className="hover:underline">Cookies</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
