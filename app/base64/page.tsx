import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder – Utilixy",
  description: "Convert text or files to and from Base64 instantly in your browser.",
  openGraph: {
    title: "Base64 Encoder / Decoder – Utilixy",
    description: "Convert text or files to and from Base64 instantly in your browser.",
    url: "/base64",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Base64 Encoder / Decoder – Utilixy",
    description: "Convert text or files to and from Base64 instantly in your browser.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode or decode Base64 strings or files — all locally, nothing is uploaded."
    >
      <Client />
    </ToolLayout>
  );
}
