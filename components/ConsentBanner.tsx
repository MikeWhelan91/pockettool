'use client';

import { useEffect, useRef, useState } from 'react';

type Consent = 'granted' | 'denied' | null;

export default function ConsentBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [show, setShow] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const v = (localStorage.getItem('pt_consent') as Consent) || null;
    setConsent(v);
    if (!v) setShow(true);
    if (v) applyConsent(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reserve space so the sticky bar doesn't cover bottom content
  useEffect(() => {
    if (!show) {
      document.body.style.paddingBottom = '';
      return;
    }
    const update = () => {
      const h = wrapRef.current?.offsetHeight ?? 0;
      document.body.style.paddingBottom = `${h + 12}px`;
    };
    update();
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      document.body.style.paddingBottom = '';
    };
  }, [show]);

  function applyConsent(v: Exclude<Consent, null>) {
    localStorage.setItem('pt_consent', v);
    setConsent(v);
    setShow(false);

    // Google Consent Mode v2 (safe no-op if gtag not present)
    const gtag = (window as any).gtag as undefined | ((...args: any[]) => void);
    if (gtag) {
      if (v === 'granted') {
        gtag('consent', 'update', {
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          ad_storage: 'granted',
          analytics_storage: 'granted',
        });
      } else {
        // Non-personalized/contextual ads
        gtag('consent', 'update', {
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          ad_storage: 'denied',
          analytics_storage: 'denied',
        });
      }
    }

    // Expose mode for your ad bootstrap
    (window as any).__ads_mode = v === 'granted' ? 'pa' : 'npa';
    if ((window as any).refreshAds) (window as any).refreshAds();
  }

  if (!show) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-x-0 bottom-0 z-50"
      role="dialog"
      aria-live="polite"
      aria-label="Ads & cookies preference"
    >
      <div className="mx-auto container-wrap px-4 pb-[env(safe-area-inset-bottom)]">
        <div className="rounded-t-xl border border-line bg-[hsl(var(--card))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--card))]/85 p-4 md:p-5 shadow-[0_-10px_30px_hsl(var(--bg)/.6)]">
          <div className="text-sm text-muted">
            We use ads to keep tools free. Choose whether to allow <b>personalized</b> ads.
            If you decline, we’ll still show <b>non-personalized</b> ads without tracking cookies.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn" onClick={() => applyConsent('granted')}>
              Allow personalized ads
            </button>
            <button
              className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
              onClick={() => applyConsent('denied')}
            >
              Show non-personalized ads
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
