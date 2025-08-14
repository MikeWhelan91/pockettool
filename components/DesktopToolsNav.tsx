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
  { key: "watermark", label: "Numbers / Header / Footer / Watermark" },
  { key: "split", label: "Split" },
  { key: "stampQR", label: "Stamp QR" },
  { key: "meta", label: "Edit Metadata" },
  { key: "compress", label: "Compress" },
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

  return (
    <nav className="hidden md:flex ml-auto items-center gap-1">
      {/* PDF with polished, centered dropdown */}
      <div
        className={[
          "relative inline-block group/pdf",
          // hover bridge to avoid flicker between trigger and panel
          "after:content-[''] after:absolute after:left-0 after:right-0 after:top-full after:h-3",
        ].join(" ")}
      >
        <Link
          href="/pdf"
          className={[
            "px-3 py-1.5 rounded-md text-base font-semibold transition-colors duration-150",
            "hover:bg-[#2B67F3] hover:text-white",
            onPdf ? "bg-[#2B67F3] text-white" : "text-[#2B67F3]",
          ].join(" ")}
        >
          PDF
        </Link>

        <div
          role="menu"
          className={[
            // centered under the PDF tab
            "absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[3000]",
            // frosted panel
            "rounded-xl p-2 ring-1 ring-[color:var(--line)]",
            "bg-[color:var(--bg)]/92 backdrop-blur-md shadow-2xl",
            // layout
            "min-w-[18rem] max-h-[70vh] overflow-auto",
            "grid grid-cols-1 sm:grid-cols-2 gap-1",
            // show/hide
            "opacity-0 invisible translate-y-1 transition ease-out duration-150",
            "group-hover/pdf:opacity-100 group-hover/pdf:visible group-hover/pdf:translate-y-0",
            "focus-within:opacity-100 focus-within:visible focus-within:translate-y-0",
          ].join(" ")}
        >
          {PDF_TOOLS.map((t) => (
            <Link
              key={t.key}
              href={`/pdf?tool=${encodeURIComponent(t.key)}`}
              role="menuitem"
              className={[
                "block w-full whitespace-nowrap",
                "px-3 py-2 rounded-lg text-base font-semibold",
                "hover:bg-[#2B67F3] hover:text-white",
              ].join(" ")}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Other main links */}
      <NavLink href="/image-converter" label="Images" active={isActive("/image-converter")} />
      <NavLink href="/random" label="Passwords" active={isActive("/random")} />
      <NavLink href="/qr" label="QR" active={isActive("/qr")} />
      <NavLink href="/format" label="Format" active={isActive("/format")} />

      {/* Extra tools inline on xl+; otherwise use your mobile menu */}
      <NavLink href="/case-converter" label="Case" active={isActive("/case-converter")} className="hidden xl:inline-flex" />
      <NavLink href="/base64" label="Base64" active={isActive("/base64")} className="hidden xl:inline-flex" />
      <NavLink href="/diff" label="Diff" active={isActive("/diff")} className="hidden xl:inline-flex" />
      <NavLink href="/regex" label="Regex" active={isActive("/regex")} className="hidden xl:inline-flex" />
    </nav>
  );
}
