"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
        "px-3 py-1.5 rounded-md text-sm font-bold transition-colors duration-150",
        "hover:bg-[#2B67F3] hover:text-white",
        active ? "bg-[#2B67F3] text-white" : "text-blue-500",
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

  return (
    // hidden on mobile, shown on md+
    <nav className="hidden md:flex ml-auto items-center gap-1">
      {/* Always visible */}
      <div className="relative group">
        <NavLink href="/pdf" label="PDF" active={isActive("/pdf")} />
        {/* PDF dropdown */}
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col bg-[color:var(--bg)] border border-[color:var(--line)] rounded-lg shadow-lg z-[3000] p-1 min-w-[180px]"
        >
          <Link href="/pdf?tool=reorder" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Reorder
          </Link>
          <Link href="/pdf?tool=watermark" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Watermark
          </Link>
          <Link href="/pdf?tool=imagesToPdf" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Images → PDF
          </Link>
          <Link href="/pdf?tool=pdfToImages" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            PDF → Images
          </Link>
          <Link href="/pdf?tool=extractText" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Extract Text
          </Link>
          <Link href="/pdf?tool=fillFlatten" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Fill & Flatten
          </Link>
          <Link href="/pdf?tool=redact" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Redact
          </Link>
          <Link href="/pdf?tool=split" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Split
          </Link>
          <Link href="/pdf?tool=stampQR" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Stamp QR
          </Link>
          <Link href="/pdf?tool=batchMerge" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Merge
          </Link>
          <Link href="/pdf?tool=compress" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Compress
          </Link>
          <Link href="/pdf?tool=rotate" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Rotate
          </Link>
          <Link href="/pdf?tool=sign" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Sign
          </Link>
          <Link href="/pdf?tool=meta" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Metadata
          </Link>
        </div>
      </div>

      <NavLink href="/image-converter" label="Images" active={isActive("/image-converter")} />
      <NavLink href="/random" label="Passwords" active={isActive("/random")} />
      <NavLink href="/qr" label="QR" active={isActive("/qr")} />
      <NavLink href="/format" label="Format" active={isActive("/format")} />

      {/* Extra tools: show as normal links on xl+, hidden on lg/md */}
      <NavLink href="/case-converter" label="Case" active={isActive("/case-converter")} className="hidden xl:inline-flex" />
      <NavLink href="/base64" label="Base64" active={isActive("/base64")} className="hidden xl:inline-flex" />
      <NavLink href="/diff" label="Diff" active={isActive("/diff")} className="hidden xl:inline-flex" />
      <NavLink href="/regex" label="Regex" active={isActive("/regex")} className="hidden xl:inline-flex" />

      {/* “More” only for md/lg; hidden on xl because all items are shown */}
      <div
        className={[
          "relative inline-block group/menu xl:hidden",
          "after:content-[''] after:absolute after:left-0 after:right-0 after:top-full after:h-3",
        ].join(" ")}
      >
        <button
          type="button"
          className="px-3 py-1.5 rounded-md text-sm font-bold transition-colors duration-150 hover:bg-[#2B67F3] hover:text-white flex items-center gap-1"
          aria-haspopup="menu"
        >
          More <span aria-hidden>▾</span>
        </button>

        <div
          role="menu"
          className={[
            "absolute left-0 top-full mt-2 -ml-3",
            "inline-flex flex-col items-stretch",
            "rounded-lg p-1 text-left",
            "bg-[color:var(--bg)] ring-1 ring-[color:var(--line)] shadow-lg",
            "z-[3000]",
            "opacity-0 invisible translate-y-1",
            "group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-0",
            "focus-within:opacity-100 focus-within:visible focus-within:translate-y-0",
            "transition ease-out duration-150",
          ].join(" ")}
        >
          <Link href="/case-converter" role="menuitem" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Case
          </Link>
          <Link href="/base64" role="menuitem" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Base64
          </Link>
          <Link href="/diff" role="menuitem" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Diff
          </Link>
          <Link href="/regex" role="menuitem" className="px-3 py-2 text-sm font-bold hover:bg-[#2B67F3] hover:text-white rounded-md">
            Regex
          </Link>
        </div>
      </div>
    </nav>
  );
}
