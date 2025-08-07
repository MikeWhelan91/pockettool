'use client';

import { useEffect, useRef, useState } from 'react';
import { toCanvas, toString as qrToString } from 'qrcode';
import AdSlot from '@/components/AdSlot';

type Mode = 'url' | 'text' | 'wifi';
type WifiState = {
  ssid: string;
  pass: string;
  sec: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
};

// Builds a spec-correct Wi-Fi QR string.
function buildWifiString(wifi: WifiState) {
  const esc = (s: string) => s.replace(/([\\;,:"])/g, '\\$1').trim();
  const t = wifi.sec === 'nopass' ? 'nopass' : wifi.sec === 'WEP' ? 'WEP' : 'WPA';
  let out = `WIFI:T:${t};S:${esc(wifi.ssid)};`;
  if (t !== 'nopass' && wifi.pass.trim()) out += `P:${esc(wifi.pass)};`;
  if (wifi.hidden) out += `H:true;`;
  out += ';';
  return out;
}

// Ensure URLs have a scheme so cameras open them correctly.
const normalizeUrl = (u: string) =>
  u.trim() && !/^https?:\/\//i.test(u) ? `https://${u.trim()}` : u.trim();

function Tab({
  children,
  active,
  on,
}: {
  children: React.ReactNode;
  active: boolean;
  on: () => void;
}) {
  return (
    <button
      onClick={on}
      className={
        'px-3 py-2 rounded-lg border ' +
        (active
          ? 'border-brand text-white bg-brand/20'
          : 'border-neutral-700 hover:bg-neutral-800')
      }
    >
      {children}
    </button>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-neutral-400 text-sm mt-1">{children}</p>;
}

function InfoBox({ mode }: { mode: Mode }) {
  if (mode === 'url') {
    return (
      <div className="text-sm text-neutral-300">
        <p className="font-medium mb-1">What happens when scanned?</p>
        <ul className="list-disc ml-5">
          <li>
            Opens the website directly (ensure it starts with <code>https://</code>).
          </li>
        </ul>
        <p className="font-medium mt-3 mb-1">Which download?</p>
        <ul className="list-disc ml-5">
          <li>
            <strong>PNG</strong> – ideal for screens & documents.
          </li>
          <li>
            <strong>SVG</strong> – scales for print without quality loss.
          </li>
        </ul>
      </div>
    );
  }
  if (mode === 'text') {
    return (
      <div className="text-sm text-neutral-300">
        <p className="font-medium mb-1">What happens when scanned?</p>
        <ul className="list-disc ml-5">
          <li>Displays your text; phones offer Copy/Search.</li>
        </ul>
        <p className="font-medium mt-3 mb-1">Tips</p>
        <ul className="list-disc ml-5">
          <li>Keep it short & plain (no emojis/line breaks).</li>
          <li>PNG for screens; SVG for print.</li>
        </ul>
      </div>
    );
  }
  // wifi
  return (
    <div className="text-sm text-neutral-300">
      <p className="font-medium mb-1">What happens when scanned?</p>
      <ul className="list-disc ml-5">
        <li>
          Phone shows <strong>Join “SSID”</strong> and connects automatically.
        </li>
      </ul>
      <p className="font-medium mt-3 mb-1">Tips</p>
      <ul className="list-disc ml-5">
        <li>
          <strong>SSID</strong> is your Wi-Fi name (Settings → Wi-Fi → connected network).
        </li>
        <li>Use <strong>WPA</strong> for most; choose <strong>Open</strong> if no password.</li>
        <li>PNG for stickers; SVG for signs.</li>
      </ul>
    </div>
  );
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function QRPage() {
  const [mode, setMode] = useState<Mode>('url');
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('Hello from PocketTool');
  const [wifi, setWifi] = useState<WifiState>({
    ssid: '',
    pass: '',
    sec: 'WPA',
    hidden: false,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const value =
    mode === 'url'
      ? normalizeUrl(url)
      : mode === 'text'
      ? text
      : buildWifiString(wifi);

  const wifiValid =
    wifi.ssid.trim().length > 0 &&
    (wifi.sec === 'nopass' || wifi.pass.trim().length >= 8);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    toCanvas(el, value || ' ', { width: 320, margin: 2 }, (err) => {
      if (err) console.error(err);
    });
  }, [value]);

  const download = (type: 'png' | 'svg') => {
    const val = value || ' ';
    if (type === 'png') {
      const data = canvasRef.current?.toDataURL('image/png');
      if (!data) return;
      triggerDownload(data, 'qr.png');
    } else {
      qrToString(val, { type: 'svg', width: 1024, margin: 2 }, (err, svg) => {
        if (err || !svg) return;
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        triggerDownload(URL.createObjectURL(blob), 'qr.svg');
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <div className="card w-full max-w-screen-md">
        <h1 className="text-xl font-semibold mb-3">QR / Wi-Fi QR Generator</h1>
        <p className="text-neutral-400 mb-4">
          Everything is created in your browser. No uploads.
        </p>

        <div className="flex gap-2 mb-3">
          <Tab on={() => setMode('url')} active={mode === 'url'}>
            Website (URL)
          </Tab>
          <Tab on={() => setMode('text')} active={mode === 'text'}>
            Plain Text
          </Tab>
          <Tab on={() => setMode('wifi')} active={mode === 'wifi'}>
            Wi-Fi (Connect)
          </Tab>
        </div>

        {mode === 'url' && (
          <>
            <input
              className="input mb-1"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
            <Hint>Scanning opens this website.</Hint>
          </>
        )}

        {mode === 'text' && (
          <>
            <textarea
              className="input mb-1"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your text"
            />
            <Hint>Shows the text; phones may offer to copy or search it.</Hint>
          </>
        )}

        {mode === 'wifi' && (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-sm text-neutral-300 mb-1">
                Network name (SSID)
              </label>
              <input
                className="input"
                placeholder="e.g. MyHomeWiFi"
                value={wifi.ssid}
                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
              />
              <Hint>
                Find it on your device: Settings → Wi-Fi → connected network.
              </Hint>
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">Security</label>
              <select
                className="input"
                value={wifi.sec}
                onChange={(e) =>
                  setWifi({ ...wifi, sec: e.target.value as WifiState['sec'] })
                }
              >
                <option value="WPA">WPA/WPA2/WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open (no password)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">Password</label>
              <input
                className="input"
                placeholder={
                  wifi.sec === 'nopass'
                    ? 'No password (open network)'
                    : 'At least 8 characters'
                }                
                disabled={wifi.sec === 'nopass'}                
                value={wifi.pass}                
                onChange={(e) => setWifi({ ...wifi, pass: e.target.value })}              
              />            
            </div>            
            <label className="flex items-center gap-2 text-neutral-300">              
              <input                
                type="checkbox"                
                checked={wifi.hidden}                
                onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}              
              />              
              Hidden network            
            </label>            
            {!wifiValid && (              
              <p className="sm:col-span-2 text-amber-400 text-sm">                
                Enter an SSID and a password (8+ chars) for WPA/WEP, or choose Open (no password).              
              </p>            
            )}          
          </div>        
        )}        
        <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start">          
          <canvas            
            ref={canvasRef}            
            className="bg-white rounded p-2"            
            width={320}            
            height={320}          
          />          
          <div className="flex-1">            
            <InfoBox mode={mode} />          
          </div>        
        </div>        
        <div className="flex gap-3 mt-4">          
          <button            
            className="btn"            
            onClick={() => download('png')}            
            disabled={mode === 'wifi' && !wifiValid}          
          >            
            Download PNG          
          </button>          
          <button            
            className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"            
            onClick={() => download('svg')}            
            disabled={mode === 'wifi' && !wifiValid}          
          >            
            Download SVG          
          </button>        
        </div>      
      </div>      

      <div className="w-full max-w-screen-md mx-auto">        
        <AdSlot slotId="0000000001" />      
      </div>      

      <section className="card w-full max-w-screen-md mx-auto">        
        <h2 className="font-semibold">Tips</h2>        
        <ul className="list-disc ml-6 text-neutral-300">          
          <li>SVG is ideal for print (no quality loss at large sizes).</li>          
          <li>For Wi-Fi, most phones support WPA; only use WEP or Open if required.</li>        
        </ul>      
      </section>    
    </div>  
  );}
