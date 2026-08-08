import { motion } from 'framer-motion';
import { DeveloperScoreBreakdown } from '@/types';
import { scoreTier } from '@/utils/format';

const BREAKDOWN_ITEMS: { key: keyof DeveloperScoreBreakdown; label: string; max: number }[] = [
  { key: 'repositoryScore', label: 'Repositories', max: 25 },
  { key: 'starScore', label: 'Community Stars', max: 30 },
  { key: 'forkScore', label: 'Forks Received', max: 15 },
  { key: 'modernStackBonus', label: 'Modern Stack', max: 20 },
  { key: 'consistencyScore', label: 'Consistency', max: 10 },
];

export default function DeveloperScore({ score }: { score: DeveloperScoreBreakdown }) {
  const tier = scoreTier(score.total);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score.total / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="mb-5 text-base font-semibold text-white">Developer Score</h3>

      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#score-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b7cf6" />
                <stop offset="50%" stopColor="#4fd1e8" />
                <stop offset="100%" stopColor="#f45fb0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-display text-3xl font-semibold text-white">{score.total}</span>
            <span className={`text-xs font-medium ${tier.colorClass}`}>{tier.label}</span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-3">
          {BREAKDOWN_ITEMS.map((item) => {
            const value = score[item.key] as number;
            return (
              <div key={item.key}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{item.label}</span>
                  <span className="font-mono text-slate-500">{value}/{item.max}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / item.max) * 100}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
