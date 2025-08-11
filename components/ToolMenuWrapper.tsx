'use client';

import { useEffect, useState } from 'react';
import ToolMenu from './ToolMenu';

export default function ToolMenuWrapper() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const b = document.body;
    if (open) b.classList.add('overflow-hidden');
    else b.classList.remove('overflow-hidden');
    return () => b.classList.remove('overflow-hidden');
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Hamburger (fixed, compact) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="icon-btn fixed z-40 top-3 left-3"
      >
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {open && <ToolMenu onClose={() => setOpen(false)} />}
    </>
  );
}
