import { motion } from 'framer-motion';
import { ExternalLink, GitFork, Star, Trophy } from 'lucide-react';
import { GithubRepo } from '@/types';

export default function TopRepositoryCard({ repo }: { repo: GithubRepo | null }) {
  if (!repo) {
    return (
      <div className="glass-card flex h-full flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-slate-500">No original repositories found to highlight.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card flex h-full flex-col p-6"
    >
      <div className="mb-3 flex items-center gap-2 text-accent-magenta">
        <Trophy size={16} />
        <span className="text-xs font-medium uppercase tracking-wide">Top Repository</span>
      </div>

      <h3 className="mb-1.5 truncate text-lg font-semibold text-white">{repo.name}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">
        {repo.description ?? 'No description provided.'}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
        {repo.language && <span className="pill">{repo.language}</span>}
        <span className="flex items-center gap-1"><Star size={14} className="text-amber-400" /> {repo.stargazers_count}</span>
        <span className="flex items-center gap-1"><GitFork size={14} className="text-accent-cyan" /> {repo.forks_count}</span>
      </div>

      <a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
      >
        Open on GitHub <ExternalLink size={14} />
      </a>
    </motion.div>
  );
}
