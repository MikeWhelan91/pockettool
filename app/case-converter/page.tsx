import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import Client from './Client';

export const metadata: Metadata = {
  title: 'Case Converter – PocketTool',
  description:
    'UPPER↔lower, Title, Sentence, Capitalize, Slug, camelCase, PascalCase, snake_case, kebab-case. All client-side.',
};

export default function Page() {
  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <div className="card w-full max-w-screen-md">
        <h1 className="text-xl font-semibold mb-2">Case Converter / Text Transformer</h1>
        <p className="text-neutral-400">
          Paste text, choose a transform, and copy the result. Nothing leaves your browser.
        </p>
        <div className="mt-4">
          <Client />
        </div>
      </div>
    </div>
  );
}
