import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder – Utilixy",
  description: "Convert text or files to and from Base64 instantly in your browser.",
};

export default function Page() {
  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode or decode Base64 strings or files — all locally, nothing is uploaded."
    >
      <Client />
    </ToolLayout>
  );
}
