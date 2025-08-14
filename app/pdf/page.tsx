// app/pdf/page.tsx
import React from "react";
import ToolLayout from "@/components/ToolLayout";
import Hero from "./Hero";               // (use your actual path)
import Client from "./Client";           // (use your actual path)

export const metadata = {
  title: "PDF Studio — Free Online PDF Tools (Private & Local-first)",
  description:
    "Merge, split, reorder, rotate, watermark, convert images ↔ PDF, extract text, redact, fill forms, and compress — all in your browser. No uploads, no limits.",
  alternates: { canonical: "https://yourdomain.com/pdf" },
  openGraph: {
    title: "PDF Studio — Free Online PDF Tools",
    description:
      "Fast, private PDF tools that run locally in your browser. No uploads required.",
    url: "https://yourdomain.com/pdf",
    siteName: "Utilixy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Studio — Free Online PDF Tools",
    description:
      "Fast, private PDF tools that run locally in your browser. No uploads required.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Studio"
      description="Fast, private, and powerful PDF tools — right in your browser. No uploads, no limits."
      align="center"
      data-pdf
    >
      {/* Left/Right grid item #1 — the hero (already centered by your styles) */}
      <Hero />

      {/* Left/Right grid item #2 — the interactive tool stage */}
      <Client />

    </ToolLayout>
  );
}
