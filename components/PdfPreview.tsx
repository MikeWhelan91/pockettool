/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PageRef = { fileIndex: number; pageIndex: number };
type Item = PageRef & { url: string };

export default function PdfPreview({
  files = [],
  selectable = false,
  selected = [],
  onPageClick,
  accent = "blue",
  className = "",
}: {
  files?: File[];
  selectable?: boolean;
  selected?: PageRef[];
  onPageClick?: (p: PageRef) => void;
  accent?: "blue" | "green";
  className?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const genId = (pr: PageRef) => `${pr.fileIndex}:${pr.pageIndex}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setItems([]);
      if (!files?.length) return;
      const pdfjs = await import("pdfjs-dist");
      (pdfjs as any).GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
      const out: Item[] = [];
      for (let fi = 0; fi < files.length; fi++) {
        const data = await files[fi].arrayBuffer();
        const doc = await (pdfjs as any).getDocument({ data }).promise;
        const max = Math.min(500, doc.numPages);
        for (let p = 1; p <= max; p++) {
          const page = await doc.getPage(p);
          const vp = page.getViewport({ scale: 0.35 * (window.devicePixelRatio || 1) });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvasContext: ctx, canvas, viewport: vp }).promise;
          out.push({ fileIndex: fi, pageIndex: p - 1, url: canvas.toDataURL("image/png") });
        }
      }
      if (!cancelled) setItems(out);
    })();
    return () => { cancelled = true; };
  }, [files]);

  const selSet = useMemo(() => new Set(selected?.map(genId)), [selected]);

  const hoverRing =
    accent === "green"
      ? "hover:shadow-[0_0_0_2px_rgba(16,185,129,0.9)]"
      : "hover:shadow-[0_0_0_2px_rgba(59,130,246,0.9)]";

  const activeRing =
    accent === "green"
      ? "shadow-[0_0_0_2px_rgba(16,185,129,1)]"
      : "shadow-[0_0_0_2px_rgba(59,130,246,1)]";

  return (
    <div className={`grid grid-cols-3 sm:grid-cols-6 gap-2 ${className}`}>
      {items.map((it) => {
        const key = `${it.fileIndex}:${it.pageIndex}`;
        const isActive = selSet.has(key);
        return (
          <button
            key={key}
            type="button"
            className={`rounded border overflow-hidden transition-transform duration-100 ${hoverRing} ${isActive ? activeRing + " scale-[1.02]" : ""}`}
            onClick={() => {
              if (!selectable) return;
              onPageClick?.({ fileIndex: it.fileIndex, pageIndex: it.pageIndex });
            }}
            title={`File #${it.fileIndex + 1}, page ${it.pageIndex + 1}`}
          >
            <img src={it.url} alt="" className="w-full block" />
          </button>
        );
      })}
    </div>
  );
}
