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
  const faq = [
    {
      q: "Is everything generated locally?",
      a: "Yes. QR codes are rendered in your browser and never uploaded.",
    },
    {
      q: "Can I customize colors or size?",
      a: "Absolutely. Adjust foreground, background, margin and module size before downloading.",
    },
    {
      q: "What types of codes can I create?",
      a: "Wi‑Fi (WPA/WEP/Open) plus standard text, URL, email and SMS QR codes.",
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <ToolLayout
      title="Wi-Fi QR Code Generator"
      description="Share your network instantly: scan to connect. Adjust size, margin, and colors, then export PNG or SVG — everything runs locally."
    >
      <div className="md:col-span-2">
        <details className="hidden md:block card p-4 md:p-6" open>
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Enter Wi‑Fi credentials or standard text and the QR code updates instantly.
              Scan with a phone to connect or view the content.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Choose Wi‑Fi, text, URL, email or SMS modes.</li>
              <li>Customize colors, margin and size.</li>
              <li>Download the code as PNG or SVG.</li>
            </ul>
            <p className="mt-3">Tip: keep contrast high for reliable scanning.</p>
          </div>
        </details>
        <details className="block md:hidden card p-4 md:p-6">
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Enter Wi‑Fi credentials or standard text and the QR code updates instantly.
              Scan with a phone to connect or view the content.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Choose Wi‑Fi, text, URL, email or SMS modes.</li>
              <li>Customize colors, margin and size.</li>
              <li>Download the code as PNG or SVG.</li>
            </ul>
            <p className="mt-3">Tip: keep contrast high for reliable scanning.</p>
          </div>
        </details>
      </div>

      <Client />

      <section id="seo-content" className="seo-half">
        <div className="card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2">Wi-Fi QR Code Generator — FAQ</h2>
          <div className="space-y-2">
            {faq.map(({ q, a }, i) => (
              <details key={i} className="card--flat p-3">
                <summary className="font-medium cursor-pointer">{q}</summary>
                <div className="mt-2 text-sm text-muted">{a}</div>
              </details>
            ))}
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </section>
    </ToolLayout>
  );
}
