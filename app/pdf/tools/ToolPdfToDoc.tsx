"use client";

import React, { useState } from "react";
import { Document, ImageRun, Packer, Paragraph } from "docx";
import { trackPdfAction, ToolHelp } from "../Client";

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
  return pdfjs;
}

export default function ToolPdfToDocUX() {
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const TOOL_LABEL = "PDF to Word";

  async function handle(file: File) {
    (window as any).gtag?.("event", "conversion_started", {
      event_category: "PDF Tools",
      event_label: TOOL_LABEL,
    });
    setBusy(true);
    try {
      const pdfjs = await loadPdfJs();
      const loading = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const children: any[] = [];

      for (let i = 1; i <= loading.numPages; i++) {
        const page = await loading.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((it: any) => it.str).join(" ").trim();
        if (text) {
          children.push(new Paragraph(text));
        }

        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, canvas, viewport }).promise;
          const dataUrl = canvas.toDataURL("image/png");
          const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
          const imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imgBytes,
                  type: "png",
                  transformation: { width: viewport.width, height: viewport.height },
                }),
              ],
            })
          );
        }
      }

      const doc = new Document({ sections: [{ properties: {}, children }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const name = file.name.replace(/\.pdf$/i, ".docx");
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      (window as any).gtag?.("event", "conversion_completed", {
        event_category: "PDF Tools",
        event_label: TOOL_LABEL,
        file_type: file.name.split(".").pop()?.toLowerCase(),
        file_size_kb: Math.round(file.size / 1024),
      });
      trackPdfAction("pdf_to_doc");
    } catch (err) {
      console.error(err);
      alert("Conversion failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <ToolHelp>
        <>
          <p>
            <b>Why</b>: Turn PDFs into editable Word documents.
          </p>
          <p>
            <b>How</b>:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Select a PDF file.</li>
            <li>Click <b>Convert to DOCX</b> to download.</li>
          </ol>
        </>
      </ToolHelp>
      <p className="text-xs text-yellow-400">
        <b>Warning</b>: Runs fully in your browser. Complex PDFs or
        formatting may export poorly or fail to convert.
      </p>
      <div className="grid md:grid-cols-[1fr_auto_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm">PDF file</span>
          <input
            type="file"
            accept="application/pdf"
            className="input mt-1"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
            }}
          />
        </label>
        {file && (
          <>
            <button
              className="btn-ghost"
              onClick={() => setFile(null)}
              disabled={busy}
            >
              Clear
            </button>
            <button
              className="btn"
              onClick={() => file && handle(file)}
              disabled={busy}
            >
              Convert to DOCX
            </button>
          </>
        )}
      </div>
      {busy && <p className="text-sm text-muted">Converting…</p>}
    </div>
  );
}

