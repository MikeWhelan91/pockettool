// app/pdf/Hero.tsx
export default function Hero() {
  return (
    <section data-hero="pdf" className="
      md:col-span-2 relative overflow-hidden rounded-3xl
      border border-[color:var(--line)] bg-[color:var(--bg)]
      p-8 md:p-14 mx-auto w-full max-w-6xl md:min-h-[280px]
      shadow-[0_10px_40px_-10px_hsl(var(--ring)/.25)]
    ">
      {/* soft glows (safe for both themes) */}
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-96 rounded-full blur-3xl opacity-40 md:opacity-50 bg-[radial-gradient(ellipse_at_top_right,theme(colors.blue.500/18)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-28 -left-10 h-72 w-96 rounded-full blur-3xl opacity-40 md:opacity-50 bg-[radial-gradient(ellipse_at_bottom_left,theme(colors.violet.500/18)_0%,transparent_60%)]" />

      <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
        {/* left */}
        <div className="md:col-span-7">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Image Studio</h1>
          <p className="mt-3 text-base md:text-lg text-muted max-w-prose">
            Fast, private, and powerful image converter & resizer — right in your browser. No limits.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-[color:var(--line)]/70 px-3 py-1 text-xs">PNG</span>
            <span className="rounded-full border border-[color:var(--line)]/70 px-3 py-1 text-xs">JPEG</span>
            <span className="rounded-full border border-[color:var(--line)]/70 px-3 py-1 text-xs">WEBP</span>
            <span className="rounded-full border border-[color:var(--line)]/70 px-3 py-1 text-xs">AVIF</span>
                        <span className="rounded-full border border-[color:var(--line)]/70 px-3 py-1 text-xs">Convert</span>
            <span className="rounded-full border border-[color:var(--line)]/70 px-3 py-1 text-xs">Resize</span>
            <span className="rounded-full border border-[color:var(--line)]/70 px-3 py-1 text-xs">Set Quality</span>
          </div>

        </div>

        {/* right quick-cards */}
        <div className="md:col-span-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: "Merge",   desc: "Combine PDFs." },
              { title: "Reorder", desc: "Drag pages." },
              { title: "Convert", desc: "Images ↔ PDF." },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg)]/70 p-5 shadow-sm text-center"
              >
                <div className="text-sm font-medium">{c.title}</div>
                <p className="text-xs text-muted mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
