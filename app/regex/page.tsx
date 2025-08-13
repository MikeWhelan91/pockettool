import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Regex Tester – Utilixy",
  description:
    "Test, replace, and split regular expressions with instant highlighting right in your browser.",
  openGraph: {
    title: "Regex Tester – Utilixy",
    description:
      "Test, replace, and split regular expressions with instant highlighting right in your browser.",
    url: "/regex",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex Tester – Utilixy",
    description:
      "Test, replace, and split regular expressions with instant highlighting right in your browser.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Regex Tester"
      description="Build, replace, and test regex patterns — everything runs locally."
    >
      <Client />
    </ToolLayout>
  );
}
