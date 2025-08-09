import Link from "next/link";
import Hero from "@/components/Hero";
import AdSlot from "@/components/AdSlot";

const tools = [
  { href: "/random", title: "Password & Random Generators", desc: "Create passwords, UUIDs, colors, lorem text, and more.", icon: "✳️" },
  { href: "/qr", title: "Wi-Fi QR & QR Codes", desc: "Share your Wi-Fi or create any QR in seconds.", icon: "📶" },
  { href: "/pdf", title: "PDF Tools", desc: "Merge, split, and compress PDFs locally.", icon: "📄" },
  { href: "/image-converter", title: "Image Converter (JPG / PNG / WEBP + HEIC)", desc: "Convert images instantly, privately.", icon: "🖼️" },
  { href: "/case-converter", title: "Case Converter", desc: "UPPER/lower, Title, Sentence, camelCase and more.", icon: "Aa" },
  { href: "/format", title: "JSON / YAML / XML Formatter", desc: "Pretty-print & validate formats in-browser.", icon: "{}" },
  { href: "/base64", title: "Base64 Encoder/Decoder", desc: "Convert text or files to/from Base64.", icon: "🧬" },
  { href: "/diff", title: "Text Diff Checker", desc: "Highlight additions & deletions between texts.", icon: "⇄" },
];

export default function Page() {
  return (
    <div className="space-y-8">
      <Hero />

      <div className="mx-auto max-w-screen-lg">
        <AdSlot slotId="0000000000" />
      </div>

      <section className="mx-auto max-w-screen-lg grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="card tool-card hover:border-[color:var(--brand)]"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-[color:var(--bg-soft)] border border-[color:var(--stroke)]">
                <span className="text-base">{t.icon}</span>
              </div>
              <h3 className="font-semibold leading-tight">{t.title}</h3>
            </div>
            <p className="text-[color:var(--text-muted)] mt-2">{t.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
