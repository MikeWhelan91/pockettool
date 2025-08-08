import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import ConsentBanner from "../components/ConsentBanner";
import { Suspense } from "react";
import ToolMenuWrapper from "../components/ToolMenuWrapper";

export const metadata: Metadata = {
  title: "PocketKit — All-in-One Web Toolkit",
  description: "Quick, private web tools including QR, password, PDF and image utilities.",
  manifest: "/manifest.json",
  themeColor: "#3B82F6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-neutral-950 text-white">
        {/* ✅ Client-side floating sidebar */}
        <ToolMenuWrapper />

        <div className="min-h-screen flex flex-col items-center">
          <header className="sticky top-0 z-30 backdrop-blur border-b border-neutral-800 bg-neutral-950/80 w-full">
            <div className="flex items-center gap-4 py-3 px-4 max-w-screen-lg mx-auto">
              <Link href="/" className="font-semibold tracking-tight text-lg ml-2">
                🧰 PocketKit
              </Link>
            </div>
          </header>

          <main className="flex-1 py-6 px-4 w-full max-w-screen-lg">
            <ConsentBanner />
            {children}
          </main>

          <footer className="px-4 py-6 text-sm text-neutral-400 w-full max-w-screen-lg">
            <div className="flex flex-wrap gap-4">
              <Suspense fallback={<span>© PocketKit</span>}>
                <DynamicCopyright />
              </Suspense>
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

function DynamicCopyright() {
  if (typeof window === "undefined") return null;
  return <span>© {new Date().getFullYear()} PocketKit</span>;
}
