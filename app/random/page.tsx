import ToolLayout from "@/components/ToolLayout";
import Client from "./Client";

export const metadata = {
  title: "Random Generators — Utilixy",
  description:
    "Passwords, UUIDs, colors, slugs, and lorem ipsum. Everything runs locally in your browser.",
};

export default function Page() {
  return (
    <ToolLayout
      title="Random Data Generators"
      description="Pick a generator, tweak options, and produce many results at once. Everything runs locally."
    >
      <Client />
    </ToolLayout>
  );
}
