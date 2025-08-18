/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  file: File;
  className?: string;
  thumbScale?: number; // 0.2..0.6
  onMeta?: (meta: { pages: number }) => void;
};

export default function PdfFirstPageThumb({
  file,
  className = "",
  thumbScale = 0.35,
  onMeta,
}: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const revokeRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pdfjs = await import("pdfjs-dist");
      // @ts-ignore
      (pdfjs as any).GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

      const data = await file.arrayBuffer();
      const doc = await (pdfjs as any).getDocument({ data }).promise;
      onMeta?.({ pages: doc.numPages });

      const page = await doc.getPage(1);
      const vp = page.getViewport({ scale: thumbScale * (window.devicePixelRatio || 1) });

      const canvas = document.createElement("canvas");
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, canvas, viewport: vp }).promise;

      const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
      const objectUrl = URL.createObjectURL(blob);
      revokeRef.current && URL.revokeObjectURL(revokeRef.current);
      revokeRef.current = objectUrl;
      if (!cancelled) setUrl(objectUrl);
    })();
    return () => {
      cancelled = true;
      if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
    };
  }, [file, thumbScale, onMeta]);

  return (
    <img
      src={url || ""}
      alt={file.name}
      className={["block w-24 h-32 object-contain rounded bg-neutral-900 border border-neutral-800", className].join(" ")}
      draggable={false}
    />
  );
}
