import type { Metadata } from "next";
import ResetConsent from "./Client";

export const metadata: Metadata = {
  title: "Cookie Settings — Utilixy",
  description:
    "Manage or revoke your consent for advertising cookies on Utilixy.",
  openGraph: {
    title: "Cookie Settings — Utilixy",
    description:
      "Manage or revoke your consent for advertising cookies on Utilixy.",
    url: "/cookies",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Settings — Utilixy",
    description:
      "Manage or revoke your consent for advertising cookies on Utilixy.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Cookies() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Cookies</h1>
      <p>
        To fund free tools, we use advertising cookies only after you consent.
        You can revoke consent below.
      </p>
      <ResetConsent />
    </div>
  );
}
