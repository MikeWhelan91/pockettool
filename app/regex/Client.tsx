"use client";

import { useState, useEffect } from "react";

interface Match {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexClient() {
  const [pattern, setPattern] = useState("\\w+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Test 123 test");
  const [replace, setReplace] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState("");

  const flagOpts = [
    { label: "g", title: "Global" },
    { label: "i", title: "Ignore case" },
    { label: "m", title: "Multiline" },
    { label: "s", title: "DotAll" },
    { label: "u", title: "Unicode" },
    { label: "y", title: "Sticky" },
  ];

  const toggleFlag = (f: string) => {
    setFlags((prev) => (prev.includes(f) ? prev.replace(f, "") : prev + f));
  };

  useEffect(() => {
    try {
      const re = new RegExp(pattern, flags);
      const res: Match[] = [];
      for (const m of text.matchAll(re)) {
        res.push({
          match: m[0],
          index: m.index ?? 0,
          groups: m.slice(1),
        });
      }
      setMatches(res);
      setError("");
    } catch {
      setMatches([]);
      setError("Invalid regular expression");
    }
  }, [pattern, flags, text]);

  function highlighted() {
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      return text.replace(re, (m) => `<mark>${m}</mark>`);
    } catch {
      return text;
    }
  }

  function replaced() {
    try {
      const re = new RegExp(pattern, flags);
      return text.replace(re, replace);
    } catch {
      return text;
    }
  }

  function split() {
    try {
      const re = new RegExp(pattern, flags);
      return text.split(re);
    } catch {
      return [text];
    }
  }

