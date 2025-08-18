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

  async function handle(file: File) {
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
      trackPdfAction("pdf_to_doc");
    } catch (err) {
      console.error(err);
      alert("Conversion failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
        }}
      />
      {busy && <p className="text-sm text-muted">Converting…</p>}
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
            <li>The DOCX downloads automatically after conversion.</li>
          </ol>
        </>
      </ToolHelp>
    </div>
  );
}

