'use client';

import { useState } from 'react';
import {
  generateLorem,
  generateUUID,
  generatePassword,
  generateHexColor,
  generateRGBColor,
  generateSlug,
} from '@/lib/random';
import AdSlot from '@/components/AdSlot';

type Generator = 'password' | 'uuid' | 'hex' | 'rgb' | 'slug' | 'lorem';

export default function RandomGeneratorPage() {
  const [generator, setGenerator] = useState<Generator>('password');
  const [count, setCount] = useState(1);
  const [output, setOutput] = useState('');
  const [loremType, setLoremType] = useState<'words' | 'sentences' | 'paragraphs'>('sentences');
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const run = () => {
    if (generator === 'password') {
      setOutput(
        generatePassword(count, {
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSymbols,
        })
      );
    } else if (generator === 'uuid') setOutput(generateUUID());
    else if (generator === 'hex') setOutput(generateHexColor());
    else if (generator === 'rgb') setOutput(generateRGBColor());
    else if (generator === 'slug') setOutput(generateSlug());
    else if (generator === 'lorem') setOutput(generateLorem({ count, type: loremType }));
  };

  return (
    <>
      <div className="card w-full max-w-screen-md">
        <h1 className="text-xl font-semibold mb-4">Random Generators</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {(['password', 'uuid', 'hex', 'rgb', 'slug', 'lorem'] as Generator[]).map((g) => (
            <button
              key={g}
              onClick={() => setGenerator(g)}
              className={
                'px-4 py-2 rounded-lg border text-sm ' +
                (generator === g
                  ? 'bg-brand text-white border-brand'
                  : 'border-neutral-700 hover:bg-neutral-800')
              }
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>

        {generator === 'password' && (
          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm text-neutral-300">Password Options</label>
            <div className="flex flex-col gap-1 text-sm">
              <label>
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                />{' '}
                Include Uppercase Letters
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                />{' '}
                Include Lowercase Letters
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                />{' '}
                Include Numbers
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                />{' '}
                Include Symbols
              </label>
            </div>
          </div>
        )}

        {generator === 'lorem' && (
          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm text-neutral-300">Lorem type</label>
            <select
              value={loremType}
              onChange={(e) => setLoremType(e.target.value as any)}
              className="input"
            >
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>
        )}

        {(generator === 'password' || generator === 'lorem') && (
          <div className="mb-4">
<label className="text-sm text-neutral-300">
  {generator === 'password' ? 'Length' : 'Amount'}
</label>
            <input
              type="number"
              className="input"
              value={count}
              min={1}
              onChange={(e) => setCount(parseInt(e.target.value))}
            />
          </div>
        )}

        <button className="btn w-full mb-4" onClick={run}>
          Generate
        </button>

        <textarea
          className="input text-sm w-full min-h-[120px]"
          readOnly
          value={output}
          placeholder="Output will appear here..."
        />

        <div className="mt-6 text-xs text-neutral-400">
          <p className="mb-2 font-semibold text-white">Tips:</p>
          <ul className="list-disc list-inside">
            <li><strong>Password:</strong> Secure, customizable strings with new toggle options</li>
            <li><strong>UUID:</strong> Universally unique identifiers</li>
            <li><strong>Hex/RGB:</strong> Useful for generating random brand or theme colors</li>
            <li><strong>Slug:</strong> Random short strings for use in URLs</li>
            <li><strong>Lorem:</strong> Now supports <em>paragraph</em> and <em>sentence</em> generation modes</li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-screen-md mx-auto">
        <AdSlot slotId="0000000006" />
      </div>
    </>
  );
}
