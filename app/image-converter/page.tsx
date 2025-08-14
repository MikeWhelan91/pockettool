import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";
import Ad from "@/components/ads/Ad";
import Hero from "./Hero";               // (use your actual path)


export const metadata: Metadata = {
  title: "Image Converter (PNG / JPEG / WEBP + HEIC) — Utilixy",
  description: "Convert images privately in your browser — supports PNG, JPEG, WEBP, and HEIC. Adjust quality, choose background color for JPEG, and convert multiple images at once.",
  openGraph: {
    title: "Image Converter (PNG / JPEG / WEBP + HEIC) — Utilixy",
    description:
      "Convert images privately in your browser — supports PNG, JPEG, WEBP, and HEIC. Adjust quality, choose background color for JPEG, and convert multiple images at once.",
    url: "/image-converter",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image Converter (PNG / JPEG / WEBP + HEIC) — Utilixy",
    description:
      "Convert images privately in your browser — supports PNG, JPEG, WEBP, and HEIC. Adjust quality, choose background color for JPEG, and convert multiple images at once.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Image Converter"
      description="Convert images locally. Choose format, quality, and background for JPEG. Drag & drop multiple files."
data-image      

    >
        <Hero />
      <Client />

   



    </ToolLayout>
  );
}
