import { Link } from 'react-router-dom';
import { Dna } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-32 text-center">
      <Dna size={40} className="text-accent-violet" />
      <h1 className="font-display text-3xl font-semibold text-white">Page not found</h1>
      <p className="max-w-sm text-sm text-slate-400">
        The page you're looking for doesn't exist. It might have been moved or the URL might be incorrect.
      </p>
      <Link to="/" className="gradient-button mt-2">Back to home</Link>
    </div>
  );
}
