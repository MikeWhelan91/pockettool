import type { Metadata } from "next";
import Hero from "./Hero";
import Client from "./Client";
import { Suspense } from "react";
import ToolLayout from "@/components/ToolLayout";

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
    <ToolLayout align="center" hideHeader data-image>
      <Hero />
      <Suspense fallback={<div className="p-4 text-sm text-muted">Loading image tool…</div>}>
        <Client />
      </Suspense>
    </ToolLayout>
  );
}



