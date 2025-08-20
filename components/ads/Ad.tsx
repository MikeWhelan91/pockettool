"use client";

import AdSlot from "./AdSlot";
import { SLOTS, type SlotKey } from "./config";

type Props = {
  slot: SlotKey;
  className?: string;
  minHeight?: number;
  format?: string | null;
  responsive?: boolean;
  lazy?: boolean;
  width?: number;
  height?: number;
  display?: "block" | "inline-block";
};

export default function Ad({
  slot,
  className,
  minHeight = 160,
  format = "auto",
  responsive = true,
  lazy = true,
  width,
  height,
  display,
}: Props) {
  return null; // ads disabled
  /*
  return (
    <AdSlot
      slotId={SLOTS[slot]}
      className={className}
      minHeight={minHeight}
      format={format}
      responsive={responsive}
      lazy={lazy}
      width={width}
      height={height}
      display={display}
    />
  );
  */
}
