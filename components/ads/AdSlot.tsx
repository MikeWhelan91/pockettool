"use client";

import { useEffect, useRef } from "react";

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
    try {
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense push error:", err);
    }
  }, []);

 const style: React.CSSProperties =
  width && height ? { display, width, height } : { display: "block" };

return (
  <div
    className={`flex justify-center items-center overflow-hidden ${className || ""}`}
    style={{
      minHeight: minHeight ? `${minHeight}px` : undefined,
      width: width ? `${width}px` : "100%",
      height: height ? `${height}px` : "auto",
    }}
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
