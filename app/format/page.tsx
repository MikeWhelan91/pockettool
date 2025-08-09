// app/formatter/page.tsx
import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'JSON / YAML / XML Formatter & Validator — PocketKit',
  description:
    'Format and validate JSON, YAML, or XML instantly in your browser. Auto-detect, pretty-print or minify. Private & fast.',
  openGraph: {
    title: 'JSON / YAML / XML Formatter & Validator — PocketKit',
    description:
      'Format and validate JSON, YAML, or XML instantly in your browser. Auto-detect, pretty-print or minify. Private & fast.',
    url: '/formatter',
    siteName: 'PocketKit',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'JSON / YAML / XML Formatter & Validator — PocketKit',
    description:
      'Format and validate JSON, YAML, or XML instantly in your browser. Auto-detect, pretty-print or minify. Private & fast.',
  },
};

export default function Page() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
      {/* Tool header */}
      <header className="rounded-2xl border border-neutral-800 bg-[#1a1a1a] p-6 md:p-8">
        <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-neutral-800 bg-[#111]">
              {/* simple curly-braces icon */}
              <span className="text-xl">{'{}'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                JSON / YAML / XML Formatter
              </h1>
              <p className="text-neutral-400">
                Paste code, auto-detect the format, and pretty-print or minify — all client-side.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-sm"
            >
              ← All tools
            </a>
            <a
              href="#editor"
              className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm"
            >
              Start formatting
            </a>
          </div>
        </div>
      </header>

      {/* Main editor card */}
      <section id="editor" className="card w-full">
        <Client />
      </section>
    </div>
  );
}
