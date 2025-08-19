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
  keywords: [
    "password generator",
    "random password",
    "uuid generator",
    "lorem ipsum generator",
    "slug generator",
    "random color",
  ],
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
  const faq = [
    {
      q: "Are the passwords unique and secure?",
      a: "Yes. They are generated with cryptographically secure randomness directly in your browser.",
    },
    {
      q: "What else can I generate?",
      a: "UUIDs, random colors, slugs and lorem ipsum text.",
    },
    {
      q: "Is any data sent to a server?",
      a: "No. All generators run entirely on your device.",
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
      title="Password Generator & Random Tools"
      description="Create strong passwords, UUIDs, colors, slugs, and lorem ipsum — everything runs locally."
    >
      <div className="md:col-span-2">
        <details className="hidden md:block card p-4 md:p-6" open>
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Choose a generator (password, UUID, color, slug or lorem ipsum) and
              configure the options. Results appear instantly with nothing sent
              online.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Create strong passwords with chosen length and character sets.</li>
              <li>Generate v4 UUIDs or random colors.</li>
              <li>Produce slugs and filler text for prototypes.</li>
            </ul>
            <p className="mt-3">Tip: copy results with one click on each panel.</p>
          </div>
        </details>
        <details className="block md:hidden card p-4 md:p-6">
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Choose a generator (password, UUID, color, slug or lorem ipsum) and
              configure the options. Results appear instantly with nothing sent
              online.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Create strong passwords with chosen length and character sets.</li>
              <li>Generate v4 UUIDs or random colors.</li>
              <li>Produce slugs and filler text for prototypes.</li>
            </ul>
            <p className="mt-3">Tip: copy results with one click on each panel.</p>
          </div>
        </details>
      </div>

      <Client />
      <section
        id="seo-content"
        className="seo-half grid gap-6 md:!mt-4"
      >
        <div className="card w-full p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            Password Generator & Random Tools — FAQ
          </h2>
          <div className="space-y-2">
            {faq.map(({ q, a }, i) => (
              <details key={i} className="card--flat p-3">
                <summary className="font-medium cursor-pointer">{q}</summary>
                <div className="mt-2 text-sm text-muted">{a}</div>
              </details>
            ))}
          </div>
        </div>
        <div className="card w-full p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-2">Related tools</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li><a className="link" href="/qr">QR Code Generator</a></li>
            <li><a className="link" href="/base64">Base64 Encoder / Decoder</a></li>
            <li><a className="link" href="/format">JSON / YAML / XML Formatter</a></li>
            <li><a className="link" href="/case-converter">Case Converter</a></li>
          </ul>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </section>
    </ToolLayout>
  );
}
