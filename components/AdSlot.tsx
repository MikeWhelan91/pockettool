'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const PUBLISHER_ID = 'ca-pub-1257499604453174';
const CONSENT_KEY = 'pt_consent';

type Props = {
  /** Your AdSense slot id, e.g. "1234567890" */
  slotId: string;
  className?: string;
  style?: React.CSSProperties;
  /** 'auto' | 'fluid' | 'rectangle' — default 'auto' */
  format?: 'auto' | 'fluid' | 'rectangle';
  /** default true */
  responsive?: boolean;
  /** Use IntersectionObserver — default true */
  lazy?: boolean;
  /** Reserve space to avoid CLS — default 90 */
  minHeight?: number;
};

export default function Adsense({
  slotId,
  className,
  style,
  format = 'auto',
  responsive = true,
  lazy = true,
  minHeight = 90,
}: Props) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Require consent
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent !== 'yes') return;

    // Ensure script exists (works even if you already added it in <head>)
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`;
    const hasScript = !!document.querySelector(`script[src="${src}"]`);
    if (!hasScript) {
      const s = document.createElement('script');
      s.async = true;
      s.src = src;
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
    }

    const el = ref.current;
    if (!el) return;

    const push = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* noop */
      }
    };

    // Lazy load
    if (lazy && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            push();
            io.disconnect();
          }
        },
        { rootMargin: '200px 0px' }
      );
      io.observe(el);
      return () => io.disconnect();
    } else {
      push();
    }
  }, [slotId, lazy]);

  return (
    <ins
      ref={ref as any}
      className={`adsbygoogle ${className ?? ''}`}
      style={{ display: 'block', width: '100%', minHeight, ...(style || {}) }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
