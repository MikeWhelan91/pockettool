"use client";

import { useState } from "react";
import QRCode from "qrcode";
import AdSlot from "@/components/AdSlot";

export default function Client() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(text, { width: 256 });
      setQrUrl(url);
    } catch (err) {
      console.error("QR generation failed", err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <h1 className="text-2xl font-semibold">QR Code Generator</h1>
      <input
        type="text"
        placeholder="Enter text or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input w-full max-w-md"
      />
      <button onClick={generateQR} disabled={!text} className="btn">
        Generate QR
      </button>

      {qrUrl && (
        <div className="flex flex-col items-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt="QR Code" className="border rounded" />
          <a href={qrUrl} download="qr.png" className="underline">
            Download QR
          </a>
        </div>
      )}

      <AdSlot slotId="0000000004" />
    </div>
  );
}
