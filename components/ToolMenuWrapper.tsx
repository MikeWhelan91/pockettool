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
      {/* hamburger – now uses high-contrast header-action */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed z-40 top-3 left-3 header-action"
      >
        <span aria-hidden>☰</span>
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
