'use client';

import { useCallback, useMemo, useState } from 'react';

type OutFmt = 'image/jpeg' | 'image/png' | 'image/webp';

export default function ImageConverter({
  title = 'Image Converter (JPG / PNG / WEBP)',
  description = 'Convert images privately in your browser. HEIC is supported.',
  defaultFormat = 'image/jpeg',
  lockFormat = false,
}: {
  title?: string;
  description?: string;
  defaultFormat?: OutFmt;
  lockFormat?: boolean;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [fmt, setFmt] = useState<OutFmt>(defaultFormat);
  const [quality, setQuality] = useState(0.9);
  const [bg, setBg] = useState('#ffffff');
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<{ name: string; url: string }[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const accept = useMemo(() => ['image/*', '.heic', '.HEIC'].join(','), []);

  const onPick = (fl: FileList | null) => {
    if (!fl) return;
    setFiles(Array.from(fl));
    setResults([]);
    setLog([]);
  };

  const addLog = (m: string) => setLog((p) => [...p, m]);

  const convertAll = useCallback(async () => {
    if (!files.length) return;
    setBusy(true);
    setResults([]);
    setLog([]);

    const heic2anyPromise = import('heic2any').then((m) => m.default).catch(() => null);

    for (const f of files) {
      try {
        const lower = f.name.toLowerCase();
        let srcBlob: Blob = f;

        if (/\.(heic|heif)$/.test(lower)) {
          const heic2any = await heic2anyPromise;
          if (!heic2any) throw new Error('HEIC decoder not available');
          const out = await heic2any({ blob: f, toType: 'image/jpeg', quality: 0.95 });
          srcBlob = Array.isArray(out) ? out[0] : out;
          addLog(`Converted HEIC → JPEG for ${f.name}`);
        }

        const bitmap = await decodeImage(srcBlob);
        const blob = await encodeBitmap(bitmap, fmt, quality, bg);

        const targetExt = fmt === 'image/jpeg' ? 'jpg' : fmt === 'image/png' ? 'png' : 'webp';
        const base = f.name.replace(/\.[^.]+$/, '');
        const url = URL.createObjectURL(blob);
        setResults((prev) => [...prev, { name: `${base}.${targetExt}`, url }]);
      } catch (e: any) {
        addLog(`❌ ${f.name}: ${e?.message || e}`);
        console.error(e);
      }
    }

    setBusy(false);
  }, [files, fmt, quality, bg]);

  const lossy = fmt !== 'image/png';

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-xl font-semibold mb-3">{title}</h1>
        <p className="text-neutral-400 mb-4">{description}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Choose images</label>
            <input
              type="file"
              multiple
              accept={accept}
              className="input"
              onChange={(e) => onPick(e.target.files)}
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              {!lockFormat && (
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Output format</label>
                  <select
                    className="input"
                    value={fmt}
                    onChange={(e) => setFmt(e.target.value as OutFmt)}
                  >
                    <option value="image/jpeg">JPG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WEBP</option>
                  </select>
                </div>
              )}

              {lossy && (
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">
                    Quality ({Math.round(quality * 100)}%)
                  </label>
                  <input
                    type="range"
                    min={0.5}
                    max={1}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-neutral-400 text-sm mt-1">
                    Lower quality reduces file size; higher quality preserves detail.
                  </p>
                </div>
              )}

              {fmt === 'image/jpeg' && (
                <div className={lockFormat ? 'col-span-2' : ''}>
                  <label className="block text-sm text-neutral-300 mb-1">
                    Background for transparency → JPG
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                      className="w-10 h-10 rounded border border-neutral-700 bg-neutral-800"
                    />
                    <span className="text-neutral-400 text-sm">
                      Used if the source has transparent pixels.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <button
                className="btn"
                disabled={busy || files.length === 0}
                onClick={convertAll}
              >
                {busy ? 'Converting…' : `Convert`}
              </button>
              <p className="text-neutral-400 text-sm mt-2">
                Tip: For print, use PNG (lossless). For web/apps, use WEBP (smaller).
              </p>
            </div>
          </div>

          <div className="text-sm text-neutral-300">
            <p className="font-medium mb-1">Supported inputs</p>
            <ul className="list-disc ml-5">
              <li>JPEG, PNG, WEBP (all browsers)</li>
              <li>HEIC (converted internally)</li>
              <li>AVIF (if your browser supports decoding)</li>
            </ul>
            <p className="font-medium mt-3 mb-1">Privacy</p>
            <ul className="list-disc ml-5">
              <li>Everything runs on your device — no uploads.</li>
              <li>EXIF is removed on re-encode (preserve option coming soon).</li>
            </ul>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <section className="card">
          <h2 className="font-semibold mb-3">Results</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {results.map((r) => (
              <figure key={r.url} className="bg-neutral-900 border border-neutral-800 rounded-lg p-2">
                <img src={r.url} alt={r.name} className="w-full h-40 object-cover rounded" />
                <figcaption className="mt-2 flex justify-between items-center text-xs">
                  <span className="truncate mr-2">{r.name}</span>
                  <a
                    className="px-2 py-1 rounded bg-brand text-white"
                    href={r.url}
                    download={r.name}
                  >
                    Download
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ---- decoding / encoding helpers ----

async function decodeImage(blob: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(blob);
  } catch {
    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const el = new Image(); el.onload = () => res(el); el.onerror = rej; el.src = url;
      });
      return await createImageBitmap(img as any);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

async function encodeBitmap(
  bitmap: ImageBitmap,
  mime: OutFmt,
  quality: number,
  fillColor: string
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width; canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d')!;
  if (mime === 'image/jpeg') { ctx.fillStyle = fillColor || '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height); }
  ctx.drawImage(bitmap, 0, 0);
  return await new Promise<Blob>((resolve, reject) => {
    const q = mime === 'image/png' ? undefined : quality;
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Encode failed'))), mime, q);
  });
}
