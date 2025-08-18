"use client";

import React, { useState } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { blobFromUint8, trackPdfAction, ToolHelp } from "../Client";

export default function ToolDocToPdfUX() {
  const [busy, setBusy] = useState(false);

  async function handle(file: File) {
    setBusy(true);
    try {
      const { extractRawText } = await import("mammoth/mammoth.browser");
      const { value } = await extractRawText({ arrayBuffer: await file.arrayBuffer() });

      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const size = 12;
      const lineHeight = 14;
      const margin = 50;
      let page = pdf.addPage();
      let y = page.getHeight() - margin;
      const maxWidth = page.getWidth() - margin * 2;

      function writeLine(text: string) {
        if (y < margin) {
          page = pdf.addPage();
          y = page.getHeight() - margin;
        }
        page.drawText(text, { x: margin, y, size, font });
        y -= lineHeight;
      }

      for (const rawLine of value.split(/\r?\n/)) {
        const words = rawLine.split(/\s+/);
        let current = "";
        for (const w of words) {
          const test = current ? current + " " + w : w;
          if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
            writeLine(current);
            current = w;
          } else {
            current = test;
          }
        }
        if (current) writeLine(current);
      }

      const bytes = await pdf.save();
      const name = file.name.replace(/\.docx?$/i, ".pdf");
      const { url } = await blobFromUint8(bytes, name);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      trackPdfAction("doc_to_pdf");
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
        accept=".doc,.docx"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
        }}
      />
      {busy && <p className="text-sm text-muted">Converting…</p>}
      <ToolHelp>
        <>
          <p>
            <b>Why</b>: Convert Word documents to PDF for universal sharing.
          </p>
          <p>
            <b>How</b>:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Select a .docx file.</li>
            <li>The PDF downloads automatically after conversion.</li>
          </ol>
        </>
      </ToolHelp>
    </div>
  );
}

