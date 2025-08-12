// Keep your SEO metadata intact
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Text Difference Checker — Utilixy",
  description:
    "Compare two blocks of text and highlight additions, deletions, and unchanged parts. Everything runs in your browser.",
  alternates: { canonical: "/diff" },
  robots: { index: true, follow: true },
  keywords: [
    "text diff",
    "compare text online",
    "diff checker",
    "text difference tool",
    "inline diff",
    "side by side diff",
  ],
  openGraph: {
    title: "Text Difference Checker — Utilixy",
    description:
      "Compare two blocks of text and highlight additions, deletions, and unchanged parts. Everything runs in your browser.",
    url: "/diff",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text Difference Checker — Utilixy",
    description:
      "Compare two blocks of text and highlight additions, deletions, and unchanged parts. Everything runs in your browser.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Text Difference Checker"
      description="Paste the original text on the left and the changed text on the right. See what’s been added and removed."
    >
      <Client />
    </ToolLayout>
  );
}
