import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Case Converter – Utilixy",
  description:
    "UPPER↔lower, Title, Sentence, Capitalize, Slug, camelCase, PascalCase, snake_case, kebab-case. All client-side.",
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
