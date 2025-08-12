'use client';

import { useMemo, useState } from 'react';
import AdSlot from '@/components/AdSlot';

type Mode =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'capitalize'
  | 'slug'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab';

function toTitle(str: string) {
  return str.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}
function toSentence(str: string) {
  return str.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (s) => s.toUpperCase());
}
function toCapitalize(str: string) {
  return str.replace(/\b\w/g, (s) => s.toUpperCase());
}
function toSlug(str: string) {
  return str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function wordTokens(str: string) {
  return (str.match(/[A-Za-z0-9]+/g) || []).map((w) => w);
}
function toCamel(str: string) {
  const w = wordTokens(str.toLowerCase());
  if (!w.length) return '';
  return w.map((x, i) => (i ? x[0].toUpperCase() + x.slice(1) : x)).join('');
}
function toPascal(str: string) {
  const w = wordTokens(str.toLowerCase());
  return w.map((x) => x[0].toUpperCase() + x.slice(1)).join('');
}
function toSnake(str: string) {
  const w = wordTokens(str.toLowerCase());
  return w.join('_');
}
function toKebab(str: string) {
  const w = wordTokens(str.toLowerCase());
  return w.join('-');
}
function transform(text: string, mode: Mode) {
  switch (mode) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return toTitle(text);
    case 'sentence': return toSentence(text);
    case 'capitalize': return toCapitalize(text);
    case 'slug': return toSlug(text);
    case 'camel': return toCamel(text);
    case 'pascal': return toPascal(text);
    case 'snake': return toSnake(text);
    case 'kebab': return toKebab(text);
    default: return text;
  }
}
function copy(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {});
}
function stats(text: string) {
  const chars = text.length;
  const words = (text.trim().match(/\S+/g) || []).length;
  const lines = text.split('\n').length;
  return { chars, words, lines };
}

export default function CaseConverterClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('lower');

  const output = useMemo(() => transform(input, mode), [input, mode]);
  const inStats = useMemo(() => stats(input), [input]);
  const outStats = useMemo(() => stats(output), [output]);

  return (
    <>
      {/* single full-width card to match other pages under ToolLayout */}
      <div className="card p-6 md:col-span-2 space-y-6">
        {/* Controls */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Transform</label>
            <select
              className="input"
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
            >
              <option value="upper">UPPER CASE</option>
              <option value="lower">lower case</option>
              <option value="title">Title Case</option>
              <option value="sentence">Sentence case</option>
              <option value="capitalize">Capitalize Words</option>
              <option value="slug">Slug (kebab + clean)</option>
              <option value="camel">camelCase</option>
              <option value="pascal">PascalCase</option>
              <option value="snake">snake_case</option>
              <option value="kebab">kebab-case</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button className="btn" onClick={() => setInput('')}>Clear input</button>
            <button className="btn-ghost" onClick={() => copy(output)}>Copy output</button>
          </div>
        </div>

        {/* Textareas */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Input</label>
            <textarea
              className="input"
              rows={10}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your text here…"
            />
            <p className="text-xs text-muted mt-1">
              {inStats.words} words • {inStats.chars} chars • {inStats.lines} lines
            </p>
          </div>
          <div>
            <label className="block text-sm mb-1">Output</label>
            <textarea
              className="input"
              rows={10}
              value={output}
              readOnly
              placeholder="Result appears here…"
            />
            <p className="text-xs text-muted mt-1">
              {outStats.words} words • {outStats.chars} chars • {outStats.lines} lines
            </p>
          </div>
        </div>
      </div>

      {/* Ad slot spans layout width */}
      <div className="md:col-span-2">
        <AdSlot slotId="0000000004" />
      </div>
    </>
  );
}
