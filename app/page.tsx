import Link from "next/link";
import type { Metadata } from "next";
import Ad from "@/components/ads/Ad"; // Multiplex wrapper

export const metadata: Metadata = {
  title: "PDF Studio & Web Tools — Utilixy",
  description:
    "Reorder, rotate, merge and split PDFs plus access quick tools like QR codes, image conversion and more — all local and private.",
  keywords: [
    "PDF Studio",
    "web tools",
    "QR code generator",
    "image converter",
    "JSON formatter",
    "random generators",
  ],
  openGraph: {
    title: "PDF Studio & Web Tools — Utilixy",
    description:
      "Reorder, rotate, merge and split PDFs plus access quick tools like QR codes, image conversion and more — all local and private.",
    url: "/",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PDF Studio & Web Tools — Utilixy",
    description:
      "Reorder, rotate, merge and split PDFs plus access quick tools like QR codes, image conversion and more — all local and private.",
    images: ["/icons/icon-512.png"],
  },
};

const tools = [
  {
    href: "/pdf",
    title: "PDF Studio",
    desc: "Reorder, rotate, merge, split, numbers, watermark, extract, redact — locally.",
  },
  {
    href: "/random",
    title: "Password Generator",
    desc: "Strong passwords, UUIDs, colors, lorem, slugs.",
  },
  {
    href: "/qr",
    title: "QR & Wi‑Fi",
    desc: "Create QR codes. Export PNG/SVG.",
  },
  {
    href: "/image-converter",
    title: "Image Converter",
    desc: "HEIC → JPG/PNG/WebP. Local, private.",
  },
  {
    href: "/format",
    title: "JSON / YAML / XML",
    desc: "Format, validate and convert.",
  },
  {
    href: "/case-converter",
    title: "Case Converter",
    desc: "Title, sentence, snake, kebab, camel, pascal.",
  },
  {
    href: "/base64",
    title: "Base64",
    desc: "Encode or decode text and files.",
  },
  {
    href: "/diff",
    title: "Text Diff",
    desc: "Compare two texts and see changes.",
  },
];

export default function HomePage() {
  return (
    <div className="grid gap-10">
      {/* Hero — PDF Studio forward, still mentions other tools */}
      <section className="relative overflow-hidden rounded-[var(--radius)] border border-line bg-[hsl(var(--card))] shadow-[0_10px_40px_-10px_hsl(var(--ring)/.25)]">
        {/* top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--ring)/.45)] to-transparent opacity-60" />

        {/* Dark vs light subtle backdrops */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="hidden dark:block absolute inset-0 [mask-image:radial-gradient(70%_60%_at_35%_0%,#000_0,transparent_70%)] bg-[radial-gradient(60%_60%_at_15%_10%,hsl(var(--ring)/.18),transparent_60%),radial-gradient(40%_40%_at_95%_0%,hsl(var(--ring)/.14),transparent_60%)]" />
          <div className="dark:hidden absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,hsl(220_20%_96%/.8),transparent_65%)]" />
        </div>

        <div className="relative px-6 py-10 md:px-10 md:py-14 grid gap-8">
          <div className="grid gap-3 text-center">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-[hsl(var(--ring)/.4)] px-3 py-1 text-xs uppercase tracking-wide">
              New · Powerful · Private
            </span>
            <h1 className="text-[2.3rem] leading-tight font-semibold tracking-tight md:text-[2.8rem]">
              Meet <span className="text-[hsl(var(--ring))]">PDF Studio</span>
            </h1>
            <div className="-mt-1 text-[1.1rem] md:text-[1.15rem] text-muted/90">
              by{" "}
              <a
                href="https://utilixy.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[hsl(var(--text))] hover:underline underline-offset-4"
              >
                utilixy.com
              </a>
            </div>

            <p className="mx-auto mt-2 text-[1.05rem] text-muted max-w-[70ch]">
              Reorder, rotate, merge, split, add page numbers, headers/footers,
              watermarks, extract text, convert images↔PDF, stamp QR, redact,
              and optimize — <b>all in your browser</b>.
            </p>
            {/* CTAs */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link href="/pdf" className="btn">
                Open PDF Studio
              </Link>
              <Link href="/qr" className="btn btn-ghost">
                QR & Wi-Fi
              </Link>
              <a href="#tools" className="btn btn-ghost">
                Browse all tools
              </a>
              <span className="text-xs text-muted">
                Private · Nothing uploaded
              </span>
            </div>

            {/* Mention other tools inline */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm">
              {[
                { href: "/qr", label: "QR & Wi‑Fi" },
                { href: "/image-converter", label: "Image converter" },
                { href: "/format", label: "JSON/YAML/XML" },
                { href: "/random", label: "Password generator" },
              ].map((x) => (
                <Link
                  key={x.href}
                  href={x.href}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 hover:bg-[hsl(var(--bg))/0.6] no-underline"
                >
                  <span>{x.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 3-up feature highlights */}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                t: "Assemble & organize",
                d: "Reorder, rotate, delete pages. Batch merge docs.",
              },
              {
                t: "Annotate & label",
                d: "Page numbers, headers/footers, watermarks, QR stamps.",
              },
              {
                t: "Convert & extract",
                d: "Images→PDF, PDF→PNG/ZIP, extract text, quick redact, split.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-line bg-[hsl(var(--bg))]/50 p-4"
              >
                <div className="font-medium">{f.t}</div>
                <div className="text-sm text-muted mt-1">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Ad between hero and tools (outside hero) */}
      <section className="mt-2">
        <Ad
          slot="belowHero"
          format="auto" // auto size
          responsive={true} // full-width responsive
          minHeight={120} // reserve enough space without a huge gap
          className="mx-auto w-full"
        />
      </section>

      {/* Tools grid */}
      <section id="tools" className="grid gap-5">
        <h2 className="text-[1.05rem] font-semibold">All tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="no-underline">
              <article
                className={
                  "tile p-5 h-full " +
                  (t.href === "/pdf"
                    ? "relative border-2 border-[hsl(var(--ring))] lg:col-span-2"
                    : "")
                }
              >
                {t.href === "/pdf" && (
                  <span className="absolute -top-3 left-4 rounded-full bg-[hsl(var(--ring))] px-2 py-0.5 text-[11px] font-semibold text-white">
                    Featured
                  </span>
                )}
                <h3 className="font-medium">{t.title}</h3>
                <p className="text-sm text-muted mt-1">{t.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm">
                  <span>Open</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="-mr-1"
                  >
                    <path
                      d="M7 17L17 7M17 7H9M17 7v8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
      {/* Homepage bottom ad: Multiplex, out of the way */}
      <section className="mt-10">
        <Ad slot="homeMultiplex" format="autorelaxed" minHeight={320} />
      </section>
    </div>
  );
}
