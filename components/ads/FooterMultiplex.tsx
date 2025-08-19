"use client";

import { usePathname } from "next/navigation";
import Ad from "@/components/ads/Ad";

/** Shows a multiplex ad above the footer on all non-home pages. */
export default function FooterMultiplex() {
  const pathname = usePathname();
  if (pathname === "/") return null; // home already has its own multiplex

  return (
    <section aria-label="Sponsored" className="mx-auto container-wrap px-4 mt-6">
      {/* keep height so you can see the slot in dev even when AdSense doesn't fill */}
      <Ad slot="homeMultiplex" format="autorelaxed" minHeight={160} />
    </section>
  );
}
