// app/pdf/page.tsx
import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'PDF Merge / Split / Compress — PocketTool',
  description:
    'Merge multiple PDFs, split page ranges, or compress — all in your browser. No uploads.',
  openGraph: {
    title: 'PDF Merge / Split / Compress — PocketTool',
    description:
      'Merge multiple PDFs, split page ranges, or compress — all in your browser. No uploads.',
    url: '/pdf',
    siteName: 'PocketTool',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'PDF Merge / Split / Compress — PocketTool',
    description:
      'Merge multiple PDFs, split page ranges, or compress — all in your browser. No uploads.',
  },
};

export default function Page() {
  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <Client />
    </div>
  );
}
