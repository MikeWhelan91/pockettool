"use client";

export default function ReopenConsentButton() {
  const handleClick = () => {
    // Funding Choices (Consent Mode) dialog, if present
    // @ts-ignore
    window?.googlefc?.showConsentDialog?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="ml-2 inline-flex items-center rounded-lg px-3 py-1 text-sm border hover:bg-gray-800/40"
    >
      Manage consent
    </button>
  );
}
