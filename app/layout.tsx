import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import DesktopToolsNav from "@/components/DesktopToolsNav";
import GAListener from "@/components/GAListener";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ToolMenuWrapper from "@/components/ToolMenuWrapper";
import ThemeToggle from "@/components/ThemeToggle";
// import FooterMultiplex from "@/components/ads/FooterMultiplex"; // ads disabled
import { Suspense } from "react";
import AnimatedMain from "@/components/AnimatedMain";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
    "Word to PDF",
    "PDF to Word",
    "QR code generator",
    "image converter",
    "JSON formatter",
    "Base64 encoder",
    "random generator",
    "regex tester",
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
        {/* Consent defaults BEFORE any Google tags */}
        <Script
          id="consent-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                ad_storage: 'granted',
                analytics_storage: 'granted'
              });
            `,
          }}
        />

        {/* Google Ads / gtag base (sitewide) */}
        <Script
          id="gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZWTPWWSGYF"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              // Configure GA4; disable auto page_view so SPA tracking is manual
              gtag('config', 'G-ZWTPWWSGYF', { send_page_view: false });

              // Small helper so components can fire conversions:
              window.utilixyTrack = function(sendTo){
                try {
                  if (typeof gtag === 'function') {
                    gtag('event', 'conversion', { send_to: sendTo });
                  }
                } catch (e) { /* no-op */ }
              };
            `,
          }}
        />

        {/* AdSense library (sitewide). It will honor your consent mode. */}
        <Script
          id="adsbygoogle"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1257499604453174"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Ensure theme class is set before paint */}
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>

        {/* Structured data */}
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
        {/* GA route-change tracker must be inside body and under Suspense */}
        <Suspense fallback={null}>
          <GAListener />
        </Suspense>

        <div className="min-h-dvh flex flex-col">
          {/* Header */}
          <header
            className="sticky top-0 z-50 border-b border-[color:var(--line)] 
             bg-[color:var(--bg)]/80 backdrop-blur-md"
          >
            <div
              className="container-wrap h-14 flex items-center gap-3"
              style={{
                paddingLeft: "max(16px, env(safe-area-inset-left))",
                paddingRight: "max(16px, env(safe-area-inset-right))",
              }}
            >
              {/* Hamburger menu (mobile only) */}
              <ToolMenuWrapper />
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 absolute md:static md:translate-x-0 left-1/2 -translate-x-1/2 md:left-0"
              >
                <img
                  src="/utilixy-nav.svg"
                  alt="Utilixy"
                  className="h-12 w-auto"
                />
                <span className="text-xl font-bold text-[#2B67F3]">
                  Utilixy
                </span>
              </Link>
              {/* Desktop nav */}
              <DesktopToolsNav />
            </div>
          </header>

          {/* Sidebar controller for hamburger */}
          <ToolMenuWrapper />

          {/* Main content */}
          <AnimatedMain className="mx-auto container-wrap px-4 py-8 flex-1">
            {children}
          </AnimatedMain>

          {/* Multiplex ad removed for now */}
          {false && <></>}

          {/* Neutral footer */}
          <footer className="border-t border-line bg-[hsl(var(--card))]">
            <div className="mx-auto container-wrap px-4 py-5 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-muted">
                © {new Date().getFullYear()} Utilixy — Tools run locally in your
                browser.
              </div>
              <div className="flex items-center gap-4 h-10">
                <nav className="flex items-center gap-4 leading-none">
                  <Link href="/privacy" className="hover:underline leading-none">
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

        {/* Analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
