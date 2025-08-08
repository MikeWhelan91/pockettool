import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'QR / Wi-Fi QR Generator — PocketTool',
  description:
    'Create QR codes for URLs, text, and Wi-Fi (WPA/WEP/Open). PNG & SVG downloads. Everything runs in your browser.',
  openGraph: {
    title: 'QR / Wi-Fi QR Generator — PocketTool',
    description:
      'Create QR codes for URLs, text, and Wi-Fi. PNG & SVG downloads. Private, in-browser.',
    url: '/qr',
    siteName: 'PocketTool',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'QR / Wi-Fi QR Generator — PocketTool',
    description:
      'Create QR codes for URLs, text, and Wi-Fi. PNG & SVG downloads. Private, in-browser.',
  },
};

export default function Page() {
  return <Client />;
}
