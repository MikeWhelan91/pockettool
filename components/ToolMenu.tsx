'use client';

import Link from 'next/link';

const tools = [
  { href: '/', label: 'Home' },
    { href: '/pdf', label: 'PDF Studio' },
  { href: '/random', label: 'Password & Random Generators' },
  { href: '/qr', label: 'Wi-Fi QR & QR Codes' },
  { href: '/image-converter', label: 'Image Converter (JPG / PNG / WEBP + HEIC)' },
  { href: '/case-converter', label: 'Case Converter' },
  { href: '/format', label: 'JSON / YAML / XML Formatter' },
  { href: '/base64', label: 'Base64 Encoder/Decoder' },
  { href: '/diff', label: 'Text Diff Checker' },
];

export default function ToolMenu({ onClose }: { onClose: () => void }) {
  return (
    <aside
      className="fixed z-50 top-0 left-0 h-dvh w-[300px] bg-[hsl(var(--bg))] border-r border-line shadow-xl"
      role="dialog"
      aria-label="Tools"
    >
      <div className="h-14 flex items-center justify-between px-3 border-b border-line">
        <div className="font-medium">Tools</div>
        <button className="btn-ghost" onClick={onClose} aria-label="Close menu">
          Close
        </button>
      </div>

      <nav className="p-3 space-y-1 text-sm">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block rounded-md px-3 py-2 hover:bg-card no-underline"
            onClick={onClose}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-line p-3 text-xs text-muted">
        © {new Date().getFullYear()} Utilixy
      </div>
    </aside>
  );
}
