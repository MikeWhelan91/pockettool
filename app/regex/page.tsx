
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Regex Tester – Utilixy",
  description:
    "Test, replace, and split regular expressions with instant highlighting right in your browser.",
  openGraph: {
    title: "Regex Tester – Utilixy",
    description:
      "Test, replace, and split regular expressions with instant highlighting right in your browser.",
    url: "/regex",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex Tester – Utilixy",
    description:
      "Test, replace, and split regular expressions with instant highlighting right in your browser.",
    images: ["/icons/icon-512.png"],
  },
  alternates: { canonical: "/regex" },
  keywords: [
    "regex tester",
    "regular expression tester",
    "regex replace",
    "regex split",
    "regex highlighter",
    "online regex tool",
    "javascript regex",
    "regex examples",
    "learn regex",
  ],
};

export default function Page() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a regular expression (regex)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A regular expression is a compact pattern for finding, extracting, and transforming text. This page lets you test patterns, view matches, and preview replacements entirely in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "How do I use this regex tester?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Enter a pattern and optional flags (g, i, m, s, u, y), paste your test string, and view matches, highlighted text, and replacement output instantly. Use presets to start quickly."
        }
      },
      {
        "@type": "Question",
        "name": "Which regex engine does this tool use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It uses the JavaScript (ECMAScript) regex engine that runs in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "How do I reference capture groups in replacements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use $1, $2, and so on in the Replace with field to insert captured groups."
        }
      },
      {
        "@type": "Question",
        "name": "Can I learn regex basics here?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. See the Quick regex cheatsheet and the User Guide below for common tokens, flags, and example patterns you can copy and paste."
        }
      }
    ]
  };

  return (
    <>
      <ToolLayout
        title="Regex Tester"
        description="Build, replace, and test regex patterns — everything runs locally."
        align="center"
      >
        {/* What this does & how to use it — top, collapsible, default-open on desktop */}
        <div className="md:col-span-2">
          {/* Desktop (open) */}
          <details className="hidden md:block card p-4 md:p-6 text-center" open>
            <summary className="cursor-pointer select-none text-base font-medium">
              What this does & how to use it
            </summary>
            <div className="mt-2 text-sm text-muted">
              <p>
                Paste or type your <strong>test string</strong>, enter a{" "}
                <strong>regex pattern</strong>, and toggle <strong>flags</strong> (g, i, m, s, u, y).
                The tool instantly shows <strong>matches</strong>, a <strong>highlighted</strong> preview,
                and lets you <strong>replace</strong> or <strong>split</strong> text.
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li><strong>Matches</strong> lists each hit, index, and captured groups.</li>
                <li><strong>Replace</strong> shows output after applying your pattern and replacement.</li>
                <li><strong>Split</strong> breaks the text into parts wherever the pattern matches.</li>
                <li><strong>Highlighted</strong> shows the test string with matches wrapped in <code>&lt;mark&gt;</code>.</li>
                <li>Use the <strong>Presets</strong> row for common patterns (emails, URLs, numbers, dates, Eircode, etc.).</li>
              </ul>
              <p className="mt-3">
                Tip: If you want to see every match, include the <code>g</code> flag. For case-insensitive
                matching, add <code>i</code>.
              </p>
            </div>
          </details>
          {/* Mobile (collapsed) */}
          <details className="block md:hidden card p-4 md:p-6 text-center">
            <summary className="cursor-pointer select-none text-base font-medium">
              What this does & how to use it
            </summary>
            <div className="mt-2 text-sm text-muted">
              <p>
                Paste or type your <strong>test string</strong>, enter a{" "}
                <strong>regex pattern</strong>, and toggle <strong>flags</strong> (g, i, m, s, u, y).
                The tool instantly shows <strong>matches</strong>, a <strong>highlighted</strong> preview,
                and lets you <strong>replace</strong> or <strong>split</strong> text.
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li><strong>Matches</strong> lists each hit, index, and captured groups.</li>
                <li><strong>Replace</strong> shows output after applying your pattern and replacement.</li>
                <li><strong>Split</strong> breaks the text into parts wherever the pattern matches.</li>
                <li><strong>Highlighted</strong> shows the test string with matches wrapped in <code>&lt;mark&gt;</code>.</li>
                <li>Use the <strong>Presets</strong> row for common patterns (emails, URLs, numbers, dates, Eircode, etc.).</li>
              </ul>
              <p className="mt-3">
                Tip: If you want to see every match, include the <code>g</code> flag. For case-insensitive
                matching, add <code>i</code>.
              </p>
            </div>
          </details>
        </div>

        <Client />

        {/* ----- User Guide ----- */}
        <div className="card p-4 md:p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Regex User Guide</h2>

          <h3 className="font-medium mt-3 mb-1">What is a regular expression?</h3>
          <p className="text-sm text-muted">
            A <strong>regular expression</strong> (regex) is a compact pattern language for searching,
            extracting and transforming text. It’s supported across programming languages and tools.
          </p>

          <h3 className="font-medium mt-3 mb-1">How this tool works</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li><strong>Pattern</strong> — the regex you want to test (e.g. <code>{String.raw`\d+`}</code>).</li>
            <li><strong>Flags</strong> — modifiers such as <code>g</code> (global), <code>i</code> (ignore case), <code>m</code> (multiline), <code>s</code> (dotAll), <code>u</code> (unicode), <code>y</code> (sticky).</li>
            <li><strong>Test string</strong> — the input text. Results update as you type.</li>
            <li><strong>Matches</strong> — each match with index and any capture groups.</li>
            <li><strong>Replace / Split</strong> — preview replacements or split results immediately.</li>
          </ul>

          <h3 className="font-medium mt-3 mb-1">Common patterns (copy & paste)</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded bg-[color:var(--bg-lift)] p-3">
              <div className="font-medium">Email</div>
              <code className="block mt-1">{String.raw`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}`}</code>
              <div className="text-muted mt-1">Simple, not full RFC validation.</div>
            </div>
            <div className="rounded bg-[color:var(--bg-lift)] p-3">
              <div className="font-medium">URL</div>
              <code className="block mt-1">{String.raw`(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w./%#?=&-]*)?`}</code>
              <div className="text-muted mt-1">HTTP(S) and bare domains.</div>
            </div>
            <div className="rounded bg-[color:var(--bg-lift)] p-3">
              <div className="font-medium">Number (int/float)</div>
              <code className="block mt-1">{String.raw`\b\d+(?:\.\d+)?\b`}</code>
            </div>
            <div className="rounded bg-[color:var(--bg-lift)] p-3">
              <div className="font-medium">Date (YYYY-MM-DD)</div>
              <code className="block mt-1">{String.raw`\b\d{4}-\d{2}-\d{2}\b`}</code>
            </div>
            <div className="rounded bg-[color:var(--bg-lift)] p-3">
              <div className="font-medium">Irish Eircode</div>
              <code className="block mt-1">{String.raw`\b[A-Za-z0-9]{3}\s?[A-Za-z0-9]{4}\b`}</code>
              <div className="text-muted mt-1">Loose match for routing key + unique identifier.</div>
            </div>
            <div className="rounded bg-[color:var(--bg-lift)] p-3">
              <div className="font-medium">Collapse whitespace</div>
              <code className="block mt-1">{String.raw`\s+`}</code>
              <div className="text-muted mt-1">Replace with a single space.</div>
            </div>
          </div>

          <h3 className="font-medium mt-3 mb-1">Flags reference</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li><code>g</code> — global (find all matches)</li>
            <li><code>i</code> — ignore case</li>
            <li><code>m</code> — multiline (<code>^</code> and <code>$</code> match line boundaries)</li>
            <li><code>s</code> — dotAll (<code>.</code> also matches newlines)</li>
            <li><code>u</code> — unicode mode</li>
            <li><code>y</code> — sticky (match starting at lastIndex)</li>
          </ul>

          <h3 className="font-medium mt-3 mb-1">Tips</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Use <code>( ... )</code> to capture groups and reference them as <code>$1</code>, <code>$2</code> in replacements.</li>
            <li>Escape special characters with <code>\</code> (e.g. use <code>\.</code> for a literal dot).</li>
            <li>Start simple; add anchors <code>^</code> and <code>$</code> to control where matches occur.</li>
          </ul>
        </div>

        {/* ----- SEO: FAQ + Related Links ----- */}
        <div className="md:col-span-2 grid lg:grid-cols-3 gap-6">
          {/* FAQ */}
          <div className="card p-4 md:p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Regex FAQ</h2>
            <details className="mb-2" open>
              <summary className="font-medium cursor-pointer">What is regex used for?</summary>
              <p className="text-sm text-muted mt-1">
                Cleaning data, validating inputs (emails, Eircodes), parsing logs, transforming text,
                and search/replace tasks in editors and code.
              </p>
            </details>
            <details className="mb-2">
              <summary className="font-medium cursor-pointer">Why doesn&apos;t my pattern match?</summary>
              <p className="text-sm text-muted mt-1">
                Check escaping (<code>{String.raw`\\.`}</code> for a literal dot), anchors (<code>^</code>, <code>$</code>),
                and flags (<code>i</code> for case-insensitive, <code>g</code> for all matches).
              </p>
            </details>
            <details className="mb-2">
              <summary className="font-medium cursor-pointer">Does this support Unicode?</summary>
              <p className="text-sm text-muted mt-1">
                Yes — enable the <code>u</code> flag for Unicode mode.
              </p>
            </details>
            <details>
              <summary className="font-medium cursor-pointer">How do I replace with capture groups?</summary>
              <p className="text-sm text-muted mt-1">
                Use <code>$1</code>, <code>$2</code>, etc. in the <em>Replace with</em> input.
              </p>
            </details>
          </div>

          {/* Related links */}
          <div className="card p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-2">Related tools</h2>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><a className="link" href="/format">JSON / YAML / XML Formatter</a></li>
              <li><a className="link" href="/case-converter">Case Converter</a></li>
              <li><a className="link" href="/diff">Diff Checker</a></li>
              <li><a className="link" href="/qr">QR Code Generator</a></li>
            </ul>
          </div>
        </div>

  
      </ToolLayout>
    </>
  );
}
