import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import Client from './Client';

export const metadata: Metadata = {
  title: 'JSON / YAML / XML Formatter & Validator – PocketTool',
  description:
    'Format and validate JSON, YAML, or XML instantly in your browser. Detects errors and pretty-prints code.',
};

export default function Page() {
  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <div className="card w-full max-w-screen-lg">
        <h1 className="text-xl font-semibold mb-2">JSON / YAML / XML Formatter & Validator</h1>
        <p className="text-neutral-400">
          Paste your code, pick a format, and get a nicely formatted, validated result — all locally.
        </p>
        <div className="mt-4">
          <Client />
        </div>
      </div>
    </div>
  );
}
