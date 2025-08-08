'use client';
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const tools = [
  { href: "/", label: "Home" },
  { href: "/random", label: "Password & Random Generators" },
  { href: "/qr", label: "Wi-Fi QR & QR Codes" },
  { href: "/pdf", label: "PDF Tools" },
  { href: "/image-converter", label: "Image Converter (JPG / PNG / WEBP + HEIC)" },
  { href: "/case-converter", label: "Case Converter" },
  { href: "/format", label: "JSON / XML Formatter" },
  { href: "/base64", label: "Base64 Encoder/Decoder" },
  { href: "/diff", label: "Text Diff Checker" },
];

const ToolMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <>
      {/* Hamburger always visible */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed top-4 left-4 z-50 p-2 rounded bg-neutral-800 hover:bg-neutral-700 focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Dim background only when menu is open */}
      {open && <div className="fixed inset-0 z-40 bg-black/70" />}

      {/* Sidebar slides in/out — always hidden initially */}
      <div
        ref={menuRef}
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-neutral-900 border-r border-neutral-800 transform transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-neutral-800 text-lg font-bold">🧰 Tools</div>
        <ul className="p-4 space-y-2">
          {tools.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="block py-2 px-4 rounded hover:bg-neutral-800"
                onClick={() => setOpen(false)}
              >
                {tool.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ToolMenu;
