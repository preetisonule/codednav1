import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface AIInsightCardProps {
  title: string;
  icon: LucideIcon;
  accentClass?: string;
  children: ReactNode;
  delay?: number;
}

export default function AIInsightCard({ title, icon: Icon, accentClass = 'text-accent-violet', children, delay = 0 }: AIInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-6"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] ${accentClass}`}>
          <Icon size={16} />
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
