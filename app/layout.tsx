import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

import ToolMenuWrapper from "@/components/ToolMenuWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import ConsentBanner from "@/components/ConsentBanner";

export const metadata: Metadata = {
  title: "PocketTool — Quick, private web tools",
  description:
    "QR & Wi-Fi codes, image and PDF tools, formatters and random generators — all running locally in your browser.",
  manifest: "/manifest.json",
  themeColor: "#3B82F6",
  openGraph: {
    title: "PocketTool — Quick, private web tools",
    description:
      "All tools run locally. Generate QR codes, convert images, merge PDFs, format JSON/YAML/XML, and more.",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PocketTool — Quick, private web tools",
    description:
      "All tools run locally. Generate QR codes, convert images, merge PDFs, format JSON/YAML/XML, and more.",
    images: ["/icons/icon-512.png"],
  },
};

// Inline script that runs before React hydrates, to avoid SSR/CSR mismatches
const themeInitScript = `
  try {
    var d = document.documentElement;
    var saved = localStorage.getItem('pk_theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var mode = saved ? saved : (prefersDark ? 'dark' : 'light');
    if (mode === 'dark') d.classList.add('theme-dark'); else d.classList.remove('theme-dark');
  } catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ensure theme class is set before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-dvh bg-[hsl(var(--bg))] text-[hsl(var(--text))]">
        {/* Collapsible sidebar trigger */}
        <ToolMenuWrapper />

        <div className="min-h-dvh flex flex-col">
          {/* Header with brand gradient */}
          <header className="header brand-gradient">
            <div className="mx-auto container-wrap px-4 h-14 flex items-center justify-between">
              <Link
                href="/"
                className="no-underline font-semibold tracking-tight"
                style={{ color: "white" }}
              >
                PocketTool
              </Link>

              <div className="flex items-center gap-3">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="mx-auto container-wrap px-4 py-8 flex-1">{children}</main>

          {/* Footer with gradient and links */}
          <footer className="brand-gradient">
            <div className="mx-auto container-wrap px-4 py-5 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ color: "white" }}>
              <div>© {new Date().getFullYear()} PocketTool — Tools run locally in your browser.</div>
              <nav className="flex gap-4">
                <Link href="/privacy" className="hover:underline">Privacy</Link>
                <Link href="/terms" className="hover:underline">Terms</Link>
                <Link href="/about" className="hover:underline">About</Link>
              </nav>
            </div>
          </footer>
        </div>

        <ConsentBanner />
      </body>
    </html>
  );
}
