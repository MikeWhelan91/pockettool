'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const tools = [
  { href: '/', label: 'Home' },
  { href: '/random', label: 'Password & Random Generators' },
  { href: '/qr', label: 'Wi-Fi QR & QR Codes' },
  { href: '/pdf', label: 'PDF Tools' },
  { href: '/image-converter', label: 'Image Converter (JPG / PNG / WEBP + HEIC)' },
  { href: '/case-converter', label: 'Case Converter' },
  { href: '/format', label: 'JSON / YAML / XML Formatter' },
  { href: '/base64', label: 'Base64 Encoder/Decoder' },
  { href: '/diff', label: 'Text Diff Checker' },
];

export default function ToolMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed top-4 left-4 z-[60] p-2 rounded-lg border
                   border-[color:var(--stroke)]
                   bg-[color:var(--bg-soft)]
                   text-[color:var(--text)]
                   hover:bg-[color:var(--bg-lift)]
                   focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/40"
        aria-label="Toggle menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        ref={menuRef}
        className={`fixed z-50 top-0 left-0 h-full w-80 max-w-[88vw]
                    border-r border-[color:var(--stroke)]
                    bg-[color:var(--bg-soft)] text-[color:var(--text)]
                    shadow-[0_10px_40px_rgba(0,0,0,.35)]
                    transform transition-transform duration-200 ease-in-out
                    ${open ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Tools"
      >
        <div className="h-14 px-4 flex items-center gap-2 border-b border-[color:var(--stroke)]">
          <span aria-hidden>🧰</span>
          <strong>Pocket<span className="text-[color:var(--brand)]">Kit</span></strong>
          <button
            className="ml-auto btn-ghost"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <nav className="p-4">
          <div className="text-sm font-semibold mb-2 text-white/60">Tools</div>
          <ul className="space-y-1">
            {tools.map(t => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="block px-3 py-2 rounded-md
                             text-[color:var(--text)]
                             hover:bg-[color:var(--bg-lift)]"
                  onClick={() => setOpen(false)}
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-4 text-xs text-white/50 border-t border-[color:var(--stroke)]">
          © {new Date().getFullYear()} PocketKit
        </div>
      </aside>
    </>
  );
}
