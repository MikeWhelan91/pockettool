/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import React from "react";
import PdfPreview from "@/components/PdfPreview";
import ToolDocToPdfUX from "./tools/ToolDocToPdf";
import ToolPdfToDocUX from "./tools/ToolPdfToDoc";
/* ---------------- Ads / Conversion helpers (Google Ads) ---------------- */
// Per-action conversion tracking. Replace LABEL_* with your real conversion labels from Google Ads.
// Example final send_to looks like: "AW-778841432/AbCdEfGhIjkLmNoP"
export type PdfAction =
  | "merge"
  | "reorder"
  | "rotate"
  | "numbers_header_footer_watermark"
  | "images_to_pdf"
  | "pdf_to_images"
  | "extract_text"
  | "fill_flatten_export"
  | "redact_apply"
  | "split"
  | "stamp_qr"
  | "edit_metadata"
  | "compress"
  | "doc_to_pdf"
  | "pdf_to_doc";

const ADS_CONVERSION_ID = "AW-778841432";
// TODO: swap placeholder labels for real ones from Google Ads
const ACTION_LABELS: Partial<Record<PdfAction, string>> = {
  merge: "LABEL_MERGE",
  reorder: "LABEL_REORDER",
  rotate: "LABEL_ROTATE",
  numbers_header_footer_watermark: "LABEL_ANNOTE",
  images_to_pdf: "LABEL_IMG2PDF",
  pdf_to_images: "LABEL_PDF2IMG",
  extract_text: "LABEL_EXTRACT",
  fill_flatten_export: "LABEL_FILLFLATTEN",
  redact_apply: "LABEL_REDACT",
  split: "LABEL_SPLIT",
  stamp_qr: "LABEL_STAMPQR",
  edit_metadata: "LABEL_EDITMETA",
  compress: "LABEL_COMPRESS",
  doc_to_pdf: "LABEL_DOC2PDF",
  pdf_to_doc: "LABEL_PDF2DOC",
};

function safeGtagEvent(sendTo: string) {
  try {
    if (typeof window === "undefined") return;
    const g = (window as any).gtag;
    if (typeof g === "function") g("event", "conversion", { send_to: sendTo });
  } catch {}
}

// De-dupe once per session per action (so a spammy user doesn't nuke your signal).
function hasFired(action: PdfAction) {
  try {
    return sessionStorage.getItem(`uxy_conv_${action}`) === "1";
  } catch {
    return false;
  }
}
function markFired(action: PdfAction) {
  try {
    sessionStorage.setItem(`uxy_conv_${action}`, "1");
  } catch {}
}

export function trackPdfAction(action: PdfAction) {
  const label = ACTION_LABELS[action];
  if (!label) return; // no label set yet; skip to avoid bad data
  if (hasFired(action)) return;
  safeGtagEvent(`${ADS_CONVERSION_ID}/${label}`);
  markFired(action);
}

/* ---------------- Shared helpers ---------------- */

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  // Make sure this exists: /public/pdfjs/pdf.worker.min.js
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
  return pdfjs;
}

async function loadJSZip() {
  try {
    const mod = await import("jszip");
    return (mod as any).default || mod;
  } catch {
    return null;
  }
}

async function loadQRCode() {
  try {
    const mod = await import("qrcode");
    return mod as any;
  } catch {
    return null;
  }
}

function dl(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function blobFromUint8(bytes: Uint8Array, name = "output.pdf") {
  const blob = new Blob([bytes.buffer as ArrayBuffer], {
    type: "application/pdf",
  });
  const url = URL.createObjectURL(blob);
  return { blob, url, name };
}

// Parse page ranges like: "1,3,5-7" into zero-based indices
function parsePageSelection(input: string, totalPages: number): number[] {
  const out = new Set<number>();
  const parts = (input || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const p of parts) {
    const m = p.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    let a = Math.max(1, Math.min(totalPages, parseInt(m[1], 10)));
    let b = m[2] ? Math.max(1, Math.min(totalPages, parseInt(m[2], 10))) : a;
    if (a > b) [a, b] = [b, a];
    for (let i = a; i <= b; i++) out.add(i - 1);
  }
  return Array.from(out).sort((x, y) => x - y);
}

/* --- Simple collapsible help block used by all tools --- */
export function ToolHelp({
  title = "What this does & how to use it",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setOpen(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return (
    <details
      open={open}
      className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3"
    >
      <summary className="cursor-pointer text-sm font-medium">{title}</summary>
      <div className="mt-2 text-sm text-muted space-y-2">{children}</div>
    </details>
  );
}

/* --- Explanations (what/why/how) for each tool --- */
const HELP = {
  reorder: (
    <>
      <p>
        <b>Why</b>: Fix wrong page order, rotate sideways scans, or remove pages
        before sharing.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Choose one or more PDFs.</li>
        <li>
          Drag thumbnails to reorder. Right-click a page to delete. Press{" "}
          <kbd>R</kbd> to rotate the preview.
        </li>
        <li>
          Click <b>Export PDF</b> to download the new document.
        </li>
      </ol>
      <p>
        <b>Notes</b>: Rotation in this tool is visual for arranging; the
        exported PDF preserves the chosen order.
      </p>
    </>
  ),
  watermark: (
    <>
      <p>
        <b>Why</b>: Add page numbers or simple headers/footers; stamp a
        “CONFIDENTIAL/DRAFT” watermark for compliance.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>
          Pick a PDF and a <b>Mode</b> (numbers, header, footer, watermark).
        </li>
        <li>Set text/position, font size, and opacity.</li>
        <li>
          Click <b>Apply & Download</b>.
        </li>
      </ol>
      <p>
        <b>Notes</b>: Page numbers default to <i>Bottom-Center</i>. “Watermark”
        places angled text in the center by default.
      </p>
    </>
  ),
  imagesToPdf: (
    <>
      <p>
        <b>Why</b>: Turn photos/scans into a clean, single PDF (receipts,
        whiteboard shots, signed pages).
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Select JPG/PNG images (order usually follows the file picker).</li>
        <li>Choose page size and margins.</li>
        <li>
          Click <b>Build PDF</b>.
        </li>
      </ol>
      <p>
        <b>Tip</b>: If images are huge, shrinking them before import keeps the
        PDF small.
      </p>
    </>
  ),
  pdfToImages: (
    <>
      <p>
        <b>Why</b>: Export pages as PNGs for slides, annotation apps, or
        image-only sharing.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>
          Pick a PDF; optionally enable <b>Download as .zip</b>.
        </li>
        <li>
          Click <b>Convert</b>. Download images or a zip archive.
        </li>
      </ol>
      <p>
        <b>Note</b>: This renders pages (it’s not extracting embedded images
        one-by-one).
      </p>
    </>
  ),
  extractText: (
    <>
      <p>
        <b>Why</b>: Get selectable text for search, quoting, or indexing.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>
          Choose a PDF and click <b>Extract</b>.
        </li>
        <li>
          Copy from the output or <b>Download .txt</b>.
        </li>
      </ol>
      <p>
        <b>Limitations</b>: Scanned PDFs without OCR will produce little or no
        text.
      </p>
    </>
  ),
  fillFlatten: (
    <>
      <p>
        <b>Why</b>: Fill form fields and lock the values so they can’t be
        edited.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>
          Open a PDF form, enter a field name and value, then click{" "}
          <b>Fill & Flatten</b>.
        </li>
      </ol>
      <p>
        <b>Notes</b>: You need the exact field name.
      </p>
    </>
  ),
  redact: (
    <>
      <p>
        <b>Why</b>: Quickly hide sensitive content before sharing.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>
          Open a PDF and choose <b>Redaction color</b> (black or white).
        </li>
        <li>
          Pick a page from the dropdown, draw boxes over areas to hide. Switch
          pages and repeat — your boxes are kept in memory per page.
        </li>
        <li>
          When you&apos;re done, click <b>Apply</b> once to burn all redactions
          into the correct pages and download.
        </li>
      </ol>
      <p>
        <b>Note</b>: This is a fast on-device redaction that draws solid boxes
        into pages.
      </p>
    </>
  ),
  split: (
    <>
      <p>
        <b>Why</b>: Break large PDFs into smaller chunks for email or
        per-section delivery.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>
          Choose a PDF and a mode: <b>count</b> (every N pages), <b>max</b>{" "}
          (chunk size), or <b>bookmarks</b> (split by top-level outline).
        </li>
        <li>
          Click <b>Split</b> to download parts.
        </li>
      </ol>
      <p>
        <b>Note</b>: Bookmark split requires a PDF with a proper outline.
      </p>
    </>
  ),
  stampQR: (
    <>
      <p>
        <b>Why</b>: Stamp a QR code (URL, ticket ID, signature link) onto every
        page.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Open a PDF, enter the text/URL, choose size and corner.</li>
        <li>
          Click <b>Stamp & Download</b>.
        </li>
      </ol>
    </>
  ),
  batchMerge: (
    <>
      <p>
        <b>Why</b>: Combine multiple PDFs into one (e.g., report + appendix +
        invoices).
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Select PDFs in the order you want them merged.</li>
        <li>
          Click <b>Merge & Download</b>.
        </li>
      </ol>
      <p>
        <b>Tip</b>: If you need to reorder after selection, use the Reorder tool
        on the merged file.
      </p>
    </>
  ),
  compress: (
    <>
      <p>
        <b>Why</b>: Reduce file size for sharing, while keeping content intact.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>
          Select one or more PDFs and click <b>Optimize & Download</b>.
        </li>
      </ol>
      <p>
        <b>Note</b>: This is <i>lossless</i> structural optimization.
      </p>
    </>
  ),
  rotate: (
    <>
      <p>
        <b>Why</b>: Permanently fix sideways/scanned pages across all or
        selected pages.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Choose a PDF and a rotation (90° CW, 180°, 270° CW).</li>
        <li>
          (Optional) Enter specific pages like <code>1,3,5-7</code> or leave
          blank for all.
        </li>
        <li>
          Click <b>Rotate & Download</b>.
        </li>
      </ol>
    </>
  ),
  sign: (
    <>
      <p>
        <b>Why</b>: Add a handwritten or image signature to your PDF.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Upload your PDF and a transparent PNG of your signature.</li>
        <li>Choose size, page(s), and corner position.</li>
        <li>
          Click <b>Sign & Download</b>.
        </li>
      </ol>
      <p>
        <b>Note</b>: This places an image stamp (not a cryptographic digital
        signature).
      </p>
    </>
  ),
  meta: (
    <>
      <p>
        <b>Why</b>: Edit Title/Author/Subject/Keywords for better document
        info/search.
      </p>
      <p>
        <b>How</b>:
      </p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Upload a PDF, fill in the fields you want to set.</li>
        <li>
          Click <b>Save Metadata</b>.
        </li>
      </ol>
    </>
  ),
} as const;

/* --------- Core studio shell (sidebar + stage) --------- */

type ToolKey =
  | "batchMerge"
  | "reorder"
  | "watermark"
  | "imagesToPdf"
  | "pdfToImages"
  | "docToPdf"
  | "pdfToDoc"
  | "extractText"
  | "fillFlatten"
  | "redact"
  | "split"
  | "stampQR"
  | "compress"
  | "rotate"
  | "sign"
  | "meta";

// replace your TOOL_LIST with this
const TOOL_LIST: { key: ToolKey; label: string }[] = [
  { key: "batchMerge", label: "Merge" },
    { key: "split", label: "Split" },
  { key: "reorder", label: "Reorder" },
  { key: "rotate", label: "Rotate Pages" },
  { key: "imagesToPdf", label: "Images → PDF" },
  { key: "pdfToImages", label: "PDF → Images" },
  { key: "docToPdf", label: "Word → PDF" },
  { key: "pdfToDoc", label: "PDF → Word" },
  { key: "extractText", label: "Extract text" },
  { key: "fillFlatten", label: "Fill forms & flatten" },
  { key: "redact", label: "Redact" },
  { key: "watermark", label: "Page numbers / Header / Footer / Watermark" },
  { key: "stampQR", label: "Stamp QR" },
  { key: "meta", label: "Edit Metadata" },
  { key: "compress", label: "Compress" },
];

export default function PDFStudio() {
  const [tool, setTool] = useState<ToolKey>("batchMerge");
  const activeLabel = useMemo(
    () => TOOL_LIST.find((t) => t.key === tool)?.label,
    [tool]
  );

  // --- Visible FAQ + JSON-LD (local to Client) ---
  const faq = [
    {
      q: "Is this PDF toolkit really private and local-first?",
      a: "Yes. Everything runs entirely in your browser — no files are uploaded; your PDFs never leave your device.",
    },
    {
      q: "What kinds of PDFs can I merge?",
      a: "Any standard PDF files. Select them in the order you want, then click Merge & Download.",
    },
    {
      q: "Can I convert images to a single PDF?",
      a: "Yes. Use Images → PDF to combine PNG/JPG/WebP into a single PDF document.",
    },
    {
      q: "Can I convert Word documents to PDF?",
      a: "Yes. Use DOCX → PDF to turn .docx files into PDFs directly in your browser.",
    },
    {
      q: "Can I convert PDFs to Word documents?",
      a: "Yes. Use PDF → DOCX to turn PDFs into editable Word files directly in your browser.",
    },
    {
      q: "How do I add page numbers or a simple header/footer?",
      a: "Open Page numbers / Header / Footer, choose a mode, position, and font size, then Apply & Download.",
    },
    {
      q: "Does compression reduce quality?",
      a: "Compression reduces file size with minimal quality loss for most documents. Choose a higher setting if needed.",
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    /* IMPORTANT: remove row gaps on md+ so there’s no grid gap under the tool */
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-x-6 gap-y-6 md:gap-y-0 items-start">
      {/* Mobile tool selector */}
      <div className="md:hidden card p-3">
        <label className="block text-sm mb-1">Tool</label>
        <select
          className="input w-full"
          value={tool}
          onChange={(e) => setTool(e.target.value as ToolKey)}
        >
          {TOOL_LIST.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop sidebar */}
      <aside className="card p-3 h-fit hidden md:block">
        <div className="grid gap-1">
          {TOOL_LIST.map((t) => (
            <button
              key={t.key}
              className={`group text-left px-3 py-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--bg)]/70 hover:bg-[color:var(--bg-lift)] transition-colors
                ${
                  tool === t.key
                    ? "ring-2 ring-[color:var(--accent)] ring-offset-1 ring-offset-[color:var(--bg)] bg-[color:var(--bg-lift)] border-[color:var(--accent)]/40"
                    : ""
                }`}
              onClick={() => setTool(t.key)}
              aria-current={tool === t.key ? "page" : undefined}
            >
              <div className="text-sm">{t.label}</div>
            </button>
          ))}
        </div>
      </aside>

      {/* === STAGE COLUMN (tool + FAQ in the SAME grid cell) === */}
      <div className="md:[grid-column:2/3] grid gap-3">
        {/* Main stage (the tools) */}
        <main className="grid gap-4">
          {activeLabel && (
            <h2 className="text-base font-semibold">{activeLabel}</h2>
          )}
          {tool === "reorder" && <ToolReorderUX />}
          {tool === "rotate" && <ToolRotateUX />}
          {tool === "watermark" && <ToolWatermarkUX />}
          {tool === "imagesToPdf" && <ToolImagesToPdfUX />}
          {tool === "pdfToImages" && <ToolPdfToImagesUX />}
          {tool === "docToPdf" && <ToolDocToPdfUX />}
          {tool === "pdfToDoc" && <ToolPdfToDocUX />}
          {tool === "extractText" && <ToolExtractTextUX />}
          {tool === "fillFlatten" && <ToolFillFlattenUX />}
          {tool === "redact" && <ToolRedactUX />}
          {tool === "split" && <ToolSplitUX />}
          {tool === "stampQR" && <ToolStampQR />}
          {tool === "batchMerge" && <ToolBatchMergeUX />}
          {tool === "meta" && <ToolMetadata />}
          {tool === "compress" && <ToolCompressUX />}
        </main>

        {/* FAQ: sits directly under the tool, half width on md+ */}
        <section className="w-full md:w-full">
          <div className="card p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              PDF Studio — FAQ
            </h2>
            <div className="space-y-2">
              {faq.map(({ q, a }, i) => (
                <details key={i} className="card--flat p-3">
                  <summary className="font-medium cursor-pointer">{q}</summary>
                  <div className="mt-2 text-sm text-muted">{a}</div>
                </details>
              ))}
            </div>
          </div>

          {/* JSON-LD for rich results */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        </section>
      </div>
    </div>
  );
}
/* -------------------- Tool: Reorder / Rotate / Delete -------------------- */

function ToolReorder() {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbs, setThumbs] = useState<
    { url: string; fileIndex: number; page: number }[]
  >([]);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      setThumbs([]);
      if (!files.length) return;
      const pdfjs = await loadPdfJs();
      const urls: { url: string; fileIndex: number; page: number }[] = [];
      for (let fi = 0; fi < files.length; fi++) {
        const data = await files[fi].arrayBuffer();
        const doc = await pdfjs.getDocument({ data }).promise;
        const pages = Math.min(1000, doc.numPages);
        for (let p = 1; p <= pages; p++) {
          const page = await doc.getPage(p);
          const vp = page.getViewport({
            scale: 0.35 * (window.devicePixelRatio || 1),
          });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvasContext: ctx, canvas, viewport: vp })
            .promise;
          urls.push({
            url: canvas.toDataURL("image/png"),
            fileIndex: fi,
            page: p - 1,
          });
        }
      }
      setThumbs(urls);
    })();
  }, [files]);

  const onDrop = (from: number, to: number) => {
    if (to < 0 || to >= thumbs.length || from === to) return;
    const arr = thumbs.slice();
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setThumbs(arr);
  };

  const exportPdf = async () => {
    if (!files.length || !thumbs.length) return;
    const out = await PDFDocument.create();
    for (const t of thumbs) {
      const src = await PDFDocument.load(
        await files[t.fileIndex].arrayBuffer()
      );
      const [page] = await out.copyPages(src, [t.page]);
      out.addPage(page);
    }
    const bytes = await out.save({ useObjectStreams: true });
    const { url } = await blobFromUint8(bytes, "reordered.pdf");
    dl(url, "reordered.pdf");
    trackPdfAction("reorder");
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.reorder}</ToolHelp>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">PDF files</label>
          <input
            type="file"
            accept="application/pdf"
            multiple
            className="input w-full"
            onChange={(e) =>
              e.target.files && setFiles(Array.from(e.target.files))
            }
          />
        </div>
        <div className="text-sm text-muted">
          Drag thumbnails to reorder; right-click to <b>delete</b>; <kbd>R</kbd>{" "}
          to rotate (visual only).
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {thumbs.map((t, i) => (
          <button
            key={i}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() =>
              dragIndex.current !== null && onDrop(dragIndex.current, i)
            }
            onContextMenu={(e) => {
              e.preventDefault();
              setThumbs((a) => a.filter((_, idx) => idx !== i));
            }}
            className="border rounded overflow-hidden"
            title={`From file #${t.fileIndex + 1}, page ${t.page + 1}`}
          >
            <img src={t.url} alt="" className="w-full" />
          </button>
        ))}
      </div>

      <div>
        <button className="btn" onClick={exportPdf} disabled={!thumbs.length}>
          Export PDF
        </button>
      </div>
    </div>
  );
}

