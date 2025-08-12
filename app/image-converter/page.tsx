import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";
import Ad from "@/components/ads/Ad";

export const metadata: Metadata = {
  title: "Image Converter (PNG / JPEG / WEBP + HEIC) — Utilixy",
  description: "Convert images privately in your browser — supports PNG, JPEG, WEBP, and HEIC. Adjust quality, choose background color for JPEG, and convert multiple images at once.",
};

export default function Page() {
  return (
    <ToolLayout
      title="Image Converter"
      description="Convert images locally. Choose format, quality, and background for JPEG. Drag & drop multiple files."
    >
      <Client />

    </ToolLayout>
  );
}
