import { FormEvent, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

interface SearchBarProps {
  onSubmit: (username: string) => void;
  loading?: boolean;
  initialValue?: string;
}

export default function SearchBar({ onSubmit, loading, initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a GitHub username, e.g. torvalds"
          aria-label="GitHub username"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500
            outline-none transition-colors focus:border-accent-violet/60 focus:bg-white/[0.06]"
        />
      </div>
      <button type="submit" disabled={loading || !value.trim()} className="gradient-button whitespace-nowrap">
        {loading ? 'Analyzing…' : 'Analyze'}
        {!loading && <ArrowRight size={16} />}
      </button>
    </form>
  );
}
