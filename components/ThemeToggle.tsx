'use client';

import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark';
const STORAGE_KEY = 'utilixy_theme';

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
  const icon = mode === 'dark' ? '🌙' : '☀️';

  function toggle() {
    const m: Mode = mode === 'dark' ? 'light' : 'dark';
    setMode(m);
    document.documentElement.classList.toggle('theme-dark', m === 'dark');
    localStorage.setItem(STORAGE_KEY, m);
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      className="theme-chip"
      title={`Switch to ${next} mode`}
    >
      <span aria-hidden>{icon}</span>
      <span className="theme-chip__label">{mode === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
