// components/DesktopToolsNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

const PDF_TOOLS: { key: string; label: string }[] = [
  { key: "batchMerge", label: "Merge" },
  { key: "reorder", label: "Reorder / Delete" },
  { key: "rotate", label: "Rotate Pages" },
  { key: "imagesToPdf", label: "Images → PDF" },
  { key: "pdfToImages", label: "PDF → Images" },
  { key: "extractText", label: "Extract Text" },
  { key: "fillFlatten", label: "Fill & Flatten" },
  { key: "redact", label: "Redact" },
  { key: "watermark", label: "Stamp" },
  { key: "split", label: "Split" },
  { key: "stampQR", label: "Stamp QR" },
  { key: "meta", label: "Edit Metadata" },
  { key: "compress", label: "Compress" },
  { key: "docToPdf", label: "Word → PDF" },
  { key: "pdfToDoc", label: "PDF → Word" },
];

const IMAGE_TOOLS: { key: string; label: string }[] = [
  { key: "convert", label: "Convert" },
  { key: "resize", label: "Resize" },
  { key: "crop", label: "Crop" },
  { key: "rotate", label: "Rotate / Flip" },
  { key: "compress", label: "Compress" },
  { key: "watermark", label: "Watermark" },
  { key: "metadata", label: "Strip metadata" },
  { key: "pdf", label: "Images → PDF" },
];

