// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About • Utilixy",
  description:
    "Why this exists, how it’s built, and what I’m learning along the way.",
  openGraph: {
    title: "About • Utilixy",
    description:
      "Why this exists, how it’s built, and what I’m learning along the way.",
    url: "/about",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About • Utilixy",
    description:
      "Why this exists, how it’s built, and what I’m learning along the way.",
    images: ["/icons/icon-512.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="grid gap-10">
      {/* Header */}
      <section className="text-center grid gap-3">
        <h1 className="text-[2rem] md:text-[2.4rem] font-semibold tracking-tight">
          About Utilixy
        </h1>
        <p className="mx-auto max-w-[70ch] text-muted">
          I’m building Utilixy as a way to <b>learn how the web actually works</b>:
          performance, browser APIs, file handling, workers, and a bunch of
          little UX details. The tools are simple on purpose—small projects that
          help me explore, and (hopefully) help you get things done, fast.
        </p>
      </section>

      {/* Three-up: Why / Principles / How it’s built */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-line bg-[hsl(var(--card))] p-5">
          <h2 className="font-medium">Why I’m doing this</h2>
          <p className="text-sm text-muted mt-2">
            I wanted a place to practice real-world front-end: routing, state,
            accessibility, keyboard flows, and performance. Shipping tiny,
            single-purpose tools forces me to learn quickly and iterate.
          </p>
        </article>

        <article className="rounded-xl border border-line bg-[hsl(var(--card))] p-5">
          <h2 className="font-medium">Principles</h2>
          <ul className="text-sm text-muted mt-2 list-disc pl-4 space-y-1">
            <li><b>Local-first:</b> everything runs in your browser.</li>
            <li><b>Fast:</b> minimal clicks, snappy UIs, no bloat.</li>
            <li><b>Private:</b> I don’t want your files—I don’t need them.</li>
            <li><b>Useful over perfect:</b> small features, shipped often.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-line bg-[hsl(var(--card))] p-5">
          <h2 className="font-medium">How it’s built</h2>
          <p className="text-sm text-muted mt-2">
            Next.js + TypeScript + Tailwind for the UI. Under the hood:
            browser APIs (Canvas, File, Streams), Web Workers for heavy work,
            and lightweight libraries where it makes sense (e.g. PDF handling,
            zipping, QR generation). Everything aims to be client-side only.
          </p>
        </article>
      </section>

      {/* What runs locally */}
      <section className="grid gap-3">
        <h2 className="text-[1.05rem] font-semibold">What runs locally?</h2>
        <div className="rounded-xl border border-line bg-[hsl(var(--card))] p-5">
          <ul className="text-sm text-muted list-disc pl-4 space-y-1">
            <li><b>PDF Studio:</b> reordering, merging, splitting, numbers, watermarks, redaction, conversions.</li>
            <li><b>QR & Wi-Fi:</b> generate and export QR codes (PNG/SVG).</li>
            <li><b>Image tools:</b> convert common formats right in the browser.</li>
            <li><b>Formatters & text tools:</b> JSON/YAML/XML, case converter, diff, Base64, etc.</li>
          </ul>
          <p className="text-xs text-muted mt-3">
            If a tool ever needs a network call (rare), I’ll call it out in the UI.
          </p>
        </div>
      </section>

      {/* FAQ-style bits */}
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-line bg-[hsl(var(--card))] p-5">
          <h3 className="font-medium">Is anything uploaded?</h3>
          <p className="text-sm text-muted mt-2">
            No—by default, files are processed locally in your browser. That’s
            the whole point: fast, private, disposable.
          </p>
        </article>

        <article className="rounded-xl border border-line bg-[hsl(var(--card))] p-5">
          <h3 className="font-medium">What about ads/consent?</h3>
          <p className="text-sm text-muted mt-2">
            Ads help keep the site free. If you decline personalization, you’ll
            still see non-personalized (contextual) ads without tracking cookies.
          </p>
        </article>

        <article className="rounded-xl border border-line bg-[hsl(var(--card))] p-5">
          <h3 className="font-medium">Can I suggest a feature?</h3>
          <p className="text-sm text-muted mt-2">
            Please do—I’m learning as I go. Bug reports, UX nitpicks, and small
            wins are very welcome.
          </p>
        </article>

        <article className="rounded-xl border border-line bg-[hsl(var(--card))] p-5">
          <h3 className="font-medium">Is this open-source?</h3>
          <p className="text-sm text-muted mt-2">
            Parts may be opened up as they stabilize. The goal is to keep things
            simple enough that you can read the code and learn from it too.
          </p>
        </article>
      </section>

      {/* Contact / CTA */}
      <section className="rounded-xl border border-line bg-[hsl(var(--card))] p-5">
        <h2 className="text-[1.05rem] font-semibold">Say hello</h2>
        <p className="text-sm text-muted mt-2">
          Found a bug? Want a tool? Curious how something works?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            className="btn"
            href="mailto:hello@utilixy.com"
          >
            Email
          </a>
          <Link href="/pdf" className="btn-ghost">
            Try PDF Studio
          </Link>
        </div>
      </section>
    </div>
  );
}
