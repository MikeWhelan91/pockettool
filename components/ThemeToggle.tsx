'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // initial from localStorage or OS
    const saved = localStorage.getItem('pk_theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const light = saved ? saved === 'light' : prefersLight;
    setIsLight(light);
    document.documentElement.classList.toggle('theme-light', light);
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle('theme-light', next);
    localStorage.setItem('pk_theme', next ? 'light' : 'dark');
  }

  return (
    <button
      onClick={toggle}
      className="btn-ghost flex items-center gap-2"
      aria-label="Toggle theme"
      title={isLight ? 'Switch to dark' : 'Switch to light'}
    >
      {isLight ? <Moon size={16}/> : <Sun size={16}/>}
      <span className="hidden sm:inline">{isLight ? 'Dark' : 'Light'}</span>
    </button>
  );
}
