'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">Something went wrong</h2>
        <p className="text-slate-500 mb-8">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="text-slate-500 font-bold hover:text-slate-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
