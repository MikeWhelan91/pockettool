import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import Client from './Client';

export const metadata: Metadata = {
  title: 'Random Data Generators – PocketTool',
  description:
    'Generate UUIDs, passwords, names, emails, colors, numbers, and lorem ipsum — instantly in your browser. No uploads, no tracking.',
};

export default function Page() {
  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <div className="card w-full max-w-screen-lg">
        <h1 className="text-xl font-semibold mb-2">Random Data Generators</h1>
        <p className="text-neutral-400">
          Pick a generator, tweak options, and produce many results at once. Everything runs locally in your browser.
        </p>
        <div className="mt-4">
          <Client />
        </div>
      </div>
    </div>
  );
}
