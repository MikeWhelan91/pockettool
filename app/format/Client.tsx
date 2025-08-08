'use client';

import { useMemo, useState } from 'react';
import yaml from 'js-yaml';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import AdSlot from '@/components/AdSlot';

type Mode = 'auto' | 'json' | 'yaml' | 'xml';

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
      let obj;
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
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        format: !minify
      });
      setDetected('xml');
      return builder.build(obj);
    };

    try {
      if (mode === 'json') return tryJSON();
      if (mode === 'yaml') return tryYAML();
      if (mode === 'xml') return tryXML();

      // Auto-detect mode
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
      setError(e.message || 'Parsing error');
      return '';
    }
  }, [input, mode, minify]);

  function copy(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-300">
        <p>
          Paste or type your code below. The tool will <strong>auto-detect</strong> whether it’s JSON,
          YAML, or XML and instantly <strong>{minify ? 'minify' : 'pretty-print'}</strong> it. You can
          also force a specific format from the dropdown.
        </p>
        {detected !== 'auto' && (
          <p className="mt-1 text-green-400">
            Detected format: <strong>{detected.toUpperCase()}</strong>
          </p>
        )}
        {error && (
          <p className="mt-1 text-red-400">
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Format type</label>
          <select
            className="input"
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
          >
            <option value="auto">Auto Detect</option>
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="xml">XML</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button className="btn" onClick={() => setInput('')}>Clear</button>
          <button
            className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
            onClick={() => copy(output ?? '')}
            disabled={!output}
          >
            Copy output
          </button>
        </div>
        <div className="flex items-end gap-2">
          <input
            id="minify"
            type="checkbox"
            className="accent-green-500"
            checked={minify}
            onChange={(e) => setMinify(e.target.checked)}
          />
          <label htmlFor="minify" className="text-sm text-neutral-300">
            Minify output
          </label>
        </div>
      </div>

      {/* Editor areas */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Input</label>
          <textarea
            className="input font-mono"
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON, YAML, or XML here…"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Output</label>
          <textarea
            className={`input font-mono ${error ? 'bg-red-950 text-red-300' : ''}`}
            rows={14}
            value={error && !output ? 'Invalid JSON/YAML/XML' : output}
            readOnly
            placeholder="Formatted code will appear here…"
          />
        </div>
      </div>

      {/* Ad */}
      <div className="w-full max-w-screen-md mx-auto">
        <AdSlot slotId="0000000005" />
      </div>
    </div>
  );
}
