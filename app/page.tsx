import Link from 'next/link'
import AdSlot from '@/components/AdSlot'

const tools = [
  { href: '/qr', title: 'QR / Wi-Fi QR', desc: 'Generate QR codes and Wi-Fi share cards.' },
  { href: '/image-converter', title: 'Images (JPG / PNG / WEBP + HEIC)', desc: 'Convert images privately in your browser.' },
  { href: '/pdf', title: 'PDF Editor', desc: 'Merge, split, and compress PDFs without uploading.' },

]

export default function Page() {
  return (
    <div className="space-y-8">
      {/* Intro card, centered */}
      <section className="card mx-auto max-w-screen-lg">
        <h1 className="text-2xl font-semibold">🛠️ PocketTool</h1>
        <p className="text-neutral-300 mt-1">
          A Swiss-army knife of fast, private web tools. Everything runs in your browser — we never upload your files.
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
  )
}
