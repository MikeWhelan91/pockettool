import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Case Converter – Utilixy",
  description:
    "UPPER↔lower, Title, Sentence, Capitalize, Slug, camelCase, PascalCase, snake_case, kebab-case. All client-side.",
  openGraph: {
    title: "Case Converter – Utilixy",
    description:
      "UPPER↔lower, Title, Sentence, Capitalize, Slug, camelCase, PascalCase, snake_case, kebab-case. All client-side.",
    url: "/case-converter",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Case Converter – Utilixy",
    description:
      "UPPER↔lower, Title, Sentence, Capitalize, Slug, camelCase, PascalCase, snake_case, kebab-case. All client-side.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Case Converter / Text Transformer"
      description="Paste text, choose a transform, and copy the result. Nothing leaves your browser."
    >
      <Client />
    </ToolLayout>
  );
}
