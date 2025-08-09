'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/qr', label: 'QR' },
  { href: '/image-converter', label: 'Images' },
  { href: '/pdf', label: 'PDF' },
  { href: '/formatter', label: 'Formatter' },
  { href: '/diff', label: 'Diff' },
  { href: '/random', label: 'Random' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--stroke)] bg-[color:var(--bg)]/80 backdrop-blur">
      <div className="container-pk h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl leading-none">🧰</span>
          <span className="font-extrabold tracking-tight">
            Pocket<span className="text-[color:var(--brand)]">Kit</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {nav.map((n) => {
            const active = path === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3 py-1.5 rounded-lg text-sm
                  ${active ? 'bg-[color:var(--bg-lift)] text-white border border-[color:var(--stroke)]' : 'text-[color:var(--text-muted)] hover:text-white'}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/privacy" className="text-sm text-[color:var(--text-muted)] hover:text-white">Privacy</Link>
          <Link href="/cookies" className="text-sm text-[color:var(--text-muted)] hover:text-white">Cookies</Link>
          <button className="md:hidden" />
        </div>

        {/* Mobile */}
        <button className="md:hidden btn-ghost" onClick={() => setOpen((s) => !s)}>
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[color:var(--stroke)] bg-[color:var(--bg)]">
          <div className="container-pk py-3 grid gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-lg ${path === n.href ? 'bg-[color:var(--bg-lift)] border border-[color:var(--stroke)]' : 'hover:bg-[color:var(--bg-lift)]'}`}
              >
                {n.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <Link href="/privacy" className="text-sm text-[color:var(--text-muted)] hover:text-white">Privacy</Link>
              <span className="text-[color:var(--text-muted)]">•</span>
              <Link href="/cookies" className="text-sm text-[color:var(--text-muted)] hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
