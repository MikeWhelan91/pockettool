import ToolLayout from "@/components/ToolLayout";
import type { Metadata } from "next";
import Client from "./Client";
import Ad from "@/components/ads/Ad"; // multiplex wrapper

export const metadata: Metadata = {
  title: "Wi-Fi QR Code Generator — Utilixy",
  description:
    "Create Wi-Fi QR codes (WPA/WEP/Open) and standard QR codes for text, email or SMS. Export PNG/SVG. Everything runs locally.",
  alternates: { canonical: "/qr" },
  robots: { index: true, follow: true },
  keywords: [
    "wifi qr code",
    "wi-fi qr code generator",
    "network qr code",
    "qr code maker",
    "free qr generator",
    "wifi password qr",
    "wifi connect qr",
  ],
  openGraph: {
    title: "Wi-Fi QR Code Generator — Utilixy",
    description:
      "Create Wi-Fi QR codes and standard QR codes for text, email or SMS. Export PNG/SVG. Everything runs locally.",
    url: "/qr",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Wi-Fi QR Code Generator — Utilixy",
    description:
      "Create Wi-Fi QR codes and standard QR codes for text, email or SMS. Export PNG/SVG. Everything runs locally.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Wi-Fi QR Code Generator"
      description="Share your network instantly: scan to connect. Adjust size, margin and colors, and export PNG or SVG."
    >
      <Client />
    
    </ToolLayout>
  );
}
