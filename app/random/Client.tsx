'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import AdSlot from '@/components/AdSlot';

/* -------------------- helpers -------------------- */

function randInt(min: number, max: number) {
  // inclusive
  return Math.floor(min + Math.random() * (max - min + 1));
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function cryptoUUID(): string {
  try {
    // modern browsers
    return crypto.randomUUID();
  } catch {
    // fallback v4-ish
    const s: string[] = [];
    const hex = '0123456789abcdef';
    for (let i = 0; i < 36; i++) s[i] = pick(hex.split(''));
    s[14] = '4';
    // @ts-ignore
    s[19] = hex[(parseInt(s[19], 16) & 0x3) | 0x8];
    s[8] = s[13] = s[18] = s[23] = '-';
    return s.join('');
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ensureAtLeastOneFromEach(charsets: string[]): string {
  return charsets.map(cs => cs[randInt(0, cs.length - 1)]).join('');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/* -------------------- static pools -------------------- */

const FIRST_NAMES = [
  'Alex','Sam','Taylor','Jordan','Riley','Casey','Jamie','Drew','Kai','Avery',
  'Morgan','Quinn','Reese','Elliot','Aria','Mila','Liam','Noah','Emma','Olivia',
];

const LAST_NAMES = [
  'Smith','Johnson','Williams','Brown','Jones','Miller','Davis','Garcia','Rodriguez','Wilson',
  'Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White',
];

const EMAIL_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'proton.me', 'example.com'];

const LOREM = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','ut',
  'enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris',
  'nisi','aliquip','ex','ea','commodo','consequat'
];

/* -------------------- generator types -------------------- */

type GenKind =
  | 'uuid'
  | 'password'
  | 'name'
  | 'email'
  | 'lorem'
  | 'number'
  | 'hexColor'
  | 'rgbColor'
  | 'slug';

type GeneratedItem = { value: string };

export default function RandomClient() {
  const [kind, setKind] = useState<GenKind>('uuid');
  const [count, setCount] = useState<number>(10);

  // password opts
  const [pwLen, setPwLen] = useState<number>(16);
  const [pwLower, setPwLower] = useState<boolean>(true);
  const [pwUpper, setPwUpper] = useState<boolean>(true);
  const [pwDigits, setPwDigits] = useState<boolean>(true);
  const [pwSymbols, setPwSymbols] = useState<boolean>(true);
  const [pwAvoidAmbiguous, setPwAvoidAmbiguous] = useState<boolean>(true);

  // email opts
  const [emailWithDots, setEmailWithDots] = useState<boolean>(false);
  const [emailUseNumbers, setEmailUseNumbers] = useState<boolean>(true);

  // lorem opts
  const [loremMode, setLoremMode] = useState<'words' | 'sentences' | 'paragraphs'>('sentences');
  const [loremAmount, setLoremAmount] = useState<number>(3);
  const [loremMinWords, setLoremMinWords] = useState<number>(6);
  const [loremMaxWords, setLoremMaxWords] = useState<number>(14);

  // number opts
  const [numMin, setNumMin] = useState<number>(1);
  const [numMax, setNumMax] = useState<number>(1000);

  // slug opts
  const [slugSource, setSlugSource] = useState<string>('My awesome Title!');

  const [results, setResults] = useState<GeneratedItem[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charsets = useMemo(() => {
    const ambiguous = 'O0o1Il|`\'"[]{}/\\,.;:';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}<>?/.,~';
    const active: string[] = [];
    if (pwLower) active.push(lower);
    if (pwUpper) active.push(upper);
    if (pwDigits) active.push(digits);
    if (pwSymbols) active.push(symbols);
    const joined = active.join('');
    const safeJoined =
      pwAvoidAmbiguous ? joined.split('').filter(c => !ambiguous.includes(c)).join('') : joined;
    return { active, pool: safeJoined };
  }, [pwLower, pwUpper, pwDigits, pwSymbols, pwAvoidAmbiguous]);

  const generateOnce = useCallback((): string => {
    switch (kind) {
      case 'uuid': {
        return cryptoUUID();
      }
      case 'password': {
        if (charsets.active.length === 0) return '';
        // guarantee at least one from each active set
        const baseline = ensureAtLeastOneFromEach(charsets.active);
        let remaining = pwLen - baseline.length;
        const pool = charsets.pool;
        const out: string[] = baseline.split('');
        for (let i = 0; i < remaining; i++) out.push(pool[randInt(0, pool.length - 1)]);
        return shuffle(out).join('');
      }
      case 'name': {
        const first = pick(FIRST_NAMES);
        const last = pick(LAST_NAMES);
        return `${first} ${last}`;
      }
      case 'email': {
        const first = pick(FIRST_NAMES).toLowerCase();
        const last = pick(LAST_NAMES).toLowerCase();
        let handle = `${first}${emailWithDots ? '.' : ''}${last}`;
        if (emailUseNumbers) handle += String(randInt(1, 9999));
        return `${handle}@${pick(EMAIL_DOMAINS)}`;
      }
      case 'lorem': {
        function makeSentence(): string {
          const n = randInt(loremMinWords, loremMaxWords);
          const words = Array.from({ length: n }, () => pick(LOREM));
          const sentence = words.join(' ');
          return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
        }
        if (loremMode === 'words') {
          const words = Array.from({ length: loremAmount }, () => pick(LOREM));
          return words.join(' ');
        }
        if (loremMode === 'sentences') {
          return Array.from({ length: loremAmount }, () => makeSentence()).join(' ');
        }
        // paragraphs
        return Array.from({ length: loremAmount }, () =>
          Array.from({ length: randInt(2, 5) }, () => makeSentence()).join(' ')
        ).join('\n\n');
      }
      case 'number': {
        const lo = Math.min(numMin, numMax);
        const hi = Math.max(numMin, numMax);
        return String(randInt(lo, hi));
      }
      case 'hexColor': {
        const r = randInt(0, 255);
        const g = randInt(0, 255);
        const b = randInt(0, 255);
        const hex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${hex(r)}${hex(g)}${hex(b)}`;
      }
      case 'rgbColor': {
        const r = randInt(0, 255);
        const g = randInt(0, 255);
        const b = randInt(0, 255);
        return `rgb(${r}, ${g}, ${b})`;
      }
      case 'slug': {
        return slugify(LOREM.slice(0, randInt(3, 7)).join(' ') + ' ' + slugSource);
      }
      default:
        return '';
    }
  }, [
    kind,
    charsets.active,
    charsets.pool,
    pwLen,
    loremMode,
    loremAmount,
    loremMinWords,
    loremMaxWords,
    numMin,
    numMax,
    emailWithDots,
    emailUseNumbers,
    slugSource,
  ]);

  const generate = useCallback(() => {
    const items: GeneratedItem[] = [];
    for (let i = 0; i < count; i++) {
      const v = generateOnce();
      items.push({ value: v });
    }
    setResults(items);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [count, generateOnce]);

  const copyAll = () => {
    const txt = results.map(r => r.value).join('\n');
    navigator.clipboard?.writeText(txt).catch(() => {});
  };

  const downloadTxt = () => {
    const txt = results.map(r => r.value).join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kind}-results.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="space-y-6">
      {/* top controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Generator</label>
          <select
            className="input"
            value={kind}
            onChange={(e) => setKind(e.target.value as GenKind)}
          >
            <option value="uuid">UUID (v4)</option>
            <option value="password">Password</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="lorem">Lorem Ipsum</option>
            <option value="number">Number</option>
            <option value="hexColor">Hex Color</option>
            <option value="rgbColor">RGB Color</option>
            <option value="slug">Slug</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-neutral-300 mb-1">How many</label>
          <input
            className="input"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value))))}
          />
        </div>

        <div className="flex items-end gap-2">
          <button className="btn" onClick={generate}>Generate</button>
          <button
            className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
            onClick={() => setResults([])}
          >
            Clear
          </button>
        </div>
      </div>

      {/* options panel */}
      <OptionsPanel
        kind={kind}
        // password
        pwLen={pwLen}
        setPwLen={setPwLen}
        pwLower={pwLower}
        setPwLower={setPwLower}
        pwUpper={pwUpper}
        setPwUpper={setPwUpper}
        pwDigits={pwDigits}
        setPwDigits={setPwDigits}
        pwSymbols={pwSymbols}
        setPwSymbols={setPwSymbols}
        pwAvoidAmbiguous={pwAvoidAmbiguous}
        setPwAvoidAmbiguous={setPwAvoidAmbiguous}
        // email
        emailWithDots={emailWithDots}
        setEmailWithDots={setEmailWithDots}
        emailUseNumbers={emailUseNumbers}
        setEmailUseNumbers={setEmailUseNumbers}
        // lorem
        loremMode={loremMode}
        setLoremMode={setLoremMode}
        loremAmount={loremAmount}
        setLoremAmount={setLoremAmount}
        loremMinWords={loremMinWords}
        setLoremMinWords={setLoremMinWords}
        loremMaxWords={loremMaxWords}
        setLoremMaxWords={setLoremMaxWords}
        // number
        numMin={numMin}
        setNumMin={setNumMin}
        numMax={numMax}
        setNumMax={setNumMax}
        // slug
        slugSource={slugSource}
        setSlugSource={setSlugSource}
      />

      {/* results */}
      <div>
        <label className="block text-sm text-neutral-300 mb-1">Results</label>
        <textarea
          ref={textareaRef}
          className="input font-mono"
          rows={10}
          value={results.map(r => r.value).join('\n')}
          onChange={() => {}}
          readOnly
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="btn" onClick={copyAll}>Copy all</button>
          <button
            className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
            onClick={downloadTxt}
          >
            Download .txt
          </button>
        </div>
      </div>

      {/* ad */}
      <div className="w-full max-w-screen-md mx-auto">
        <AdSlot slotId="0000000006" />
      </div>
    </div>
  );
}

/* -------------------- options panel -------------------- */

type OptionsProps = {
  kind: GenKind;
  // password
  pwLen: number; setPwLen: (n: number) => void;
  pwLower: boolean; setPwLower: (b: boolean) => void;
  pwUpper: boolean; setPwUpper: (b: boolean) => void;
  pwDigits: boolean; setPwDigits: (b: boolean) => void;
  pwSymbols: boolean; setPwSymbols: (b: boolean) => void;
  pwAvoidAmbiguous: boolean; setPwAvoidAmbiguous: (b: boolean) => void;
  // email
  emailWithDots: boolean; setEmailWithDots: (b: boolean) => void;
  emailUseNumbers: boolean; setEmailUseNumbers: (b: boolean) => void;
  // lorem
  loremMode: 'words' | 'sentences' | 'paragraphs'; setLoremMode: (m: 'words' | 'sentences' | 'paragraphs') => void;
  loremAmount: number; setLoremAmount: (n: number) => void;
  loremMinWords: number; setLoremMinWords: (n: number) => void;
  loremMaxWords: number; setLoremMaxWords: (n: number) => void;
  // number
  numMin: number; setNumMin: (n: number) => void;
  numMax: number; setNumMax: (n: number) => void;
  // slug
  slugSource: string; setSlugSource: (s: string) => void;
};

function OptionsPanel(props: OptionsProps) {
  const {
    kind,
    // pw
    pwLen, setPwLen,
    pwLower, setPwLower,
    pwUpper, setPwUpper,
    pwDigits, setPwDigits,
    pwSymbols, setPwSymbols,
    pwAvoidAmbiguous, setPwAvoidAmbiguous,
    // email
    emailWithDots, setEmailWithDots,
    emailUseNumbers, setEmailUseNumbers,
    // lorem
    loremMode, setLoremMode,
    loremAmount, setLoremAmount,
    loremMinWords, setLoremMinWords,
    loremMaxWords, setLoremMaxWords,
    // number
    numMin, setNumMin,
    numMax, setNumMax,
    // slug
    slugSource, setSlugSource,
  } = props;

  if (kind === 'password') {
    return (
      <div className="card">
        <h2 className="font-semibold mb-3">Password options</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="block">
            <span className="block text-sm text-neutral-300 mb-1">Length</span>
            <input
              className="input"
              type="number"
              min={4}
              max={128}
              value={pwLen}
              onChange={(e) => setPwLen(Math.max(4, Math.min(128, Number(e.target.value))))}
            />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pwLower} onChange={(e) => setPwLower(e.target.checked)} />
            Lowercase
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pwUpper} onChange={(e) => setPwUpper(e.target.checked)} />
            Uppercase
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pwDigits} onChange={(e) => setPwDigits(e.target.checked)} />
            Digits
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pwSymbols} onChange={(e) => setPwSymbols(e.target.checked)} />
            Symbols
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pwAvoidAmbiguous} onChange={(e) => setPwAvoidAmbiguous(e.target.checked)} />
            Avoid ambiguous (O/0, l/1, etc.)
          </label>
        </div>
      </div>
    );
  }

  if (kind === 'email') {
    return (
      <div className="card">
        <h2 className="font-semibold mb-3">Email options</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={emailWithDots} onChange={(e) => setEmailWithDots(e.target.checked)} />
            Use dot between first/last
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={emailUseNumbers} onChange={(e) => setEmailUseNumbers(e.target.checked)} />
            Append random numbers
          </label>
        </div>
      </div>
    );
  }

  if (kind === 'lorem') {
    return (
      <div className="card">
        <h2 className="font-semibold mb-3">Lorem ipsum options</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="block">
            <span className="block text-sm text-neutral-300 mb-1">Mode</span>
            <select className="input" value={loremMode} onChange={(e) => setLoremMode(e.target.value as any)}>
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm text-neutral-300 mb-1">Amount</span>
            <input
              className="input"
              type="number"
              min={1}
              max={100}
              value={loremAmount}
              onChange={(e) => setLoremAmount(Math.max(1, Math.min(100, Number(e.target.value))))}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm text-neutral-300 mb-1">Min words / sentence</span>
              <input
                className="input"
                type="number"
                min={2}
                max={30}
                value={loremMinWords}
                onChange={(e) => setLoremMinWords(Math.max(2, Math.min(30, Number(e.target.value))))}
              />
            </label>
            <label className="block">
              <span className="block text-sm text-neutral-300 mb-1">Max words / sentence</span>
              <input
                className="input"
                type="number"
                min={loremMinWords}
                max={50}
                value={loremMaxWords}
                onChange={(e) => setLoremMaxWords(Math.max(loremMinWords, Math.min(50, Number(e.target.value))))}
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'number') {
    return (
      <div className="card">
        <h2 className="font-semibold mb-3">Number options</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="block">
            <span className="block text-sm text-neutral-300 mb-1">Min</span>
            <input
              className="input"
              type="number"
              value={numMin}
              onChange={(e) => setNumMin(Number(e.target.value))}
            />
          </label>
          <label className="block">
            <span className="block text-sm text-neutral-300 mb-1">Max</span>
            <input
              className="input"
              type="number"
              value={numMax}
              onChange={(e) => setNumMax(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
    );
  }

  if (kind === 'slug') {
    return (
      <div className="card">
        <h2 className="font-semibold mb-3">Slug options</h2>
        <label className="block">
          <span className="block text-sm text-neutral-300 mb-1">Source text</span>
          <input
            className="input"
            type="text"
            value={slugSource}
            onChange={(e) => setSlugSource(e.target.value)}
            placeholder="My awesome Title!"
          />
        </label>
      </div>
    );
  }

  // for uuid, name, colors: no options needed
  return null;
}
