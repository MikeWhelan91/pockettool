import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Base64 Encoder / Decoder – PocketTool',
  description: 'Convert text or files to and from Base64 instantly in your browser.',
};

export default function Page() {
  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <div className="card w-full max-w-screen-lg">
        <h1 className="text-xl font-semibold mb-2">Base64 Encoder / Decoder</h1>
        <p className="text-neutral-400">
          Encode or decode Base64 strings or files — all locally, nothing is uploaded.
        </p>
        <div className="mt-4">
          <Client />
        </div>
      </div>
    </div>
  );
}