/* -------------------- NEW: Rotate Pages (permanent) -------------------- */

function ToolRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [pages, setPages] = useState<string>(""); // e.g. "1,3,5-7"

  const run = async () => {
    if (!file) return;
    const doc = await PDFDocument.load(await file.arrayBuffer());
    const total = doc.getPageCount();
    const targets = pages.trim()
      ? parsePageSelection(pages, total)
      : Array.from({ length: total }, (_, i) => i);

    targets.forEach((idx) => {
      const p = doc.getPage(idx);
      p.setRotation(degrees(angle));
    });

    const bytes = await doc.save({ useObjectStreams: true });
    const { url } = await blobFromUint8(bytes, "rotated.pdf");
    dl(url, "rotated.pdf");
    trackPdfAction("rotate");
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.rotate}</ToolHelp>

      <div className="grid md:grid-cols-3 gap-3">
        <input
          type="file"
          accept="application/pdf"
          className="input"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <select
          className="input"
          value={angle}
          onChange={(e) =>
            setAngle(parseInt(e.target.value, 10) as 90 | 180 | 270)
          }
        >
          <option value={90}>Rotate 90° CW</option>
          <option value={180}>Rotate 180°</option>
          <option value={270}>Rotate 270° CW</option>
        </select>
        <input
          className="input"
          placeholder="Pages (e.g. 1,3,5-7) — leave empty for all"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
        />
      </div>

      <button className="btn" onClick={run} disabled={!file}>
        Rotate & Download
      </button>
    </div>
  );
}

/* -------------------- Tool: Page numbers / Header / Footer / Watermark -------------------- */


