import type { Metadata } from "next";
import ReopenConsentButton from "@/components/ReopenConsentButton"; // note the path

export const metadata: Metadata = {
  title: "Privacy Policy — Utilixy",
  description:
    "How Utilixy handles data, cookies, ads, and analytics. Most tools run entirely in your browser.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — Utilixy",
    description:
      "How Utilixy handles data, cookies, ads, and analytics. Most tools run entirely in your browser.",
    url: "/privacy",
    siteName: "Utilixy",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy — Utilixy",
    description:
      "How Utilixy handles data, cookies, ads, and analytics. Most tools run entirely in your browser.",
    images: ["/icons/icon-512.png"],
  },
};

export default function Privacy() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> {new Date().toISOString().slice(0, 10)}</p>

      <h2>What we do</h2>
      <p>
        Utilixy is designed to be <strong>local-first</strong>. For most tools, processing
        happens in your browser and files never leave your device. Examples include
        conversions like <em>HEIC → JPG</em>, basic image utilities, and QR code generation.
      </p>

      <h2>When data leaves your device</h2>
      <ul>
        <li><strong>Error logs &amp; security:</strong> Standard request metadata may be logged.</li>
        <li><strong>Analytics:</strong> Aggregate usage only; we don’t sell/share it for others’ marketing.</li>
        <li><strong>Advertising:</strong> Ads run only when consent allows it.</li>
      </ul>

      <h2>Cookies &amp; Consent</h2>
      <p>
        We use Google’s Consent Mode and Funding Choices. Until you consent (where required),
        non-essential cookies are limited and ad personalization is disabled.
      </p>
      <p>
        You can review or change your choices at any time: <ReopenConsentButton />
      </p>
      <p className="text-sm opacity-70">
  If the button does nothing, the consent dialog isn’t available in your region or hasn’t loaded yet.  
  <br />
  (We’re not huge fans of these banners either, but needs must — it keeps the lights on!)
</p>

      <h2>Advertising (Google AdSense)</h2>
      <p>
        We use Google AdSense to serve ads. Learn more and manage preferences:
      </p>
      <ul>
        <li><a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/ads</a></li>
        <li><a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">myadcenter.google.com</a></li>
        <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
      </ul>

      <h2>Data retention</h2>
      <p>Server/analytics logs are retained for a limited period. Local-first files are not uploaded or stored by us.</p>

      <h2>Your rights</h2>
      <p>Depending on your location, you may have rights to access, correct, delete, or restrict processing.</p>

      <h2>Contact</h2>
      <p>Use the contact link in the site footer.</p>
    </div>
  );
}
