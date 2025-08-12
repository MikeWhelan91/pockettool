
# Utilixy — Swiss‑Army Web Tools (Scaffold)

This is a minimal Next.js + TypeScript + Tailwind scaffold with two tools ready:

- **/qr** — QR / Wi‑Fi QR generator (PNG/SVG downloads)
- **/image-converter** — HEIC → JPG converter (client‑side with `heic2any`)

Ads are gated behind a simple consent banner. Replace the AdSense client and slot IDs before launch.

## Quick start

```bash
npm i
npm run dev
# visit http://localhost:3000
```

## Add your AdSense IDs

Edit `components/AdSlot.tsx`:
- Replace `ca-pub-xxxxxxxxxxxxxxxx` with your client ID
- Replace `slotId` props on each page with your slot IDs

## Tech

- Next.js 14 (app router), TypeScript, Tailwind
- `qrcode` for QR generation
- `heic2any` (WASM libheif) for local HEIC → JPG conversion
- Simple localStorage consent gate (replace with a TCF v2 CMP for production)

## Roadmap (next)

- PDF Merge/Split/Compress (client‑side with `pdf-lib` + `pdfjs-dist`)
- MP4 → GIF (`ffmpeg.wasm` in a Web Worker)
- i18n, PWA offline shell, how‑to pages

## Branding

Current working name: **Utilixy** (rename freely). To rename:
- update `public/manifest.json`
- change header label in `app/layout.tsx`
- search/replace Utilixy in code

---

© 2025 Utilixy
