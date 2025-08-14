'use client';

import { useState, useCallback } from 'react';

type OutputFormat = 'png' | 'jpeg' | 'webp' | 'avif';

interface ConvertedImage {
  name: string;
  url: string;
  fallbackUrl?: string; // for <picture> fallback when output is AVIF
}

export default function ImageConverter() {
  const [images, setImages] = useState<File[]>([]);
  const [format, setFormat] = useState<OutputFormat>('png');
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [converted, setConverted] = useState<ConvertedImage[]>([]);
  const [targetW, setTargetW] = useState<number | ''>('');
  const [targetH, setTargetH] = useState<number | ''>('');
  const [busy, setBusy] = useState(false);
  const [heicDetected, setHeicDetected] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setImages(arr);
    setConverted([]);
    setWarning(null);

    const hasHeic = arr.some(
      (file) => file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')
    );
    setHeicDetected(hasHeic);
  }, []);

  async function convertAll() {
    if (images.length === 0) return;
    setBusy(true);
    setConverted([]);
    setWarning(null);

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    let heic2any: any = null;
    if (typeof window !== 'undefined') {
      const mod = await import('heic2any');
      heic2any = mod.default;
    }

    // Lazy-load AVIF encoder if requested
    let avifEncode: ((img: ImageData, opts: any) => Promise<any>) | null = null;
    if (format === 'avif') {
      const avifMod = await import('@jsquash/avif');
      avifEncode = avifMod.encode;
    }

    const results: ConvertedImage[] = [];

    for (const file of images) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const normalizedExt = ext === 'jpg' ? 'jpeg' : ext;
      if (normalizedExt === format) {
        setWarning(`Skipping ${file.name} — already a ${format.toUpperCase()} file.`);
        continue;
      }

      try {
        // Prepare source blob
        let srcBlob: Blob = file;
        if ((file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) && heic2any) {
          srcBlob = (await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: quality / 100,
          })) as Blob;
        }
        srcBlob = srcBlob.slice(0, srcBlob.size, srcBlob.type);

        // Draw / resize
        const isAvifInput = (file.type === 'image/avif') || file.name.toLowerCase().endsWith('.avif');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context not available');

        let naturalW = 0;
        let naturalH = 0;
        let drewToCanvas = false;

        // Primary path: use createImageBitmap when browser can decode AVIF natively
        try {
          const imgBitmap = await createImageBitmap(srcBlob as any);
          naturalW = imgBitmap.width;
          naturalH = imgBitmap.height;
          const w = (targetW || naturalW);
          const h = (targetH || naturalH);
          canvas.width = w;
          canvas.height = h;
          if (format === 'jpeg') {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, w, h);
          }
          ctx.drawImage(imgBitmap, 0, 0, w, h);
          drewToCanvas = true;
        } catch (e) {
          // Fallback path: decode AVIF via WASM if native decode failed
          if (isAvifInput) {
            const { decode } = await import('@jsquash/avif');
            const buf = await file.arrayBuffer();
            const imageData: any = await decode(buf as ArrayBuffer);
            naturalW = imageData.width;
            naturalH = imageData.height;
            const w = (targetW || naturalW);
            const h = (targetH || naturalH);
            canvas.width = w;
            canvas.height = h;
            // If resizing, draw via putImageData to an offscreen and scale; else direct putImageData
            if ((w === naturalW) && (h === naturalH)) {
              ctx.putImageData(imageData, 0, 0);
            } else {
              // draw into a temp canvas then scale
              const tmp = document.createElement('canvas');
              tmp.width = imageData.width;
              tmp.height = imageData.height;
              const tctx = tmp.getContext('2d')!;
              tctx.putImageData(imageData, 0, 0);
              if (format === 'jpeg') {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, w, h);
              }
              ctx.drawImage(tmp, 0, 0, w, h);
            }
            drewToCanvas = true;
          } else {
            throw e;
          }
        }

        // Encode
        let blob: Blob | null = null;
        let fallbackUrl__internal: string | undefined = undefined; // init for each file

        if (format === 'avif') {
          if (!avifEncode) throw new Error('AVIF encoder not loaded');
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const avifRaw = await avifEncode(imageData, { quality });
          // avifRaw can be ArrayBuffer or Uint8Array depending on build; normalize to ArrayBuffer
          const avifPart: ArrayBuffer = (avifRaw instanceof ArrayBuffer) ? avifRaw : (avifRaw.buffer as ArrayBuffer);
          blob = new Blob([avifPart], { type: 'image/avif' });
          // Also create JPEG fallback URL
          const jpegBlob = await new Promise<Blob>((res) =>
            canvas.toBlob((b) => res(b!), 'image/jpeg', quality / 100)
          );
          fallbackUrl__internal = URL.createObjectURL(jpegBlob);
        } else {
          blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(
              (b) => resolve(b),
              `image/${format}`,
              format === 'png' ? undefined : quality / 100
            );
          });
        }

        if (blob) {
          const outName = file.name.replace(/\.[^.]+$/, '') + '.' + format;
          zip.file(outName, blob);
          results.push({
            name: outName,
            url: URL.createObjectURL(blob),
            fallbackUrl: fallbackUrl__internal,
          });
        }
      } catch (err) {
        console.error(`Error converting ${file.name}`, err);
      }
    }

    if (results.length > 1) {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      results.unshift({
        name: 'converted-images.zip',
        url: URL.createObjectURL(zipBlob),
      });
    }

    setConverted(results);
    setBusy(false);
  }

  return (
    <>
      <div className="card p-6 space-y-4 md:col-span-2">

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            dragOver ? 'border-green-500 bg-green-500/10' : 'border-neutral-700'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <p className="text-neutral-400">Drop images here or click to select files</p>
          <input
            id="fileInput"
            type="file"
            accept="image/*,.heic,.avif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {heicDetected && (
          <div className="text-xs text-yellow-400">
            HEIC file detected — it will be converted to your chosen output format.
          </div>
        )}

        {warning && <div className="text-xs text-yellow-400">{warning}</div>}

        {/* Thumbnails (selected input files) */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {images.map((file, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-24 w-24 object-cover border border-neutral-800 rounded"
                />
                <p className="text-xs text-neutral-400 truncate w-24">{file.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Output Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
            className="input"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WEBP</option>
            <option value="avif">AVIF</option>
          </select>
        </div>

        {(format === 'jpeg' || format === 'webp' || format === 'avif') && (
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Quality: {quality}%</label>
            <input
              type="range"
              min={1}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {format === 'jpeg' && (
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Background Color</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </div>
        )}

        {/* Resize */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Width (px)</label>
            <input
              type="number"
              min={1}
              value={targetW}
              onChange={(e) => setTargetW(e.target.value ? Number(e.target.value) : '')}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Height (px)</label>
            <input
              type="number"
              min={1}
              value={targetH}
              onChange={(e) => setTargetH(e.target.value ? Number(e.target.value) : '')}
              className="input w-full"
            />
          </div>
        </div>

        <button onClick={convertAll} disabled={images.length === 0 || busy} className="btn w-full">
          {busy ? 'Converting…' : `Convert ${images.length || ''} Image${images.length !== 1 ? 's' : ''}`}
        </button>

        {/* Results */}
        {converted.length > 0 && (
          <div className="space-y-3 mt-4">
            {converted.map((img, i) => (
              <div key={i} className="flex flex-col items-start space-y-1">
                {/* If we have a fallback, render <picture> */}
                {img.fallbackUrl ? (
                  <picture>
                    <source type="image/avif" srcSet={img.url} />
                    <source type="image/jpeg" srcSet={img.fallbackUrl} />
                    <img
                      src={img.fallbackUrl}
                      alt={img.name}
                      className="max-h-64 object-contain border border-neutral-800 rounded"
                    />
                  </picture>
                ) : (
                  <img
                    src={img.url}
                    alt={img.name}
                    className="max-h-64 object-contain border border-neutral-800 rounded"
                  />
                )}
                <a href={img.url} download={img.name} className="underline text-blue-400">
                  Download {img.name}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* FAQ (SEO) */}
        <section className="card p-4 mt-6" id="image-converter-faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-lg font-semibold mb-2">
            Image Converter FAQ
          </h2>

          <details className="card p-3 mb-2">
            <summary className="font-medium">Is anything uploaded to a server?</summary>
            <p className="text-sm text-muted">
              No. All conversions run locally in your browser—files never leave your device.
            </p>
          </details>

          <details className="card p-3 mb-2">
            <summary className="font-medium">Which formats can I convert?</summary>
            <p className="text-sm text-muted">PNG, JPEG, WEBP, HEIC, and AVIF.</p>
          </details>

          <details className="card p-3 mb-2">
            <summary className="font-medium">What is AVIF and why use it?</summary>
            <p className="text-sm text-muted">
              AVIF is a modern, royalty‑free image format that often achieves the same visual quality
              as JPEG/WebP at much smaller sizes. Smaller images improve page speed and Core Web
              Vitals (especially LCP), which can benefit SEO. We also provide automatic JPEG
              fallbacks for broad compatibility.
            </p>
          </details>

          <details className="card p-3 mb-2">
            <summary className="font-medium">Can I resize images at the same time?</summary>
            <p className="text-sm text-muted">
              Yes. Set width/height in pixels; leave fields blank to keep original dimensions.
            </p>
          </details>

          <details className="card p-3 mb-2">
            <summary className="font-medium">Does it work offline?</summary>
            <p className="text-sm text-muted">
              Yes—after the page loads once, conversions are fully local and don’t require a network
              connection.
            </p>
          </details>
        </section>
      </div>
    </>
  );
}
