export const GA_MEASUREMENT_ID = 'G-ZWTPWWSGYF';

export function pageview(url: string, title?: string) {
  if (typeof window === 'undefined') return;
  // gtag is created by your <Script> tags in layout.tsx
  // @ts-ignore
  window.gtag?.('event', 'page_view', {
    page_title: title || document.title,
    page_location: url,
    page_path: new URL(url, window.location.origin).pathname + new URL(url, window.location.origin).search,
  });
}
