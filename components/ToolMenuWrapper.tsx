'use client';

import dynamic from "next/dynamic";

const ToolMenu = dynamic(() => import("./ToolMenu"), { ssr: false });

export default function ToolMenuWrapper() {
  return <ToolMenu />;
}
