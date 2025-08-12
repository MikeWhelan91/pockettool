"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import UtilixyLogo from "@/components/branding/UtilixyLogo";

const nav = [
  { href: "/", label: "Home" },
  { href: "/qr", label: "QR" },
  { href: "/image-converter", label: "Images" },
  { href: "/pdf", label: "PDF" },
  { href: "/formatter", label: "Formatter" },
  { href: "/diff", label: "Diff" },
  { href: "/random", label: "Random" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--stroke)] bg-[color:var(--bg)]/80 backdrop-blur">
      {/* On mobile: 3-col grid (menu | logo | spacer) so logo can be centered.
          On md+: switch to flex with justify-between */}
      <div className="container-pk h-14 grid grid-cols-3 items-center md:flex md:items-center md:justify-between">
        {/* Mobile: hamburger (left) */}
        <button
          className="btn-ghost justify-self-start md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((s) => !s)}
        >
          {/* icon is nicer than “Menu” text */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Brand — centered on mobile (col 2), left-aligned on md+ */}
        <Link
          href="/"
          className="col-start-2 justify-self-center md:col-auto md:justify-self-start flex items-center gap-2 no-underline"
          aria-label="Utilixy home"
        >
          <UtilixyLogo className="h-7 w-auto text-[color:var(--brand)]" aria-hidden="true" />
          <span className="font-extrabold tracking-tight">Utilixy</span>
        </Link>

        {/* Spacer on mobile to balance grid; hidden on md since we switch to flex */}
        <div className="justify-self-end md:hidden" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {nav.map((n) => {
            const active = path === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  active
                    ? "bg-[color:var(--bg-lift)] text-white border border-[color:var(--stroke)]"
                    : "text-[color:var(--text-muted)] hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions (right) */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/privacy" className="text-sm text-[color:var(--text-muted)] hover:text-white">
            Privacy
          </Link>
          <Link href="/cookies" className="text-sm text-[color:var(--text-muted)] hover:text-white">
            Cookies
          </Link>
        </div>
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
                className={`px-3 py-2 rounded-lg ${
                  path === n.href
                    ? "bg-[color:var(--bg-lift)] border border-[color:var(--stroke)]"
                    : "hover:bg-[color:var(--bg-lift)]"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <Link href="/privacy" className="text-sm text-[color:var(--text-muted)] hover:text-white">
                Privacy
              </Link>
              <span className="text-[color:var(--text-muted)]">•</span>
              <Link href="/cookies" className="text-sm text-[color:var(--text-muted)] hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
