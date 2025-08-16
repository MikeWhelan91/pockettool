"use client";

import { useEffect, useRef, useState } from "react";

type RectPct = { x: number; y: number; w: number; h: number }; // each 0..100

type Props = {
  src: string;
  /** show the overlay (masks, box, handles). If false, acts as plain live preview container */
  visible?: boolean;
  /** fixed aspect: "free" | "1:1" | "4:3" | "16:9" */
  aspect?: "free" | "1:1" | "4:3" | "16:9";
  /** crop rect in percentages */
  rect?: RectPct;
  /** notify on rect change */
  onChange?: (r: RectPct) => void;
  /** transform preview */
  previewTransform?: { flipH: boolean; flipV: boolean; rotate: 0 | 90 | 180 | 270 };
  /** CSS height of the preview box */
  height?: number; // default 420
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function ratioFrom(aspect: Props["aspect"]) {
  if (!aspect || aspect === "free") return undefined;
  const [aw, ah] = aspect.split(":").map((v) => parseInt(v, 10));
  return aw / ah;
}

export default function Cropper({
  src,
  visible = true,
  aspect = "1:1",
  rect,
  onChange,
  previewTransform = { flipH: false, flipV: false, rotate: 0 },
  height = 420,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [r, setR] = useState<RectPct>(rect ?? { x: 20, y: 20, w: 60, h: 60 });
  useEffect(() => {
    if (rect) setR(rect);
  }, [rect?.x, rect?.y, rect?.w, rect?.h]);
  useEffect(() => {
    onChange?.(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r.x, r.y, r.w, r.h]);

  // prevent blue selection flash while dragging
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

  const ratio = ratioFrom(aspect);

  // Pointer drag state (handles vs move)
  const dragRef = useRef<{
    type: "move" | "nw" | "ne" | "sw" | "se" | null;
    startX: number;
    startY: number;
    startRect: RectPct;
  } | null>(null);

  function pctFromPointer(e: PointerEvent | React.PointerEvent) {
    const wrap = wrapRef.current!;
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: clamp(x, 0, 100), y: clamp(y, 0, 100) };
  }

  function startDrag(e: React.PointerEvent, type: "move" | "nw" | "ne" | "sw" | "se") {
    e.preventDefault();
    // VERY IMPORTANT: stop corner drag bubbling so it doesn't trigger move
    e.stopPropagation();
    const pt = pctFromPointer(e);
    dragRef.current = { type, startX: pt.x, startY: pt.y, startRect: { ...r } };
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
      setR({ ...r, x: nx, y: ny });
      return;
    }

    // resize from a corner
    let nx = startRect.x;
    let ny = startRect.y;
    let nw = startRect.w;
    let nh = startRect.h;

    if (type === "nw") {
      // move left/top edges
      const rx = clamp(startRect.x + dx, 0, startRect.x + startRect.w - 1);
      const ry = clamp(startRect.y + dy, 0, startRect.y + startRect.h - 1);
      nw = startRect.w + (startRect.x - rx);
      nh = startRect.h + (startRect.y - ry);
      nx = rx;
      ny = ry;
    } else if (type === "ne") {
      // move right/top edges
      const ry = clamp(startRect.y + dy, 0, startRect.y + startRect.h - 1);
      nw = clamp(startRect.w + dx, 1, 100 - startRect.x);
      nh = startRect.h + (startRect.y - ry);
      ny = ry;
    } else if (type === "sw") {
      // move left/bottom edges
      const rx = clamp(startRect.x + dx, 0, startRect.x + startRect.w - 1);
      nw = startRect.w + (startRect.x - rx);
      nx = rx;
      nh = clamp(startRect.h + dy, 1, 100 - startRect.y);
    } else if (type === "se") {
      // move right/bottom edges
      nw = clamp(startRect.w + dx, 1, 100 - startRect.x);
      nh = clamp(startRect.h + dy, 1, 100 - startRect.y);
    }

    // lock aspect if requested
    if (ratio) {
      const boxRatio = nw / nh;
      if (boxRatio > ratio) {
        // too wide; shrink width
        nw = nh * ratio;
      } else {
        // too tall; shrink height
        nh = nw / ratio;
      }
      // keep inside container
      nw = Math.min(nw, 100 - nx);
      nh = Math.min(nh, 100 - ny);
    }

    // minimum size 1%
    nw = Math.max(1, nw);
    nh = Math.max(1, nh);

    setR({ x: nx, y: ny, w: nw, h: nh });
  }

  function endDrag(e: PointerEvent) {
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
      className="relative rounded bg-black/20 overflow-hidden select-none" // select-none = user-select: none
      style={{ height, touchAction: "none" }} // touchAction: none -> smoother touch/pointer
    >
      {/* Image container with transforms */}
      <div className="absolute inset-0 origin-center" style={{ transform }}>
        <img
          ref={imgRef}
          src={src}
          alt="preview"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          draggable={false}
        />

        {/* Hide overlay when not visible (e.g. on Rotate tool) */}
        {visible && (
          <>
            {/* outside masks */}
            <div className="absolute bg-black/40 pointer-events-none" style={{ left: 0, top: 0, width: `${r.x}%`, height: "100%" }} />
            <div className="absolute bg-black/40 pointer-events-none" style={{ left: `${r.x + r.w}%`, top: 0, right: 0, height: "100%" }} />
            <div className="absolute bg-black/40 pointer-events-none" style={{ left: `${r.x}%`, top: 0, width: `${r.w}%`, height: `${r.y}%` }} />
            <div className="absolute bg-black/40 pointer-events-none" style={{ left: `${r.x}%`, top: `${r.y + r.h}%`, width: `${r.w}%`, bottom: 0 }} />

            {/* crop box */}
            <div
              className="absolute border-2 border-blue-500"
              style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
              onPointerDown={(e) => startDrag(e, "move")}
              aria-label="Crop area"
            >
              {/* corner handles */}
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
                    onPointerDown={(e) => startDrag(e, corner)} // stopPropagation inside startDrag
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
