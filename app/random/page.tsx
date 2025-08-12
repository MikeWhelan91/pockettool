import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";
import Ad from "@/components/ads/Ad";

export const metadata = {
  title: "Password Generator & Random Tools — Utilixy",
  description: "Generate strong passwords, UUIDs, colors, slugs and lorem ipsum locally in your browser.",
  alternates: { canonical: "/random" },
};

export default function Page() {
  return (
    <ToolLayout
      title="Password Generator & Random Tools"
      description="Create strong passwords plus UUIDs, colors, slugs and lorem ipsum. Everything runs locally."
    >
      <Client />
    </ToolLayout>
  );
}
