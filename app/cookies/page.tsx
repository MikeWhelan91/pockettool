import type { Metadata } from "next";
import ResetConsent from "./Client";

export const metadata: Metadata = {
  title: "Cookie Settings — Utilixy",
  description:
    "Manage or revoke your consent for advertising cookies on Utilixy.",
};

export default function Cookies() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Cookies</h1>
      <p>
        To fund free tools, we use advertising cookies only after you consent.
        You can revoke consent below.
      </p>
      <ResetConsent />
    </div>
  );
}
