import { Link } from 'react-router-dom';
import { Dna } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-base-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-violet to-accent-magenta shadow-glow transition-transform group-hover:scale-105">
            <Dna className="h-4.5 w-4.5 text-white" size={18} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            Code<span className="gradient-text">DNA</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
        </nav>

        <Link to="/" className="pill hover:border-white/20 hover:text-white transition-colors">
          Analyze a profile
        </Link>
      </div>
    </header>
  );
}
