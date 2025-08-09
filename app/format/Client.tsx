'use client';

import { useMemo, useState } from 'react';
import yaml from 'js-yaml';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import AdSlot from '@/components/AdSlot';

type Mode = 'auto' | 'json' | 'yaml' | 'xml';

function Badge({
  color = 'neutral',
  children,
}: {
  color?: 'neutral' | 'green' | 'red' | 'blue' | 'yellow';
  children: React.ReactNode;
}) {
  const map: Record<string, string> = {
    neutral: 'bg-neutral-900 text-neutral-300 border-neutral-700',
    green: 'bg-green-900/30 text-green-300 border-green-800/60',
    red: 'bg-red-900/30 text-red-300 border-red-800/60',
    blue: 'bg-blue-900/30 text-blue-300 border-blue-800/60',
    yellow: 'bg-yellow-900/30 text-yellow-300 border-yellow-800/60',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${map[color]}`}>
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
      if (minify) {
        dump = dump.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
      }
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

      // Auto detect
      try {
        return tryJSON();
      } catch {}
      try {
        return tryYAML();
      } catch {}
      try {
        return tryXML();
      } catch {}

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
    <div className="space-y-5">
      {/* Tool strip */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-lg border border-neutral-700">
            {(['auto', 'json', 'yaml', 'xml'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-sm transition
                  ${mode === m ? 'bg-[#3B82F6] text-white' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200'}`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm">
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
              <Badge color="red">Invalid {mode === 'auto' ? 'input' : mode.toUpperCase()}</Badge>
            ) : detected !== 'auto' ? (
              <Badge color="green">Detected: {detected.toUpperCase()}</Badge>
            ) : (
              <Badge>Awaiting input…</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-sm"
            onClick={() => setInput('')}
          >
            Clear
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm"
            onClick={() => copy(output)}
            disabled={!output}
          >
            Copy output
          </button>
        </div>
      </div>

      {/* Editor panes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm text-neutral-300">Input</label>
            <span className="text-xs text-neutral-500">
              {inStats.words} words • {inStats.chars} chars • {inStats.lines} lines
            </span>
          </div>
          <textarea
            className="input font-mono h-64 sm:h-[420px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON, YAML, or XML here…'
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm text-neutral-300">Output</label>
            <div className="sm:hidden">
              {error ? (
                <Badge color="red">Invalid</Badge>
              ) : detected !== 'auto' ? (
                <Badge color="green">Detected: {detected.toUpperCase()}</Badge>
              ) : (
                <Badge>—</Badge>
              )}
            </div>
          </div>
          <textarea
            className={`input font-mono h-64 sm:h-[420px] ${error && !output ? 'bg-red-950 text-red-300' : ''}`}
            value={error && !output ? 'Invalid JSON/YAML/XML' : output}
            readOnly
            placeholder="Formatted output will appear here…"
          />
        </div>
      </div>

      {/* Tips + Ad */}
      <div className="mt-2 grid gap-4 lg:grid-cols-[1fr,330px]">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-300">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Auto‑detect</strong> tries JSON → YAML → XML in that order.</li>
            <li><strong>Minify</strong> removes whitespace; turn it off for pretty‑printed output.</li>
            <li>Everything runs locally — your data never leaves your browser.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
          <AdSlot slotId="0000000005" />
        </div>
      </div>
    </div>
  );
}
