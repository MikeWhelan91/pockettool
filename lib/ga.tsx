export const GA_MEASUREMENT_ID = 'G-ZWTPWWSGYF';

export function pageview(url: string, title?: string) {
  if (typeof window === 'undefined') return;
  // @ts-ignore - gtag injected by layout.tsx
  window.gtag?.('event', 'page_view', {
    page_title: title || document.title,
    page_location: url,
    page_path: new URL(url, window.location.origin).pathname +
               new URL(url, window.location.origin).search,
  });
}
