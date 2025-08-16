import type { Metadata } from "next";
import Hero from "./Hero";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Image Studio — Resize, Crop, Convert & Compress (JPG/PNG/WebP) | Utilixy",
  description:
    "Fast, private, in-browser image tools: resize, crop, rotate/flip, convert formats (JPG/PNG/WebP), compress for web, add text watermarks, strip metadata, and export images to PDF. No uploads.",
  alternates: {
    canonical: "https://utilixy.com/image-converter",
  },
  openGraph: {
    title: "Utilixy Image Studio",
    description:
      "Resize, crop, rotate, convert (JPG/PNG/WebP), compress, watermark, strip EXIF, and export to PDF — entirely in your browser.",
    url: "https://utilixy.com/image-converter",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "Utilixy" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utilixy Image Studio",
    description:
      "Resize, crop, rotate, convert, compress, watermark, strip EXIF, and export to PDF — fully local.",
  },
};

export default function Page() {
  // FAQ structured data for SEO
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do my images upload to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All image processing happens locally in your browser using canvas and JavaScript. Files never leave your device."
        }
      },
      {
        "@type": "Question",
        "name": "Which formats can I convert?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "JPG, PNG and WebP. You can also export multiple images into a single PDF."
        }
      },
      {
        "@type": "Question",
        "name": "Can I strip EXIF metadata?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Re-encoding via the canvas drops EXIF/metadata; enable 'Strip metadata' before exporting."
        }
      }
    ]
  };

  return (
    <>
      <Hero />
      {/* JSON-LD for FAQ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Client />
    </>
  );
}
