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
    setFlags((prev) =>
      prev.includes(f) ? prev.replace(f, "") : prev + f
    );
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

  return (
    <div className="card p-6 md:col-span-2 space-y-6">
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          className="input font-mono"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Pattern"
          aria-label="Pattern"
        />
        <div className="input flex items-center gap-2 text-sm">
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

      <div>
        <label className="block text-sm mb-1">Test string</label>
        <textarea
          className="input font-mono"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Matches</label>
        {error ? (
          <div className="text-red-400 text-sm">{error}</div>
        ) : matches.length ? (
          <ol className="text-sm space-y-1">
            {matches.map((m, i) => (
              <li key={i}>
                <code>{m.match}</code> @ {m.index}
                {m.groups.length ? ` groups: ${m.groups.join(", ")}` : ""}
              </li>
            ))}
          </ol>
        ) : (
          <div className="text-muted text-sm">No matches</div>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Replace with</label>
        <input
          className="input font-mono"
          value={replace}
          onChange={(e) => setReplace(e.target.value)}
          placeholder="Replacement"
        />
        <div className="text-sm mt-2">{replaced()}</div>
      </div>

      <div>
        <label className="block text-sm mb-1">Split</label>
        <div className="text-sm break-all">{JSON.stringify(split())}</div>
      </div>

      <div>
        <label className="block text-sm mb-1">Highlighted</label>
        <div
          className="input font-mono whitespace-pre-wrap min-h-[8rem]"
          dangerouslySetInnerHTML={{ __html: highlighted() }}
        />
      </div>
    </div>
  );
}

