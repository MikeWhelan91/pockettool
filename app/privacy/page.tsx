import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Utilixy",
  description:
    "Understand how Utilixy handles data, cookies, and local processing for web tools.",
};

export default function Privacy() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Privacy</h1>
      <p>
        Utilixy runs most processing in your browser. Files you use in tools like
        HEIC→JPG or QR generator are not uploaded to our servers.
      </p>
      <p>
        We show a small number of ads to keep tools free. Ads only load after you
        accept cookies in the consent banner.
      </p>
    </div>
  );
}
