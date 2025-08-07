'use client';

import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import AdSlot from '@/components/AdSlot';

// Serve the PDF.js worker from public
GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';

// Base scale for HD previews
const PREVIEW_BASE_SCALE = 0.6;

type Operation = 'merge' | 'split' | 'compress';

export default function PDFToolsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [operation, setOperation] = useState<Operation>('merge');
  const [ranges, setRanges] = useState<string>('1-end');
  const [busy, setBusy] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string>('');
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<number | null>(null);

  // Regenerate previews
  useEffect(() => {
    setPreviews([]);
    if (!files.length) return;
    if (operation === 'merge') generateMergePreviews(files);
    else if (operation === 'split') generateSplitPreviews(files[0]);
  }, [files, operation, ranges]);

  async function generateMergePreviews(selection: File[]) {
    const urls: string[] = [];
    const dpr = window.devicePixelRatio || 1;
    for (const f of selection) {
      const data = await f.arrayBuffer();
      const pdf = await getDocument({ data }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: PREVIEW_BASE_SCALE * dpr });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      urls.push(canvas.toDataURL('image/png'));
    }
    setPreviews(urls);
  }

  async function generateSplitPreviews(file: File) {
    const urls: string[] = [];
    const data = await file.arrayBuffer();
    const pdf = await getDocument({ data }).promise;
    const totalPages = pdf.numPages;
    const pageIndices: number[] = [];

    ranges.split(',').forEach(part => {
      let [start, end] = part.split('-').map(x => x.trim());
      let s = start === 'end' ? totalPages : parseInt(start, 10);
      let e = end ? (end === 'end' ? totalPages : parseInt(end, 10)) : s;
      if (isNaN(s) || s < 1) s = 1;
      if (isNaN(e) || e > totalPages) e = totalPages;
      for (let p = s; p <= e; p++) pageIndices.push(p - 1);
    });

    const dpr = window.devicePixelRatio || 1;
    for (const idx of pageIndices) {
      const page = await pdf.getPage(idx + 1);
      const viewport = page.getViewport({ scale: PREVIEW_BASE_SCALE * dpr });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      urls.push(canvas.toDataURL('image/png'));
    }
    setPreviews(urls);
  }

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return;
    setFiles(Array.from(fl));
    setOutputUrl('');
    setSelectedPreview(null);
  };

  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    setOutputUrl('');
    try {
      const pdfDoc = await PDFDocument.create();
      if (operation === 'merge' || operation === 'compress') {
        for (const f of files) {
          const bytes = await f.arrayBuffer();
          const src = await PDFDocument.load(bytes);
          const pages = await pdfDoc.copyPages(src, src.getPageIndices());
          pages.forEach(p => pdfDoc.addPage(p));
        }
      } else {
        const bytes = await files[0].arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const total = src.getPageCount();
        const indices: number[] = [];
        ranges.split(',').forEach(part => {
          let [start, end] = part.split('-').map(x => x.trim());
          let s = start === 'end' ? total : parseInt(start, 10);
          let e = end ? (end === 'end' ? total : parseInt(end, 10)) : s;
          if (isNaN(s) || s < 1) s = 1;
          if (isNaN(e) || e > total) e = total;
          for (let p = s; p <= e; p++) indices.push(p - 1);
        });
        const pages = await pdfDoc.copyPages(src, indices);
        pages.forEach(p => pdfDoc.addPage(p));
      }
      const out = await pdfDoc.save({ useObjectStreams: operation === 'compress' });
      setOutputUrl(URL.createObjectURL(new Blob([out], { type: 'application/pdf' })));
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <div className="card w-full max-w-screen-md">
        <h1 className="text-xl font-semibold mb-4">PDF Merge / Split / Compress</h1>

        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={e => handleFiles(e.target.files)}
          className="input mb-4"
        />
        {operation === 'merge' && (
          <p className="text-sm text-neutral-400 mb-4">
            Select two or more PDF files to merge.
          </p>
        )}
        {operation === 'split' && (
          <p className="text-sm text-neutral-400 mb-4">
            Select one PDF and enter page ranges (e.g. 1-3,5,7-end) to split into a new file.
          </p>
        )}
        {operation === 'compress' && (
          <p className="text-sm text-neutral-400 mb-4">
            Compression uses PDF object streams to reduce file size of the selected PDFs.
          </p>
        )}

        <div className="flex gap-2 mb-4">
          {(['merge','split','compress'] as Operation[]).map(op => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              className={
                'px-4 py-2 rounded-lg border ' +
                (operation === op
                  ? 'bg-brand text-white border-brand'
                  : 'border-neutral-700 hover:bg-neutral-800')
              }
            >
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </button>
          ))}
        </div>

        {operation === 'split' && (
          <div className="mb-4">
            <label className="block text-sm text-neutral-300 mb-1">Page ranges (e.g. 1-3,5,7-end)</label>
            <input
              className="input w-full"
              value={ranges}
              onChange={e => setRanges(e.target.value)}
              placeholder="1-end"
            />
          </div>
        )}

        {previews.length > 0 && (
          <>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {previews.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preview ${i + 1}`}
                  className="w-full border rounded cursor-pointer transform transition hover:scale-110"
                  onClick={() => setSelectedPreview(i)}
                />
              ))}
            </div>
            {selectedPreview !== null && (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                onClick={() => setSelectedPreview(null)}
              >
                <img
                  src={previews[selectedPreview]}
                  alt={`Preview ${selectedPreview + 1}`}
                  className="max-w-full max-h-full"
                />
              </div>
            )}
          </>
        )}

        <button
          className="btn w-full"
          onClick={run}
          disabled={busy || !files.length}
        >
          {busy ? 'Processing…' : 'Run'}
        </button>

        {outputUrl && (
          <a
            href={outputUrl}
            download={
              operation === 'merge'
                ? 'merged.pdf'
                : operation === 'split'
                ? 'split.pdf'
                : 'compressed.pdf'
            }
            className="btn w-full mt-4"
          >
            Download Result
          </a>
        )}
      </div>

      <div className="w-full max-w-screen-md mx-auto">
        <AdSlot slotId="0000000003" />
      </div>
    </div>
  );
}
