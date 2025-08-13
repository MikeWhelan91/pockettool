export default function Head() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a regular expression (regex)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "A regular expression is a compact pattern for finding, extracting, and transforming text. This page lets you test patterns, view matches, and preview replacements entirely in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "How do I use this regex tester?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Enter a pattern and optional flags (g, i, m, s, u, y), paste your test string, and view matches, highlighted text, and replacement output instantly. Use presets to start quickly."
        }
      },
      {
        "@type": "Question",
        "name": "Which regex engine does this tool use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "It uses the JavaScript (ECMAScript) regex engine that runs in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "How do I reference capture groups in replacements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Use $1, $2, and so on in the Replace with field to insert captured groups."
        }
      },
      {
        "@type": "Question",
        "name": "Can I learn regex basics here?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. See the Quick regex cheatsheet and the User Guide below for common tokens, flags, and example patterns you can copy and paste."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Injected into <head> so crawlers see it, while it never shows in the UI.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
