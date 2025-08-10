'use client';

import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark';
const STORAGE_KEY = 'pk_theme';

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode | undefined>(undefined);

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Mode | null;
    const prefersDark =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial: Mode = saved ?? (prefersDark ? 'dark' : 'light');
    setMode(initial);
    document.documentElement.classList.toggle('theme-dark', initial === 'dark');
  }, []);

  if (!mode) return null;

  const next: Mode = mode === 'dark' ? 'light' : 'dark';
  const label = mode === 'dark' ? '🌙 Dark' : '☀️ Light';

  function toggle() {
    const m: Mode = mode === 'dark' ? 'light' : 'dark';
    setMode(m);
    document.documentElement.classList.toggle('theme-dark', m === 'dark');
    localStorage.setItem(STORAGE_KEY, m);
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme" className="header-action" title={`Switch to ${next} mode`}>
      {label}
    </button>
  );
}
