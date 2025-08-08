'use client';

import { useState, useCallback } from 'react';
import AdSlot from '@/components/AdSlot';

type OutputFormat = 'png' | 'jpeg' | 'webp';

interface ConvertedImage {
  name: string;
  url: string;
}

export default function ImageConverter() {
  const [images, setImages] = useState<File[]>([]);
  const [format, setFormat] = useState<OutputFormat>('png');
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [converted, setConverted] = useState<ConvertedImage[]>([]);
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

    // Detect HEIC files
    const hasHeic = arr.some(
      (file) =>
        file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')
    );
    setHeicDetected(hasHeic);
  }, []);

  async function convertAll() {
    if (images.length === 0) return;
    setBusy(true);
    setConverted([]);
    setWarning(null);

    const results: ConvertedImage[] = [];

    // Dynamically import heic2any only in the browser
    let heic2any: any = null;
    if (typeof window !== 'undefined') {
      const mod = await import('heic2any');
      heic2any = mod.default;
    }

    for (const file of images) {
      const ext = file.name.split('.').pop()?.toLowerCase();

      // Safeguard: skip same-format conversions
      // Normalize 'jpg' to 'jpeg' for comparison
      const normalizedExt = ext === 'jpg' ? 'jpeg' : ext;

      if (normalizedExt === format) {
        setWarning(`Skipping ${file.name} — already a ${format.toUpperCase()} file.`);
        continue;
      }
 
      try {
        let srcBlob: Blob = file;

        // HEIC support
        if (
          (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) &&
          heic2any
        ) {
          srcBlob = (await heic2any({
            blob: file,
            toType: `image/${format}`,
            quality: quality / 100,
          })) as Blob;
        }

        // ✅ Clone the blob to avoid "InvalidStateError"
        srcBlob = srcBlob.slice(0, srcBlob.size, srcBlob.type);

        // Create image bitmap
        const imgBitmap = await createImageBitmap(srcBlob);
        const canvas = document.createElement('canvas');
        canvas.width = imgBitmap.width;
        canvas.height = imgBitmap.height;
        const ctx = canvas.getContext('2d');

        // Fill background if JPEG (no alpha)
        if (format === 'jpeg') {
          ctx!.fillStyle = bgColor;
          ctx!.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx?.drawImage(imgBitmap, 0, 0);

        // Convert to target format
        const blob: Blob | null = await new Promise((resolve) => {
          canvas.toBlob(
            (b) => resolve(b),
            `image/${format}`,
            format === 'png' ? undefined : quality / 100
          );
        });

        if (blob) {
          results.push({
            name: file.name.replace(/\.[^.]+$/, '') + '.' + format,
            url: URL.createObjectURL(blob),
          });
        }
      } catch (err) {
        console.error(`Error converting ${file.name}`, err);
      }
    }

    setConverted(results);
    setBusy(false);
  }

  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <div className="card w-full max-w-screen-md p-6 space-y-4">
        <h1 className="text-xl font-semibold">Image Converter</h1>
        <p className="text-neutral-400 text-sm">
          Convert images directly in your browser — supports PNG, JPEG, WEBP, and HEIC as input.
          Choose format, quality, and background fill for JPEG. Drag & drop or use the file picker.
        </p>

        {/* Drag-and-drop area */}
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
          <p className="text-neutral-400">
            Drop images here or click to select files
          </p>
          <input
            id="fileInput"
            type="file"
            accept="image/*,.heic"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* HEIC detection notice */}
        {heicDetected && (
          <div className="text-xs text-yellow-400">
            HEIC file detected — it will be converted to your chosen output format.
          </div>
        )}

        {/* Warning for skipped files */}
        {warning && (
          <div className="text-xs text-yellow-400">{warning}</div>
        )}

        {/* Preview thumbnails */}
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

        {/* Format selection */}
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
          </select>
        </div>

        {/* Quality slider */}
        {(format === 'jpeg' || format === 'webp') && (
          <div>
            <label className="block text-sm text-neutral-300 mb-1">
              Quality: {quality}%
            </label>
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

        {/* Background color for JPEG */}
        {format === 'jpeg' && (
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Background Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>
        )}

        {/* Convert button */}
        <button
          onClick={convertAll}
          disabled={images.length === 0 || busy}
          className="btn w-full"
        >
          {busy ? 'Converting…' : `Convert ${images.length || ''} Image${images.length !== 1 ? 's' : ''}`}
        </button>

        {/* Converted results */}
        {converted.length > 0 && (
          <div className="space-y-3">
            {converted.map((img, i) => (
              <div key={i} className="flex flex-col items-start space-y-1">
                <img
                  src={img.url}
                  alt={img.name}
                  className="max-h-64 object-contain border border-neutral-800 rounded"
                />
                <a
                  href={img.url}
                  download={img.name}
                  className="underline text-blue-400"
                >
                  Download {img.name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ad slot */}
      <div className="w-full max-w-screen-md mx-auto">
        <AdSlot slotId="0000000002" />
      </div>
    </div>
  );
}
