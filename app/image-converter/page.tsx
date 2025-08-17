import type { Metadata } from "next";
import Hero from "./Hero";
import Client from "./Client";
import { Suspense } from "react";

export const metadata: Metadata = {
  title:
    "Image Studio — Convert, Resize & Batch Download (PNG/JPG/WebP/AVIF/HEIC) | Utilixy",
  description:
    "Fast, private image tools: convert between PNG, JPG, WebP, AVIF & HEIC, batch-resize and download, crop, rotate/flip, compress for web, add text watermarks, strip metadata, and export images to PDF. No uploads.",
  alternates: {
    canonical: "https://utilixy.com/image-converter",
  },
  openGraph: {
    title: "Utilixy Image Studio",
    description:
      "Convert PNG, JPG, WebP, AVIF & HEIC, batch-download, resize, crop, rotate, compress, watermark, strip EXIF, and export to PDF — entirely in your browser.",
    url: "https://utilixy.com/image-converter",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "Utilixy" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utilixy Image Studio",
    description:
      "Convert PNG, JPG, WebP, AVIF & HEIC, batch-download, resize, crop, rotate, compress, watermark, strip EXIF, and export to PDF — fully local.",
  },
};

export default function Page() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="p-4 text-sm text-muted">Loading image tool…</div>}>
        <Client />
      </Suspense>

      {/* SEO/FAQ content aligned with main column on md+ */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 mt-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
        <section id="seo-content" className="seo-half md:col-start-2">
          <div className="card p-4 md:p-6 lg:max-w-none lg:mx-0 lg:w-full">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Image Studio — FAQ</h2>
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
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        </section>
      </div>
    </>
  );
}

/* ---------- FAQ data (used for UI + JSON-LD) ---------- */

const faq: { q: string; a: string }[] = [
  {
    q: "Do images get uploaded to a server?",
    a: "No. All conversions, resizes and edits run locally in your browser using WebAssembly and Web APIs. Your files never leave your device."
  },
  {
    q: "Which formats are supported?",
    a: "You can convert between PNG, JPG/JPEG, WebP, AVIF and HEIC/HEIF. You can also export images to a single PDF."
  },
  {
    q: "Can I batch convert or resize?",
    a: "Yes. Drop a folder or multiple files to batch convert and resize. Use the batch download button to save everything at once."
  },
  {
    q: "Why does an HEIC fail on some browsers?",
    a: "Native HEIC/HEIF decoding relies on the browser/OS. If your browser lacks support, convert HEIC → JPG/WebP/PNG first."
  },
  {
    q: "Is there any quality loss?",
    a: "Lossless formats like PNG remain lossless. For JPG/WebP/AVIF you can choose quality. Higher quality means larger files."
  },
  {
    q: "Can I remove EXIF/metadata?",
    a: "Yes. Use the Strip metadata option to remove EXIF, GPS and other attached fields before downloading."
  },
  {
    q: "How do I watermark?",
    a: "Open Watermark, type your text, choose size/opacity/position, then apply to one or many images before downloading."
  },
  {
    q: "Does it work offline?",
    a: "After the first load, most features continue to work offline in supported browsers because everything runs client-side."
  }
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faq.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": a
    }
  }))
};

