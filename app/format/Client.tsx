'use client';

import { useState, useCallback, useMemo } from 'react';
import yaml from 'js-yaml';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
// import Ad from '@/components/ads/Ad'; // ads disabled

type Mode = 'auto' | 'json' | 'yaml' | 'xml';

function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'green' | 'red';
  children: React.ReactNode;
}) {
  const cls =
    tone === 'green'
      ? 'border-green-300 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300'
      : tone === 'red'
      ? 'border-red-300 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300'
      : 'border-neutral-300 bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300';
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${cls}`}>
      {children}
    </span>
  );
}

export default function FormatterClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('auto');
  const [detected, setDetected] = useState<Mode>('auto');
  const [error, setError] = useState('');
  const [minify, setMinify] = useState(false);

  const output = useMemo(() => {
    setError('');
    if (!input.trim()) {
      setDetected('auto');
      return '';
    }

    const tryJSON = () => {
      const obj = JSON.parse(input);
      setDetected('json');
      return JSON.stringify(obj, null, minify ? 0 : 2);
    };

    const tryYAML = () => {
      let obj: any;
      try {
        obj = JSON.parse(input);
      } catch {
        obj = yaml.load(input);
      }
      setDetected('yaml');
      let dump = yaml.dump(obj, { indent: minify ? 0 : 2 });
      if (minify) dump = dump.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
      return dump;
    };

    const tryXML = () => {
      const parser = new XMLParser({ ignoreAttributes: false });
      const obj = parser.parse(input);
      const builder = new XMLBuilder({ ignoreAttributes: false, format: !minify });
      setDetected('xml');
      return builder.build(obj);
    };

    try {
      if (mode === 'json') return tryJSON();
      if (mode === 'yaml') return tryYAML();
      if (mode === 'xml') return tryXML();

      // auto
      try { return tryJSON(); } catch {}
      try { return tryYAML(); } catch {}
      try { return tryXML(); } catch {}

      setError('Could not detect a valid JSON, YAML, or XML structure.');
      setDetected('auto');
      return '';
    } catch (e: any) {
      setError(e?.message || 'Parsing error');
      return '';
    }
  }, [input, mode, minify]);

  const inStats = useMemo(() => {
    const chars = input.length;
    const words = (input.trim().match(/\S+/g) || []).length;
    const lines = input.split('\n').length;
    return { chars, words, lines };
  }, [input]);

  function copy(text: string) {
    if (!text) return;
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  return (
    <>
      <div className="card p-6 md:col-span-2 space-y-5">
        {/* Controls row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="seg">
              {(['auto', 'json', 'yaml', 'xml'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`seg-btn ${mode === m ? 'seg-btn--active' : ''}`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            <label className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
              <input
                type="checkbox"
                className="accent-blue-500"
                checked={minify}
                onChange={(e) => setMinify(e.target.checked)}
              />
              Minify
            </label>

            <div className="hidden sm:block">
              {error ? (
                <Badge tone="red">Invalid {mode === 'auto' ? 'input' : mode.toUpperCase()}</Badge>
              ) : detected !== 'auto' ? (
                <Badge tone="green">Detected: {detected.toUpperCase()}</Badge>
              ) : (
                <Badge>Awaiting input…</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-ghost" onClick={() => setInput('')}>
              Clear
            </button>
            <button className="btn" onClick={() => copy(output)} disabled={!output}>
              Copy output
            </button>
          </div>
        </div>

        {/* Editors */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm">Input</label>
              <span className="text-xs text-muted">
                {inStats.words} words • {inStats.chars} chars • {inStats.lines} lines
              </span>
            </div>
            <textarea
              className="input font-mono h-64 sm:h-[420px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste JSON, YAML, or XML here…"
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm">Output</label>
              <div className="sm:hidden">
                {error ? (
                  <Badge tone="red">Invalid</Badge>
                ) : detected !== 'auto' ? (
                  <Badge tone="green">Detected: {detected.toUpperCase()}</Badge>
                ) : (
                  <Badge>—</Badge>
                )}
              </div>
            </div>
            <textarea
              className={`input font-mono h-64 sm:h-[420px] ${error && !output ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' : ''}`}
              value={error && !output ? 'Invalid JSON/YAML/XML' : output}
              readOnly
              placeholder="Formatted output will appear here…"
            />
          </div>
        </div>
      </div>
    </>
  );
}
