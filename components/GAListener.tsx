'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/ga';

export default function GAListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = `${window.location.origin}${pathname}${searchParams?.toString() ? `?${searchParams}` : ''}`;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