function ToolWatermark() {
  const [file, setFile] = useState<File | null>(null);

  const [mode, setMode] = useState<"numbers" | "header" | "footer" | "watermark">("numbers");
  const [text, setText] = useState<string>("CONFIDENTIAL");
  const [pos, setPos] = useState<"tl" | "tc" | "tr" | "bl" | "bc" | "br" | "center">("bc");
  const [opacity, setOpacity] = useState<number>(60);
  const [color, setColor] = useState<string>("#000000");
  const [size, setSize] = useState<number>(12);

  // live preview thumbs
  type Thumb = { page: number; url: string; w: number; h: number; pageWidthPt: number };
  const [thumbs, setThumbs] = useState<Thumb[]>([]);

  useEffect(() => {
    if (mode === "numbers") setPos("bc");
    else if (mode === "header") setPos("tc");
    else if (mode === "footer") setPos("bc");
    else if (mode === "watermark") setPos("center");
    if (mode === "watermark") setColor("#ff0000");
    else setColor("#000000");
  }, [mode]);

  useEffect(() => { setThumbs([]); }, [file]);

  // build thumbs + keep PDF width in points for font-size parity
  useEffect(() => {
    (async () => {
      if (!file) return;
      const pdfjs = await loadPdfJs();
      const data = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data }).promise;
      const dpr = window.devicePixelRatio || 1;
      const out: Thumb[] = [];
      for (let p = 1; p <= doc.numPages && p <= 64; p++) {
        const page = await doc.getPage(p);
        const vp1 = page.getViewport({ scale: 1 });           // PDF points
        const vp  = page.getViewport({ scale: 0.70 * dpr });  // bitmap for preview
        const c = document.createElement("canvas");
        c.width = vp.width; c.height = vp.height;
        const ctx = c.getContext("2d")!;
        await page.render({ canvasContext: ctx, canvas: c, viewport: vp }).promise;
        out.push({ page: p-1, url: c.toDataURL("image/png"), w: c.width, h: c.height, pageWidthPt: vp1.width });
      }
      setThumbs(out);
    })();
  }, [file]);

  // tile width observer -> match preview size to export points
  const tileRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [tileW, setTileW] = useState<Record<number, number>>({});
  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      setTileW(prev => {
        const next = { ...prev };
        for (const e of entries) {
          const key = Number((e.target as HTMLElement).dataset.page);
          next[key] = e.contentRect.width;
        }
        return next;
      });
    });
    thumbs.forEach(t => { const el = tileRefs.current[t.page]; if (el) ro.observe(el); });
    return () => ro.disconnect();
  }, [thumbs]);

  function hexToRgb01(hex: string) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return { r: 0, g: 0, b: 0 };
    return { r: parseInt(m[1], 16)/255, g: parseInt(m[2], 16)/255, b: parseInt(m[3], 16)/255 };
  }

  function previewFontPx(t: Thumb) {
    const displayW = tileW[t.page] ?? t.w;
    return Math.max(8, size * (displayW / t.pageWidthPt)); // pt -> px at current display scale
  }

  function labelFor(i: number) {
    return mode === "numbers" ? `${i+1} / ${thumbs.length}` : text;
  }

  function overlayStyle(t: Thumb): React.CSSProperties {
    const s: any = {
      position: "absolute",
      color,
      textShadow: "0 0 6px rgba(0,0,0,.65)",
      opacity: Math.max(0, Math.min(1, opacity/100)),
      left: 8, top: 8
    };
    let effPos = pos;
    if (mode === "watermark") effPos = "center";
    if (mode === "numbers" && pos === "center") effPos = "bc";
    switch (effPos) {
      case "tl": s.left=8; s.top=8; s.right="auto"; s.bottom="auto"; s.transform="none"; break;
      case "tc": s.left="50%"; s.top=8; s.right="auto"; s.bottom="auto"; s.transform="translateX(-50%)"; break;
      case "tr": s.right=8; s.top=8; s.left="auto"; s.bottom="auto"; s.transform="none"; break;
      case "bl": s.left=8; s.bottom=8; s.right="auto"; s.top="auto"; s.transform="none"; break;
      case "bc": s.left="50%"; s.bottom=8; s.right="auto"; s.top="auto"; s.transform="translateX(-50%)"; break;
      case "br": s.right=8; s.bottom=8; s.left="auto"; s.top="auto"; s.transform="none"; break;
      case "center":
        s.left="50%"; s.top="50%"; s.right="auto"; s.bottom="auto";
        s.transform = mode === "watermark" ? "translate(-50%, -50%) rotate(35deg)" : "translate(-50%, -50%)";
        break;
    }
    return s;
  }

  async function run() {
    if (!file) return;
    const src = await PDFDocument.load(await file.arrayBuffer());
    const font = await src.embedFont(StandardFonts.Helvetica);
    const pages = src.getPages();

    pages.forEach((p, idx) => {
      const { width, height } = p.getSize();
      const pad = 24;

      // target anchor (x,y)
      let x = width/2, y = pad;
      let content = mode === "numbers" ? `${idx+1} / ${pages.length}` : text;
      let effPos = pos;
      if (mode === "watermark") effPos = "center";
      if (mode === "numbers" && pos === "center") effPos = "bc";

      switch (effPos) {
        case "tl": x=pad; y=height-pad; break;
        case "tc": x=width/2; y=height-pad; break;
        case "tr": x=width-pad; y=height-pad; break;
        case "bl": x=pad; y=pad; break;
        case "bc": x=width/2; y=pad; break;
        case "br": x=width-pad; y=pad; break;
        case "center": x=width/2; y=height/2; break;
      }

      const tw = font.widthOfTextAtSize(content, size);
      const th = font.heightAtSize(size, { descender: false });
      const rgb01 = hexToRgb01(color);

      let originX = x;
      let originY = y;
      let rotateOpt: any = undefined;

      if (effPos === "center" && mode === "watermark") {
        const theta = 35 * Math.PI / 180;
        const sin = Math.sin(theta);
        const cos = Math.cos(theta);
        const rotW = tw * cos + th * sin;
        const rotH = tw * sin + th * cos;
        originX = (width - rotW) / 2 + th * sin;
        originY = (height - rotH) / 2;
        rotateOpt = degrees(35);
      } else {
        if (effPos.endsWith("c") || effPos === "center") originX = x - tw/2;
        if (effPos.endsWith("r")) originX = x - tw;
        // For top edge, y we computed is to the top; move baseline down by text height
        if (effPos === "tl" || effPos === "tc" || effPos === "tr") originY = y - th;
      }

      p.drawText(content, {
        x: originX,
        y: originY,
        size,
        font,
        color: rgb(rgb01.r, rgb01.g, rgb01.b),
        opacity: Math.max(0, Math.min(1, opacity/100)),
        rotate: rotateOpt,
      } as any);
    });

    const bytes = await src.save({ useObjectStreams: true });
    const { url } = await blobFromUint8(bytes, `annotated.pdf`);
    dl(url, `annotated.pdf`);
    trackPdfAction("numbers_header_footer_watermark");
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.watermark}</ToolHelp>

      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="text-sm mb-1 block">PDF file</label>
          <input type="file" accept="application/pdf" className="input w-full" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <div>
          <label className="text-sm mb-1 block">Mode</label>
          <select className="input w-full" value={mode} onChange={(e) => setMode(e.target.value as any)}>
            <option value="numbers">Page numbers</option>
            <option value="header">Header text</option>
            <option value="footer">Footer text</option>
            <option value="watermark">Watermark (center angled)</option>
          </select>
        </div>
        <div>
          <label className="text-sm mb-1 block">Font size (pt)</label>
          <input type="number" min={6} max={256} className="input w-full" value={size} onChange={(e)=> setSize(parseInt(e.target.value || "12",10))} />
        </div>
      </div>

      <div className={`grid gap-3 ${mode === "numbers" ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
        {mode !== "numbers" && (
          <label className="block">
            <span className="text-sm">Text</span>
            <input className="input w-full mt-1" value={text} onChange={(e)=> setText(e.target.value)} />
          </label>
        )}
        <label className="block">
          <span className="text-sm">Position</span>
          <select className="input w-full mt-1" value={pos} onChange={(e)=> setPos(e.target.value as any)} disabled={mode==="watermark"}>
            <option value="tl">Top-Left</option>
            <option value="tc">Top-Center</option>
            <option value="tr">Top-Right</option>
            <option value="bl">Bottom-Left</option>
            <option value="bc">Bottom-Center</option>
            <option value="br">Bottom-Right</option>
            <option value="center">Center (angled)</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm">Opacity (%)</span>
          <input type="number" min={0} max={100} className="input w-full mt-1" value={opacity} onChange={(e)=> setOpacity(parseInt(e.target.value || "60",10))} />
        </label>
        <label className="block">
          <span className="text-sm">Color</span>
          <input type="color" className="input w-full mt-1" value={color} onChange={(e)=> setColor((e.target as HTMLInputElement).value)} />
        </label>
      </div>

   <button className="btn" onClick={run} disabled={!file}>Apply & Download</button>

{/* Live preview */}
{thumbs.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
    {thumbs.map(t => {
      const label = labelFor(t.page);
      const s = overlayStyle(t);
      const fontPx = previewFontPx(t);
      return (
        <div
          key={t.page}
          className="relative border rounded overflow-hidden"
          ref={(el: HTMLDivElement | null) => {
            tileRefs.current[t.page] = el; // set and return void
          }}
          data-page={t.page}
        >
          <img
            src={t.url}
            alt={`p${t.page + 1}`}
            className="w-full select-none pointer-events-none"
          />
          <div style={s as any}>
            <span style={{ fontSize: `${fontPx}px`, fontWeight: 600 }}>
              {label}
            </span>
          </div>
        </div>
      );
    })}
  </div>
)}
</div>
);
}



/* -------------------- Tool: Images → PDF -------------------- */

function ToolImagesToPdf() {
  const [images, setImages] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<"A4" | "Letter">("A4");
  const [margin, setMargin] = useState<number>(24);

  const run = async () => {
    if (!images.length) return;
    const doc = await PDFDocument.create();
    for (const img of images) {
      const bytes = new Uint8Array(await img.arrayBuffer());
      const isPng = img.type.includes("png");
      const embedded = isPng
        ? await doc.embedPng(bytes)
        : await doc.embedJpg(bytes);
      const [w, h] = pageSize === "A4" ? [595.28, 841.89] : [612, 792];
      const page = doc.addPage([w, h]);
      const scale = Math.min(
        (w - margin * 2) / embedded.width,
        (h - margin * 2) / embedded.height
      );
      const dw = embedded.width * scale;
      const dh = embedded.height * scale;
      const x = (w - dw) / 2;
      const y = (h - dh) / 2;
      page.drawImage(embedded, { x, y, width: dw, height: dh });
    }
    const bytes = await doc.save({ useObjectStreams: true });
    const { url } = await blobFromUint8(bytes, "images.pdf");
    dl(url, "images.pdf");
    trackPdfAction("images_to_pdf");
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.imagesToPdf}</ToolHelp>

      <div className="grid md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm">Images (JPG/PNG)</span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="input mt-1"
            onChange={(e) =>
              setImages(e.target.files ? Array.from(e.target.files) : [])
            }
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">Page</span>
            <select
              className="input mt-1"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as any)}
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm">Margins (pt)</span>
            <input
              type="number"
              className="input mt-1"
              value={margin}
              min={0}
              max={72}
              onChange={(e) => setMargin(parseInt(e.target.value || "24", 10))}
            />
          </label>
        </div>
      </div>
      <button className="btn" onClick={run} disabled={!images.length}>
        Build PDF
      </button>
    </div>
  );
}

/* -------------------- Tool: PDF → Images (PNG / Zip) -------------------- */

function ToolPdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [pngs, setPngs] = useState<string[]>([]);
  const [asZip, setAsZip] = useState<boolean>(false);

  const run = async () => {
    if (!file) return;
    const pdfjs = await loadPdfJs();
    const bytes = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: bytes }).promise;
    const urls: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const vp = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, canvas, viewport: vp }).promise;
      urls.push(canvas.toDataURL("image/png"));
    }
    setPngs(urls);

    if (asZip) {
      const JSZip = await loadJSZip();
      if (!JSZip)
        return alert("Install jszip to enable Zip export: npm i jszip");
      const zip = new JSZip();
      urls.forEach((u, idx) =>
        zip.file(`page-${idx + 1}.png`, u.split(",")[1], { base64: true })
      );
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      dl(url, "pages.zip");
    }

    // Track once conversion finished (regardless of zip vs individual)
    trackPdfAction("pdf_to_images");
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.pdfToImages}</ToolHelp>

      <div className="grid md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm">PDF file</span>
          <input
            type="file"
            accept="application/pdf"
            className="input mt-1"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={asZip}
            onChange={(e) => setAsZip(e.target.checked)}
          />
          Download as .zip
        </label>
      </div>
      <button className="btn" onClick={run} disabled={!file}>
        Convert
      </button>

      {pngs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {pngs.map((u, i) => (
            <a
              key={i}
              href={u}
              download={`page-${i + 1}.png`}
              className="border rounded overflow-hidden block"
            >
              <img src={u} alt={`page ${i + 1}`} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------- Tool: Extract text -------------------- */

function ToolExtractText() {
  const [file, setFile] = useState<File | null>(null);
  const [out, setOut] = useState<string>("");

  const run = async () => {
    if (!file) return;
    const pdfjs = await loadPdfJs();
    const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
      .promise;
    let buf = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const tc = await page.getTextContent();
      const line = (tc.items as any[])
        .map((it: any) => ("str" in it ? it.str : ""))
        .join("");
      buf += line + "\n\n";
    }
    setOut(buf.trim());
    trackPdfAction("extract_text");
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.extractText}</ToolHelp>

      <div className="grid md:grid-cols-2 gap-3">
        <input
          type="file"
          accept="application/pdf"
          className="input"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button className="btn" onClick={run} disabled={!file}>
          Extract
        </button>
      </div>
      <textarea className="input h-64 font-mono" value={out} readOnly />
      {out && (
        <button
          className="btn-ghost"
          onClick={() => {
            const url = URL.createObjectURL(
              new Blob([out], { type: "text/plain" })
            );
            dl(url, "text.txt");
          }}
        >
          Download .txt
        </button>
      )}
    </div>
  );
}

/* -------------------- Tool: Fill forms & flatten -------------------- */

function ToolFillFlatten() {
  const [file, setFile] = React.useState<File | null>(null);
  const [origBytes, setOrigBytes] = React.useState<Uint8Array | null>(null);

  // Working doc & form kept in memory
  const [doc, setDoc] = React.useState<PDFDocument | null>(null);
  const formRef = React.useRef<any>(null);

  const [fields, setFields] = React.useState<{ name: string; type: string; value?: string }[]>([]);
  const [busy, setBusy] = React.useState(false);

  // Single / bulk inputs
  const [k, setK] = React.useState("");
  const [v, setV] = React.useState("");
  const [bulk, setBulk] = React.useState<string>("");

  // Export options
  const [flatten, setFlatten] = React.useState<boolean>(true);

  // Search
  const [q, setQ] = React.useState("");

  // --- Live preview thumbnails + widget overlays ---
  type Thumb = { page: number; url: string; w: number; h: number; widgets: { id: string; name: string; type: string; rect: [number,number,number,number]; value?: string }[] };
  const [thumbs, setThumbs] = React.useState<Thumb[]>([]);

  function detectType(field: any): string {
    const n = field?.constructor?.name || "";
    if (n) return n.replace(/^PDF/, "");
    if ("check" in field || "uncheck" in field) return "CheckBox";
    if ("select" in field) return "Dropdown/Radio/OptionList";
    if ("setText" in field) return "TextField";
    return "Unknown";
  }

  async function buildDoc(bytes: Uint8Array) {
    const d = await PDFDocument.load(bytes);
    setDoc(d);
    formRef.current = d.getForm();
  }

  async function listFieldsFromCurrentDoc() {
    if (!doc) return;
    const f = formRef.current;
    const all = (f as any).getFields?.() as any[] | undefined;
    const mapped = all?.map((fld: any) => {
      const name = fld.getName?.() ?? "(unnamed)";
      const type = detectType(fld);
      let value: string | undefined;
      try {
        if (typeof fld.getText === "function") value = fld.getText();
        else if (typeof fld.isChecked === "function") value = fld.isChecked() ? "checked" : "unchecked";
        else if (typeof (fld as any).getSelected === "function") {
          const sel = (fld as any).getSelected();
          value = Array.isArray(sel) ? sel.join(", ") : String(sel ?? "");
        }
      } catch {}
      return { name, type, value };
    }) ?? [];
    setFields(mapped);
  }

  function valueFor(name: string): string | undefined {
    const f = fields.find(x => x.name === name);
    return f?.value;
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setFields([]);
    setK(""); setV(""); setBulk("");
    setDoc(null); formRef.current = null;
    setThumbs([]);
    if (!f) return;
    setBusy(true);
    try {
      const ab = await f.arrayBuffer();
      const bytes = new Uint8Array(ab);
      setOrigBytes(bytes);
      await buildDoc(bytes);
      await listFieldsFromCurrentDoc();

      // Build preview thumbs + widget rects with pdf.js
      const pdfjs = await loadPdfJs();
      const docjs = await pdfjs.getDocument({ data: bytes }).promise;
      const out: Thumb[] = [];
      const maxPages = Math.min(64, docjs.numPages);
      const dpr = window.devicePixelRatio || 1;

      for (let p = 1; p <= maxPages; p++) {
        const page = await docjs.getPage(p);
        const viewport = page.getViewport({ scale: 0.70 * dpr });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, canvas, viewport }).promise;

        // Map widget rectangles to viewport space
        const annots = await page.getAnnotations({ intent: "display" });
        const t = viewport.transform;
        const m = { a:t[0], b:t[1], c:t[2], d:t[3], e:t[4], f:t[5] };
        function mapRect(rect: number[]) {
          const [x1,y1,x2,y2] = rect;
          const X1 = m.a*x1 + m.c*y1 + m.e;
          const Y1 = m.b*x1 + m.d*y1 + m.f;
          const X2 = m.a*x2 + m.c*y2 + m.e;
          const Y2 = m.b*x2 + m.d*y2 + m.f;
          return [Math.min(X1,X2), Math.min(Y1,Y2), Math.max(X1,X2), Math.max(Y1,Y2)] as [number,number,number,number];
        }
        const widgets: Thumb['widgets'] = [];
        for (const a of annots) {
          if ((a as any).subtype !== "Widget") continue;
          const name = (a as any).fieldName || (a as any).title || (a as any).id || "";
          const rect = mapRect((a as any).rect || (a as any).rects || [0,0,0,0]);
          const type = (a as any).fieldType || "Widget";
          widgets.push({ id: `${p}:${name}:${widgets.length}`, name, type, rect, value: valueFor(name) });
        }

        out.push({ page: p-1, url: canvas.toDataURL("image/png"), w: canvas.width, h: canvas.height, widgets });
      }
      setThumbs(out);
    } finally {
      setBusy(false);
    }
  }

  function parseBulk(text: string): Record<string, string | boolean | string[]> {
    try {
      const obj = JSON.parse(text);
      if (obj && typeof obj === "object") return obj as Record<string, any>;
    } catch {}
    const out: Record<string, any> = {};
    text.split(/\\r?\\n/).map(s=>s.trim()).filter(Boolean).forEach(line => {
      const m = line.match(/^([^=]+)=(.*)$/);
      if (!m) return;
      const key = m[1].trim();
      const raw = m[2].trim();
      if (/^(true|false)$/i.test(raw)) out[key] = /^true$/i.test(raw);
      else if (raw.includes(",")) out[key] = raw.split(",").map(x=>x.trim()).filter(Boolean);
      else out[key] = raw;
    });
    return out;
  }

  function applyValueToField(field: any, val: any): boolean {
    try {
      if (typeof field.setText === "function") { field.setText(String(val ?? "")); return true; }
      if (typeof field.check === "function" || typeof field.uncheck === "function") {
        const truthy = typeof val === "boolean" ? val : /^(1|true|yes|on|checked)$/i.test(String(val ?? "").trim());
        truthy ? field.check?.() : field.uncheck?.();
        return true;
      }
      if (typeof field.select === "function") {
        if (Array.isArray(val)) field.select(val); else field.select(String(val ?? ""));
        return true;
      }
    } catch {}
    return false;
  }

  async function fillSingle() {
    if (!doc || !k) return;
    setBusy(true);
    try {
      const f = formRef.current;
      let field: any;
      try { field = f.getField(k); } catch { alert(`Field "${k}" not found.`); return; }
      if (!applyValueToField(field, v)) { alert("This field type isn’t supported yet."); return; }
      await listFieldsFromCurrentDoc();
      // update widget values in preview
      setThumbs(t => t.map(pg => ({ ...pg, widgets: pg.widgets.map(w => w.name === k ? { ...w, value: v } : w) })));
    } finally { setBusy(false); }
  }

  async function fillBulk() {
    if (!doc || !bulk.trim()) return;
    setBusy(true);
    try {
      const data = parseBulk(bulk);
      const f = formRef.current;
      let applied = 0;
      for (const name of Object.keys(data)) {
        try {
          const fld = f.getField(name);
          if (applyValueToField(fld, data[name])) applied++;
        } catch {}
      }
      if (!applied) { alert("No fields were updated. Check names/values."); return; }
      await listFieldsFromCurrentDoc();
      setThumbs(t => t.map(pg => ({ ...pg, widgets: pg.widgets.map(w => (w.name in data) ? { ...w, value: String((data as any)[w.name]) } : w) })));
    } finally { setBusy(false); }
  }

  async function toggleCheckbox(name: string) {
    if (!doc) return;
    try {
      const f = formRef.current;
      const fld = f.getField(name);
      if (typeof fld.isChecked === "function") {
        const cur = fld.isChecked();
        cur ? fld.uncheck?.() : fld.check?.();
        await listFieldsFromCurrentDoc();
        setThumbs(t => t.map(pg => ({ ...pg, widgets: pg.widgets.map(w => w.name === name ? { ...w, value: cur ? "unchecked" : "checked" } : w) })));
      }
    } catch {}
  }

  async function reloadValues() { if (!doc) return; await listFieldsFromCurrentDoc(); }

  async function revertAll() {
    if (!origBytes) return;
    setBusy(true);
    try { await buildDoc(origBytes); await listFieldsFromCurrentDoc(); } finally { setBusy(false); }
  }

  async function exportPdf() {
    if (!doc) return;
    const working = doc;
    if (flatten) {
      try { formRef.current.flatten(); } catch {}
    }
    const bytes = await working.save({ useObjectStreams: true });
    const { url } = await blobFromUint8(bytes, flatten ? "filled.pdf" : "filled-editable.pdf");
    dl(url, flatten ? "filled.pdf" : "filled-editable.pdf");
    trackPdfAction("fill_flatten_export");
  }

  function downloadCSV() {
    const rows = [["name","type","value"], ...fields.map(f => [f.name, f.type, f.value ?? ""])];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    dl(url, "pdf-form-fields.csv");
  }

  function preloadBulkFromTable() {
    const s = q.trim().toLowerCase();
    const list = (s ? fields.filter(f => f.name.toLowerCase().includes(s)) : fields).map(f => `${f.name}=${f.value ?? ""}`);
    setBulk(list.join("\\n"));
  }

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return fields;
    return fields.filter(f => f.name.toLowerCase().includes(s));
  }, [fields, q]);

  // helper for overlay style in %
  function boxStyle(t: Thumb, r: [number,number,number,number]) {
    const [x1,y1,x2,y2] = r;
    return {
      position: "absolute",
      left: `${(x1 / t.w) * 100}%`,
      top: `${(y1 / t.h) * 100}%`,
      width: `${((x2 - x1) / t.w) * 100}%`,
      height: `${((y2 - y1) / t.h) * 100}%`,
      pointerEvents: "auto"
    } as React.CSSProperties;
  }

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.fillFlatten}</ToolHelp>

      {/* Pick file + actions */}
      <div className="grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-end">
        <input type="file" accept="application/pdf" className="input" onChange={onPick} />
        <button className="btn-ghost" onClick={reloadValues} disabled={!doc || busy} title="Reload values from current PDF">Reload values</button>
        <button className="btn-ghost" onClick={() => doc && downloadCSV()} disabled={!fields.length} title="Download field names/types/values as CSV">Download CSV</button>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={flatten} onChange={(e)=> setFlatten(e.target.checked)} />
          Flatten on export
        </label>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={revertAll} disabled={!origBytes || busy}>Revert</button>
          <button className="btn" onClick={exportPdf} disabled={!doc || busy}>Export PDF</button>
        </div>
      </div>

      {/* Live preview */}
      {thumbs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {thumbs.map((t) => (
            <div key={t.page} className="relative border rounded overflow-hidden">
              <img src={t.url} alt={`p${t.page+1}`} className="w-full block pointer-events-none select-none" />
              {t.widgets.map((w) => (
                <div
                  key={w.id}
                  className={`absolute rounded ring-1 ring-white/80 bg-sky-400/20 hover:ring-2 hover:ring-sky-500`}
                  style={boxStyle(t, w.rect)}
                  title={`${w.name || "(unnamed)"}${w.value ? ` — ${w.value}` : ""}`}
                  onClick={() => {
                    if (!doc) return;
                    const f = formRef.current;
                    try {
                      const fld = f.getField(w.name);
                      if (typeof fld.isChecked === "function") {
                        const cur = fld.isChecked();
                        cur ? fld.uncheck?.() : fld.check?.();
                        listFieldsFromCurrentDoc().then(()=> {
                          setThumbs(prev => prev.map(pg => (pg.page===t.page ? {...pg, widgets: pg.widgets.map(ww => ww.id===w.id ? {...ww, value: cur ? "unchecked" : "checked"} : ww)} : pg)));
                        });
                        return;
                      }
                      if (typeof fld.setText === "function") {
                        const val = prompt(`Set value for "${w.name}"`, w.value ?? "");
                        if (val !== null) {
                          fld.setText(val);
                          listFieldsFromCurrentDoc().then(()=> {
                            setThumbs(prev => prev.map(pg => (pg.page===t.page ? {...pg, widgets: pg.widgets.map(ww => ww.id===w.id ? {...ww, value: val} : ww)} : pg)));
                          });
                        }
                        return;
                      }
                    } catch {}
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Field table + filter */}
      {fields.length > 0 && (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <input className="input" placeholder="Search field names" value={q} onChange={(e)=> setQ(e.target.value)} />
            <button className="btn-ghost" onClick={preloadBulkFromTable} title="Load the visible fields into Bulk fill editor">Load into Bulk</button>
          </div>
          <div className="overflow-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Current</th>
                  <th className="px-3 py-2">Copy / Toggle</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr key={i} className="border-t border-neutral-800">
                    <td className="px-3 py-2 font-mono">{f.name}</td>
                    <td className="px-3 py-2">{f.type}</td>
                    <td className="px-3 py-2">
                      {f.type === "CheckBox" ? (
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={f.value === "checked"} onChange={() => toggleCheckbox(f.name)} />
                          {f.value || "unchecked"}
                        </label>
                      ) : (f.value ?? "")}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(f.name)}>Copy name</button>
                        {f.type === "CheckBox" && (<button className="btn-ghost" onClick={() => toggleCheckbox(f.name)}>Toggle</button>)}
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td className="px-3 py-4 text-muted" colSpan={4}>No fields match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Single fill */}
      <div className="grid md:grid-cols-3 gap-3">
        <input className="input" placeholder="Field name" value={k} onChange={(e)=> setK(e.target.value)} />
        <input className="input" placeholder="Value (text / true|false / option[,option])" value={v} onChange={(e)=> setV(e.target.value)} />
        <button className="btn" onClick={fillSingle} disabled={!doc || !k || busy}>{busy ? "Working…" : "Apply change"}</button>
      </div>

      {/* Bulk fill */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Bulk fill (applies to current PDF in memory)</label>
        <textarea className="input h-40 font-mono" placeholder={`JSON or KEY=VALUE per line
Examples:
{"FullName":"Jane Doe","Agree":true,"Country":"Ireland"}
FullName=Jane Doe
Agree=true
Interests=Reading, Music`} value={bulk} onChange={(e)=> setBulk(e.target.value)} />
        <div className="flex gap-2">
          <button className="btn" onClick={fillBulk} disabled={!doc || busy}>{busy ? "Working…" : "Apply bulk changes"}</button>
          <button className="btn-ghost" onClick={()=> setBulk("")} disabled={busy}>Clear</button>
          <button className="btn-ghost" onClick={reloadValues} disabled={!doc || busy} title="Refresh table values after changes">Reload values</button>
        </div>
      </div>
    </div>
  );
}


/* -------------------- Tool: Redact (multi-page memory) -------------------- */

/* -------------------- Tool: Redact (multi-page memory; preloaded image cache — no black flash) -------------------- */

/* -------------------- Tool: Redact (multi-page; immediate paint) -------------------- */

function ToolRedact() {
  const [file, setFile] = React.useState<File | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const [pageCount, setPageCount] = React.useState<number>(0);
  const [pageIndex, setPageIndex] = React.useState<number>(0); // zero-based

  // Rectangles kept per page
  const [rectsByPage, setRectsByPage] = React.useState<
    Record<number, { x: number; y: number; w: number; h: number }[]>
  >({});

  // Canvas dims per page (for PDF coord mapping)
  const [dimsByPage, setDimsByPage] = React.useState<
    Record<number, { cw: number; ch: number }>
  >({});

  // Preloaded base images per page (avoid async on drag)
  const imgElByPage = React.useRef<Record<number, HTMLImageElement>>({});

  const drawing = React.useRef<{ x: number; y: number } | null>(null);
  const [redactColor, setRedactColor] = React.useState<"black" | "white">(
    "black"
  );
  const scale = 1.3;

  async function loadPdfDoc() {
    const pdfjs = await loadPdfJs();
    return pdfjs.getDocument({ data: await file!.arrayBuffer() }).promise;
  }

  async function rasterizePageToImageEl(
    p: any
  ): Promise<{ img: HTMLImageElement; w: number; h: number }> {
    const vp = p.getViewport({ scale });
    const off = document.createElement("canvas");
    off.width = vp.width;
    off.height = vp.height;
    const offctx = off.getContext("2d")!;
    await p.render({ canvasContext: offctx, canvas: off, viewport: vp })
      .promise;

    const img = new Image();
    img.src = off.toDataURL("image/png");
    await new Promise<void>((res) => (img.onload = () => res()));
    return { img, w: off.width, h: off.height };
  }

  // Imperative draw (doesn't depend on setState having finished)
  function drawPage(idx: number) {
    const canvas = canvasRef.current!;
    const base = imgElByPage.current[idx];
    const dims = dimsByPage[idx];
    if (!canvas || !base || !dims) return;

    if (canvas.width !== dims.cw || canvas.height !== dims.ch) {
      canvas.width = dims.cw;
      canvas.height = dims.ch;
    }
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);

    const list = rectsByPage[idx] || [];
    ctx.fillStyle =
      redactColor === "black" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.5)";
    ctx.strokeStyle =
      redactColor === "black" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
    ctx.lineWidth = 1;
    list.forEach((r) => {
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeRect(r.x, r.y, r.w, r.h);
    });
  }

  // Redraw with optional live rect while dragging
  function redraw(
    live?: { x: number; y: number; w: number; h: number },
    idx = pageIndex
  ) {
    const canvas = canvasRef.current!;
    const base = imgElByPage.current[idx];
    const dims = dimsByPage[idx];
    if (!canvas || !base || !dims) return;

    if (canvas.width !== dims.cw || canvas.height !== dims.ch) {
      canvas.width = dims.cw;
      canvas.height = dims.ch;
    }
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);

    const list = rectsByPage[idx] || [];
    ctx.fillStyle =
      redactColor === "black" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.5)";
    ctx.strokeStyle =
      redactColor === "black" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
    ctx.lineWidth = 1;
    list.forEach((r) => {
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeRect(r.x, r.y, r.w, r.h);
    });
    if (live) {
      ctx.fillRect(live.x, live.y, live.w, live.h);
      ctx.strokeRect(live.x, live.y, live.w, live.h);
    }
  }

  // Load & paint a specific page (immediate first paint)
  async function ensurePageReadyAndPaint(idx: number) {
    if (!file) return;
    // already cached?
    if (!imgElByPage.current[idx]) {
      const doc = await loadPdfDoc();
      setPageCount(doc.numPages);
      const p = await doc.getPage(idx + 1);
      const { img, w, h } = await rasterizePageToImageEl(p);
      imgElByPage.current[idx] = img;
      // update dims (state) for export math
      setDimsByPage((prev) => ({ ...prev, [idx]: { cw: w, ch: h } }));
      // immediate paint using known dims
      const canvas = canvasRef.current!;
      if (canvas) {
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0);
        // draw any existing rects
        const list = rectsByPage[idx] || [];
        ctx.fillStyle =
          redactColor === "black"
            ? "rgba(0,0,0,0.35)"
            : "rgba(255,255,255,0.5)";
        ctx.strokeStyle =
          redactColor === "black" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
        ctx.lineWidth = 1;
        list.forEach((r) => {
          ctx.fillRect(r.x, r.y, r.w, r.h);
          ctx.strokeRect(r.x, r.y, r.w, r.h);
        });
      }
      return;
    }
    // cached – paint synchronously
    drawPage(idx);
  }

  // Pointer helpers
  function getCanvasPos(e: React.MouseEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function onMouseDown(e: React.MouseEvent) {
    drawing.current = getCanvasPos(e);
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!drawing.current) return;
    const start = drawing.current;
    const cur = getCanvasPos(e);
    redraw({
      x: Math.min(start.x, cur.x),
      y: Math.min(start.y, cur.y),
      w: Math.abs(cur.x - start.x),
      h: Math.abs(cur.y - start.y),
    });
  }
  function onMouseUp(e: React.MouseEvent) {
    if (!drawing.current) return;
    const start = drawing.current;
    const end = getCanvasPos(e);
    drawing.current = null;
    const rect = {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      w: Math.abs(end.x - start.x),
      h: Math.abs(end.y - start.y),
    };
    setRectsByPage((prev) => {
      const cur = prev[pageIndex] ? [...prev[pageIndex]] : [];
      cur.push(rect);
      return { ...prev, [pageIndex]: cur };
    });
    redraw();
  }

  function clearBoxes() {
    setRectsByPage((prev) => ({ ...prev, [pageIndex]: [] }));
    redraw();
  }
  function clearAll() {
    setRectsByPage({});
    redraw();
  }

  async function apply() {
    if (!file) return;
    const src = await PDFDocument.load(await file.arrayBuffer());
    const total = src.getPageCount();
    for (let i = 0; i < total; i++) {
      const rects = rectsByPage[i];
      if (!rects?.length) continue;
      const page = src.getPage(i);
      const { width, height } = page.getSize();
      const dims = dimsByPage[i] || { cw: width, ch: height };
      const sx = width / dims.cw;
      const sy = height / dims.ch;
      rects.forEach((r) => {
        const x = r.x * sx;
        const y = (dims.ch - (r.y + r.h)) * sy; // invert Y
        const w = r.w * sx;
        const h = r.h * sy;
        page.drawRectangle({
          x,
          y,
          width: w,
          height: h,
          color: redactColor === "black" ? rgb(0, 0, 0) : rgb(1, 1, 1),
          borderWidth: 0,
        });
      });
    }
    const bytes = await src.save({ useObjectStreams: true });
    const { url } = await blobFromUint8(bytes, "redacted.pdf");
    dl(url, "redacted.pdf");
    trackPdfAction("redact_apply");
  }

  // Initial paint when a file is chosen
  React.useEffect(() => {
    if (file) {
      setPageIndex(0);
      setRectsByPage({});
      setDimsByPage({});
      imgElByPage.current = {};
      // immediate paint page 0
      void ensurePageReadyAndPaint(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Repaint when page selection changes
  React.useEffect(() => {
    if (file) void ensurePageReadyAndPaint(pageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  // Repaint if color toggles or rects on current page change
  React.useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redactColor, rectsByPage, dimsByPage, pageIndex]);

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.redact}</ToolHelp>

      <div className="grid md:grid-cols-[1fr,auto,auto,auto] gap-3 items-end">
        <input
          type="file"
          accept="application/pdf"
          className="input"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <div>
          <label className="text-sm mb-1 block">Redaction color</label>
          <div className="seg">
            {(["black", "white"] as const).map((c) => (
              <button
                key={c}
                type="button"
                className={`seg-btn ${
                  redactColor === c ? "seg-btn--active" : ""
                }`}
                onClick={() => setRedactColor(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm mb-1 block">Page</label>
          <select
            className="input"
            value={pageIndex}
            onChange={(e) => setPageIndex(parseInt(e.target.value, 10) || 0)}
            disabled={!file || pageCount === 0}
          >
            {Array.from({ length: pageCount || 1 }, (_, i) => (
              <option key={i} value={i}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={clearBoxes} disabled={!file}>
            Clear boxes
          </button>
          <button className="btn-ghost" onClick={clearAll} disabled={!file}>
            Clear all
          </button>
          <button className="btn" onClick={apply} disabled={!file}>
            Apply
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <canvas
          ref={canvasRef}
          className="rounded border"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        />
      </div>

      <p className="text-xs text-muted">
        Draw on any page, switch pages and draw more. Apply once to burn all
        redactions at once.
      </p>
    </div>
  );
}

/* -------------------- Tool: Split (count / size / bookmarks) -------------------- */

function ToolSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"count" | "max" | "bookmarks">("count");
  const [count, setCount] = useState<number>(10);
  const [maxPages, setMaxPages] = useState<number>(25);

  const run = async () => {
    if (!file) return;
    const src = await PDFDocument.load(await file.arrayBuffer());
    const total = src.getPageCount();

    if (mode === "count") {
      let idx = 0;
      for (let start = 0; start < total; start += count) {
        const end = Math.min(total, start + count) - 1;
        const out = await PDFDocument.create();
        const pages = await out.copyPages(
          src,
          Array.from({ length: end - start + 1 }, (_, i) => start + i)
        );
        pages.forEach((p) => out.addPage(p));
        const bytes = await out.save({ useObjectStreams: true });
        const { url } = await blobFromUint8(bytes, `split-${++idx}.pdf`);
        dl(url, `split-${idx}.pdf`);
      }
      trackPdfAction("split");
      return;
    }

    if (mode === "max") {
      let idx = 0;
      for (let start = 0; start < total; start += maxPages) {
        const end = Math.min(total, start + maxPages) - 1;
        const out = await PDFDocument.create();
        const pages = await out.copyPages(
          src,
          Array.from({ length: end - start + 1 }, (_, i) => start + i)
        );
        pages.forEach((p) => out.addPage(p));
        const bytes = await out.save({ useObjectStreams: true });
        const { url } = await blobFromUint8(bytes, `chunk-${++idx}.pdf`);
        dl(url, `chunk-${idx}.pdf`);
      }
      trackPdfAction("split");
      return;
    }

    try {
      const pdfjs = await loadPdfJs();
      const d = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const outline = await d.getOutline();
      if (!outline?.length) return alert("No bookmarks found in this PDF.");

      let start = (outline[0].dest as any)?.[0]?.num - 1 || 0;
      for (let i = 0; i < outline.length; i++) {
        const o = outline[i];
        const next = outline[i + 1];
        const thisStart = start;
        const thisEnd = (next?.dest as any)?.[0]?.num - 2 || total - 1;
        start = thisEnd + 1;

        const out = await PDFDocument.create();
        const pages = await out.copyPages(
          src,
          Array.from(
            { length: thisEnd - thisStart + 1 },
            (_, k) => thisStart + k
          )
        );
        pages.forEach((p) => out.addPage(p));
        const bytes = await out.save({ useObjectStreams: true });
        const safe = (o.title || `section-${i + 1}`).replace(
          /[^a-z0-9\- _]/gi,
          "_"
        );
        const { url } = await blobFromUint8(bytes, `${safe}.pdf`);
        dl(url, `${safe}.pdf`);
      }
      trackPdfAction("split");
    } catch {
      alert("Could not read bookmarks in this PDF.");
    }
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.split}</ToolHelp>

      <div className="grid md:grid-cols-3 gap-3">
        <input
          type="file"
          accept="application/pdf"
          className="input"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <div className="seg">
          {(["count", "max", "bookmarks"] as const).map((m) => (
            <button
              key={m}
              className={`seg-btn ${mode === m ? "seg-btn--active" : ""}`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
        {mode === "count" && (
          <input
            type="number"
            className="input"
            min={1}
            value={count}
            onChange={(e) =>
              setCount(Math.max(1, parseInt(e.target.value || "10", 10)))
            }
          />
        )}
        {mode === "max" && (
          <input
            type="number"
            className="input"
            min={1}
            value={maxPages}
            onChange={(e) =>
              setMaxPages(Math.max(1, parseInt(e.target.value || "25", 10)))
            }
          />
        )}
      </div>
      <button className="btn" onClick={run} disabled={!file}>
        Split
      </button>
    </div>
  );
}

/* -------------------- Tool: Stamp QR -------------------- */

function ToolStampQR() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("https://example.com");
  const [size, setSize] = useState<number>(96);
  const [pos, setPos] = useState<"tl" | "tr" | "bl" | "br">("br");

  const run = async () => {
    if (!file) return;
    const QRCode = await loadQRCode();
    if (!QRCode) return alert("Install qrcode to use this tool: npm i qrcode");

    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "M",
      margin: 0,
    });
    const src = await PDFDocument.load(await file.arrayBuffer());
    const png = await src.embedPng(await (await fetch(dataUrl)).arrayBuffer());

    src.getPages().forEach((p) => {
      const { width, height } = p.getSize();
      const pad = 16;
      let x = width - size - pad;
      let y = pad;
      if (pos === "tl") {
        x = pad;
        y = height - size - pad;
      }
      if (pos === "tr") {
        x = width - size - pad;
        y = height - size - pad;
      }
      if (pos === "bl") {
        x = pad;
        y = pad;
      }
      if (pos === "br") {
        x = width - size - pad;
        y = pad;
      }
      p.drawImage(png, { x, y, width: size, height: size });
    });

    const bytes = await src.save({ useObjectStreams: true });
    const { url } = await blobFromUint8(bytes, "stamped.pdf");
    dl(url, "stamped.pdf");
    trackPdfAction("stamp_qr");
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.stampQR}</ToolHelp>

      <div className="grid md:grid-cols-3 gap-3">
        <input
          type="file"
          accept="application/pdf"
          className="input"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Text / URL"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            className="input"
            min={48}
            max={256}
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value || "96", 10))}
          />
          <select
            className="input"
            value={pos}
            onChange={(e) => setPos(e.target.value as any)}
          >
            <option value="tl">Top-Left</option>
            <option value="tr">Top-Right</option>
            <option value="bl">Bottom-Left</option>
            <option value="br">Bottom-Right</option>
          </select>
        </div>
      </div>
      <button className="btn" onClick={run} disabled={!file}>
        Stamp & Download
      </button>
    </div>
  );
}

/* -------------------- Tool: Batch merge -------------------- */

function ToolBatchMerge() {
  const [files, setFiles] = useState<File[]>([]);

  const run = async () => {
    if (!files.length) return;
    const out = await PDFDocument.create();
    for (const f of files) {
      const src = await PDFDocument.load(await f.arrayBuffer());
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((p) => out.addPage(p));
    }
    const bytes = await out.save({ useObjectStreams: true });
    const { url } = await blobFromUint8(bytes, "merged.pdf");
    dl(url, "merged.pdf");
    trackPdfAction("merge");
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.batchMerge}</ToolHelp>

      <input
        type="file"
        multiple
        accept="application/pdf"
        className="input"
        onChange={(e) =>
          setFiles(e.target.files ? Array.from(e.target.files) : [])
        }
      />
      <button className="btn" onClick={run} disabled={!files.length}>
        Merge & Download
      </button>
    </div>
  );
}

/* -------------------- NEW: Edit Metadata -------------------- */

function ToolMetadata() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState(""); // comma separated
  const [loading, setLoading] = useState(false);

  async function readMetadata(f: File) {
    setLoading(true);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setTitle(doc.getTitle() ?? "");
      setAuthor(doc.getAuthor() ?? "");
      setSubject(doc.getSubject() ?? "");
      const kws = (doc as any).getKeywords?.();
      const kwList = Array.isArray(kws) ? kws : [];
      setKeywords(kwList.join(", "));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    // Prefill fields from the picked PDF (if any)
    if (f) await readMetadata(f);
    else {
      setTitle("");
      setAuthor("");
      setSubject("");
      setKeywords("");
    }
  }

  const save = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      // Write only when provided; empty strings clear the Info values
      doc.setTitle(title ?? "");
      doc.setAuthor(author ?? "");
      doc.setSubject(subject ?? "");
      // Split on commas and trim
      const kw = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      (doc as any).setKeywords?.(kw);

      const bytes = await doc.save({ useObjectStreams: true });
      const { url } = await blobFromUint8(bytes, "metadata.pdf");
      dl(url, "metadata.pdf");
      trackPdfAction("edit_metadata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.meta}</ToolHelp>

      <div className="grid md:grid-cols-2 gap-3">
        <input
          type="file"
          accept="application/pdf"
          className="input"
          onChange={onPick}
        />
        <div className="flex gap-2">
          <button
            className="btn-ghost"
            onClick={() => file && readMetadata(file)}
            disabled={!file || loading}
          >
            Reload metadata
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              setTitle("");
              setAuthor("");
              setSubject("");
              setKeywords("");
            }}
            disabled={loading}
          >
            Clear fields
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          className="input"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          className="input"
          placeholder="Keywords (comma-separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>

      <button className="btn" onClick={save} disabled={!file || loading}>
        {loading ? "Working…" : "Save Metadata"}
      </button>

      <p className="text-xs text-muted">
        Note: This reads/writes the PDF Info dictionary (Title, Author, Subject,
        Keywords).
      </p>
    </div>
  );
}

/* -------------------- Tool: Compress (lossless optimize) -------------------- */

function ToolCompress() {
  const [files, setFiles] = useState<File[]>([]);

  const run = async () => {
    if (!files.length) return;
    const out = await PDFDocument.create();
    for (const f of files) {
      const src = await PDFDocument.load(await f.arrayBuffer());
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((p) => out.addPage(p));
    }
    const bytes = await out.save({ useObjectStreams: true });
    const { url } = await blobFromUint8(bytes, "compressed.pdf");
    dl(url, "compressed.pdf");
    trackPdfAction("compress");
  };

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.compress}</ToolHelp>

      <input
        type="file"
        multiple
        accept="application/pdf"
        className="input"
        onChange={(e) =>
          setFiles(e.target.files ? Array.from(e.target.files) : [])
        }
      />
      <button className="btn" onClick={run} disabled={!files.length}>
        Optimize & Download
      </button>
      <p className="text-xs text-muted">
        Lossless structural optimize. Image-heavy PDFs may not shrink much
        without lossy re-encoding (kept off by design).
      </p>
    </div>
  );
}

/* ======================= Enhanced MERGE (drag reorder + live previews) ======================= */

function ToolBatchMergeUX() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [thumbs, setThumbs] = React.useState<string[]>([]); // first page per file
  const [pageThumbs, setPageThumbs] = React.useState<
    { fileIndex: number; page: number; url: string }[]
  >([]);
  const dragIndex = React.useRef<number | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setThumbs([]);
      setPageThumbs([]);
      if (!files.length) return;
      const pdfjs = await loadPdfJs();
      // First-page thumbnails per file
      const firsts: string[] = [];
      for (let fi = 0; fi < files.length; fi++) {
        const data = await files[fi].arrayBuffer();
        const doc = await pdfjs.getDocument({ data }).promise;
        const p = await doc.getPage(1);
        const vp = p.getViewport({
          scale: 0.35 * (window.devicePixelRatio || 1),
        });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d")!;
        await p.render({ canvasContext: ctx, canvas, viewport: vp }).promise;
        firsts.push(canvas.toDataURL("image/png"));

        // All pages thumbnails for live preview grid
        const total = Math.min(1000, doc.numPages);
        for (let i = 1; i <= total; i++) {
          const page = await doc.getPage(i);
          const v = page.getViewport({
            scale: 0.35 * (window.devicePixelRatio || 1),
          });
          const c = document.createElement("canvas");
          c.width = v.width;
          c.height = v.height;
          const cx = c.getContext("2d")!;
          await page.render({ canvasContext: cx, canvas: c, viewport: v })
            .promise;
          const url = c.toDataURL("image/png");
          setPageThumbs((prev) => [
            ...prev,
            { fileIndex: fi, page: i - 1, url },
          ]);
        }
      }
      setThumbs(firsts);
    })();
  }, [files]);

  function onDrop(from: number, to: number) {
    if (to < 0 || to >= files.length || from === to) return;
    setFiles((prev) => {
      const arr = prev.slice();
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return arr;
    });
    setThumbs((prev) => {
      const arr = prev.slice();
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return arr;
    });
    setPageThumbs((prev) => {
      // remap fileIndex according to reorder
      const map = Array.from({ length: files.length }, (_, i) => i);
      // compute new index map after move
      const newMap = map.slice();
      const [m] = newMap.splice(from, 1);
      newMap.splice(to, 0, m);
      // produce inverse mapping oldIndex -> newIndex
      const inv = newMap.reduce((acc, oldIdx, newIdx) => {
        acc[oldIdx] = newIdx;
        return acc;
      }, {} as Record<number, number>);
      return prev.map((p) => ({ ...p, fileIndex: inv[p.fileIndex] }));
    });
  }

  async function mergeNow() {
    if (files.length < 2) return;
    setBusy(true);
    try {
      const out = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await f.arrayBuffer());
        const pages = await out.copyPages(
          src,
          Array.from({ length: src.getPageCount() }, (_, i) => i)
        );
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save({ useObjectStreams: true });
      const { url } = await blobFromUint8(bytes, "merged.pdf");
      dl(url, "merged.pdf");
      trackPdfAction("merge");
    } catch (e) {
      console.error(e);
      alert("Merge failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>
        <p>
          <b>Why</b>: Combine multiple PDFs into one.
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Add PDFs</li>
          <li>Drag to reorder</li>
          <li>Preview pages below</li>
          <li>Merge & download</li>
        </ol>
      </ToolHelp>

      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm">PDF files</span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            className="input mt-1"
            onChange={(e) =>
              e.target.files && setFiles(Array.from(e.target.files))
            }
          />
        </label>
        {files.length > 0 && (
          <button
            className="btn-ghost"
            onClick={() => {
              setFiles([]);
              setThumbs([]);
              setPageThumbs([]);
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Reorderable strip */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <div
              key={f.name + f.lastModified}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() =>
                dragIndex.current !== null && onDrop(dragIndex.current, i)
              }
              className="group rounded-lg border border-neutral-800 bg-neutral-900/70 hover:bg-neutral-900 transition flex items-center gap-3 p-2"
            >
              <img
                src={thumbs[i] || ""}
                alt=""
                className="w-16 h-20 object-contain rounded bg-neutral-900 border border-neutral-800"
                draggable={false}
              />
              <div className="min-w-0">
                <div className="truncate font-medium">{f.name}</div>
                <div className="text-xs text-muted">#{i + 1}</div>
              </div>
              <span className="ml-auto text-xs px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                drag
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2">
        <button
          className="btn"
          onClick={mergeNow}
          disabled={busy || files.length < 2}
        >
          {busy ? "Merging…" : "Merge PDFs"}
        </button>
      </div>

      {/* Live page previews (all pages, ordered) */}
      {pageThumbs.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Preview</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
            {pageThumbs
              .sort((a, b) => a.fileIndex - b.fileIndex || a.page - b.page)
              .map((p, idx) => (
                <div key={idx} className="border rounded overflow-hidden">
                  <img
                    src={p.url}
                    alt={`file ${p.fileIndex + 1} page ${p.page + 1}`}
                    className="w-full"
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================= Enhanced SPLIT (ranges + visual picker) ======================= */

function ToolSplitUX() {
  const [file, setFile] = React.useState<File | null>(null);
  const [mode, setMode] = React.useState<"ranges" | "pick">("pick");
  const [combine, setCombine] = React.useState(false);

  const [ranges, setRanges] = React.useState("");
  const [thumbs, setThumbs] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setThumbs([]);
    setSelected(new Set());
  }, [file]);

  React.useEffect(() => {
    (async () => {
      if (!file) return;
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const list: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({
          scale: 0.35 * (window.devicePixelRatio || 1),
        });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, canvas, viewport: vp }).promise;
        list.push(canvas.toDataURL("image/png"));
      }
      setThumbs(list);
    })();
  }, [file]);

  function toggle(idx: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  async function extract(pageIdxs: number[]) {
    if (!file || !pageIdxs.length) return;
    const src = await PDFDocument.load(await file.arrayBuffer());
    if (combine) {
      const out = await PDFDocument.create();
      for (const idx of pageIdxs) {
        const [p] = await out.copyPages(src, [idx]);
        out.addPage(p);
      }
      const bytes = await out.save({ useObjectStreams: true });
      const { url } = await blobFromUint8(bytes, "extracted.pdf");
      dl(url, "extracted.pdf");
    } else {
      let n = 1;
      for (const idx of pageIdxs) {
        const out = await PDFDocument.create();
        const [p] = await out.copyPages(src, [idx]);
        out.addPage(p);
        const bytes = await out.save({ useObjectStreams: true });
        const { url } = await blobFromUint8(bytes, `page-${idx + 1}.pdf`);
        dl(url, `page-${idx + 1}-${n++}.pdf`);
      }
    }
    trackPdfAction("split");
  }

  async function runRanges() {
    if (!file) return;
    setBusy(true);
    try {
      const total = thumbs.length || 9999;
      const idxs = parsePageSelection(ranges, total);
      await extract(idxs);
    } finally {
      setBusy(false);
    }
  }

  async function runPicked() {
    if (!file) return;
    setBusy(true);
    try {
      await extract(Array.from(selected).sort((a, b) => a - b));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>
        <p>
          <b>Why</b>: Split a PDF by picking pages visually, or by typing
          ranges.
        </p>
        <p>
          <b>How</b>: Upload a PDF → choose <i>Ranges</i> or <i>Select pages</i>{" "}
          → Split.
        </p>
      </ToolHelp>

      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm">PDF file</span>
          <input
            type="file"
            accept="application/pdf"
            className="input mt-1"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <button
            className="btn-ghost"
            onClick={() => {
              setFile(null);
              setSelected(new Set());
              setRanges("");
            }}
          >
            Clear
          </button>
        )}
      </div>

      {!file ? (
        <p className="text-sm text-muted">Choose a PDF to split.</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <button
              className={`chip ${mode === "ranges" ? "chip--active" : ""}`}
              onClick={() => setMode("ranges")}
            >
              Ranges
            </button>
            <button
              className={`chip ${mode === "pick" ? "chip--active" : ""}`}
              onClick={() => setMode("pick")}
            >
              Select pages
            </button>
            <label className="ml-auto inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={combine}
                onChange={(e) => setCombine(e.target.checked)}
              />
              Merge extracted into one PDF
            </label>
          </div>

          {mode === "ranges" ? (
            <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
              <input
                className="input"
                placeholder="e.g. 5-6,8-10"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
              />
              <button
                className="btn"
                onClick={runRanges}
                disabled={busy || !ranges.trim()}
              >
                {busy ? "Splitting…" : "Split"}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <button
                  className="btn"
                  onClick={runPicked}
                  disabled={busy || selected.size === 0}
                >
                  {busy ? "Splitting…" : `Extract ${selected.size} page(s)`}
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => setSelected(new Set())}
                >
                  Clear selection
                </button>
              </div>
              <p className="text-sm text-muted">
                Click thumbnails to select/deselect pages.
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                {thumbs.map((u, i) => {
                  const on = selected.has(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggle(i)}
                      className={`relative border rounded overflow-hidden ${
                        on ? "ring-2 ring-green-500" : ""
                      }`}
                      title={`Page ${i + 1}`}
                    >
                      <img src={u} alt={`Page ${i + 1}`} className="w-full" />
                      {on && (
                        <span className="absolute top-1 left-1 text-xs bg-green-600 text-white rounded px-1">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Always-on preview grid */}
          {thumbs.length > 0 && mode === "ranges" && (
            <div className="mt-6">
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                {thumbs.map((u, i) => (
                  <div key={i} className="border rounded overflow-hidden">
                    <img src={u} alt={`Page ${i + 1}`} className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ======================= Enhanced FILL & FLATTEN (field picker overlay) =======================
   Notes: pdf-lib supports .form.flatten() for ALL fields. Partial flatten is not available.
   This UI lets the user:
     - Inspect fields visually on top of the live preview
     - Select fields to CLEAR values or mark READ-ONLY
     - Optionally FLATTEN ALL fields at export time
   Implementation detail:
     - Uses pdfjs-dist to render pages & fetch form annotations (widget positions) for overlay.
     - Uses pdf-lib to clear values, set read-only flags, and flatten all when requested.
*/


/* ======================= ROTATE (action above, live preview) ======================= */
function ToolRotateUX() {
  const [file, setFile] = React.useState<File | null>(null);
  const [thumbs, setThumbs] = React.useState<string[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [degrees, setDegrees] = React.useState(90); // CW

  React.useEffect(() => {
    setThumbs([]);
  }, [file]);

  React.useEffect(() => {
    (async () => {
      if (!file) return;
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const dpr = window.devicePixelRatio || 1;
      const list: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 0.70 * dpr });
        const c = document.createElement("canvas");
        c.width = vp.width;
        c.height = vp.height;
        await page.render({
          canvasContext: c.getContext("2d")!,
          canvas: c,
          viewport: vp,
        }).promise;
        list.push(c.toDataURL("image/png"));
      }
      setThumbs(list);
    })();
  }, [file]);

  async function rotateAll(delta: number) {
    if (!file) return;
    setBusy(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const count = pdf.getPageCount();
      for (let i = 0; i < count; i++) {
        const p = pdf.getPage(i);
        const cur = p.getRotation().angle || 0;
        p.setRotation(degreesToRotation((((cur + delta) % 360) + 360) % 360));
      }
      const bytes = await pdf.save({ useObjectStreams: true });
      const { url } = await blobFromUint8(bytes, "rotated.pdf");
      dl(url, "rotated.pdf");
      trackPdfAction("rotate");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm">PDF file</span>
          <input
            type="file"
            accept="application/pdf"
            className="input mt-1"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <button className="btn-ghost" onClick={() => setFile(null)}>
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="btn"
          onClick={() => rotateAll(90)}
          disabled={busy || !file}
        >
          {busy ? "Working…" : "Rotate 90° CW"}
        </button>
        <button
          className="btn-ghost"
          onClick={() => rotateAll(270)}
          disabled={busy || !file}
        >
          Rotate 90° CCW
        </button>
      </div>
      {thumbs.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
          {thumbs.map((u, i) => (
            <div key={i} className="border rounded overflow-hidden">
              <img src={u} alt={`p${i + 1}`} className="w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function degreesToRotation(d: number) {
  return { angle: d, type: "degrees" } as any;
}

/* ======================= REORDER PAGES (drag grid) ======================= */
function ToolReorderUX() {
  const [file, setFile] = React.useState<File | null>(null);
  const [thumbs, setThumbs] = React.useState<string[]>([]);
  const [order, setOrder] = React.useState<number[]>([]);
  const [busy, setBusy] = React.useState(false);
  const dragIndex = React.useRef<number | null>(null);

  React.useEffect(() => {
    setThumbs([]);
    setOrder([]);
  }, [file]);

  React.useEffect(() => {
    (async () => {
      if (!file) return;
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const dpr = window.devicePixelRatio || 1;
      const list: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 0.32 * dpr });
        const c = document.createElement("canvas");
        c.width = vp.width;
        c.height = vp.height;
        await page.render({
          canvasContext: c.getContext("2d")!,
          canvas: c,
          viewport: vp,
        }).promise;
        list.push(c.toDataURL("image/png"));
      }
      setThumbs(list);
      setOrder(Array.from({ length: list.length }, (_, i) => i));
    })();
  }, [file]);

  function onDrop(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;
    setOrder((prev) => {
      const arr = prev.slice();
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return arr;
    });
  }

  async function exportReordered() {
    if (!file || !order.length) return;
    setBusy(true);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, order);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save({ useObjectStreams: true });
      const { url } = await blobFromUint8(bytes, "reordered.pdf");
      dl(url, "reordered.pdf");
      trackPdfAction("reorder");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm">PDF file</span>
          <input
            type="file"
            accept="application/pdf"
            className="input mt-1"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <button className="btn-ghost" onClick={() => setFile(null)}>
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="btn"
          onClick={exportReordered}
          disabled={busy || order.length === 0}
        >
          {busy ? "Exporting…" : "Export reordered PDF"}
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {order.map((idx, gridIndex) => (
          <div
            key={gridIndex}
            draggable
            onDragStart={() => (dragIndex.current = gridIndex)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() =>
              dragIndex.current !== null && onDrop(dragIndex.current, gridIndex)
            }
            className="relative border rounded overflow-hidden"
          >
            <img src={thumbs[idx]} alt={`p${idx + 1}`} className="w-full" />
            <span className="absolute top-1 left-1 text-xs bg-neutral-800/80 border border-neutral-700 text-white rounded px-1">
              #{gridIndex + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================= IMAGES → PDF (drag order, action above) ======================= */
function ToolImagesToPdfUX() {
  const [images, setImages] = React.useState<File[]>([]);
  const [urls, setUrls] = React.useState<string[]>([]);
  const dragIndex = React.useRef<number | null>(null);
  const [busy, setBusy] = React.useState(false);

 React.useEffect(() => {
   const next = images.map(f => URL.createObjectURL(f));
   setUrls(next);
   return () => { next.forEach(u => URL.revokeObjectURL(u)); };
 }, [images]);

  function onDrop(from: number, to: number) {
    if (from === to) return;
    setImages((prev) => {
      const arr = prev.slice();
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return arr;
    });
  }

  async function exportPdf() {
    if (images.length === 0) return;
    setBusy(true);
    try {
      const pdf = await PDFDocument.create();
      for (const imgFile of images) {
        const bytes = new Uint8Array(await imgFile.arrayBuffer());
        let img, dims: { width: number; height: number };
        const name = imgFile.name.toLowerCase();
        if (name.endsWith(".png")) {
          img = await pdf.embedPng(bytes);
          dims = { width: img.width, height: img.height };
        } else {
          img = await pdf.embedJpg(bytes);
          dims = { width: img.width, height: img.height };
        }
        const page = pdf.addPage([dims.width, dims.height]);
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: dims.width,
          height: dims.height,
        });
      }
      const out = await pdf.save({ useObjectStreams: true });
      const { url } = await blobFromUint8(out, "images.pdf");
      dl(url, "images.pdf");
      trackPdfAction("images_to_pdf");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm">Images</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="input mt-1"
            onChange={(e) =>
              e.target.files && setImages(Array.from(e.target.files))
            }
          />
        </label>
        {images.length > 0 && (
          <button className="btn-ghost" onClick={() => setImages([])}>
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="btn"
          onClick={exportPdf}
          disabled={busy || images.length === 0}
        >
          {busy ? "Building…" : "Create PDF"}
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {urls.map((u, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() =>
              dragIndex.current !== null && onDrop(dragIndex.current, i)
            }
            className="relative border rounded overflow-hidden"
          >
            <img
              src={u}
              alt={`img${i + 1}`}
              className="w-full object-contain h-40 bg-neutral-900"
            />
            <span className="absolute top-1 left-1 text-xs bg-neutral-800/80 border border-neutral-700 text-white rounded px-1">
              #{i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================= PDF → IMAGES (preview + zip) ======================= */
function ToolPdfToImagesUX() {
  const [file, setFile] = React.useState<File | null>(null);
  const [thumbs, setThumbs] = React.useState<{ url: string; blob?: Blob }[]>(
    []
  );
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setThumbs([]);
  }, [file]);

  React.useEffect(() => {
    (async () => {
      if (!file) return;
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const dpr = window.devicePixelRatio || 1;
      const list: { url: string; blob?: Blob }[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 2 * dpr });
        const c = document.createElement("canvas");
        c.width = vp.width;
        c.height = vp.height;
        const ctx = c.getContext("2d")!;
        await page.render({ canvasContext: ctx, canvas: c, viewport: vp })
          .promise;
        const blob: Blob = await new Promise((res) =>
          c.toBlob((b) => res(b!), "image/png")
        );
        list.push({ url: URL.createObjectURL(blob), blob });
      }
      setThumbs(list);
    })();
  }, [file]);

  async function downloadZip() {
    if (!thumbs.length) return;
    setBusy(true);
    try {
      const JSZip = await loadJSZip();
      if (!JSZip) {
        alert("Zip unavailable in this environment.");
        return;
      }
      const zip = new JSZip();
      thumbs.forEach((t, i) => {
        if (t.blob) zip.file(`page-${i + 1}.png`, t.blob);
      });
      const out = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(out);
      dl(url, "images.zip");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm">PDF file</span>
          <input
            type="file"
            accept="application/pdf"
            className="input mt-1"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <button className="btn-ghost" onClick={() => setFile(null)}>
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="btn"
          onClick={downloadZip}
          disabled={busy || !thumbs.length}
        >
          {busy ? "Preparing…" : "Download images (.zip)"}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {thumbs.map((t, i) => (
          <div key={i} className="border rounded overflow-hidden">
            <img src={t.url} alt={`p${i + 1}`} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================= EXTRACT TEXT (preview + action above) ======================= */
function ToolExtractTextUX() {
  const [file, setFile] = React.useState<File | null>(null);
  const [text, setText] = React.useState<string>("");
  const [busy, setBusy] = React.useState(false);
  const [thumbs, setThumbs] = React.useState<string[]>([]);

  React.useEffect(() => {
    setThumbs([]);
    setText("");
  }, [file]);

  React.useEffect(() => {
    (async () => {
      if (!file) return;
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const dpr = window.devicePixelRatio || 1;
      const list: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 0.26 * dpr });
        const c = document.createElement("canvas");
        c.width = vp.width;
        c.height = vp.height;
        await page.render({
          canvasContext: c.getContext("2d")!,
          canvas: c,
          viewport: vp,
        }).promise;
        list.push(c.toDataURL("image/png"));
      }
      setThumbs(list);
    })();
  }, [file]);

  async function extract() {
    if (!file) return;
    setBusy(true);
    try {
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      let out = "";
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const c = await page.getTextContent();
        out += c.items.map((it: any) => it.str ?? "").join(" ") + "\\n";
      }
      setText(out.trim());
      trackPdfAction("extract_text");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm">PDF file</span>
          <input
            type="file"
            accept="application/pdf"
            className="input mt-1"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <button
            className="btn-ghost"
            onClick={() => {
              setFile(null);
              setText("");
            }}
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="btn" onClick={extract} disabled={busy || !file}>
          {busy ? "Extracting…" : "Extract text"}
        </button>
      </div>
      {thumbs.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {thumbs.map((u, i) => (
            <div key={i} className="border rounded overflow-hidden">
              <img src={u} alt={`p${i + 1}`} className="w-full" />
            </div>
          ))}
        </div>
      )}
      {text && <textarea className="input w-full h-56" value={text} readOnly />}
    </div>
  );
}

/* ======================= COMPRESS (preview + action above) ======================= */
function ToolCompressUX() {
  const [file, setFile] = React.useState<File | null>(null);
  const [thumbs, setThumbs] = React.useState<string[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [quality, setQuality] = React.useState<"high" | "medium" | "low">(
    "medium"
  );

  React.useEffect(() => {
    setThumbs([]);
  }, [file]);

  React.useEffect(() => {
    (async () => {
      if (!file) return;
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const dpr = window.devicePixelRatio || 1;
      const list: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 0.26 * dpr });
        const c = document.createElement("canvas");
        c.width = vp.width;
        c.height = vp.height;
        await page.render({
          canvasContext: c.getContext("2d")!,
          canvas: c,
          viewport: vp,
        }).promise;
        list.push(c.toDataURL("image/png"));
      }
      setThumbs(list);
    })();
  }, [file, quality]);

  async function compress() {
    if (!file) return;
    setBusy(true);
    try {
      // Simple passthrough: we rely on pdf-lib re-saving which may reduce size; real image downsampling requires image re-encode.
      const src = await PDFDocument.load(await file.arrayBuffer());
      const bytes = await src.save({ useObjectStreams: true });
      const { url } = await blobFromUint8(bytes, "compressed.pdf");
      dl(url, "compressed.pdf");
      trackPdfAction("compress");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm">PDF file</span>
          <input
            type="file"
            accept="application/pdf"
            className="input mt-1"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <button className="btn-ghost" onClick={() => setFile(null)}>
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <span>Quality</span>
          <select
            className="input"
            value={quality}
            onChange={(e) => setQuality(e.target.value as any)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <button className="btn" onClick={compress} disabled={busy || !file}>
          {busy ? "Compressing…" : "Compress PDF"}
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {thumbs.map((u, i) => (
          <div key={i} className="border rounded overflow-hidden">
            <img src={u} alt={`p${i + 1}`} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================= REDACT (visual boxes + rasterize) =======================
   UX: upload → draw black boxes over thumbnails → Export (rasterizes each page and burns boxes)
   Note: This performs *safe* redaction by rasterizing; underlying text is removed.
*/
function ToolRedactUX() {
  const [file, setFile] = React.useState<File | null>(null);
  const [thumbs, setThumbs] = React.useState<
    { url: string; w: number; h: number }[]
  >([]);
  const [boxes, setBoxes] = React.useState<
    Record<number, { x: number; y: number; w: number; h: number }[]>
  >({}); // per page
  const [busy, setBusy] = React.useState(false);
  const [scale, setScale] = React.useState(0.35);

  React.useEffect(() => {
    setThumbs([]);
    setBoxes({});
  }, [file]);

  React.useEffect(() => {
    (async () => {
      if (!file) return;
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const out: any[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale });
        const c = document.createElement("canvas");
        c.width = vp.width;
        c.height = vp.height;
        await page.render({
          canvasContext: c.getContext("2d")!,
          canvas: c,
          viewport: vp,
        }).promise;
        out.push({ url: c.toDataURL("image/png"), w: c.width, h: c.height });
      }
      setThumbs(out);
    })();
  }, [file, scale]);

  function startDraw(p: number, e: React.MouseEvent<HTMLDivElement>) {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    function onMove(ev: MouseEvent) {
      const mx = ev.clientX - rect.left;
      const my = ev.clientY - rect.top;
      const x = Math.min(sx, mx),
        y = Math.min(sy, my);
      const w = Math.abs(mx - sx),
        h = Math.abs(my - sy);
      setBoxes((prev) => {
        const copy = { ...prev };
        const arr = (copy[p] || []).slice(0, -1);
        arr.push({ x, y, w, h });
        copy[p] = arr;
        return copy;
      });
    }
    function onUp(ev: MouseEvent) {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    setBoxes((prev) => ({
      ...prev,
      [p]: [...(prev[p] || []), { x: sx, y: sy, w: 0, h: 0 }],
    }));
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function clearPage(p: number) {
    setBoxes((prev) => ({ ...prev, [p]: [] }));
  }

  async function exportRedacted() {
    if (!file) return;
    setBusy(true);
    try {
      const pdfjs = await loadPdfJs();
      const src = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const out = await PDFDocument.create();
      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const vp = page.getViewport({ scale: 2 }); // high res
        const c = document.createElement("canvas");
        c.width = vp.width;
        c.height = vp.height;
        const ctx = c.getContext("2d")!;
        await page.render({ canvasContext: ctx, canvas: c, viewport: vp })
          .promise;
        // burn redaction boxes (scale from thumb to hi-res)
        const t = thumbs[i - 1];
        const scaleX = c.width / t.w,
          scaleY = c.height / t.h;
        (boxes[i - 1] || []).forEach((b) => {
          ctx.fillStyle = "#000";
          ctx.fillRect(b.x * scaleX, b.y * scaleY, b.w * scaleX, b.h * scaleY);
        });
        const blob: Blob = await new Promise((res) =>
          c.toBlob((b) => res(b!), "image/jpeg", 0.92)
        );
        const imgBytes = new Uint8Array(await blob.arrayBuffer());
        const pdf = out;
        const img = await pdf.embedJpg(imgBytes);
        const pageOut = pdf.addPage([img.width, img.height]);
        pageOut.drawImage(img, {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        });
      }
      const bytes = await out.save({ useObjectStreams: true });
      const { url } = await blobFromUint8(bytes, "redacted.pdf");
      dl(url, "redacted.pdf");
      trackPdfAction("redact_apply");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm">PDF file</span>
          <input
            type="file"
            accept="application/pdf"
            className="input mt-1"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <button
            className="btn-ghost"
            onClick={() => {
              setFile(null);
              setThumbs([]);
              setBoxes({});
            }}
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="btn"
          onClick={exportRedacted}
          disabled={busy || !file}
        >
          {busy ? "Exporting…" : "Export redacted PDF"}
        </button>
        <label className="inline-flex items-center gap-2 text-sm">
          <span>Thumb scale</span>
          <input
            type="range"
            min="0.25"
            max="0.6"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {thumbs.map((t, i) => (
          <div key={i} className="relative border rounded overflow-hidden">
            <img
              src={t.url}
              alt={`p${i + 1}`}
              className="w-full select-none pointer-events-none"
            />
            <div
              className="absolute inset-0 cursor-crosshair"
              onMouseDown={(e) => startDraw(i, e)}
            />
            {(boxes[i] || []).map((b, idx) => (
              <div
                key={idx}
                className="absolute bg-black/80 border border-black"
                style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
              />
            ))}
            <button
              type="button"
              className="absolute top-1 left-1 text-xs bg-neutral-800/80 border border-neutral-700 text-white rounded px-1"
              onClick={() => clearPage(i)}
            >
              Clear
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================= WATERMARK (text or image) ======================= */





/* ======================= Page numbers / Header / Footer / Watermark (with LIVE PREVIEW) ======================= */
function ToolWatermarkUX() {
  const [file, setFile] = React.useState<File | null>(null);
  const [mode, setMode] = React.useState<"numbers"|"header"|"footer"|"watermark">("numbers");
  const [text, setText] = React.useState("CONFIDENTIAL");
  const [pos, setPos] = React.useState<"tl"|"tc"|"tr"|"bl"|"bc"|"br"|"center">("bc");
  const [color, setColor] = useState<string>("#000000");
  const [size, setSize] = React.useState(12);
  const [opacity, setOpacity] = React.useState(60);
  const [thumbs, setThumbs] = React.useState<{page:number; url:string; w:number; h:number; pageWidthPt:number}[]>([]);
  const tileRefs = React.useRef<Record<number, HTMLDivElement | null>>({});
  const [tileW, setTileW] = React.useState<Record<number, number>>({});

  const [busy, setBusy] = React.useState(false);

  React.useEffect(()=>{
    setThumbs([]);
    setTileW({});
  }, [file]);

  React.useEffect(()=>{
    if (mode === "numbers") setPos("bc");
    else if (mode === "header") setPos("tc");
    else if (mode === "footer") setPos("bc");
    else setPos("center");
    if (mode === "watermark") setColor("#ff0000");
    else setColor("#000000");
  }, [mode]);

  React.useEffect(()=>{
    (async () => {
      if (!file) return;
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const out:any[] = [];
      const dpr = window.devicePixelRatio || 1;
      for (let p=1; p<=doc.numPages; p++) {
        const page = await doc.getPage(p);
        const vp = page.getViewport({ scale: 0.70 * dpr });
        const vp1 = page.getViewport({ scale: 1 });
        const c = document.createElement("canvas");
        c.width = vp.width; c.height = vp.height;
        const ctx = c.getContext("2d")!;
        await page.render({ canvasContext: ctx, canvas: c, viewport: vp }).promise;
        out.push({ page: p-1, url: c.toDataURL("image/png"), w: c.width, h: c.height, pageWidthPt: vp1.width });
      }
      setThumbs(out);
    })();
  }, [file]);

  React.useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        const page = parseInt(el.dataset.page || "", 10);
        if (!isNaN(page)) {
          setTileW(w => ({ ...w, [page]: e.contentRect.width }));
        }
      }
    });
    thumbs.forEach(t => {
      const el = tileRefs.current[t.page];
      if (el) ro.observe(el);
    });
    return () => ro.disconnect();
  }, [thumbs]);

  function labelFor(pageIndex:number) {
    return mode === "numbers" ? `${pageIndex+1} / ${thumbs.length}` : text;
  }

  function previewFontPx(t:{page:number; w:number; pageWidthPt:number}) {
    const displayW = tileW[t.page] ?? t.w;
    return Math.max(8, size * (displayW / t.pageWidthPt));
  }

  function overlayStyle(t:{w:number; h:number}) {
    // CSS placement relative to thumbnail box
    const s: any = {
      position: "absolute",
      color,
      textShadow: "0 0 6px rgba(0,0,0,.65)",
      opacity: Math.max(0, Math.min(1, opacity/100)),
      transform: ""
    };
    if (pos === "tl") { s.left = 8; s.top = 8; }
    if (pos === "tc") { s.left = "50%"; s.top = 8; s.transform = "translateX(-50%)"; }
    if (pos === "tr") { s.right = 8; s.top = 8; }
    if (pos === "bl") { s.left = 8; s.bottom = 8; }
    if (pos === "bc") { s.left = "50%"; s.bottom = 8; s.transform = "translateX(-50%)"; }
    if (pos === "br") { s.right = 8; s.bottom = 8; }
    if (pos === "center") { s.left = "50%"; s.top = "50%"; s.transform = "translate(-50%,-50%) rotate(35deg)"; }
    return s;
  }

  async function apply() {
    if (!file) return;
    setBusy(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      
pages.forEach((p, idx) => {
  const { width, height } = p.getSize();
  const pad = 24;
  const content = mode === "numbers" ? `${idx+1} / ${pages.length}` : text;

  let effPos = pos;
  if (mode === "watermark") effPos = "center";
  if (mode === "numbers" && pos === "center") effPos = "bc";

  let x = width/2, y = pad;
  switch (effPos) {
    case "tl": x=pad; y=height-pad; break;
    case "tc": x=width/2; y=height-pad; break;
    case "tr": x=width-pad; y=height-pad; break;
    case "bl": x=pad; y=pad; break;
    case "bc": x=width/2; y=pad; break;
    case "br": x=width-pad; y=pad; break;
    case "center": x=width/2; y=height/2; break;
  }

  const w = font.widthOfTextAtSize(content, size);
  const h = font.heightAtSize(size, { descender: false });
  let originX = x;
  let originY = y;
  let rotateOpt = undefined;

  if (effPos === "center" && mode === "watermark") {
    const theta = (35 * Math.PI) / 180;
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);
    const rotW = w * cos + h * sin;
    const rotH = w * sin + h * cos;
    originX = (width - rotW) / 2 + h * sin;
    originY = (height - rotH) / 2;
    rotateOpt = degrees(35);
  } else {
    // Align by width for left/center/right when not rotated
    if (effPos.endsWith("c") || effPos === "center") originX = x - w / 2;
    if (effPos.endsWith("r")) originX = x - w;
    // For top-aligned positions (tl/tc/tr) move baseline down by text height
    if (effPos === "tl" || effPos === "tc" || effPos === "tr") originY = y - h;
  }

  const r = parseInt(color.slice(1,3),16)/255;
  const g = parseInt(color.slice(3,5),16)/255;
  const b = parseInt(color.slice(5,7),16)/255;

  p.drawText(content, {
    x: originX,
    y: originY,
    size,
    font,
    color: rgb(r,g,b),
    opacity: Math.max(0, Math.min(1, opacity/100)),
    rotate: rotateOpt,
  } as any);
});
const bytes = await pdf.save({ useObjectStreams: true });
      const { url } = await blobFromUint8(bytes, "annotated.pdf");
      dl(url, "annotated.pdf");
      trackPdfAction("numbers_header_footer_watermark");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <ToolHelp>{HELP.watermark}</ToolHelp>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm">PDF file</span>
          <input type="file" accept="application/pdf" className="input mt-1" onChange={e=> setFile(e.target.files?.[0] ?? null)} />
        </label>
        <label className="block">
          <span className="text-sm">Mode</span>
          <select className="input mt-1" value={mode} onChange={e=> setMode(e.target.value as any)}>
            <option value="numbers">Page numbers</option>
            <option value="header">Header text</option>
            <option value="footer">Footer text</option>
            <option value="watermark">Watermark</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm">Font size (pt)</span>
          <input type="number" min={6} max={256} className="input mt-1" value={size} onChange={e=> setSize(parseInt(e.target.value||"12",10))} />
        </label>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <label className="block">
          <span className="text-sm">Text</span>
          <input className="input mt-1" value={text} onChange={e=> setText(e.target.value)} disabled={mode==="numbers"} />
        </label>
        <label className="block">
          <span className="text-sm">Position</span>
          <select className="input mt-1" value={pos} onChange={e=> setPos(e.target.value as any)} disabled={mode==="watermark"}>
            <option value="tl">Top-Left</option>
            <option value="tc">Top-Center</option>
            <option value="tr">Top-Right</option>
            <option value="bl">Bottom-Left</option>
            <option value="bc">Bottom-Center</option>
            <option value="br">Bottom-Right</option>
            <option value="center">Center (angled)</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm">Opacity (%)</span>
          <input type="number" min={0} max={100} className="input mt-1" value={opacity} onChange={e=> setOpacity(parseInt(e.target.value||"60",10))} />
        </label>
        <label className="block">
          <span className="text-sm">Color</span>
          <input type="color" className="input mt-1" value={color} onChange={e=> setColor((e.target as HTMLInputElement).value)} />
        </label>
      </div>

      <button className="btn" onClick={apply} disabled={!file || busy}>
        {busy ? "Applying…" : "Apply & Download"}
      </button>

      {/* LIVE PREVIEW */}
      {thumbs.length>0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted">Live preview (not exported)</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {thumbs.map(t => {
              const fontPx = previewFontPx(t);
              return (
                <div
                  key={t.page}
                  className="relative border rounded overflow-hidden"
                  ref={el => { tileRefs.current[t.page] = el; }}
                  data-page={t.page}
                >
                  <img src={t.url} alt={`Page ${t.page+1}`} className="w-full select-none pointer-events-none" />
                  <div style={overlayStyle(t)}>
                    <span style={{ fontSize: `${fontPx}px`, fontWeight: 600 }}>{labelFor(t.page)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================= Fill & Flatten with POPUP editor on preview ======================= */
function ToolFillFlattenUX() {
  const [file, setFile] = React.useState<File | null>(null);
  const [origBytes, setOrigBytes] = React.useState<Uint8Array | null>(null);

  // Working doc & form kept in memory
  const [doc, setDoc] = React.useState<PDFDocument | null>(null);
  const formRef = React.useRef<any>(null);

  const [fields, setFields] = React.useState<{ name: string; type: string; value?: string }[]>([]);
  const [busy, setBusy] = React.useState(false);

  // Single / bulk inputs
  const [k, setK] = React.useState("");
  const [v, setV] = React.useState("");
  const [bulk, setBulk] = React.useState<string>("");

  // Export options
  const [flatten, setFlatten] = React.useState<boolean>(true);

  // Search
  const [q, setQ] = React.useState("");

  // --- Live preview thumbnails + widget overlays ---
  type Thumb = { page: number; url: string; w: number; h: number; widgets: { id: string; name: string; type: string; rect: [number,number,number,number]; value?: string }[] };
  const [thumbs, setThumbs] = React.useState<Thumb[]>([]);

  function detectType(field: any): string {
    const n = field?.constructor?.name || "";
    if (n) return n.replace(/^PDF/, "");
    if ("check" in field || "uncheck" in field) return "CheckBox";
    if ("select" in field) return "Dropdown/Radio/OptionList";
    if ("setText" in field) return "TextField";
    return "Unknown";
  }

  async function buildDoc(bytes: Uint8Array) {
    const d = await PDFDocument.load(bytes);
    setDoc(d);
    formRef.current = d.getForm();
  }

  async function listFieldsFromCurrentDoc() {
    if (!doc) return;
    const f = formRef.current;
    const all = (f as any).getFields?.() as any[] | undefined;
    const mapped = all?.map((fld: any) => {
      const name = fld.getName?.() ?? "(unnamed)";
      const type = detectType(fld);
      let value: string | undefined;
      try {
        if (typeof fld.getText === "function") value = fld.getText();
        else if (typeof fld.isChecked === "function") value = fld.isChecked() ? "checked" : "unchecked";
        else if (typeof (fld as any).getSelected === "function") {
          const sel = (fld as any).getSelected();
          value = Array.isArray(sel) ? sel.join(", ") : String(sel ?? "");
        }
      } catch {}
      return { name, type, value };
    }) ?? [];
    setFields(mapped);
  }

  function valueFor(name: string): string | undefined {
    const f = fields.find(x => x.name === name);
    return f?.value;
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setFields([]);
    setK(""); setV(""); setBulk("");
    setDoc(null); formRef.current = null;
    setThumbs([]);
    if (!f) return;
    setBusy(true);
    try {
      const ab = await f.arrayBuffer();
      const bytes = new Uint8Array(ab);
      setOrigBytes(bytes);
      await buildDoc(bytes);
      await listFieldsFromCurrentDoc();

      // Build preview thumbs + widget rects with pdf.js
      const pdfjs = await loadPdfJs();
      const docjs = await pdfjs.getDocument({ data: bytes }).promise;
      const out: Thumb[] = [];
      const maxPages = Math.min(64, docjs.numPages);
      const dpr = window.devicePixelRatio || 1;

      for (let p = 1; p <= maxPages; p++) {
        const page = await docjs.getPage(p);
        const viewport = page.getViewport({ scale: 1 * dpr });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, canvas, viewport }).promise;

        // Map widget rectangles to viewport space
        const annots = await page.getAnnotations({ intent: "display" });
        const t = viewport.transform;
        const m = { a:t[0], b:t[1], c:t[2], d:t[3], e:t[4], f:t[5] };
        function mapRect(rect: number[]) {
          const [x1,y1,x2,y2] = rect;
          const X1 = m.a*x1 + m.c*y1 + m.e;
          const Y1 = m.b*x1 + m.d*y1 + m.f;
          const X2 = m.a*x2 + m.c*y2 + m.e;
          const Y2 = m.b*x2 + m.d*y2 + m.f;
          return [Math.min(X1,X2), Math.min(Y1,Y2), Math.max(X1,X2), Math.max(Y1,Y2)] as [number,number,number,number];
        }
        const widgets: Thumb['widgets'] = [];
        for (const a of annots) {
          if ((a as any).subtype !== "Widget") continue;
          const name = (a as any).fieldName || (a as any).title || (a as any).id || "";
          const rect = mapRect((a as any).rect || (a as any).rects || [0,0,0,0]);
          const type = (a as any).fieldType || "Widget";
          widgets.push({ id: `${p}:${name}:${widgets.length}`, name, type, rect, value: valueFor(name) });
        }

        out.push({ page: p-1, url: canvas.toDataURL("image/png"), w: canvas.width, h: canvas.height, widgets });
      }
      setThumbs(out);
    } finally {
      setBusy(false);
    }
  }

  function parseBulk(text: string): Record<string, string | boolean | string[]> {
    try {
      const obj = JSON.parse(text);
      if (obj && typeof obj === "object") return obj as Record<string, any>;
    } catch {}
    const out: Record<string, any> = {};
    text.split(/\\r?\\n/).map(s=>s.trim()).filter(Boolean).forEach(line => {
      const m = line.match(/^([^=]+)=(.*)$/);
      if (!m) return;
      const key = m[1].trim();
      const raw = m[2].trim();
      if (/^(true|false)$/i.test(raw)) out[key] = /^true$/i.test(raw);
      else if (raw.includes(",")) out[key] = raw.split(",").map(x=>x.trim()).filter(Boolean);
      else out[key] = raw;
    });
    return out;
  }

  function applyValueToField(field: any, val: any): boolean {
    try {
      if (typeof field.setText === "function") { field.setText(String(val ?? "")); return true; }
      if (typeof field.check === "function" || typeof field.uncheck === "function") {
        const truthy = typeof val === "boolean" ? val : /^(1|true|yes|on|checked)$/i.test(String(val ?? "").trim());
        truthy ? field.check?.() : field.uncheck?.();
        return true;
      }
      if (typeof field.select === "function") {
        if (Array.isArray(val)) field.select(val); else field.select(String(val ?? ""));
        return true;
      }
    } catch {}
    return false;
  }

  async function fillSingle() {
    if (!doc || !k) return;
    setBusy(true);
    try {
      const f = formRef.current;
      let field: any;
      try { field = f.getField(k); } catch { alert(`Field "${k}" not found.`); return; }
      if (!applyValueToField(field, v)) { alert("This field type isn’t supported yet."); return; }
      await listFieldsFromCurrentDoc();
      // update widget values in preview
      setThumbs(t => t.map(pg => ({ ...pg, widgets: pg.widgets.map(w => w.name === k ? { ...w, value: v } : w) })));
    } finally { setBusy(false); }
  }

  async function fillBulk() {
    if (!doc || !bulk.trim()) return;
    setBusy(true);
    try {
      const data = parseBulk(bulk);
      const f = formRef.current;
      let applied = 0;
      for (const name of Object.keys(data)) {
        try {
          const fld = f.getField(name);
          if (applyValueToField(fld, data[name])) applied++;
        } catch {}
      }
      if (!applied) { alert("No fields were updated. Check names/values."); return; }
      await listFieldsFromCurrentDoc();
      setThumbs(t => t.map(pg => ({ ...pg, widgets: pg.widgets.map(w => (w.name in data) ? { ...w, value: String((data as any)[w.name]) } : w) })));
    } finally { setBusy(false); }
  }

  async function toggleCheckbox(name: string) {
    if (!doc) return;
    try {
      const f = formRef.current;
      const fld = f.getField(name);
      if (typeof fld.isChecked === "function") {
        const cur = fld.isChecked();
        cur ? fld.uncheck?.() : fld.check?.();
        await listFieldsFromCurrentDoc();
        setThumbs(t => t.map(pg => ({ ...pg, widgets: pg.widgets.map(w => w.name === name ? { ...w, value: cur ? "unchecked" : "checked" } : w) })));
      }
    } catch {}
  }

  async function reloadValues() { if (!doc) return; await listFieldsFromCurrentDoc(); }

  async function revertAll() {
    if (!origBytes) return;
    setBusy(true);
    try { await buildDoc(origBytes); await listFieldsFromCurrentDoc(); } finally { setBusy(false); }
  }

  async function exportPdf() {
    if (!doc) return;
    const working = doc;
    if (flatten) {
      try { formRef.current.flatten(); } catch {}
    }
    const bytes = await working.save({ useObjectStreams: true });
    const { url } = await blobFromUint8(bytes, flatten ? "filled.pdf" : "filled-editable.pdf");
    dl(url, flatten ? "filled.pdf" : "filled-editable.pdf");
    trackPdfAction("fill_flatten_export");
  }

  function downloadCSV() {
    const rows = [["name","type","value"], ...fields.map(f => [f.name, f.type, f.value ?? ""])];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    dl(url, "pdf-form-fields.csv");
  }

  function preloadBulkFromTable() {
    const s = q.trim().toLowerCase();
    const list = (s ? fields.filter(f => f.name.toLowerCase().includes(s)) : fields).map(f => `${f.name}=${f.value ?? ""}`);
    setBulk(list.join("\\n"));
  }

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return fields;
    return fields.filter(f => f.name.toLowerCase().includes(s));
  }, [fields, q]);

  // helper for overlay style in %
  function boxStyle(t: Thumb, r: [number,number,number,number]) {
    const [x1,y1,x2,y2] = r;
    return {
      position: "absolute",
      left: `${(x1 / t.w) * 100}%`,
      top: `${(y1 / t.h) * 100}%`,
      width: `${((x2 - x1) / t.w) * 100}%`,
      height: `${((y2 - y1) / t.h) * 100}%`,
      pointerEvents: "auto"
    } as React.CSSProperties;
  }

  return (
    <div className="card p-6 min-h-0 space-y-4">
      <ToolHelp>{HELP.fillFlatten}</ToolHelp>

      {/* Pick file + actions */}
      <div className="grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-end">
        <input type="file" accept="application/pdf" className="input" onChange={onPick} />
        <button className="btn-ghost" onClick={reloadValues} disabled={!doc || busy} title="Reload values from current PDF">Reload values</button>
        <button className="btn-ghost" onClick={() => doc && downloadCSV()} disabled={!fields.length} title="Download field names/types/values as CSV">Download CSV</button>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={flatten} onChange={(e)=> setFlatten(e.target.checked)} />
          Flatten on export
        </label>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={revertAll} disabled={!origBytes || busy}>Revert</button>
          <button className="btn" onClick={exportPdf} disabled={!doc || busy}>Export PDF</button>
        </div>
      </div>

      {/* Live preview */}
      {thumbs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {thumbs.map((t) => (
            <div key={t.page} className="relative border rounded overflow-hidden">
              <img src={t.url} alt={`p${t.page+1}`} className="w-full block pointer-events-none select-none" />
              {t.widgets.map((w) => (
                <div
                  key={w.id}
                  className={`absolute rounded ring-1 ring-white/80 bg-sky-400/20 hover:ring-2 hover:ring-sky-500`}
                  style={boxStyle(t, w.rect)}
                  title={`${w.name || "(unnamed)"}${w.value ? ` — ${w.value}` : ""}`}
                  onClick={() => {
                    if (!doc) return;
                    const f = formRef.current;
                    try {
                      const fld = f.getField(w.name);
                      if (typeof fld.isChecked === "function") {
                        const cur = fld.isChecked();
                        cur ? fld.uncheck?.() : fld.check?.();
                        listFieldsFromCurrentDoc().then(()=> {
                          setThumbs(prev => prev.map(pg => (pg.page===t.page ? {...pg, widgets: pg.widgets.map(ww => ww.id===w.id ? {...ww, value: cur ? "unchecked" : "checked"} : ww)} : pg)));
                        });
                        return;
                      }
                      if (typeof fld.setText === "function") {
                        const val = prompt(`Set value for "${w.name}"`, w.value ?? "");
                        if (val !== null) {
                          fld.setText(val);
                          listFieldsFromCurrentDoc().then(()=> {
                            setThumbs(prev => prev.map(pg => (pg.page===t.page ? {...pg, widgets: pg.widgets.map(ww => ww.id===w.id ? {...ww, value: val} : ww)} : pg)));
                          });
                        }
                        return;
                      }
                    } catch {}
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Field table + filter */}
      {fields.length > 0 && (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <input className="input" placeholder="Search field names" value={q} onChange={(e)=> setQ(e.target.value)} />
            <button className="btn-ghost" onClick={preloadBulkFromTable} title="Load the visible fields into Bulk fill editor">Load into Bulk</button>
          </div>
          <div className="overflow-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Current</th>
                  <th className="px-3 py-2">Copy / Toggle</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr key={i} className="border-t border-neutral-800">
                    <td className="px-3 py-2 font-mono">{f.name}</td>
                    <td className="px-3 py-2">{f.type}</td>
                    <td className="px-3 py-2">
                      {f.type === "CheckBox" ? (
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={f.value === "checked"} onChange={() => toggleCheckbox(f.name)} />
                          {f.value || "unchecked"}
                        </label>
                      ) : (f.value ?? "")}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(f.name)}>Copy name</button>
                        {f.type === "CheckBox" && (<button className="btn-ghost" onClick={() => toggleCheckbox(f.name)}>Toggle</button>)}
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td className="px-3 py-4 text-muted" colSpan={4}>No fields match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Single fill */}
      <div className="grid md:grid-cols-3 gap-3">
        <input className="input" placeholder="Field name" value={k} onChange={(e)=> setK(e.target.value)} />
        <input className="input" placeholder="Value (text / true|false / option[,option])" value={v} onChange={(e)=> setV(e.target.value)} />
        <button className="btn" onClick={fillSingle} disabled={!doc || !k || busy}>{busy ? "Working…" : "Apply change"}</button>
      </div>

      {/* Bulk fill */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Bulk fill (applies to current PDF in memory)</label>
        <textarea className="input h-40 font-mono" placeholder={`JSON or KEY=VALUE per line
Examples:
{"FullName":"Jane Doe","Agree":true,"Country":"Ireland"}
FullName=Jane Doe
Agree=true
Interests=Reading, Music`} value={bulk} onChange={(e)=> setBulk(e.target.value)} />
        <div className="flex gap-2">
          <button className="btn" onClick={fillBulk} disabled={!doc || busy}>{busy ? "Working…" : "Apply bulk changes"}</button>
          <button className="btn-ghost" onClick={()=> setBulk("")} disabled={busy}>Clear</button>
          <button className="btn-ghost" onClick={reloadValues} disabled={!doc || busy} title="Refresh table values after changes">Reload values</button>
        </div>
      </div>
    </div>
  );
}

