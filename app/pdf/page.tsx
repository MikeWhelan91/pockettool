// app/pdf/page.tsx
import React, { Suspense } from "react";
import ToolLayout from "@/components/ToolLayout";
import Hero from "./Hero"; // (use your actual path)
import Client from "./Client"; // (use your actual path)

export const metadata = {
  title: "PDF Studio — Free Online PDF Tools (Private & Local-first)",
  description:
    "Merge, split, reorder, rotate, add colored watermarks, convert images free ↔ PDF, extract text, redact, fill forms, and compress — all in your browser. Free with no sign-up, pop-ups, redirects, or uploads.",
  alternates: { canonical: "https://utilixy.com/pdf" },
  openGraph: {
    title: "PDF Studio — Free Online PDF Tools",
    description:
      "Free, fast, private PDF tools that run locally in your browser. Add colored watermarks with no sign-up, pop-ups, redirects, or uploads.",
    url: "https://utilixy.com/pdf",
    siteName: "Utilixy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Studio — Free Online PDF Tools",
    description:
      "Free, fast, private PDF tools that run locally in your browser. Add colored watermarks with no sign-up, pop-ups, redirects, or uploads.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Studio"
      description="Free, private, and powerful PDF tools — right in your browser. No sign-ups, pop-ups, redirects, or uploads."
      align="center"
      data-pdf
    >
      {/* Left/Right grid item #1 — hero */}
      <Hero />

      {/* Left/Right grid item #2 — interactive tool stage (uses useSearchParams) */}
      <Suspense fallback={<div className="p-4 text-sm text-muted">Loading PDF tool…</div>}>
        <Client />
      </Suspense>
    </ToolLayout>
  );
}
