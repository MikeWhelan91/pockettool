'use client';

import { useMemo, useState } from 'react';
import AdSlot from '@/components/AdSlot';

/** ------------ tiny diff helpers (no external deps) ------------ **/

type Token = { t: string; key: string };
type Op = { type: 'eq' | 'add' | 'del'; items: Token[] };

/** LCS-based diff. Tokenizer decides granularity (words vs lines). */
function diffTokens(aTokens: Token[], bTokens: Token[]): Op[] {
  const n = aTokens.length;
  const m = bTokens.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        aTokens[i].key === bTokens[j].key ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops: Op[] = [];
  let i = 0,
    j = 0;
  const push = (type: Op['type'], tok: Token) => {
    const last = ops[ops.length - 1];
    if (last && last.type === type) last.items.push(tok);
    else ops.push({ type, items: [tok] });
  };

  while (i < n && j < m) {
    if (aTokens[i].key === bTokens[j].key) {
      push('eq', bTokens[j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push('del', aTokens[i]);
      i++;
    } else {
      push('add', bTokens[j]);
      j++;
    }
  }
  while (i < n) push('del', aTokens[i++]);
  while (j < m) push('add', bTokens[j++]);
  return ops;
}

function tokenizeWords(s: string): Token[] {
  // Keep words and whitespace/punctuation so spacing is preserved
  const parts = s.match(/(\s+|[^\s]+)/g) || [];
  return parts.map((t, idx) => ({ t, key: t.trim() ? `W:${t}` : `S:${t.length}` }));
}

function tokenizeLines(s: string): Token[] {
  const parts = s.split(/\r?\n/);
  return parts.map((t, idx) => ({ t, key: `L:${t}` }));
}

/** Render ops into HTML for word view (inline marks). */
function renderWordOps(ops: Op[]) {
  return (
    <div
      className="border border-neutral-800 rounded-lg p-3 bg-neutral-900 text-sm leading-6 overflow-auto font-mono whitespace-pre-wrap"
    >
      {ops.map((op, i) => {
        if (op.type === 'eq') {
          return op.items.map((x, k) => <span key={`${i}:${k}`}>{x.t}</span>);
        }
        if (op.type === 'add') {
          return (
            <mark
              key={i}
              className="bg-green-900/40 text-green-200 rounded px-0.5"
              style={{ border: '1px solid rgba(34,197,94,0.35)' }}
            >
              {op.items.map((x, k) => (
                <span key={`${i}:${k}`}>{x.t}</span>
              ))}
            </mark>
          );
        }
        return (
          <span key={i} className="bg-red-900/30 text-red-300 rounded px-0.5 line-through">
            {op.items.map((x, k) => (
              <span key={`${i}:${k}`}>{x.t}</span>
            ))}
          </span>
        );
      })}
    </div>
  );
}

function renderLineOps(ops: Op[]) {
  return (
    <pre className="border border-neutral-800 rounded-lg p-3 bg-neutral-900 text-sm overflow-auto font-mono whitespace-pre-wrap">
      {ops.map((op) => {
        if (op.type === 'eq') return op.items.map((x) => `  ${x.t}`).join('\n') + '\n';
        if (op.type === 'add') return op.items.map((x) => `+ ${x.t}`).join('\n') + '\n';
        return op.items.map((x) => `- ${x.t}`).join('\n') + '\n';
      }).join('')}
    </pre>
  );
}

/** ------------ component ------------ **/

type View = 'words' | 'lines';

export default function DiffClient() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [view, setView] = useState<View>('words');

  const ops = useMemo(() => {
    const aTok = view === 'words' ? tokenizeWords(a) : tokenizeLines(a);
    const bTok = view === 'words' ? tokenizeWords(b) : tokenizeLines(b);
    return diffTokens(aTok, bTok);
  }, [a, b, view]);

  function swap() {
    setA(b);
    setB(a);
  }
  function copyHTML() {
    // Quick-and-dirty copy of rendered HTML for word view
    const el = document.getElementById('diff-render-root');
    if (!el) return;
    const html = el.innerHTML;
    navigator.clipboard?.writeText(html).catch(() => {});
  }
  function copyUnified() {
    // Produce a simple unified-like text for lines view
    const lines: string[] = [];
    ops.forEach((op) => {
      if (op.type === 'eq') op.items.forEach((i) => lines.push(`  ${i.t}`));
      if (op.type === 'add') op.items.forEach((i) => lines.push(`+ ${i.t}`));
      if (op.type === 'del') op.items.forEach((i) => lines.push(`- ${i.t}`));
    });
    navigator.clipboard?.writeText(lines.join('\n')).catch(() => {});
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-neutral-300 mb-1">View</label>
          <select
            className="input"
            value={view}
            onChange={(e) => setView(e.target.value as View)}
          >
            <option value="words">Words (inline)</option>
            <option value="lines">Lines (unified)</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button className="btn" onClick={swap}>Swap</button>
          <button
            className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
            onClick={() => {
              setA('');
              setB('');
            }}
          >
            Clear
          </button>
        </div>
        <div className="flex items-end gap-2">
          {view === 'words' ? (
            <button
              className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
              onClick={copyHTML}
            >
              Copy rendered HTML
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
              onClick={copyUnified}
            >
              Copy unified text
            </button>
          )}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Original</label>
          <textarea
            className="input font-mono"
            rows={12}
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="Paste original text here…"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Changed</label>
          <textarea
            className="input font-mono"
            rows={12}
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="Paste changed text here…"
          />
        </div>
      </div>

      {/* Output */}
      <div id="diff-render-root">
        {view === 'words' ? renderWordOps(ops) : renderLineOps(ops)}
      </div>

      {/* Legend */}
      <div className="text-xs text-neutral-400">
        <span className="bg-red-900/30 text-red-300 rounded px-1 mr-2 line-through">removed</span>
        <span
          className="bg-green-900/40 text-green-200 rounded px-1"
          style={{ border: '1px solid rgba(34,197,94,0.35)' }}
        >
          added
        </span>
      </div>

      {/* Ad */}
      <div className="w-full max-w-screen-md mx-auto">
        <AdSlot slotId="0000000007" />
      </div>
    </div>
  );
}
