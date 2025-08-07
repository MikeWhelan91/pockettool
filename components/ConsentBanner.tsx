'use client';

import { useEffect, useState } from 'react';

export default function ConsentBanner() {
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    const v = localStorage.getItem('pt_consent');
    setSeen(!!v);
  }, []);

  if (seen) return null;

  return (
    <div className="card mb-6">
      <p className="mb-3">
        We use a small number of ads to keep tools free. Accept cookies to enable ads.
        You can change this anytime in Cookies.
      </p>
      <div className="flex gap-3">
        <button
          className="btn"
          onClick={() => {
            localStorage.setItem('pt_consent', 'yes');
            location.reload();
          }}
        >
          Accept
        </button>
        <button
          className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800"
          onClick={() => {
            localStorage.setItem('pt_consent', 'no');
            location.reload();
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