  // ---------- presets & cheatsheet ----------
  const presets: Array<{
    id: string;
    label: string;
    pattern: string;
    flags?: string;
    sample: string;
    replace?: string;
    hint?: string;
  }> = [
    {
      id: "emails",
      label: "Emails",
      pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,}",
      flags: "gi",
      sample:
        "Contact us at support@example.com or sales@utilixy.com. Personal: mike.whelan+test@gmail.com",
      hint: "Simple email match (no full RFC validation).",
    },
    {
      id: "urls",
      label: "URLs",
      pattern:
        "(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]{2,}(\\/[\\w./%#?=&-]*)?",
      flags: "gi",
      sample:
        "Docs: https://utilixy.com/regex and http://example.org. Also see www.example.com/about.",
      hint: "HTTP(S) + bare domains.",
    },
    {
      id: "numbers",
      label: "Numbers",
      pattern: "\\b\\d+(?:\\.\\d+)?\\b",
      flags: "g",
      sample:
        "Totals: 42, 3.14, 9000 and 0.5 are captured, but 1,234 (comma) is not.",
    },
    {
      id: "dates",
      label: "Dates (YYYY-MM-DD)",
      pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b",
      flags: "g",
      sample: "Events: 2025-08-13, 1999-12-31. Not: 13/08/2025.",
    },
    {
      id: "eircode",
      label: "Irish Eircode",
      pattern: "\\b[A-Za-z0-9]{3}\\s?[A-Za-z0-9]{4}\\b",
      flags: "gi",
      sample: "Sample addresses: D02 X285, T12XK4E, A65 F4E2.",
      hint: "Loose Eircode match; not validating routing key sets.",
    },
    {
      id: "capture-name",
      label: "Capture (First, Last)",
      pattern: "([A-Z][a-z]+)\\s([A-Z][a-z]+)",
      flags: "g",
      sample:
        "Team: John Smith, Alice Murphy, BRIAN o'reilly (won't match last one).",
      hint: "Shows capture groups (1, 2).",
    },
    {
      id: "whitespace",
      label: "Trim extra spaces",
      pattern: "\\s+",
      flags: "g",
      sample: "This    sentence   has   extra   spaces.",
      replace: " ",
      hint: "Use Replace panel to normalize whitespace.",
    },
  ];

  function applyPreset(p: (typeof presets)[number]) {
    setPattern(p.pattern);
    setFlags(p.flags ?? "g");
    setText(p.sample);
    if (p.replace !== undefined) setReplace(p.replace);
  }

  const cheatsheet: Array<{ title: string; rx: string; tip?: string }> = [
    { title: "Digit", rx: "\\d", tip: "Any 0–9" },
    { title: "Word char", rx: "\\w", tip: "A–Z, a–z, 0–9, _" },
    { title: "Whitespace", rx: "\\s", tip: "Space, tab, newline" },
    { title: "Start / End", rx: "^  $", tip: "Anchors (line start / end)" },
    { title: "One or more", rx: "+", tip: "Previous token 1..∞" },
    { title: "Zero or more", rx: "*", tip: "Previous token 0..∞" },
    { title: "Optional", rx: "?", tip: "Previous token 0 or 1" },
    { title: "Group / capture", rx: "( ... )", tip: "Saved as $1, $2…" },
    { title: "Non-capturing", rx: "(?: ... )" },
    { title: "Alternation", rx: "A|B", tip: "A or B" },
    { title: "Character set", rx: "[abc]" },
    { title: "Negated set", rx: "[^abc]" },
    { title: "Escape", rx: "\\.", tip: "Literal dot" },
  ];
  // ---------- END presets & cheatsheet ----------

  return (
    <>
      {/* Controls card */}
      <div className="card p-6 md:col-span-2 space-y-6">
        <div className="grid gap-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              className="input font-mono ring-1 ring-[color:var(--line)] focus:ring-[color:var(--accent)]"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Pattern (e.g. \\b\\d+(?:\\.\\d+)?\\b)"
              aria-label="Pattern"
            />
            <div className="input flex items-center gap-3 text-sm ring-1 ring-[color:var(--line)]">
              <span className="text-muted">Flags:</span>
              {flagOpts.map((f) => (
                <label key={f.label} title={f.title} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    className="accent-current"
                    checked={flags.includes(f.label)}
                    onChange={() => toggleFlag(f.label)}
                  />
                  {f.label}
                </label>
              ))}
            </div>
            <button
              className="btn"
              onClick={() => {
                setPattern("");
                setFlags("g");
                setText("");
                setReplace("");
                setMatches([]);
              }}
            >
              Clear
            </button>
          </div>

          {/* Presets row */}
          <div className="grid gap-2">
            <label className="text-sm text-muted">Presets & examples</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="seg-btn hover:brightness-110"
                  title={p.hint || p.label}
                  onClick={() => applyPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test string & Output side-by-side on desktop (aligned) */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Test string card */}
          <div className="card p-3 ring-1 ring-[color:var(--line)] min-h-[320px] flex flex-col">
            <div className="flex items-baseline justify-between">
              <label className="block text-sm font-medium">Test string</label>
              <span className="text-xs text-muted">Type or paste sample text</span>
            </div>
            <textarea
              className="input font-mono min-h-[220px] mt-2 ring-1 ring-[color:var(--line)] focus:ring-[color:var(--accent)] flex-1"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Output card */}
          <div className="card p-3 bg-[color:var(--bg-lift)] ring-1 ring-[color:var(--line)] min-h-[320px] flex flex-col">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-medium">Output</label>
              <span className="text-xs text-muted">
                Result after <code>Replace with</code> (or original if empty)
              </span>
            </div>
            <textarea
              className="input min-h-[220px] mt-2 bg-transparent flex-1"
              value={replaced()}
              readOnly
            />
            <div className="flex gap-2 mt-2">
              <button
                className="btn-ghost"
                onClick={() => navigator.clipboard.writeText(replaced() || "")}
              >
                Copy
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  const blob = new Blob([replaced() || ""], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `regex-output.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download .txt
              </button>
            </div>
          </div>
        </div>

        {/* Matches / Replace / Split / Highlighted */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Matches boxed */}
            <div className="card p-3 ring-1 ring-[color:var(--line)]">
              <label className="block text-sm mb-1 font-medium">Matches</label>
              {error ? (
                <div className="text-red-500/90 text-sm bg-[color:var(--bg-lift)] ring-1 ring-red-500/30 rounded px-3 py-2">
                  {error}
                </div>
              ) : matches.length ? (
                <ol className="text-sm space-y-1 bg-[color:var(--bg-lift)] rounded p-3 ring-1 ring-[color:var(--line)]">
                  {matches.map((m, i) => (
                    <li key={i}>
                      <code className="font-mono">{m.match}</code>{" "}
                      <span className="text-muted">@ {m.index}</span>
                      {m.groups.length ? (
                        <span className="text-muted"> — groups: {m.groups.join(", ")}</span>
                      ) : null}
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-muted text-sm">No matches</div>
              )}
            </div>

            {/* Replace boxed */}
            <div className="card p-3 ring-1 ring-[color:var(--line)]">
              <label className="block text-sm mb-1 font-medium">Replace with</label>
              <input
                className="input font-mono ring-1 ring-[color:var(--line)] focus:ring-[color:var(--accent)]"
                value={replace}
                onChange={(e) => setReplace(e.target.value)}
                placeholder="Replacement"
              />
              <p className="text-xs text-muted mt-1">
                Use <code>$1</code>, <code>$2</code>… to reference capture groups.
              </p>
            </div>

            {/* Split boxed */}
            <div className="card p-3 ring-1 ring-[color:var(--line)]">
              <label className="block text-sm mb-1 font-medium">Split</label>
              <div className="text-sm break-all bg-[color:var(--bg-lift)] rounded p-3 ring-1 ring-[color:var(--line)]">
                {JSON.stringify(split())}
              </div>
            </div>
          </div>

          {/* Highlighted boxed */}
          <div className="card p-3 ring-1 ring-[color:var(--line)]">
            <label className="block text-sm mb-1 font-medium">Highlighted</label>
            <div
              className="input font-mono whitespace-pre-wrap min-h-[220px] ring-1 ring-[color:var(--line)]"
              dangerouslySetInnerHTML={{ __html: highlighted() }}
            />
            <p className="text-xs text-muted mt-1">
              Matches are wrapped in <code>&lt;mark&gt;</code> for quick visual scanning.
            </p>
          </div>
        </div>

        {/* Quick cheatsheet — collapsed on mobile & desktop */}
        <details className="border-t border-line pt-4">
          <summary className="text-sm font-medium cursor-pointer select-none">
            Quick regex cheatsheet
          </summary>
          <div className="grid sm:grid-cols-3 gap-2 text-sm mt-3">
            {cheatsheet.map((c, i) => (
              <div key={i} className="rounded bg-[color:var(--bg-lift)] p-3 ring-1 ring-[color:var(--line)]">
                <div className="font-medium">{c.title}</div>
                <code className="block mt-1">{c.rx}</code>
                {c.tip ? <div className="text-muted mt-1">{c.tip}</div> : null}
              </div>
            ))}
          </div>
        </details>
      </div>
    </>
  );
}
