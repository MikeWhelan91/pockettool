import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Free PDF Tools — Merge, Split, Compress, Edit, and Convert PDFs | Utilixy",
  description:
    "All-in-one free PDF toolkit. Merge, split, compress, convert images to PDF, edit, and secure your documents — all in your browser, no uploads required.",
  alternates: { canonical: "/pdf" },
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
