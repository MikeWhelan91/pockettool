"use client";

import { useState } from "react";

type Mode = "encode" | "decode";

export default function Base64Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  async function processText() {
    try {
      setError("");
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError("Invalid input for chosen mode.");
      setOutput("");
    }
  }

  async function processFile(f: File) {
    try {
      setError("");
      if (mode === "encode") {
        const data = await f.arrayBuffer();
        const bytes = new Uint8Array(data);
        let binary = "";
        for (const b of bytes) binary += String.fromCharCode(b);
        setOutput(btoa(binary));
      } else {
        const binary = atob(input.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes]);
        setOutput(URL.createObjectURL(blob)); // user can download
      }
    } catch {
      setError("Error processing file.");
      setOutput("");
    }
  }

  return (
    <>
      {/* Single full-width card to match other tools */}
      <div className="card p-6 md:col-span-2 space-y-6">
        {/* Controls */}
        <div className="grid sm:grid-cols-3 gap-3">
          <select
            className="input"
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            aria-label="Mode"
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
        <div>
          <label className="block text-sm mb-1">
            {mode === "encode" ? "Enter text to encode…" : "Enter Base64 to decode…"}
          </label>
          <textarea
            className="input font-mono"
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* File input */}
        <div>
          <label className="block text-sm mb-1">Or select a file</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="input"
          />
        </div>

        {/* Output */}
        {output && mode === "decode" && output.startsWith("blob:") ? (
          <div className="mt-2">
            <a href={output} download="decoded-file" className="underline">
              Download decoded file
            </a>
          </div>
        ) : (
          <div>
            <label className="block text-sm mb-1">Output</label>
            <textarea
              className="input font-mono"
              rows={8}
              value={output}
              readOnly
              placeholder="Output will appear here…"
            />
          </div>
        )}

        {/* Error */}
        {error && <div className="text-red-400 text-sm">{error}</div>}

        {/* Copy */}
        {output && !output.startsWith("blob:") && (
          <button
            className="btn-ghost"
            onClick={() => navigator.clipboard?.writeText(output).catch(() => {})}
          >
            Copy output
          </button>
        )}
      </div>
    </>
  );
}
