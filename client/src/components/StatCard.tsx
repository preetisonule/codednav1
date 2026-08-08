import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accentClass?: string;
  delay?: number;
}

export default function StatCard({ label, value, icon: Icon, accentClass = 'text-accent-violet', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className="glass-card p-5 transition-colors hover:border-white/[0.14]"
    >
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] ${accentClass}`}>
        <Icon size={18} />
      </div>
      <p className="font-display text-2xl font-semibold text-white">{value}</p>
      <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-500">{label}</p>
    </motion.div>
  );
}
