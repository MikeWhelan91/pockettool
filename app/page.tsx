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
      {/* Hero — subtle glow, gradient accents, no CTA */}
    <section
  className="
    relative overflow-hidden rounded-[var(--radius)]
    border border-line bg-[hsl(var(--card))]
    shadow-[0_10px_40px_-10px_hsl(var(--ring)/.25)]
  "
>
  {/* thin highlight */}
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--ring)/.45)] to-transparent opacity-60" />

  {/* BACKDROPS */}
  {/* Dark-mode glow (kept from your current look) */}
  <div
    aria-hidden
    className="hero-dark pointer-events-none absolute inset-0"
  >
    <div className="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_35%_0%,#000_0,transparent_70%)]
                    bg-[radial-gradient(60%_60%_at_15%_10%,hsl(var(--ring)/.18),transparent_60%),radial-gradient(40%_40%_at_95%_0%,hsl(var(--ring)/.14),transparent_60%)]" />
    <div className="absolute -top-20 -left-24 h-[420px] w-[420px] rounded-full bg-[hsl(var(--ring)/.18)] blur-3xl" />
    <div className="absolute -bottom-28 -right-28 h-[520px] w-[520px] rounded-full bg-[hsl(var(--ring)/.12)] blur-3xl" />
  </div>

  {/* Light-mode: super subtle, mostly neutral (almost no blue) */}
  <div
    aria-hidden
    className="hero-light pointer-events-none absolute inset-0"
  >
    {/* extremely faint neutral wash */}
    <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,hsl(220_20%_96%/.8),transparent_65%)]" />
    {/* a tiny hint of ring, much lower than before */}
    <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_95%_0%,hsl(var(--ring)/.04),transparent_60%)]" />
  </div>

  <div className="relative px-6 py-10 md:px-10 md:py-14 grid gap-8 md:grid-cols-[380px_1fr] items-center">
    <div className="flex justify-center items-center">
      <img
        src="/utilixy-logo.svg"
        alt="Utilixy logo"
        className="h-[220px] w-auto md:h-[260px] lg:h-[300px] drop-shadow-md [filter:contrast(1.05)_saturate(1.05)]"
      />
    </div>

    <div>
      <h1 className="text-[2.2rem] leading-tight font-semibold tracking-tight md:text-[2.6rem]">
        Quick, private web tools — right in your browser
      </h1>
      <p className="mt-3 text-[1.05rem] text-muted max-w-[64ch]">
        Generate QR codes, convert images, merge PDFs, format JSON/YAML/XML, and more.
        Everything runs locally on your device — nothing uploaded.
      </p>
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
