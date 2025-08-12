import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Utilixy",
  description:
    "Review the usage terms for Utilixy's local-first web tools and services.",
};

export default function Terms() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Terms</h1>
      <p>
        Utilixy is provided as-is, without warranties. Use responsibly and
        ensure you have rights to the files you process.
      </p>
    </div>
  );
}
