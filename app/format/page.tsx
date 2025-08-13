// app/formatter/page.tsx
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "JSON / YAML / XML Formatter & Validator — Utilixy",
  description:
    "Format and validate JSON, YAML, or XML instantly in your browser. Auto-detect, pretty-print or minify. Private & fast.",
  openGraph: {
    title: "JSON / YAML / XML Formatter & Validator — Utilixy",
    description:
      "Format and validate JSON, YAML, or XML instantly in your browser. Auto-detect, pretty-print or minify. Private & fast.",
    url: "/format",
    siteName: "Utilixy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON / YAML / XML Formatter — Utilixy",
    description:
      "Format and validate JSON, YAML, or XML instantly in your browser.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="JSON / YAML / XML Formatter"
      description="Paste code, auto-detect the format, and pretty-print or minify — all client-side."
    >
      <Client />
    </ToolLayout>
  );
}
