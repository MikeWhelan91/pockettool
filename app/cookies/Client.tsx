'use client'

export default function ResetConsent() {
  return (
    <button
      className="px-3 py-2 rounded bg-brand"
      onClick={() => {
        localStorage.removeItem('pt_consent');
        location.reload();
      }}
    >
      Reopen consent
    </button>
  );
}
