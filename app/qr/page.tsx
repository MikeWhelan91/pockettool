import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata = {
  title: "Wi-Fi QR Code Generator — PocketTool",
  description:
    "Create Wi-Fi QR codes (WPA/WEP/Open) and standard QR codes for text, email or SMS. Export PNG/SVG. Everything runs locally.",
};

export default function Page() {
  return (
    <ToolLayout
      title="Wi-Fi QR Code Generator"
      description="Share your network instantly: scan to connect. Adjust size, margin and colors, and export PNG or SVG."
    >
      <Client />
    </ToolLayout>
  );
}