function NavLink({
  href,
  label,
  active,
  className = "",
}: {
  href: string;
  label: string;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "px-3 py-1.5 rounded-md text-base font-semibold transition-colors duration-150",
        "hover:bg-[#2B67F3] hover:text-white",
        active ? "bg-[#2B67F3] text-white" : "text-[#2B67F3]",
        className,
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function DesktopToolsNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const onPdf = pathname?.startsWith("/pdf");
  const onImages = pathname?.startsWith("/image-converter");

  const [pdfOpen, setPdfOpen] = React.useState(false);
  const [imageOpen, setImageOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);

  // small delay before closing menus to avoid flicker when moving cursor
  const pdfTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = (ref: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  };

  const openWith = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  ) => () => {
    clearTimer(timerRef);
    setter(true);
  };

  const closeWith = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  ) => () => {
    clearTimer(timerRef);
    timerRef.current = setTimeout(() => setter(false), 100);
  };

  const pdfRef = React.useRef<HTMLDivElement | null>(null);
  const imageRef = React.useRef<HTMLDivElement | null>(null);
  const moreRef = React.useRef<HTMLDivElement | null>(null);

  // Detect “desktop hover” capability
  const [canHover, setCanHover] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setCanHover(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Close on outside click / Esc
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (pdfRef.current && !pdfRef.current.contains(e.target as Node)) setPdfOpen(false);
      if (imageRef.current && !imageRef.current.contains(e.target as Node)) setImageOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPdfOpen(false);
        setImageOpen(false);
        setMoreOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <nav className="hidden md:flex ml-auto items-center gap-1">
      {/* PDF */}
      <div
        ref={pdfRef}
        className="relative inline-block"
        // Hover only on desktop; mobile/tablet uses click
        onMouseEnter={canHover ? openWith(setPdfOpen, pdfTimer) : undefined}
        onMouseLeave={canHover ? closeWith(setPdfOpen, pdfTimer) : undefined}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={pdfOpen}
          onClick={!canHover ? () => setPdfOpen((v) => !v) : undefined}
          className={[
            "px-3 py-1.5 rounded-md text-base font-semibold transition-colors duration-150",
            "hover:bg-[#2B67F3] hover:text-white",
            onPdf ? "bg-[#2B67F3] text-white" : "text-[#2B67F3]",
            "inline-flex items-center gap-1",
          ].join(" ")}
        >
          PDF
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 translate-y-px" fill="currentColor">
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
          </svg>
        </button>

        {/* Menu (kept inside same wrapper → no hover gap) */}
        <div
          role="menu"
          aria-hidden={!pdfOpen}
          className={[
            "absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[3000]",
            "rounded-xl p-2 glass",
            "min-w-[18rem] max-h-[70vh] overflow-auto",
            "grid grid-cols-1 sm:grid-cols-2 gap-1",
            pdfOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1",
            "transition ease-out duration-150",
          ].join(" ")}
        >
          <Link
            href="/pdf"
            role="menuitem"
            className="block w-full whitespace-nowrap px-3 py-2 rounded-lg text-base font-semibold hover:bg-[#2B67F3] hover:text-white"
            onClick={() => setPdfOpen(false)}
          >
            PDF Home
          </Link>
          {PDF_TOOLS.map((t) => (
            <Link
              key={t.key}
              href={`/pdf?tool=${encodeURIComponent(t.key)}`}
              role="menuitem"
              className="block w-full whitespace-nowrap px-3 py-2 rounded-lg text-base font-semibold hover:bg-[#2B67F3] hover:text-white"
              onClick={() => setPdfOpen(false)}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Images */}
      <div
        ref={imageRef}
        className="relative inline-block"
        onMouseEnter={canHover ? openWith(setImageOpen, imageTimer) : undefined}
        onMouseLeave={canHover ? closeWith(setImageOpen, imageTimer) : undefined}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={imageOpen}
          onClick={!canHover ? () => setImageOpen((v) => !v) : undefined}
          className={[
            "px-3 py-1.5 rounded-md text-base font-semibold transition-colors duration-150",
            "hover:bg-[#2B67F3] hover:text-white",
            onImages ? "bg-[#2B67F3] text-white" : "text-[#2B67F3]",
            "inline-flex items-center gap-1",
          ].join(" ")}
        >
          Images
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 translate-y-px" fill="currentColor">
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
          </svg>
        </button>

        <div
          role="menu"
          aria-hidden={!imageOpen}
          className={[
            "absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[3000]",
            "rounded-xl p-2 glass",
            "min-w-[18rem] max-h-[70vh] overflow-auto",
            "grid grid-cols-1 sm:grid-cols-2 gap-1",
            imageOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1",
            "transition ease-out duration-150",
          ].join(" ")}
        >
          <Link
            href="/image-converter"
            role="menuitem"
            className="block w-full whitespace-nowrap px-3 py-2 rounded-lg text-base font-semibold hover:bg-[#2B67F3] hover:text-white"
            onClick={() => setImageOpen(false)}
          >
            Image Home
          </Link>
          {IMAGE_TOOLS.map((t) => (
            <Link
              key={t.key}
              href={`/image-converter?tool=${encodeURIComponent(t.key)}`}
              role="menuitem"
              className="block w-full whitespace-nowrap px-3 py-2 rounded-lg text-base font-semibold hover:bg-[#2B67F3] hover:text-white"
              onClick={() => setImageOpen(false)}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main links */}
      <NavLink href="/random" label="Passwords" active={isActive("/random")} />
      <NavLink href="/qr" label="QR" active={isActive("/qr")} />
      <NavLink href="/format" label="Format" active={isActive("/format")} />

      {/* Extra tools inline on xl+ */}
      <NavLink href="/case-converter" label="Case" active={isActive("/case-converter")} className="hidden xl:inline-flex" />
      <NavLink href="/base64" label="Base64" active={isActive("/base64")} className="hidden xl:inline-flex" />
      <NavLink href="/diff" label="Diff" active={isActive("/diff")} className="hidden xl:inline-flex" />
      <NavLink href="/regex" label="Regex" active={isActive("/regex")} className="hidden xl:inline-flex" />

      {/* More (same hover/click rules) */}
      <div
        ref={moreRef}
        className="relative inline-block xl:hidden"
        onMouseEnter={canHover ? openWith(setMoreOpen, moreTimer) : undefined}
        onMouseLeave={canHover ? closeWith(setMoreOpen, moreTimer) : undefined}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={moreOpen}
          onClick={!canHover ? () => setMoreOpen((v) => !v) : undefined}
          className="px-3 py-1.5 rounded-md text-base font-semibold transition-colors duration-150 text-[#2B67F3] hover:bg-[#2B67F3] hover:text-white inline-flex items-center gap-1"
        >
          More
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 translate-y-px" fill="currentColor">
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
          </svg>
        </button>

        <div
          role="menu"
          aria-hidden={!moreOpen}
          className={[
            "absolute right-0 top-full mt-2 z-[3000]",
            "rounded-xl p-2 glass",
            "min-w-[12rem] grid gap-1",
            moreOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1",
            "transition ease-out duration-150",
          ].join(" ")}
        >
          <Link href="/case-converter" role="menuitem" className="px-3 py-2 rounded-lg text-base font-semibold hover:bg-[#2B67F3] hover:text-white" onClick={() => setMoreOpen(false)}>
            Case
          </Link>
          <Link href="/base64" role="menuitem" className="px-3 py-2 rounded-lg text-base font-semibold hover:bg-[#2B67F3] hover:text-white" onClick={() => setMoreOpen(false)}>
            Base64
          </Link>
          <Link href="/diff" role="menuitem" className="px-3 py-2 rounded-lg text-base font-semibold hover:bg-[#2B67F3] hover:text-white" onClick={() => setMoreOpen(false)}>
            Diff
          </Link>
          <Link href="/regex" role="menuitem" className="px-3 py-2 rounded-lg text-base font-semibold hover:bg-[#2B67F3] hover:text-white" onClick={() => setMoreOpen(false)}>
            Regex
          </Link>
        </div>
      </div>
    </nav>
  );
}
