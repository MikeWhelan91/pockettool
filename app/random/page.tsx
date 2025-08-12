import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata = {
  title: "Password Generator & Random Tools — Utilixy",
  description:
    "Generate strong passwords, UUIDs, colors, slugs and lorem ipsum locally in your browser.",
  alternates: { canonical: "/random" },
};

export default function Page() {
  return (
    <ToolLayout
      title="Password Generator & Random Tools"
      description="Create strong passwords plus UUIDs, colors, slugs and lorem ipsum. Everything runs locally."
    >
      <Client />
      <p className="mt-4 text-sm text-muted">
        Need to work with PDFs? Try our <Link href="/pdf">PDF Studio</Link>.
      </p>
    </ToolLayout>
  );
}
