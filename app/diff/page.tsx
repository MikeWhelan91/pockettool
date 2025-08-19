// Keep your SEO metadata intact
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Text Difference Checker — Utilixy",
  description:
    "Compare two blocks of text and highlight additions, deletions, and unchanged parts. Everything runs in your browser.",
  alternates: { canonical: "/diff" },
  robots: { index: true, follow: true },
  keywords: [
    "text diff",
    "compare text online",
    "diff checker",
    "text difference tool",
    "inline diff",
    "side by side diff",
  ],
  openGraph: {
    title: "Text Difference Checker — Utilixy",
    description:
      "Compare two blocks of text and highlight additions, deletions, and unchanged parts. Everything runs in your browser.",
    url: "/diff",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text Difference Checker — Utilixy",
    description:
      "Compare two blocks of text and highlight additions, deletions, and unchanged parts. Everything runs in your browser.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Page() {
  const faq = [
    {
      q: "Is my text sent to a server?",
      a: "No. The diff runs entirely in your browser—nothing is uploaded.",
    },
    {
      q: "Can I compare large files?",
      a: "Yes, though very large texts may be slower depending on your device.",
    },
    {
      q: "Does it support side-by-side view?",
      a: "Yes. Switch between inline and side-by-side modes to view differences.",
    },
    {
      q: "Is the comparison case-sensitive?",
      a: "Yes, differences are case-sensitive.",
    },
    {
      q: "Is the tool free?",
      a: "Yes—100% free and ad-supported. No sign-up required.",
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
      title="Text Difference Checker"
      description="Paste the original text on the left and the changed text on the right. See what’s been added and removed."
    >
      <div className="md:col-span-2">
        <details className="hidden md:block card p-4 md:p-6" open>
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Paste your <strong>original</strong> text on the left and the
              <strong> changed</strong> text on the right. Differences appear instantly and
              stay on your device.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                <strong>Inline</strong> view shows additions and deletions within lines.
              </li>
              <li>
                <strong>Side-by-side</strong> view compares entire lines next to each other.
              </li>
              <li>
                Switch modes or copy results without leaving the page.
              </li>
            </ul>
            <p className="mt-3">
              Tip: large texts may take longer to compute depending on your device.
            </p>
          </div>
        </details>
        <details className="block md:hidden card p-4 md:p-6">
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Paste your <strong>original</strong> text on the left and the
              <strong> changed</strong> text on the right. Differences appear instantly and
              stay on your device.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                <strong>Inline</strong> view shows additions and deletions within lines.
              </li>
              <li>
                <strong>Side-by-side</strong> view compares entire lines next to each other.
              </li>
              <li>
                Switch modes or copy results without leaving the page.
              </li>
            </ul>
            <p className="mt-3">
              Tip: large texts may take longer to compute depending on your device.
            </p>
          </div>
        </details>
      </div>

      <Client />
      <section id="seo-content" className="seo-half">
        <div className="card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            Text Difference Checker — FAQ
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
