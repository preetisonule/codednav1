import { BookMarked, GitFork, Star, Target } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { AnalysisResult } from '@/types';
import { formatCompactNumber } from '@/utils/format';

export default function StatsGrid({ analysis }: { analysis: AnalysisResult }) {
  const items = [
    { label: 'Repositories', value: formatCompactNumber(analysis.repoCount), icon: BookMarked, accentClass: 'text-accent-violet' },
    { label: 'Total Stars', value: formatCompactNumber(analysis.totalStars), icon: Star, accentClass: 'text-amber-400' },
    { label: 'Total Forks', value: formatCompactNumber(analysis.totalForks), icon: GitFork, accentClass: 'text-accent-cyan' },
    { label: 'Developer Score', value: `${analysis.developerScore.total}/100`, icon: Target, accentClass: 'text-accent-magenta' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item, i) => (
        <StatCard key={item.label} {...item} delay={i * 0.05} />
      ))}
    </div>
  );
}
