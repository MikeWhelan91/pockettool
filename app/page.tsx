import Link from "next/link";
import type { Metadata } from "next";
// Ads temporarily disabled

export const metadata: Metadata = {
  title: "PDF Studio & Web Tools — Utilixy",
  description:
    "Reorder, rotate, merge and split PDFs plus access quick tools like QR codes, image conversion and more — all local, private and free. No sign-up, pop-ups or redirects.",
  keywords: [
    "PDF Studio",
    "web tools",
    "QR code generator",
    "image converter",
    "JSON formatter",
    "random generators",
    "regex tester",
    "password generator",
    "base64 encoder",
    "case converter",
    "text diff checker",
    "free online tools",
    "no sign up",
    "no pop ups",
    "no redirects",
  ],
  openGraph: {
    title: "PDF Studio & Web Tools — Utilixy",
    description:
      "Reorder, rotate, merge and split PDFs plus access quick tools like QR codes, image conversion and more — all local, private and free. No sign-up, pop-ups or redirects.",
    url: "/",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PDF Studio & Web Tools — Utilixy",
    description:
      "Reorder, rotate, merge and split PDFs plus access quick tools like QR codes, image conversion and more — all local, private and free. No sign-up, pop-ups or redirects.",
    images: ["/icons/icon-512.png"],
  },
};

const tools = [
  {
    href: "/pdf",
    title: "PDF Studio",
    desc: "Reorder, rotate, merge and split PDFs, add numbers and watermarks — all local.",
  },
  {
    href: "/image-converter",
    title: "Image Studio",
    desc: "Convert and optimize HEIC, JPG, PNG, WebP and AVIF images.",
  },
  {
    href: "/random",
    title: "Password Generator",
    desc: "Generate passwords, UUIDs, colors, lorem and slugs.",
  },
  {
    href: "/qr",
    title: "QR & Wi‑Fi",
    desc: "Make Wi‑Fi and custom QR codes, export PNG or SVG.",
  },
  {
    href: "/format",
    title: "JSON / YAML / XML",
    desc: "Format, validate and convert between JSON, YAML and XML.",
  },
  {
    href: "/case-converter",
    title: "Case Converter",
    desc: "Convert text to title, sentence, snake, kebab, camel or Pascal case.",
  },
  {
    href: "/base64",
    title: "Base64",
    desc: "Encode or decode text and files using Base64.",
  },
  {
    href: "/diff",
    title: "Text Diff",
    desc: "Compare two texts and highlight differences.",
  },
  {
    href: "/regex",
    title: "Regex Tester",
    desc: "Test regular expressions with instant match, replace and split.",
  },
];

const faq = [
  {
    q: "Is Utilixy free to use?",
    a: "Yes. Every tool is 100% free with no hidden costs or subscriptions.",
  },
  {
    q: "Do I need to create an account?",
    a: "No sign-up or registration is required — just open a tool and start working.",
  },
  {
    q: "Will I see pop-ups or be redirected?",
    a: "No. Utilixy avoids intrusive pop-ups or redirects so you can stay focused.",
  },
  {
    q: "Are my files uploaded or stored anywhere?",
    a: "Everything runs locally in your browser. Your files never leave your device.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

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
              Private · Free · No sign-up
            </span>
            <h1 className="text-[2.3rem] leading-tight font-semibold tracking-tight md:text-[2.8rem]">
              <span className="text-[hsl(var(--ring))]">Utilixy</span> Web Tools
            </h1>

            <p className="mx-auto mt-2 text-[1.05rem] text-muted max-w-[70ch]">
              Edit, merge, split & convert PDFs, extract text, add watermarks &
              page numbers, optimize images (AVIF, PNG, JPEG, WebP) —{" "}
              <b>
                fast, private, and entirely in your browser, free forever with
                no sign-up, pop-ups, or redirects.
              </b>
            </p>
            {/* CTAs */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link href="/pdf" className="btn">
                Open PDF Studio
              </Link>
              <Link href="/image-converter" className="btn">
                Open Image Studio
              </Link>
              <a href="#tools" className="btn">
                Browse all tools
              </a>
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

      {/* Ad removed for now */}
      {false && (
        <section className="mt-2">
          {/* <Ad
            slot="belowHero"
            format="auto"
            responsive={true}
            minHeight={60}
            className="mx-auto w-full"
          /> */}
        </section>
      )}

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

      {/* FAQ for homepage */}
      <section className="mt-10">
        <div className="card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            Utilixy — FAQ
          </h2>
          <div className="space-y-2">
            {faq.map(({ q, a }, i) => (
              <details key={i} className="card--flat p-3">
                <summary className="font-medium cursor-pointer">{q}</summary>
                <div className="mt-2 text-sm text-muted">{a}</div>
              </details>
            ))}
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </section>

      {/* Bottom ad removed for now */}
      {false && (
        <section className="mt-6">
          {/* <Ad slot="homeMultiplex" format="autorelaxed" minHeight={150} /> */}
        </section>
      )}
    </div>
  );
}
