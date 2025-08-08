import Link from 'next/link';
import AdSlot from '@/components/AdSlot';

const tools = [
  { href: '/random', title: 'Password & Random Generators', desc: 'Create secure passwords, UUIDs, colors, lorem text, and more.' },
  { href: '/qr', title: 'Wi-Fi QR & QR Codes', desc: 'Share your Wi-Fi or generate any QR code in seconds.' },
  { href: '/pdf', title: 'PDF Tools', desc: 'Merge, split, and compress PDFs directly in your browser.' },
  { href: '/image-converter', title: 'Image Converter (JPG / PNG / WEBP + HEIC)', desc: 'Convert images privately and instantly in your browser.' },
  { href: '/case-converter', title: 'Case Converter', desc: 'Switch text between upper, lower, title, and sentence case.' },
  { href: '/format', title: 'JSON / XML Formatter', desc: 'Cleanly format and validate JSON or XML files.' },
  { href: '/base64', title: 'Base64 Encoder/Decoder', desc: 'Convert text or files to/from Base64 encoding.' },
  { href: '/diff', title: 'Text Diff Checker', desc: 'Spot differences between two blocks of text easily.' }
];

export default function Page() {
  return (
    <div className="space-y-8">
      {/* Intro card, centered */}
      <section className="card mx-auto max-w-screen-lg">
        <h1 className="text-2xl font-semibold">🧰 PocketKit</h1>
        <p className="text-neutral-300 mt-1">
          Fast, private web tools — everything runs in your browser. No tracking, no uploads, just instant productivity.
        </p>
      </section>

      {/* Ad slot */}
      <AdSlot slotId="0000000000" />

      {/* Tools grid, centered and capped width */}
      <section className="mx-auto max-w-screen-lg grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="card hover:border-brand transition">
            <h2 className="font-semibold">{t.title}</h2>
            <p className="text-neutral-400 mt-1">{t.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
