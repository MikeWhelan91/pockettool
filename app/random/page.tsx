import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";
import Ad from "@/components/ads/Ad";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator & Random Tools — Utilixy",
  description:
    "Generate strong passwords, UUIDs, colors, slugs and lorem ipsum locally in your browser.",
  alternates: { canonical: "/random" },
  openGraph: {
    title: "Password Generator & Random Tools — Utilixy",
    description:
      "Generate strong passwords, UUIDs, colors, slugs and lorem ipsum locally in your browser.",
    url: "/random",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Password Generator & Random Tools — Utilixy",
    description:
      "Generate strong passwords, UUIDs, colors, slugs and lorem ipsum locally in your browser.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Password Generator & Random Tools"
      description="Create strong passwords plus UUIDs, colors, slugs and lorem ipsum. Everything runs locally."
    >
      <Client />
    </ToolLayout>
  );
}
