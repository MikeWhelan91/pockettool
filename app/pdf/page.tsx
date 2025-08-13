import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Free PDF Tools — Merge, Split, Compress, Edit, and Convert PDFs | Utilixy",
  description:
    "All-in-one free PDF toolkit. Merge, split, compress, convert images to PDF, edit, and secure your documents — all in your browser, no uploads required.",
  alternates: { canonical: "/pdf" },
  openGraph: {
    title: "Free PDF Tools — Merge, Split, Compress, Edit, and Convert PDFs | Utilixy",
    description:
      "All-in-one free PDF toolkit. Merge, split, compress, convert images to PDF, edit, and secure your documents — all in your browser, no uploads required.",
    url: "/pdf",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Free PDF Tools — Merge, Split, Compress, Edit, and Convert PDFs | Utilixy",
    description:
      "All-in-one free PDF toolkit. Merge, split, compress, convert images to PDF, edit, and secure your documents — all in your browser, no uploads required.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Studio"
      description="All-in-one free PDF toolkit. Merge, split, compress, convert images to PDF, edit, and secure your documents — all in your browser, no uploads required."
      align="center"
    >
      <Client />
    </ToolLayout>
  );
}
