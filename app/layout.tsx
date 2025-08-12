import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ToolMenuWrapper from "@/components/ToolMenuWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import FooterMultiplex from "@/components/ads/FooterMultiplex";

import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Utilixy — Quick, private web tools",
  description:
    "QR & Wi-Fi codes, image and PDF tools, formatters and random generators — all running locally in your browser.",
  manifest: "/manifest.json",
  themeColor: "#3B82F6",
  metadataBase: new URL("https://utilixy.com"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  keywords: [
    "PDF tools",
    "QR code generator",
    "image converter",
    "JSON formatter",
    "Base64 encoder",
    "random generator",
  ],
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
// default to dark unless the user has explicitly chosen otherwise
const themeInitScript = `
  try {
    var d = document.documentElement;
    var saved = localStorage.getItem('utilixy_theme'); // 'light' | 'dark'
    var mode = saved || 'dark';
    if (mode === 'dark') d.classList.add('theme-dark'); else d.classList.remove('theme-dark');
  } catch (e) {}
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Utilixy",
  url: "https://utilixy.com",
  description: "Quick, private web tools that run locally in your browser.",
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Utilixy",
  url: "https://utilixy.com",
  logo: "https://utilixy.com/icons/icon-512.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          ad_storage: 'denied',
          analytics_storage: 'denied'
        });
      `,
          }}
        />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1257499604453174"
          crossOrigin="anonymous"
        />

        {/* Ensure theme class is set before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-dvh bg-[hsl(var(--bg))] text-[hsl(var(--text))]">
        {/* Collapsible sidebar trigger (hamburger lives here; compact styling in component) */}

        <div className="min-h-dvh flex flex-col">
          {/* Neutral glass header */}

          {/* Header */}
          <header className="header bg-[hsl(var(--bg))]/90 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--bg))]/80 border-b border-line">
            <div className="mx-auto container-wrap h-14 md:h-16 grid grid-cols-3 items-center md:flex md:items-center md:justify-between">
              {/* Mobile hamburger (left) */}
              <div className="md:hidden justify-self-start">
                <ToolMenuWrapper />
              </div>

              {/* Brand — centered on mobile, left-aligned on desktop */}
              <Link
                href="/"
                aria-label="Utilixy home"
                className="col-start-2 justify-self-center md:col-auto md:justify-self-start flex items-center gap-2 no-underline"
              >
                <Image
                  src="/utilixy-nav.svg"
                  alt=""
                  aria-hidden="true"
                  width={500}
                  height={500}
                  priority
                  className="h-14 w-auto md:h-16"
                />
                <span className="text-[26px] md:text-[26px] tracking-tight font-semibold">
                  Utilixy
                </span>
              </Link>

              {/* Spacer to balance grid on mobile */}
              <div className="md:hidden" />

              {/* Desktop: menu button (right) + tagline */}
              <div className="hidden md:flex items-center gap-4">
                <div className="hidden md:block">
                  <ToolMenuWrapper />
                </div>
                <div className="hidden md:flex items-center h-10">
                  <span className="text-sm text-muted leading-none whitespace-nowrap">
                    Private · Local-first · Nothing uploaded
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="mx-auto container-wrap px-4 py-8 flex-1">
            {children}
          </main>

                    {/* Multiplex above footer on tool pages */}
          <FooterMultiplex />

          {/* Neutral footer (no brand gradient) */}
          <footer className="border-t border-line bg-[hsl(var(--card))]">
            <div className="mx-auto container-wrap px-4 py-5 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-muted">
                © {new Date().getFullYear()} Utilixy — Tools run locally in your
                browser.
              </div>
              <div className="flex items-center gap-4 h-10">
                <nav className="flex items-center gap-4 leading-none">
                  <Link
                    href="/privacy"
                    className="hover:underline leading-none"
                  >
                    Privacy
                  </Link>
                  <Link href="/terms" className="hover:underline leading-none">
                    Terms
                  </Link>
                  <Link href="/about" className="hover:underline leading-none">
                    About
                  </Link>
                </nav>
                <div className="flex items-center">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
