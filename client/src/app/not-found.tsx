import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🛰️</div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">404 - Page Not Found</h2>
        <p className="text-slate-500 mb-8">
          The page you are looking for has drifted into deep space. Let's get you back home.
        </p>
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
