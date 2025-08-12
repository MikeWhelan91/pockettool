import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "PDF Studio — Utilixy",
  description:
    "Reorder, rotate, split, merge, watermark, page numbers, extract text, images↔PDF, redaction and more — fully client-side.",
};

export default function Page() {
  return (
    <ToolLayout
      title="PDF Studio"
      description="Reorder, rotate, split, merge, watermark, page numbers, extract text, images↔PDF, redaction and more — all locally in your browser."
      align="center"
    >
      <Client />
    </ToolLayout>
  );
}
