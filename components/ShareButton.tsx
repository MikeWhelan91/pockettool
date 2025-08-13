"use client";

export default function ShareButton() {
  async function handleShare() {
    const url = window.location.href;
    const title = document.title;
    if (navigator.share) {
      try {
        await navigator.share({ url, title });
        return;
      } catch {
        // ignore
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  }

  return (
    <button className="btn-ghost" onClick={handleShare} aria-label="Share">
      Share
    </button>
  );
}
