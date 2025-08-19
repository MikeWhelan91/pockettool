// app/formatter/page.tsx
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "JSON / YAML / XML Formatter & Validator — Utilixy",
  description:
    "Format and validate JSON, YAML, or XML instantly in your browser. Auto-detect, pretty-print or minify. Private & fast.",
  alternates: { canonical: "/format" },
  keywords: [
    "json formatter",
    "yaml formatter",
    "xml formatter",
    "json validator",
    "online formatter",
    "pretty print json",
  ],
  openGraph: {
    title: "JSON / YAML / XML Formatter & Validator — Utilixy",
    description:
      "Format and validate JSON, YAML, or XML instantly in your browser. Auto-detect, pretty-print or minify. Private & fast.",
    url: "/format",
    siteName: "Utilixy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON / YAML / XML Formatter — Utilixy",
    description:
      "Format and validate JSON, YAML, or XML instantly in your browser.",
  },
};

export default function Page() {
  const faq = [
    {
      q: "Is my code sent to a server?",
      a: "No. Formatting and validation happen entirely in your browser.",
    },
    {
      q: "Which formats are supported?",
      a: "JSON, YAML, and XML with auto-detection and conversion between them.",
    },
    {
      q: "Can I minify as well as pretty-print?",
      a: "Yes. Toggle between formatted and minified output.",
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
      title="JSON / YAML / XML Formatter"
      description="Paste code, auto-detect the format, and pretty-print or minify — everything runs locally."
    >
      <div className="md:col-span-2">
        <details className="hidden md:block card p-4 md:p-6" open>
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Paste your <strong>JSON</strong>, <strong>YAML</strong> or
              <strong> XML</strong>. The tool detects the format and instantly
              pretty-prints or minifies it locally.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Validate structure and highlight errors.</li>
              <li>Convert between JSON, YAML and XML.</li>
              <li>Copy formatted or minified output with one click.</li>
            </ul>
            <p className="mt-3">Tip: large documents may take longer to process.</p>
          </div>
        </details>
        <details className="block md:hidden card p-4 md:p-6">
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Paste your <strong>JSON</strong>, <strong>YAML</strong> or
              <strong> XML</strong>. The tool detects the format and instantly
              pretty-prints or minifies it locally.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Validate structure and highlight errors.</li>
              <li>Convert between JSON, YAML and XML.</li>
              <li>Copy formatted or minified output with one click.</li>
            </ul>
            <p className="mt-3">Tip: large documents may take longer to process.</p>
          </div>
        </details>
      </div>

      <Client />
      <section
        id="seo-content"
        className="seo-full md:col-span-2 grid gap-6 md:grid-cols-2"
      >
        <div className="card w-full p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            JSON / YAML / XML Formatter — FAQ
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
            <li><a className="link" href="/case-converter">Case Converter</a></li>
            <li><a className="link" href="/diff">Diff Checker</a></li>
            <li><a className="link" href="/base64">Base64 Encoder / Decoder</a></li>
            <li><a className="link" href="/regex">Regex Tester</a></li>
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
