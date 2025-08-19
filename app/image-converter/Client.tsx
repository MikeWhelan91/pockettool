/* eslint-disable @next/next/no-img-element */
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* ───────────────────────── helpers ───────────────────────── */

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Collapsible help: expanded on desktop, collapsed on mobile (matches PDF). */
function ToolHelp({
  title = "What this does & how to use it",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setOpen(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return (
    <details open={open} className="rounded-lg border border-line bg-card p-3">
      <summary className="cursor-pointer text-sm font-medium">{title}</summary>
      <div className="mt-2 text-sm text-muted space-y-2">{children}</div>
    </details>
  );
}

/** Inline drag-and-drop zone (rendered inside each tool). */
function DropZoneInline({
  accept,
  multiple,
  onFiles,
  label,
}: {
  accept: string;
  multiple: boolean;
  onFiles: (files: File[]) => void;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [drag, setDrag] = useState(false);

  function pick(ev: React.ChangeEvent<HTMLInputElement>) {
    if (!ev.target.files) return;
    onFiles(Array.from(ev.target.files));
    ev.target.value = ""; // allow re-pick same files
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
    const items = Array.from(e.dataTransfer.files || []);
    if (items.length) onFiles(items);
  }

  return (
    <div className="w-full">
      <label className="block text-sm text-neutral-300 mb-1">{label}</label>
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDrag(false);
        }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={
          "flex items-center justify-center rounded-lg border-2 border-dashed px-4 py-10 transition " +
          (drag
            ? "border-[#2B67F3] bg-[#2B67F3]/10"
            : "border-[#2B67F3] hover:bg-[#2B67F3]/5")
        }
        aria-label="Drop images here or click to browse"
      >
        <div className="text-center">
          <div className="text-sm">Drag & drop images here</div>
          <div className="text-xs text-muted mt-1">or click to browse…</div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={pick}
      />
    </div>
  );
}

/** Inline cropper (drag corners or move). Overlay visible only on Crop tool. */
function CropperInline({
  src,
  rect,
  onChange,
  aspect,
  previewTransform,
  height = 420,
  visible = true,
}: {
  src: string;
  rect: { x: number; y: number; w: number; h: number };
  onChange: (r: { x: number; y: number; w: number; h: number }) => void;
  aspect: "free" | "1:1" | "4:3" | "16:9";
  previewTransform: {
    flipH: boolean;
    flipV: boolean;
    rotate: 0 | 90 | 180 | 270;
  };
  height?: number;
  visible?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const ratio = useMemo(() => {
    if (aspect === "free") return undefined;
    const [aw, ah] = aspect.split(":").map((v) => parseInt(v, 10));
    return aw / ah;
  }, [aspect]);

  // Disable text selection during drag (prevents blue overlay).
  const savedUserSelect = useRef<string | null>(null);
  function disableSelection() {
    savedUserSelect.current = document.body.style.userSelect;
    document.body.style.userSelect = "none";
  }
  function restoreSelection() {
    if (savedUserSelect.current !== null) {
      document.body.style.userSelect = savedUserSelect.current;
      savedUserSelect.current = null;
    }
  }

  const dragRef = useRef<{
    type: "move" | "nw" | "ne" | "sw" | "se" | null;
    startX: number;
    startY: number;
    startRect: { x: number; y: number; w: number; h: number };
  } | null>(null);

  function pctFromPointer(e: PointerEvent | React.PointerEvent) {
    const wrap = wrapRef.current!;
    const r = wrap.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    return { x: clamp(x, 0, 100), y: clamp(y, 0, 100) };
  }

  function startDrag(
    e: React.PointerEvent,
    type: "move" | "nw" | "ne" | "sw" | "se",
  ) {
    e.preventDefault();
    e.stopPropagation(); // so corner doesn’t trigger move
    const pt = pctFromPointer(e);
    dragRef.current = {
      type,
      startX: pt.x,
      startY: pt.y,
      startRect: { ...rect },
    };
    (e.target as Element).setPointerCapture(e.pointerId);
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", endDrag);
    disableSelection();
  }

  function onDrag(e: PointerEvent) {
    if (!dragRef.current) return;
    const { type, startX, startY, startRect } = dragRef.current;
    const { x, y } = pctFromPointer(e);
    const dx = x - startX;
    const dy = y - startY;

    if (type === "move") {
      const nx = clamp(startRect.x + dx, 0, 100 - startRect.w);
      const ny = clamp(startRect.y + dy, 0, 100 - startRect.h);
      onChange({ ...rect, x: nx, y: ny });
      return;
    }

    let nx = startRect.x,
      ny = startRect.y,
      nw = startRect.w,
      nh = startRect.h;
    if (type === "nw") {
      const rx = clamp(startRect.x + dx, 0, startRect.x + startRect.w - 1);
      const ry = clamp(startRect.y + dy, 0, startRect.y + startRect.h - 1);
      nw = startRect.w + (startRect.x - rx);
      nh = startRect.h + (startRect.y - ry);
      nx = rx;
      ny = ry;
    } else if (type === "ne") {
      const ry = clamp(startRect.y + dy, 0, startRect.y + startRect.h - 1);
      nw = clamp(startRect.w + dx, 1, 100 - startRect.x);
      nh = startRect.h + (startRect.y - ry);
      ny = ry;
    } else if (type === "sw") {
      const rx = clamp(startRect.x + dx, 0, startRect.x + startRect.w - 1);
      nw = startRect.w + (startRect.x - rx);
      nx = rx;
      nh = clamp(startRect.h + dy, 1, 100 - startRect.y);
    } else if (type === "se") {
      nw = clamp(startRect.w + dx, 1, 100 - startRect.x);
      nh = clamp(startRect.h + dy, 1, 100 - startRect.y);
    }

    if (ratio) {
      const boxRatio = nw / nh;
      if (boxRatio > ratio) nw = nh * ratio;
      else nh = nw / ratio;
      nw = Math.min(nw, 100 - nx);
      nh = Math.min(nh, 100 - ny);
    }
    nw = Math.max(1, nw);
    nh = Math.max(1, nh);
    onChange({ x: nx, y: ny, w: nw, h: nh });
  }

  function endDrag() {
    window.removeEventListener("pointermove", onDrag);
    window.removeEventListener("pointerup", endDrag);
    restoreSelection();
    dragRef.current = null;
  }

  const transform = `
    ${previewTransform.flipH ? "scaleX(-1)" : ""}
    ${previewTransform.flipV ? " scaleY(-1)" : ""}
    ${previewTransform.rotate ? ` rotate(${previewTransform.rotate}deg)` : ""}
  `.trim();

  return (
    <div
      ref={wrapRef}
      className="relative rounded bg-black/20 overflow-hidden select-none"
      style={{ height, touchAction: "none" }}
    >
      <div className="absolute inset-0 origin-center" style={{ transform }}>
        <img
          src={src}
          alt="preview"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          draggable={false}
        />

        {visible && (
          <>
            {/* outside masks */}
            <div
              className="absolute bg-black/40 pointer-events-none"
              style={{ left: 0, top: 0, width: `${rect.x}%`, height: "100%" }}
            />
            <div
              className="absolute bg-black/40 pointer-events-none"
              style={{
                left: `${rect.x + rect.w}%`,
                top: 0,
                right: 0,
                height: "100%",
              }}
            />
            <div
              className="absolute bg-black/40 pointer-events-none"
              style={{
                left: `${rect.x}%`,
                top: 0,
                width: `${rect.w}%`,
                height: `${rect.y}%`,
              }}
            />
            <div
              className="absolute bg-black/40 pointer-events-none"
              style={{
                left: `${rect.x}%`,
                top: `${rect.y + rect.h}%`,
                width: `${rect.w}%`,
                bottom: 0,
              }}
            />

            {/* crop box */}
            <div
              className="absolute border-2 border-blue-500"
              style={{
                left: `${rect.x}%`,
                top: `${rect.y}%`,
                width: `${rect.w}%`,
                height: `${rect.h}%`,
              }}
              onPointerDown={(e) => startDrag(e, "move")}
              aria-label="Crop area"
            >
              {(["nw", "ne", "sw", "se"] as const).map((corner) => {
                const styleMap: Record<typeof corner, React.CSSProperties> = {
                  nw: { left: -6, top: -6, cursor: "nwse-resize" },
                  ne: { right: -6, top: -6, cursor: "nesw-resize" },
                  sw: { left: -6, bottom: -6, cursor: "nesw-resize" },
                  se: { right: -6, bottom: -6, cursor: "nwse-resize" },
                };
                return (
                  <div
                    key={corner}
                    onPointerDown={(e) => startDrag(e, corner)}
                    className="absolute w-3 h-3 bg-white rounded-sm shadow"
                    style={styleMap[corner]}
                    role="button"
                    aria-label={`${corner} resize handle`}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Image Studio ───────────────────────── */

type OutFmt = "image/jpeg" | "image/png" | "image/webp" | "image/avif";
type Result = { name: string; url: string; blob: Blob };
type ToolId =
  | "convert"
  | "resize"
  | "crop"
  | "rotate"
  | "compress"
  | "watermark"
  | "metadata"
  | "pdf";

const TOOLS: { id: ToolId; label: string }[] = [
  { id: "convert", label: "Convert" },
  { id: "resize", label: "Resize" },
  { id: "crop", label: "Crop" },
  { id: "rotate", label: "Rotate / Flip" },
  { id: "compress", label: "Compress" },
  { id: "watermark", label: "Watermark" },
  { id: "metadata", label: "Strip metadata" },
  { id: "pdf", label: "Images → PDF" },
];

type Picked = { file: File; name: string; url: string };

export default function Client() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function isToolId(t: any): t is ToolId {
    return TOOLS.some((tool) => tool.id === t);
  }

  const [active, setActive] = useState<ToolId>(() => {
    const t = searchParams.get("tool");
    return isToolId(t) ? t : "convert";
  });

  // files
  const [picked, setPicked] = useState<Picked[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const activeLabel = useMemo(
    () => TOOLS.find((t) => t.id === active)?.label ?? "",
    [active],
  );

  // results
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [log, setLog] = useState<string[]>([]);

  // Convert / Compress / Metadata shared options
  const [fmt, setFmt] = useState<OutFmt>("image/jpeg");
  const [quality, setQuality] = useState<number>(0.85);
  const [stripMeta, setStripMeta] = useState<boolean>(true);

  // AVIF feature check
  const [avifOK, setAvifOK] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ok = c.toDataURL("image/avif").startsWith("data:image/avif");
      setAvifOK(ok);
    } catch {
      setAvifOK(false);
    }
  }, []);

  // Resize
  const [resizeMode, setResizeMode] = useState<"exact" | "fit" | "percent">(
    "fit",
  );
  const [resizeW, setResizeW] = useState<number>(1920);
  const [resizeH, setResizeH] = useState<number>(1080);
  const [resizePct, setResizePct] = useState<number>(50);

  // Crop (default = Free)
  const [cropAspect, setCropAspect] = useState<"free" | "1:1" | "4:3" | "16:9">(
    "free",
  );
  const [cropRect, setCropRect] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  }>({
    x: 20,
    y: 20,
    w: 60,
    h: 60,
  });

  // Rotate / flip
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Watermark options (new; defaults match old behavior)
  const [wmText, setWmText] = useState("Generated by Utilixy");
  const [wmPos, setWmPos] = useState<
    "top-left" | "top-right" | "bottom-left" | "bottom-right"
  >("top-right");
  const [wmSize, setWmSize] = useState<number>(16);
  const [wmOpacity, setWmOpacity] = useState<number>(0.45);

  const accept = useMemo(
    () =>
      ["image/jpeg", "image/png", "image/webp", "image/avif", "image/*"].join(
        ",",
      ),
    [],
  );
  const addLog = (m: string) => setLog((p) => [...p, m]);
  const clear = () => {
    setResults([]);
    setLog([]);
  };

  // Sync state when ?tool= changes (e.g., via navbar)
  useEffect(() => {
    const t = searchParams.get("tool");
    if (isToolId(t) && t !== active) {
      setActive(t);
      setActiveIdx(0);
    }
  }, [searchParams, active]);

  const changeTool = (next: ToolId) => {
    setActive(next);
    setActiveIdx(0);
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("tool", next);
    router.replace(`/image-converter?${sp.toString()}`, { scroll: false });
  };

    // uploader
    function onPick(files: File[]) {
    const arr = files.map((f) => ({
      file: f,
      name: f.name.replace(/\.[^.]+$/, ""),
      url: URL.createObjectURL(f),
    }));
    picked.forEach((p) => URL.revokeObjectURL(p.url));
    setPicked(arr);
    setActiveIdx(0);
    setResults([]);
    setLog([]);
  }

  useEffect(() => {
    return () => {
      picked.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helpers
  async function decodeFileToBitmap(file: File): Promise<ImageBitmap> {
    return await createImageBitmap(file);
  }
  async function encodeCanvas(
    canvas: HTMLCanvasElement,
    targetFmt: OutFmt,
    q: number,
  ): Promise<Blob> {
    if (targetFmt === "image/avif" && !avifOK) {
      const { encode } = await import("@jsquash/avif");
      const ctx = canvas.getContext("2d")!;
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const avifBuffer = await encode(img, { quality: Math.round(q * 63) });
      return new Blob([avifBuffer], { type: "image/avif" });
    }
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to encode canvas"))),
        targetFmt,
        targetFmt === "image/png" ? undefined : q,
      );
    });
  }
  function drawOp(
    bmp: ImageBitmap,
    draw: (
      ctx: CanvasRenderingContext2D,
      sw: number,
      sh: number,
    ) => { w: number; h: number },
  ): HTMLCanvasElement {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;
    const sw = bmp.width;
    const sh = bmp.height;
    const { w, h } = draw(ctx, sw, sh);
    c.width = w;
    c.height = h;
    draw(ctx, sw, sh);
    return c;
  }
  function applyResize(sw: number, sh: number): { dw: number; dh: number } {
    if (resizeMode === "percent") {
      const f = Math.max(1, Math.min(100, resizePct)) / 100;
      return {
        dw: Math.max(1, Math.round(sw * f)),
        dh: Math.max(1, Math.round(sh * f)),
      };
    }
    if (resizeMode === "exact") {
      return {
        dw: Math.max(1, Math.round(resizeW)),
        dh: Math.max(1, Math.round(resizeH)),
      };
    }
    const r = Math.min(resizeW / sw, resizeH / sh);
    return {
      dw: Math.max(1, Math.round(sw * r)),
      dh: Math.max(1, Math.round(sh * r)),
    };
  }
  function applyTransform(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.translate(w / 2, h / 2);
    if (flipH) ctx.scale(-1, 1);
    if (flipV) ctx.scale(1, -1);
    ctx.rotate((Math.PI / 180) * rotation);
    ctx.translate(-w / 2, -h / 2);
  }
  function drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const text = wmText;
    ctx.save();
    ctx.globalAlpha = clamp(wmOpacity, 0, 1);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.font = `${wmSize}px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif`;
    const tw = ctx.measureText(text).width;
    const th = wmSize;
    let x = 16,
      y = 16 + th;

    switch (wmPos) {
      case "top-right":
        x = w - tw - 16;
        y = 16 + th;
        break;
      case "bottom-left":
        x = 16;
        y = h - 16;
        break;
      case "bottom-right":
        x = w - tw - 16;
        y = h - 16;
        break;
      // top-left default already set
    }
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  // processing
  const processAll = useCallback(
    async (mode: ToolId) => {
      if (!picked.length) return;
      setBusy(true);
      setResults([]);
      setLog([]);
      try {
        const bitmaps = await Promise.all(
          picked.map((p) => decodeFileToBitmap(p.file)),
        );
        const pdfPages: { dataUrl: string; w: number; h: number }[] = [];

        for (let i = 0; i < picked.length; i++) {
          const bmp = bitmaps[i];

          const canvas = drawOp(bmp, (ctx, sw, sh) => {
            // Crop first
            let sx = 0,
              sy = 0,
              csw = sw,
              csh = sh;
            if (mode === "crop") {
              const rx = clamp(cropRect.x, 0, 100) / 100;
              const ry = clamp(cropRect.y, 0, 100) / 100;
              const rw = clamp(cropRect.w, 1, 100) / 100;
              const rh = clamp(cropRect.h, 1, 100) / 100;
              sx = Math.round(sw * rx);
              sy = Math.round(sh * ry);
              csw = Math.max(1, Math.round(sw * rw));
              csh = Math.max(1, Math.round(sh * rh));
              if (sx + csw > sw) csw = sw - sx;
              if (sy + csh > sh) csh = sh - sy;
            }

            // Resize
            let dw = csw,
              dh = csh;
            if (mode === "resize") {
              const r = applyResize(csw, csh);
              dw = r.dw;
              dh = r.dh;
            }

            // Prepare canvas
            (ctx.canvas as HTMLCanvasElement).width = dw;
            (ctx.canvas as HTMLCanvasElement).height = dh;

            // Rotate / flip
            if (mode === "rotate") {
              applyTransform(ctx, dw, dh);
            }

            // Draw
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(bmp, sx, sy, csw, csh, 0, 0, dw, dh);

            if (mode === "watermark") drawWatermark(ctx, dw, dh);

            return { w: dw, h: dh };
          });

          if (mode === "pdf") {
            const dataUrl = canvas.toDataURL("image/png");
            pdfPages.push({ dataUrl, w: canvas.width, h: canvas.height });
            addLog(`Prepared ${picked[i].name} for PDF`);
            continue;
          }

          // choose output format for convert/compress/metadata
          let outFmt: OutFmt = "image/png";
          let q = 0.92;
          if (
            mode === "convert" ||
            mode === "compress" ||
            mode === "metadata"
          ) {
            outFmt = fmt;
            q = fmt === "image/png" ? 0.92 : quality;
            if (outFmt === "image/avif" && !avifOK) {
              addLog(
                "⚠ AVIF encode not supported natively. Using WebAssembly encoder (slower).",
              );
            }
          }

          // encode (or passthrough for metadata if user unchecked strip)
          let blob: Blob;
          if (mode === "metadata" && !stripMeta) {
            blob = picked[i].file; // keep original, no strip
          } else {
            blob = await encodeCanvas(canvas, outFmt, q);
          }

          const ext =
            outFmt === "image/jpeg"
              ? "jpg"
              : outFmt === "image/webp"
                ? "webp"
                : outFmt === "image/avif"
                  ? "avif"
                  : "png";
          const renamed = `${picked[i].name}-${canvas.width}x${canvas.height}.${ext}`;
          const url = URL.createObjectURL(blob);
          setResults((p) => [...p, { name: renamed, url, blob }]);
          addLog(`✔ ${renamed}`);
        }

        if (mode === "pdf") {
          const { PDFDocument, StandardFonts } = await import("pdf-lib");
          const pdf = await PDFDocument.create();
          const font = await pdf.embedFont(StandardFonts.Helvetica);

          for (const p of pdfPages) {
            const page = pdf.addPage([p.w, p.h]);
            const pngBytes = Uint8Array.from(
              atob(p.dataUrl.split(",")[1]),
              (c) => c.charCodeAt(0),
            );
            const img = await pdf.embedPng(pngBytes);
            page.drawImage(img, { x: 0, y: 0, width: p.w, height: p.h });
            page.drawText("Generated by Utilixy", {
              x: 12,
              y: 12,
              size: 10,
              font,
            });
          }
          const pdfBytes = await pdf.save(); // Uint8Array
          const ab = new ArrayBuffer(pdfBytes.byteLength);
          new Uint8Array(ab).set(pdfBytes);
          const blob = new Blob([ab], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setResults((p) => [...p, { name: "images.pdf", url, blob }]);
          addLog("✔ images.pdf");
        }
      } catch (e: any) {
        console.error(e);
        addLog(`❌ ${e?.message || e}`);
      } finally {
        setBusy(false);
      }
    },
    [
      picked,
      fmt,
      quality,
      stripMeta,
      avifOK,
      resizeMode,
      resizeW,
      resizeH,
      resizePct,
      cropRect.x,
      cropRect.y,
      cropRect.w,
      cropRect.h,
      rotation,
      flipH,
      flipV,
      wmText,
      wmPos,
      wmSize,
      wmOpacity,
    ],
  );

  /* ───────────────────────── UI ───────────────────────── */

  return (
    <section
      data-image
      className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 mt-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 items-start">
        {/* Sidebar (unchanged) */}
        <aside className="card p-3 h-fit hidden md:block">
          <div className="grid gap-1">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                className={`group text-left px-3 py-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--bg)]/70 hover:bg-[color:var(--bg-lift)] transition-colors
                  ${active === t.id ? "ring-2 ring-[color:var(--accent)] ring-offset-1 ring-offset-[color:var(--bg)] bg-[color:var(--bg-lift)] border-[color:var(--accent)]/40" : ""}`}
                onClick={() => changeTool(t.id)}
                aria-current={active === t.id ? "page" : undefined}
              >
                <div className="text-sm">{t.label}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile tool picker (dropdown only; no chip toolbar) */}
        <div className="md:hidden">
          <label className="block text-sm mb-1">Tool</label>
          <select
            className="input w-full"
            value={active}
            onChange={(e) => changeTool(e.target.value as ToolId)}
          >
            {TOOLS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stage */}
        <div className="card p-4">
          {activeLabel && (
            <h2 className="text-2xl font-bold mb-4 text-center text-[#2B67F3]">{activeLabel}</h2>
          )}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Left: preview + thumbs (unchanged) */}
            <div className="order-2 lg:order-1">
              <h3 className="text-sm font-medium mb-2">Live Preview</h3>

              {picked.length > 0 ? (
                <>
                  <CropperInline
                    src={picked[activeIdx].url}
                    rect={cropRect}
                    onChange={setCropRect}
                    aspect={active === "crop" ? "free" : "free"}
                    visible={active === "crop"}
                    previewTransform={{ flipH, flipV, rotate: rotation }}
                    height={420}
                  />

                  {/* Thumbnails */}
                  <div className="mt-3">
                    <div className="text-xs mb-2 text-muted">Selected</div>
                    <div className="flex gap-2 overflow-x-auto">
                      {picked.map((p, i) => (
                        <button
                          key={p.url}
                          onClick={() => setActiveIdx(i)}
                          className={`border rounded overflow-hidden shrink-0 ${i === activeIdx ? "ring-2 ring-blue-500" : "hover:opacity-90"}`}
                          style={{ width: 72, height: 54 }}
                          title={p.name}
                        >
                          <img
                            src={p.url}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="rounded bg-black/20 border border-dashed border-line flex items-center justify-center"
                  style={{ height: 420 }}
                >
                  <p className="text-sm text-muted">
                    Add images using the uploader in the tool panel →
                  </p>
                </div>
              )}
            </div>

            {/* Right: active tool controls (unchanged layout, options added where missing) */}
            <div className="order-1 lg:order-2">
              {active === "convert" && (
                <div className="space-y-4">
                  <ToolHelp>
                    <>
                      <p>
                        <b>Why</b>: Convert images between JPG, PNG, WebP, and
                        AVIF; strip metadata for privacy.
                      </p>
                      <p>
                        <b>How</b>:
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Add images here.</li>
                        <li>Select output format and quality.</li>
                        <li>
                          Click <b>Convert</b>.
                        </li>
                      </ol>
                    </>
                  </ToolHelp>

                  <DropZoneInline
                    accept={accept}
                    multiple
                    onFiles={onPick}
                    label="Images"
                  />

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">
                        Output format
                      </label>
                      <select
                        className="input"
                        value={fmt}
                        onChange={(e) => setFmt(e.target.value as OutFmt)}
                      >
                        <option value="image/jpeg">JPG</option>
                        <option value="image/png">PNG</option>
                        <option value="image/webp">WEBP</option>
                        <option value="image/avif">AVIF</option>
                      </select>
                      {fmt === "image/avif" && !avifOK && (
                        <p className="mt-1 text-xs text-yellow-400">
                          Browser can’t encode AVIF — will fall back to WEBP.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">
                        Quality{" "}
                        {fmt === "image/png"
                          ? "(lossless)"
                          : `(${Math.round(quality * 100)}%)`}
                      </label>
                      <input
                        type="range"
                        min={0.5}
                        max={1}
                        step={0.05}
                        value={quality}
                        disabled={fmt === "image/png"}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={stripMeta}
                        onChange={(e) => setStripMeta(e.target.checked)}
                      />
                      <span className="text-sm">Strip metadata (EXIF)</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="btn"
                      onClick={() => processAll("convert")}
                      disabled={busy || picked.length === 0}
                    >
                      {busy ? "Working…" : "Convert"}
                    </button>
                  </div>
                </div>
              )}

              {active === "resize" && (
                <div className="space-y-4">
                  <ToolHelp>
                    <>
                      <p>
                        <b>Why</b>: Create web-friendly sizes.
                      </p>
                      <p>
                        <b>How</b>: Pick a mode, set size, then click{" "}
                        <b>Resize</b>.
                      </p>
                    </>
                  </ToolHelp>

                  <DropZoneInline
                    accept={accept}
                    multiple
                    onFiles={onPick}
                    label="Images"
                  />

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Mode</label>
                      <select
                        className="input"
                        value={resizeMode}
                        onChange={(e) => setResizeMode(e.target.value as any)}
                      >
                        <option value="fit">Fit within box</option>
                        <option value="exact">Exact size</option>
                        <option value="percent">Percent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Width</label>
                      <input
                        type="number"
                        className="input"
                        value={resizeW}
                        onChange={(e) =>
                          setResizeW(parseInt(e.target.value, 10) || 1)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Height</label>
                      <input
                        type="number"
                        className="input"
                        value={resizeH}
                        onChange={(e) =>
                          setResizeH(parseInt(e.target.value, 10) || 1)
                        }
                      />
                      {resizeMode === "percent" && (
                        <div className="mt-3">
                          <label className="block text-sm mb-1">Percent</label>
                          <input
                            type="range"
                            min={1}
                            max={300}
                            value={resizePct}
                            onChange={(e) =>
                              setResizePct(parseInt(e.target.value, 10))
                            }
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className="btn"
                    onClick={() => processAll("resize")}
                    disabled={busy || picked.length === 0}
                  >
                    {busy ? "Working…" : "Resize"}
                  </button>
                </div>
              )}

              {active === "crop" && (
                <div className="space-y-4">
                  <ToolHelp>
                    <>
                      <p>
                        <b>Why</b>: Trim images to the important region.
                      </p>
                      <p>
                        <b>How</b>: Drag the corners or move the box. Lock
                        aspect if needed.
                      </p>
                    </>
                  </ToolHelp>

                  <DropZoneInline
                    accept={accept}
                    multiple
                    onFiles={onPick}
                    label="Images"
                  />

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Aspect</label>
                      <select
                        className="input"
                        value={cropAspect}
                        onChange={(e) => setCropAspect(e.target.value as any)}
                      >
                        <option value="free">Free</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="4:3">4:3</option>
                        <option value="16:9">16:9</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 flex items-end">
                      <button
                        className="btn-ghost"
                        onClick={() =>
                          setCropRect({ x: 20, y: 20, w: 60, h: 60 })
                        }
                      >
                        Reset crop
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn"
                    onClick={() => processAll("crop")}
                    disabled={busy || picked.length === 0}
                  >
                    {busy ? "Working…" : "Crop"}
                  </button>
                </div>
              )}

              {active === "rotate" && (
                <div className="space-y-4">
                  <ToolHelp>
                    <>
                      <p>
                        <b>Why</b>: Fix orientation or mirror.
                      </p>
                      <p>
                        <b>How</b>: Pick rotation/flip and click <b>Apply</b>.
                      </p>
                    </>
                  </ToolHelp>

                  <DropZoneInline
                    accept={accept}
                    multiple
                    onFiles={onPick}
                    label="Images"
                  />

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Rotation</label>
                      <select
                        className="input"
                        value={rotation}
                        onChange={(e) =>
                          setRotation(parseInt(e.target.value, 10) as any)
                        }
                      >
                        <option value={0}>0°</option>
                        <option value={90}>90°</option>
                        <option value={180}>180°</option>
                        <option value={270}>270°</option>
                      </select>
                    </div>
                    <label className="inline-flex items-center gap-2 mt-7">
                      <input
                        type="checkbox"
                        checked={flipH}
                        onChange={(e) => setFlipH(e.target.checked)}
                      />
                      <span className="text-sm">Flip horizontal</span>
                    </label>
                    <label className="inline-flex items-center gap-2 mt-7">
                      <input
                        type="checkbox"
                        checked={flipV}
                        onChange={(e) => setFlipV(e.target.checked)}
                      />
                      <span className="text-sm">Flip vertical</span>
                    </label>
                  </div>

                  <button
                    className="btn"
                    onClick={() => processAll("rotate")}
                    disabled={busy || picked.length === 0}
                  >
                    {busy ? "Working…" : "Apply"}
                  </button>
                </div>
              )}

              {active === "compress" && (
                <div className="space-y-4">
                  <ToolHelp>
                    <>
                      <p>
                        <b>Why</b>: Smaller files for the web.
                      </p>
                      <p>
                        <b>How</b>: Choose output format/quality, then run{" "}
                        <b>Compress</b>.
                      </p>
                    </>
                  </ToolHelp>

                  <DropZoneInline
                    accept={accept}
                    multiple
                    onFiles={onPick}
                    label="Images"
                  />

                  {/* added controls */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">
                        Output format
                      </label>
                      <select
                        className="input"
                        value={fmt}
                        onChange={(e) => setFmt(e.target.value as OutFmt)}
                      >
                        <option value="image/jpeg">JPG</option>
                        <option value="image/png">PNG</option>
                        <option value="image/webp">WEBP</option>
                        <option value="image/avif">AVIF</option>
                      </select>
                      {fmt === "image/avif" && !avifOK && (
                        <p className="mt-1 text-xs text-yellow-400">
                          Browser can’t encode AVIF — will fall back to WEBP.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-300 mb-1">
                        Quality{" "}
                        {fmt === "image/png"
                          ? "(lossless)"
                          : `(${Math.round(quality * 100)}%)`}
                      </label>
                      <input
                        type="range"
                        min={0.5}
                        max={1}
                        step={0.05}
                        value={quality}
                        disabled={fmt === "image/png"}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <button
                    className="btn"
                    onClick={() => processAll("compress")}
                    disabled={busy || picked.length === 0}
                  >
                    {busy ? "Working…" : "Compress"}
                  </button>
                </div>
              )}

              {active === "watermark" && (
                <div className="space-y-4">
                  <ToolHelp>
                    <>
                      <p>
                        <b>Why</b>: Add a simple text footer mark.
                      </p>
                      <p>
                        <b>How</b>: Set text, position, size, opacity; then
                        click <b>Apply</b>.
                      </p>
                    </>
                  </ToolHelp>

                  <DropZoneInline
                    accept={accept}
                    multiple
                    onFiles={onPick}
                    label="Images"
                  />

                  {/* added controls */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Text</label>
                      <input
                        className="input"
                        value={wmText}
                        onChange={(e) => setWmText(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Position</label>
                      <select
                        className="input"
                        value={wmPos}
                        onChange={(e) => setWmPos(e.target.value as any)}
                      >
                        <option value="top-left">Top-left</option>
                        <option value="top-right">Top-right</option>
                        <option value="bottom-left">Bottom-left</option>
                        <option value="bottom-right">Bottom-right</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Font size (px)
                      </label>
                      <input
                        type="number"
                        className="input"
                        min={8}
                        max={96}
                        value={wmSize}
                        onChange={(e) =>
                          setWmSize(parseInt(e.target.value, 10) || 16)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Opacity ({Math.round(wmOpacity * 100)}%)
                      </label>
                      <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={wmOpacity}
                        onChange={(e) =>
                          setWmOpacity(parseFloat(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <button
                    className="btn"
                    onClick={() => processAll("watermark")}
                    disabled={busy || picked.length === 0}
                  >
                    {busy ? "Working…" : "Apply"}
                  </button>
                </div>
              )}

              {active === "metadata" && (
                <div className="space-y-4">
                  <ToolHelp>
                    <>
                      <p>
                        <b>Why</b>: Remove EXIF (camera/location) for privacy.
                      </p>
                      <p>
                        <b>How</b>: Re-encodes via canvas to strip metadata.
                      </p>
                    </>
                  </ToolHelp>

                  <DropZoneInline
                    accept={accept}
                    multiple
                    onFiles={onPick}
                    label="Images"
                  />

                  {/* added control */}
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={stripMeta}
                      onChange={(e) => setStripMeta(e.target.checked)}
                    />
                    <span className="text-sm">Strip metadata (EXIF)</span>
                  </label>

                  <button
                    className="btn"
                    onClick={() => processAll("metadata")}
                    disabled={busy || picked.length === 0}
                  >
                    {busy ? "Working…" : "Strip"}
                  </button>
                </div>
              )}

              {active === "pdf" && (
                <div className="space-y-4">
                  <ToolHelp>
                    <>
                      <p>
                        <b>Why</b>: Bundle multiple images into a single PDF.
                      </p>
                      <p>
                        <b>How</b>: Add images here in order, then click{" "}
                        <b>Create PDF</b>.
                      </p>
                    </>
                  </ToolHelp>

                  <DropZoneInline
                    accept={accept}
                    multiple
                    onFiles={onPick}
                    label="Images (JPG/PNG/WEBP/AVIF)"
                  />

                  <button
                    className="btn"
                    onClick={() => processAll("pdf")}
                    disabled={busy || picked.length === 0}
                  >
                    {busy ? "Working…" : "Create PDF"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="card p-4 md:col-start-2">
          {" "}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Results</h2>
            <div className="flex gap-2">
              <button className="btn-ghost" onClick={clear}>
                Clear
              </button>
              {results.length > 1 && (
                <button
                  className="btn"
                  onClick={async () => {
                    const JSZip = (await import("jszip")).default;
                    const zip = new JSZip();
                    for (const r of results) {
                      const arr = new Uint8Array(await r.blob.arrayBuffer());
                      zip.file(r.name, arr);
                    }
                    const blob = await zip.generateAsync({ type: "blob" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "images.zip";
                    a.click();
                  }}
                >
                  Download ZIP
                </button>
              )}
            </div>
          </div>
          {results.length === 0 ? (
            <p className="text-sm text-muted mt-2">
              Nothing yet — pick a tool, add images, and run it.
            </p>
          ) : (
            <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
              {results.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  download={r.name}
                  className="block border rounded overflow-hidden"
                >
                  <img src={r.url} alt={r.name} className="block w-full" />
                  <div className="px-2 py-1 text-xs truncate">{r.name}</div>
                </a>
              ))}
            </div>
          )}
          {log.length > 0 && (
            <pre className="mt-4 p-3 bg-black/30 rounded text-xs overflow-auto max-h-60">
              {log.join("\n")}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
