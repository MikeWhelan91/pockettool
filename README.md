# Utilixy — PDF Studio & Local-First Web Tools

**Utilixy** is a set of fast, private, local-first utilities. Files are processed **in your browser**. Nothing is uploaded.

## Highlights

- **PDF Studio** (hero): reorder, rotate, merge, split, page numbers, headers/footers, watermarks, extract text, images↔PDF, stamp QR, quick raster redaction, optimize.
- **QR & Wi-Fi:** generate QR codes (PNG/SVG).
- **Image Converter:** HEIC → JPG/PNG/WebP (client-side).
- **Formatters & Text Tools:** JSON/YAML/XML, regex tester (highlight, replace, split), case converter, Base64, diff.
- **Local-first:** privacy by default.

---

## Quick start

```bash
npm i
npm run dev
# http://localhost:3000
```

**Node**: 18+ recommended (Next.js App Router).  
**TypeScript**: enabled.  
**Tailwind**: already wired via `globals.css`.

---

## Routes

- `/` — Homepage (PDF Studio hero, tools grid)
- `/pdf` — **PDF Studio**
- `/qr` — QR & Wi-Fi generator
- `/image-converter` — Client-side image conversion
- `/format` — JSON / YAML / XML formatter
- `/random` — Random & passwords (UUID, colors, lorem, slugs)
- `/case-converter` — Case converter
- `/base64` — Base64 encode/decode
- `/diff` — Text diff
- `/regex` — Regex tester
- `/about` — About the project

---

## Tech stack

- **Framework:** Next.js (App Router) + TypeScript + Tailwind
- **PDF:** `pdf-lib`, `pdfjs-dist` (render/extract)
- **QR:** `qrcode`
- **Images:** `heic2any` (WASM libheif) for HEIC → JPG/PNG/WebP
- **UX:** local-first patterns, Web APIs (Canvas/File), small, focused components

---

## PDF Studio features (browser-only)

- **Assemble:** reorder, rotate, delete; merge and split.
- **Label:** page numbers, headers/footers, watermarks (center/angled, corners).
- **Convert:** images → PDF; PDF → images (PNG/ZIP).
- **Extract:** text extraction (where text layer exists).
- **Redact (quick):** draw boxes; bake to raster on page 1 (fast).  
  > For true vector redaction (remove content streams/text), plan a v2.
- **Optimize:** structural, lossless optimizations.  
  > For stronger shrinkage, a “lossy” image downscale mode can be added.

---

## Theming

- **Default:** Dark mode (first visit).
- **Persistence:** User choice saved to `localStorage("utilixy_theme")`.
- **Toggle:** In the footer.

---

## Ads & consent (privacy-aware)

- **Consent banner:** sticky bottom; first-run prompt.
- **Accept:** personalized ads (Consent Mode v2: granted).
- **Decline:** **non-personalized** contextual ads (Consent Mode v2: denied).
- Exposes `window.__ads_mode` (`"pa"` or `"npa"`) for ad bootstrap; call `window.refreshAds?.()` after a choice.

---

## SEO basics

- **Metadata API:** titles, descriptions, canonical per route.
- **Sitemap & robots:** `app/sitemap.ts`, `app/robots.ts`.
- **Structured data:** JSON-LD for Organization/WebSite (home) and SoftwareApplication (PDF Studio).
- **Internal links:** homepage hero, tool chips, header/footer links.

---

## Scripts

```bash
npm run dev     # local dev
npm run build   # production build
npm run start   # run built app
npm run lint    # lint
```

---

## Roadmap

- Vector redaction (multi-page, content stream removal)
- Lossy PDF optimize (image recompress/downscale)
- Client-side OCR (for scanned PDFs)
- PWA install prompt + offline shell
- i18n and accessibility polish
- “What’s new” changelog

---

## Contributing

Issues and PRs are welcome—especially small UX fixes, accessibility tweaks, and test PDFs that break things.

---

## Branding

Working name: **Utilixy**. To rename:
- Update `public/manifest.json`
- Change header label in `app/layout.tsx`
- Replace “Utilixy” mentions across the codebase

---

© 2025 Utilixy
