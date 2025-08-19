"use client";

import { useEffect, useRef, CSSProperties } from "react";

type AdSlotProps = {
  slotId: string;
  className?: string;
  format?: string | null;                  // "auto" | "autorelaxed" | null (for fixed-size)
  responsive?: boolean;                    // true for data-full-width-responsive
  minHeight?: number;                      // wrapper min-height to avoid CLS
  lazy?: boolean;                          // data-loading-strategy="lazy"
  width?: number;                          // fixed width (e.g., 250)
  height?: number;                         // fixed height (e.g., 600)
  display?: "block" | "inline-block";      // for fixed-size units, use inline-block
};

export default function AdSlot({
  slotId,
  className = "",
  format = "auto",
  responsive = true,
  minHeight = 120,
  lazy = true,
  width,
  height,
  display = "block",
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (typeof window === "undefined") return;

  try {
    const w = window as any;
    // Make sure it's an array before pushing
    if (!Array.isArray(w.adsbygoogle)) w.adsbygoogle = [];
    (w.adsbygoogle as any[]).push({});
  } catch (err) {
    console.error("AdSense push error:", err);
  }
}, []);


  const wrapperClass = `ad-slot flex justify-center items-center overflow-hidden ${className || ""} ${
    width && height ? "ad-fixed" : ""
  }`;

  return (
    <div
      className={wrapperClass}
      style={{
        ["--ad-min" as any]: minHeight ? `${minHeight}px` : undefined,
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "auto",
      } as CSSProperties}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: display || "block",
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "auto",
        }}
        data-ad-client="ca-pub-1257499604453174"
        data-ad-slot={slotId}
        {...(format ? { "data-ad-format": format } : {})}
        {...(responsive ? { "data-full-width-responsive": "true" } : {})}
        {...(lazy ? { "data-loading-strategy": "lazy" } : {})}
        ref={adRef as unknown as React.RefObject<HTMLModElement>}
      ></ins>
    </div>
  );

}
