import Link from "next/link";

const tools = [
  { href: "/qr", title: "QR & Wi-Fi", desc: "Create QR codes. Export PNG/SVG." },
  { href: "/image-converter", title: "Image Converter", desc: "HEIC → JPG/PNG/WebP. Local, private." },
  { href: "/pdf", title: "PDF Tools", desc: "Merge, split, compress PDFs — in your browser." },
  { href: "/format", title: "JSON / YAML / XML", desc: "Format, validate and convert." },
  { href: "/random", title: "Random & Passwords", desc: "UUIDs, passwords, colors, lorem, slugs." },
  { href: "/case-converter", title: "Case Converter", desc: "Title, sentence, snake, kebab, camel, pascal." },
  { href: "/base64", title: "Base64", desc: "Encode or decode text and files." },
  { href: "/diff", title: "Text Diff", desc: "Compare two texts and see changes." },
];

export default function HomePage() {
  return (
    <div className="grid gap-10">
      {/* Hero with thin blue border + soft glow */}
      <section
        className="hero border"
        style={{
          // thin blue border from theme token
          borderColor: "hsl(var(--ring))",
          // soft outer glow using the same token (kept gentle so it doesn't shout)
          boxShadow:
            "0 6px 24px hsl(var(--ring) / .16), inset 0 1px 0 hsl(var(--bg) / .8)",
        }}
      >
        <div className="px-6 py-10 md:px-10 md:py-14 grid gap-8 md:grid-cols-[1.1fr_.9fr] items-center">
          <div>
            <h1 className="text-[2.1rem] leading-tight font-semibold tracking-tight">
              Quick, private web tools — right in your browser
            </h1>
            <p className="mt-3 text-[1.05rem] text-muted max-w-[58ch]">
              Generate QR codes, convert images, merge PDFs, format JSON/YAML/XML, and more. Everything runs locally on
              your device — nothing uploaded.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/qr" className="btn">Open a tool</Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {["Runs locally","No tracking","Dark mode","PWA friendly","Accessible"].map((x) => (
                <span key={x} className="chip">{x}</span>
              ))}
            </div>
          </div>

          {/* Keep the preview block for balance for now */}
          <div className="hidden md:block">
            <div
              className="card--flat p-5 h-full grid place-items-center"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 40%, hsl(var(--ring) / .14), transparent 60%), hsl(var(--card))",
              }}
            >
              <div className="rounded-[16px] border border-line bg-[hsl(var(--bg))] shadow-sm px-6 py-4">
                <div className="text-sm text-muted">Preview</div>
                <div className="mt-2 text-[.95rem]">Lightweight UI with consistent spacing.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="grid gap-5">
        <h2 className="text-[1.05rem] font-semibold">Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="no-underline">
              <article className="tile p-5">
                <h3 className="font-medium">{t.title}</h3>
                <p className="text-sm text-muted mt-1">{t.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm">
                  <span>Open</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="-mr-1">
                    <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
