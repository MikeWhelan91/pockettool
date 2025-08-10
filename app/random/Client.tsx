"use client";

import { useMemo, useState } from "react";
import {
  generatePassword,
  generateUUID,
  generateHexColor,
  generateRGBColor,
  generateSlug,
  generateLorem,
} from "@/lib/random";

type Gen = "password" | "uuid" | "hex" | "rgb" | "slug" | "lorem";

export default function RandomGeneratorPage() {
  // default: password
  const [gen, setGen] = useState<Gen>("password");
  const [count, setCount] = useState<number>(1);

  // password options
  const [pwUpper, setPwUpper] = useState(true);
  const [pwLower, setPwLower] = useState(true);
  const [pwNum, setPwNum] = useState(true);
  const [pwSym, setPwSym] = useState(true);
  const [pwLen, setPwLen] = useState<number>(12); // 12 default

  // lorem options
  const [loremType, setLoremType] = useState<"words" | "sentences" | "paragraphs">("sentences");
  const [loremCount, setLoremCount] = useState<number>(3);

  const output = useMemo(() => {
    const items: string[] = [];
    const n = Math.max(1, Math.min(500, count || 1));

    switch (gen) {
      case "password": {
        for (let i = 0; i < n; i++) {
          items.push(
            generatePassword(
              pwLen || 12,
              {
                includeUppercase: pwUpper,
                includeLowercase: pwLower,
                includeNumbers: pwNum,
                includeSymbols: pwSym,
              }
            )
          );
        }
        break;
      }
      case "uuid": {
        for (let i = 0; i < n; i++) items.push(generateUUID());
        break;
      }
      case "hex": {
        for (let i = 0; i < n; i++) items.push(generateHexColor());
        break;
      }
      case "rgb": {
        for (let i = 0; i < n; i++) items.push(generateRGBColor());
        break;
      }
      case "slug": {
        for (let i = 0; i < n; i++) items.push(generateSlug());
        break;
      }
      case "lorem": {
        for (let i = 0; i < n; i++) items.push(generateLorem({ type: loremType, count: loremCount || 3 }));
        break;
      }
    }

    return items.join("\n");
  }, [gen, count, pwLen, pwUpper, pwLower, pwNum, pwSym, loremType, loremCount]);

  return (
    <>
      {/* Left: controls */}
      <div className="card p-4 md:p-6">
        <div className="grid gap-5">
          {/* Generator tabs */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Random Generators</label>
            <div className="seg">
              {([
                { id: "password", label: "Password" },
                { id: "uuid", label: "Uuid" },
                { id: "hex", label: "Hex" },
                { id: "rgb", label: "Rgb" },
                { id: "slug", label: "Slug" },
                { id: "lorem", label: "Lorem" },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`seg-btn ${gen === t.id ? "seg-btn--active" : ""}`}
                  onClick={() => setGen(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inline options per generator */}
          {gen === "password" && (
            <div className="grid gap-3">
              <div className="text-sm text-muted">Password Options</div>

              {/* checkboxes + length inline */}
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={pwUpper} onChange={(e) => setPwUpper(e.target.checked)} />
                  Include Uppercase
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={pwLower} onChange={(e) => setPwLower(e.target.checked)} />
                  Include Lowercase
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={pwNum} onChange={(e) => setPwNum(e.target.checked)} />
                  Include Numbers
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={pwSym} onChange={(e) => setPwSym(e.target.checked)} />
                  Include Symbols
                </label>

                {/* length small input */}
                <label className="inline-flex items-center gap-2 text-sm ml-auto">
                  Length
                  <input
                    className="input-sm"
                    type="number"
                    min={4}
                    max={128}
                    value={pwLen}
                    onChange={(e) => setPwLen(Math.max(4, Math.min(128, parseInt(e.target.value || "12", 10))))}
                  />
                </label>
              </div>
            </div>
          )}

          {gen === "lorem" && (
            <div className="grid gap-3">
              <div className="text-sm text-muted">Lorem Options</div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="seg">
                  {(["words", "sentences", "paragraphs"] as const).map((t) => (
                    <button
                      key={t}
                      className={`seg-btn ${loremType === t ? "seg-btn--active" : ""}`}
                      onClick={() => setLoremType(t)}
                      type="button"
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <label className="inline-flex items-center gap-2 text-sm ml-auto">
                  Count
                  <input
                    className="input-sm"
                    type="number"
                    min={1}
                    max={50}
                    value={loremCount}
                    onChange={(e) => setLoremCount(Math.max(1, Math.min(50, parseInt(e.target.value || "3", 10))))}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Count + Generate */}
 <div className="flex flex-wrap items-center gap-3 min-w-0">
  <label className="inline-flex items-center gap-2 text-sm">
    Count
    <input
      className="input-sm"
      type="number"
      min={1}
      max={500}
      value={count}
      onChange={(e) =>
        setCount(Math.max(1, Math.min(500, parseInt(e.target.value || "1", 10))))
      }
    />
  </label>
  <button className="btn">Generate</button>
</div>

        </div>
      </div>

      {/* Right: output */}
      <div className="card p-4 md:p-6">
        <div className="grid gap-3">
          <label className="text-sm font-medium">Output</label>
          <textarea
            className="input min-h-[260px]"
            value={output}
            readOnly
          />
          <div className="flex gap-2">
            <button
              className="btn-ghost"
              onClick={() => {
                navigator.clipboard.writeText(output || "");
              }}
            >
              Copy
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                const blob = new Blob([output || ""], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${gen}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download .txt
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
