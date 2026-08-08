import { Dna, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
        <div className="flex items-center gap-2">
          <Dna size={16} className="text-accent-violet" />
          <span>CodeDNA — AI-Powered Developer Growth Platform</span>
        </div>
        <div className="flex items-center gap-5">
          <span>Built with React, TypeScript &amp; Express</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Github size={15} /> Source
          </a>
        </div>
      </div>
    </footer>
  );
}
