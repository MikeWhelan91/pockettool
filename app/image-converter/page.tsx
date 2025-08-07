'use client';

import ImageConverter from '@/components/ImageConverter';
import AdSlot from '@/components/AdSlot';

export default function ImageConverterPage() {
  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      {/* Converter card: centered & capped width */}
      <div className="card w-full max-w-screen-md">
        <ImageConverter />
      </div>

      {/* Ad slot: same width & center */}
      <div className="w-full max-w-screen-md mx-auto">
        <AdSlot slotId="0000000002" />
      </div>
    </div>
  );
}
