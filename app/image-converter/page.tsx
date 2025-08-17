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
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        </section>
      </div>
    </>
  );
}
