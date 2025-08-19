"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";

type QRType = "wifi" | "text" | "email" | "sms";

export default function QRTool() {
  // Default hero = Wi-Fi
  const [type, setType] = useState<QRType>("wifi");

  // generic
  const [text, setText] = useState("");

  // wifi
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [wifiAuth, setWifiAuth] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [hidden, setHidden] = useState(false);

  // email
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // sms
  const [phone, setPhone] = useState("");
  const [smsBody, setSmsBody] = useState("");

  // fixed rendering opts (we removed size/margin/colors UI)
  const SIZE = 280;
  const MARGIN = 2;
  const FG = "#111111";
  const BG = "#ffffff";

  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [svgText, setSvgText] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Build QR payload
  const data = useMemo(() => {
    switch (type) {
      case "wifi": {
        const esc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
        const auth = wifiAuth === "nopass" ? "nopass" : wifiAuth;
        return `WIFI:T:${auth};S:${esc(ssid)};${wifiAuth !== "nopass" ? `P:${esc(password)};` : ""}${hidden ? "H:true;" : ""};`;
      }
      case "email": {
        const params = new URLSearchParams();
        if (subject) params.set("subject", subject);
        if (body) params.set("body", body);
        return `mailto:${email}${params.toString() ? `?${params.toString()}` : ""}`;
      }
      case "sms": {
        const params = new URLSearchParams();
        if (smsBody) params.set("body", smsBody);
        return `sms:${phone}${params.toString() ? `?${params.toString()}` : ""}`;
      }
      default:
        return text || "";
    }
  }, [type, text, wifiAuth, ssid, password, hidden, email, subject, body, phone, smsBody]);

  // Generate PNG + SVG whenever inputs change
  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const opts = { margin: MARGIN, color: { dark: FG, light: BG }, width: SIZE };
        const dataUrl = await QRCode.toDataURL(data || " ", opts);
        const svg = await QRCode.toString(data || " ", { ...opts, type: "svg" });
        if (!cancelled) {
          setPngUrl(dataUrl);
          setSvgText(svg);
        }
      } catch {
        if (!cancelled) {
          setPngUrl(null);
          setSvgText(null);
        }
      }
    }

    run();
    return () => { cancelled = true; };
  }, [data]);

  function download(filename: string, href: string) {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    a.click();
  }

  function downloadSVG() {
    if (!svgText) return;
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    download("qr.svg", url);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Left: form */}
      <div className="card p-4 md:p-6">
        <div className="grid gap-5">
          {/* Type selector */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Type</label>
            <div className="flex flex-wrap gap-2">
              {([
                { id: "wifi", label: "Wi-Fi" },
                { id: "text", label: "Text / URL" },
                { id: "email", label: "Email" },
                { id: "sms", label: "SMS" },
              ] as const).map((t) => {
                const isActive = type === t.id;
                const cls = isActive ? "btn" : "btn-ghost";
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={cls}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content fields */}
          {type === "wifi" && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="ssid">Wi-Fi SSID</label>
                <input id="ssid" className="input" placeholder="e.g. MyHomeWiFi" value={ssid} onChange={(e) => setSsid(e.target.value)} />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Authentication</label>
                <div className="flex flex-wrap gap-2">
                  {(["WPA", "WEP", "nopass"] as const).map((a) => {
                    const active = wifiAuth === a;
                    return (
                      <button
                        key={a}
                        type="button"
                        className={active ? "btn" : "btn-ghost"}
                        onClick={() => setWifiAuth(a)}
                        aria-pressed={active}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>

              {wifiAuth !== "nopass" && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="pwd">Password</label>
                  <input id="pwd" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              )}

              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
                Hidden network
              </label>
            </div>
          )}

          {type === "text" && (
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="qr-text">Text or URL</label>
              <textarea
                id="qr-text"
                className="input min-h-[120px]"
                placeholder="https://example.com or any text…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}

          {type === "email" && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="email">To</label>
                <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="subj">Subject</label>
                <input id="subj" className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="em-body">Body</label>
                <textarea id="em-body" className="input min-h-[100px]" value={body} onChange={(e) => setBody(e.target.value)} />
              </div>
            </div>
          )}

          {type === "sms" && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="phone">Phone</label>
                <input id="phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="sms-body">Message</label>
                <textarea id="sms-body" className="input min-h-[100px]" value={smsBody} onChange={(e) => setSmsBody(e.target.value)} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {pngUrl ? (
              <button className="btn" onClick={() => download("wifi-qr.png", pngUrl)}>Download PNG</button>
            ) : null}
            {svgText ? (
              <button className="btn-ghost" onClick={downloadSVG}>Download SVG</button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Right: live preview */}
      <div className="card p-4 md:p-6">
        <div className="grid place-items-center min-h-[320px]">
          {pngUrl ? (
            <img
              ref={imgRef}
              src={pngUrl}
              alt="Generated QR code"
              width={SIZE}
              height={SIZE}
              className="rounded-md border border-line"
              style={{ background: BG }}
            />
          ) : (
            <div className="text-sm text-muted">Enter Wi-Fi details to generate a QR code.</div>
          )}
        </div>
      </div>
    </>
  );
}
