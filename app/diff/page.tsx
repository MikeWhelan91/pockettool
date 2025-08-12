// app/diff/page.tsx
import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Text Difference Checker — Utilixy',
  description:
    'Compare two blocks of text and highlight additions, deletions, and unchanged parts. Everything runs in your browser.',
  openGraph: {
    title: 'Text Difference Checker — Utilixy',
    description:
      'Compare two blocks of text and highlight additions, deletions, and unchanged parts. Everything runs in your browser.',
    url: '/diff',
    siteName: 'Utilixy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Text Difference Checker — Utilixy',
    description:
      'Compare two blocks of text and highlight additions, deletions, and unchanged parts. Everything runs in your browser.',
  },
};

export default function Page() {
  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <div className="card w-full max-w-screen-lg">
        <h1 className="text-xl font-semibold mb-2">Text Difference Checker</h1>
        <p className="text-neutral-400">
          Paste the original text on the left and the changed text on the right. See what’s been added and removed.
        </p>

        <div className="mt-4">
          <Client />
        </div>
      </div>
    </div>
  );
}
