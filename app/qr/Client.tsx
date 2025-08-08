'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import AdSlot from '@/components/AdSlot';

type QRType = 'wifi' | 'text' | 'email' | 'sms';

export default function Client() {
  const [qrType, setQrType] = useState<QRType>('wifi');
  const [text, setText] = useState('');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [emailTo, setEmailTo] = useState('');
  const [smsNumber, setSmsNumber] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const buildData = (): string => {
    switch (qrType) {
      case 'wifi':
        return `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};H:false;`;
      case 'email':
        return `mailto:${emailTo}`;
      case 'sms':
        return `sms:${smsNumber}`;
      case 'text':
      default:
        return text;
    }
  };

  const generateQR = async () => {
    const data = buildData();
    try {
      const url = await QRCode.toDataURL(data, { width: 256 });
      const svg = await QRCode.toString(data, { type: 'svg' });
      setQrUrl(url);
      setSvgUrl(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
    } catch (err) {
      console.error('QR generation failed', err);
      setQrUrl(null);
      setSvgUrl(null);
    }
  };

  useEffect(() => {
    generateQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrType, text, wifiSSID, wifiPassword, wifiSecurity, emailTo, smsNumber]);

  const copyToClipboard = async () => {
    const data = buildData();
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <h1 className="text-2xl font-semibold text-center">Create a Wi-Fi QR Code for Guests</h1>
      <p className="text-center text-neutral-400 max-w-prose text-sm">
        Share your Wi-Fi quickly by generating a QR code that guests can scan with their phone.
        Fill in your network details below.
      </p>

      {/* QR Type Selector - visible up top now */}
      <div className="card w-full max-w-screen-md p-4 space-y-4">
        <label className="block font-medium">Select QR Code Type</label>
        <select
          className="input w-full"
          value={qrType}
          onChange={(e) => setQrType(e.target.value as QRType)}
        >
          <option value="wifi">Wi-Fi (Default)</option>
          <option value="text">Text / URL</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
      </div>

      {/* Wi-Fi Generator */}
      {qrType === 'wifi' && (
        <div className="card w-full max-w-screen-md space-y-4 p-4">
          <input
            type="text"
            placeholder="Wi-Fi SSID (Network Name)"
            value={wifiSSID}
            onChange={(e) => setWifiSSID(e.target.value)}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Wi-Fi Password"
            value={wifiPassword}
            onChange={(e) => setWifiPassword(e.target.value)}
            className="input w-full"
          />
          <select
            className="input w-full"
            value={wifiSecurity}
            onChange={(e) => setWifiSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')}
          >
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">No Password</option>
          </select>
        </div>
      )}

      {qrType === 'text' && (
        <div className="card w-full max-w-screen-md space-y-4 p-4">
          <input
            type="text"
            placeholder="Enter text or URL"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input w-full"
          />
        </div>
      )}

      {qrType === 'email' && (
        <div className="card w-full max-w-screen-md space-y-4 p-4">
          <input
            type="email"
            placeholder="someone@example.com"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            className="input w-full"
          />
        </div>
      )}

      {qrType === 'sms' && (
        <div className="card w-full max-w-screen-md space-y-4 p-4">
          <input
            type="tel"
            placeholder="+123456789"
            value={smsNumber}
            onChange={(e) => setSmsNumber(e.target.value)}
            className="input w-full"
          />
        </div>
      )}

      {/* Preview + actions */}
      {qrUrl && (
        <div className="flex flex-col items-center space-y-2">
          <img src={qrUrl} alt="QR Code" className="border rounded shadow-md" />
          <div className="flex gap-3 mt-2">
            <a href={qrUrl} download="qr.png" className="btn text-sm">
              Download PNG
            </a>
            {svgUrl && (
              <a href={svgUrl} download="qr.svg" className="btn text-sm">
                Download SVG
              </a>
            )}
            <button onClick={copyToClipboard} className="btn text-sm">
              {copied ? 'Copied!' : 'Copy QR Content'}
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-screen-md mx-auto">
        <AdSlot slotId="0000000004" />
      </div>
    </div>
  );
}
