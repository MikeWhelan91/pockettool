import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder – Utilixy",
  description: "Convert text or files to and from Base64 instantly in your browser.",
  alternates: { canonical: "/base64" },
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "text to base64",
    "file to base64",
    "base64 converter",
    "online base64",
  ],
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
  const faq = [
    {
      q: "Is anything uploaded to a server?",
      a: "No. Encoding and decoding happen entirely in your browser.",
    },
    {
      q: "Can I encode files as well as text?",
      a: "Yes. Drop any file and get its Base64 representation instantly.",
    },
    {
      q: "Is there a size limit?",
      a: "Only your device's memory limits apply since processing is in-browser.",
    },
    {
      q: "Can I decode Base64 back to the original file?",
      a: "Yes. Paste a Base64 string and download the decoded file.",
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
      title="Base64 Encoder / Decoder"
      description="Encode or decode Base64 strings or files — everything runs locally, nothing is uploaded."
    >
      <div className="md:col-span-2">
        <details className="hidden md:block card p-4 md:p-6" open>
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Paste text or drop a file, then choose <strong>Encode</strong> or
              <strong> Decode</strong>. The converted output appears instantly with nothing
              sent to a server.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                <strong>Encode</strong> turns text or files into a Base64 string.
              </li>
              <li>
                <strong>Decode</strong> converts a Base64 string back to text or a
                downloadable file.
              </li>
              <li>
                <strong>Copy</strong> buttons let you grab the result quickly.
              </li>
            </ul>
            <p className="mt-3">
              Tip: large files need more memory because everything runs locally.
            </p>
          </div>
        </details>
        <details className="block md:hidden card p-4 md:p-6">
          <summary className="cursor-pointer select-none text-base font-medium">
            What this does & how to use it
          </summary>
          <div className="mt-2 text-sm text-muted">
            <p>
              Paste text or drop a file, then choose <strong>Encode</strong> or
              <strong> Decode</strong>. The converted output appears instantly with nothing
              sent to a server.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>
                <strong>Encode</strong> turns text or files into a Base64 string.
              </li>
              <li>
                <strong>Decode</strong> converts a Base64 string back to text or a
                downloadable file.
              </li>
              <li>
                <strong>Copy</strong> buttons let you grab the result quickly.
              </li>
            </ul>
            <p className="mt-3">
              Tip: large files need more memory because everything runs locally.
            </p>
          </div>
        </details>
      </div>

      <Client />
      <section id="seo-content" className="seo-half">
        <div className="card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            Base64 Encoder / Decoder — FAQ
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
