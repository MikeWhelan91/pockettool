'use client';

import { useState } from 'react';
import AdSlot from '@/components/AdSlot';

type Mode = 'encode' | 'decode';

export default function Base64Client() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  async function processText() {
    try {
      setError('');
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (e: any) {
      setError('Invalid input for chosen mode.');
    }
  }

  async function processFile(f: File) {
    try {
      setError('');
      if (mode === 'encode') {
        const data = await f.arrayBuffer();
        const bytes = new Uint8Array(data);
        let binary = '';
        for (let b of bytes) binary += String.fromCharCode(b);
        setOutput(btoa(binary));
      } else {
        const binary = atob(input.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes]);
        setOutput(URL.createObjectURL(blob));
      }
    } catch {
      setError('Error processing file.');
    }
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  return (
    <div className="space-y-6">
      {/* Mode selection */}
      <div className="grid sm:grid-cols-3 gap-3">
        <select
          className="input"
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
        >
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </select>
        <button className="btn" onClick={processText}>
          Process Text
        </button>
        <button
          className="btn"
          onClick={() => file && processFile(file)}
          disabled={!file}
        >
          Process File
        </button>
      </div>

      {/* Text input */}
      <textarea
        className="input font-mono"
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to encode…' : 'Enter Base64 to decode…'}
      />

      {/* File input */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="input"
      />

      {/* Output */}
      {output && mode === 'decode' && output.startsWith('blob:') ? (
        <div className="mt-2">
          <a href={output} download="decoded-file" className="underline">
            Download Decoded File
          </a>
        </div>
      ) : (
        <textarea
          className="input font-mono"
          rows={6}
          value={output}
          readOnly
          placeholder="Output will appear here…"
        />
      )}

      {/* Error */}
      {error && <div className="text-red-400 text-sm">{error}</div>}

      {/* Copy button */}
      {output && !output.startsWith('blob:') && (
        <button
          className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
          onClick={() => copy(output)}
        >
          Copy Output
        </button>
      )}

      {/* Ad */}
      <div className="w-full max-w-screen-md mx-auto">
        <AdSlot slotId="0000000006" />
      </div>
    </div>
  );
}
