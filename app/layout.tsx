/* eslint-disable @next/next/no-img-element */
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

import ToolMenuWrapper from "@/components/ToolMenuWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import ConsentBanner from "@/components/ConsentBanner";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["600"], // semi-bold
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Utilixy — Quick, private web tools",
  description:
    "QR & Wi-Fi codes, image and PDF tools, formatters and random generators — all running locally in your browser.",
  manifest: "/manifest.json",
  themeColor: "#3B82F6",
  openGraph: {
    title: "Utilixy — Quick, private web tools",
    description:
      "All tools run locally. Generate QR codes, convert images, merge PDFs, format JSON/YAML/XML, and more.",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utilixy — Quick, private web tools",
    description:
      "All tools run locally. Generate QR codes, convert images, merge PDFs, format JSON/YAML/XML, and more.",
    images: ["/icons/icon-512.png"],
  },
};

// Runs before hydration to avoid SSR/CSR theme mismatch
const themeInitScript = `
  try {
    var d = document.documentElement;
    var saved = localStorage.getItem('utilixy_theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var mode = saved ? saved : (prefersDark ? 'dark' : 'light');
    if (mode === 'dark') d.classList.add('theme-dark'); else d.classList.remove('theme-dark');
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ensure theme class is set before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-dvh bg-[hsl(var(--bg))] text-[hsl(var(--text))]">
        {/* Collapsible sidebar trigger (hamburger lives here; compact styling in component) */}
        <ToolMenuWrapper />

        <div className="min-h-dvh flex flex-col">
          {/* Neutral glass header */}


{/* Header */}
<header className="header bg-[hsl(var(--bg))]/90 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--bg))]/80 border-b border-line">
  <div className="mx-auto container-wrap h-14 md:h-16 relative flex items-center justify-between">
    {/* Hamburger on small screens */}
    <div className="flex items-center md:hidden">
      <ToolMenuWrapper />
    </div>

    {/* Brand */}
    <Link
      href="/"
      aria-label="Utilixy home"
      className="flex items-center gap-2 no-underline
                 md:static md:translate-x-0
                 absolute left-1/2 -translate-x-1/2 md:left-auto"
    >
      <img
        src="/utilixy-nav.svg"
        alt=""
        aria-hidden="true"
        className="h-11 w-auto md:h-14"
      />
      <span className="text-[20px] md:text-[24px] tracking-tight font-semibold">
        Utilixy
      </span>
    </Link>

    {/* Theme toggle */}
    <div className="flex items-center">
      <ThemeToggle />
    </div>
  </div>
</header>





          {/* Main content */}
          <main className="mx-auto container-wrap px-4 py-8 flex-1">
            {children}
          </main>

          {/* Footer: keep the pleasant blue gradient */}
          <footer className="brand-gradient">
            <div
              className="mx-auto container-wrap px-4 py-5 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              style={{ color: "white" }}
            >
              <div>
                © {new Date().getFullYear()} Utilixy — Tools run locally in your
                browser.
              </div>
              <nav className="flex gap-4">
                <Link href="/privacy" className="hover:underline">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:underline">
                  Terms
                </Link>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </nav>
            </div>
          </footer>
        </div>

        <ConsentBanner />
      </body>
    </html>
  );
}
