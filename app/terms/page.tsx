import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Utilixy",
  description:
    "Review the usage terms for Utilixy's local-first web tools and services.",
  openGraph: {
    title: "Terms of Service — Utilixy",
    description:
      "Review the usage terms for Utilixy's local-first web tools and services.",
    url: "/terms",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service — Utilixy",
    description:
      "Review the usage terms for Utilixy's local-first web tools and services.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Terms() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Terms</h1>
      <p>
        Utilixy is provided as-is, without warranties. Use responsibly and
        ensure you have rights to the files you process.
      </p>
    </div>
  );
}
