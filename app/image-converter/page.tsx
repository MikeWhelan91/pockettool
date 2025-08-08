// app/image-converter/page.tsx
import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Image Converter (PNG / JPEG / WEBP + HEIC) — PocketTool',
  description:
    'Convert images privately in your browser — supports PNG, JPEG, WEBP, and HEIC. Adjust quality, choose background color for JPEG, and convert multiple images at once.',
  openGraph: {
    title: 'Image Converter — PocketTool',
    description:
      'Convert images privately in your browser — supports PNG, JPEG, WEBP, and HEIC. Adjust quality, choose background color for JPEG, and convert multiple images at once.',
    url: '/image-converter',
    siteName: 'PocketTool',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Image Converter — PocketTool',
    description:
      'Convert images privately in your browser — supports PNG, JPEG, WEBP, and HEIC. Adjust quality, choose background color for JPEG, and convert multiple images at once.',
  },
};

export default function Page() {
  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <Client />
    </div>
  );
}
