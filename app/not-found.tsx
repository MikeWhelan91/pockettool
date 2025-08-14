// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-muted mb-6">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link href="/" className="btn">Go home</Link>
    </main>
  );
}
