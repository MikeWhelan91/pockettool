import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Case Converter – Utilixy",
  description:
    "UPPER↔lower, Title, Sentence, Capitalize, Slug, camelCase, PascalCase, snake_case, kebab-case. All client-side.",
  alternates: { canonical: "/case-converter" },
  keywords: [
    "case converter",
    "text transformer",
    "uppercase to lowercase",
    "camelcase",
    "snake case",
    "kebab case",
    "title case",
  ],
  openGraph: {
    title: "Case Converter – Utilixy",
    description:
      "UPPER↔lower, Title, Sentence, Capitalize, Slug, camelCase, PascalCase, snake_case, kebab-case. All client-side.",
    url: "/case-converter",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Case Converter – Utilixy",
    description:
      "UPPER↔lower, Title, Sentence, Capitalize, Slug, camelCase, PascalCase, snake_case, kebab-case. All client-side.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Page() {
  const faq = [
    {
      q: "Is my text sent anywhere?",
      a: "No. Conversions happen instantly in your browser—nothing is uploaded.",
    },
    {
      q: "Which case styles are supported?",
      a: "Upper, lower, title, sentence, slug, camelCase, PascalCase, snake_case and kebab-case.",
    },
    {
      q: "Can I copy results easily?",
      a: "Yes. Use the copy buttons beside each output field.",
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
      title="Case Converter / Text Transformer"
      description="Paste text, choose a transform, and copy the result. Nothing leaves your browser."
    >
      <div className="md:col-span-2">
        <details className="hidden md:block card p-4 md:p-6" open>
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Paste text, pick a <strong>case style</strong>, and the transformed text
              updates instantly without leaving your device.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                Convert between upper, lower, title, sentence and more.
              </li>
              <li>
                Generate slugs, camelCase or snake_case for programming.
              </li>
              <li>
                Copy the result with one click.
              </li>
            </ul>
            <p className="mt-3">Tip: you can edit the output further before copying.</p>
          </div>
        </details>
        <details className="block md:hidden card p-4 md:p-6">
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Paste text, pick a <strong>case style</strong>, and the transformed text
              updates instantly without leaving your device.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                Convert between upper, lower, title, sentence and more.
              </li>
              <li>
                Generate slugs, camelCase or snake_case for programming.
              </li>
              <li>
                Copy the result with one click.
              </li>
            </ul>
            <p className="mt-3">Tip: you can edit the output further before copying.</p>
          </div>
        </details>
      </div>

      <Client />
      <section id="seo-content" className="seo-half">
        <div className="card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            Case Converter — FAQ
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </section>
    </ToolLayout>
  );
}
