import { motion } from 'framer-motion';
import { Dna } from 'lucide-react';

const MESSAGES = [
  'Sequencing repositories…',
  'Reading commit patterns…',
  'Calculating Developer Score…',
  'Generating AI insights…',
];

export default function Loading({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-32 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-violet to-accent-magenta shadow-glow"
      >
        <Dna className="text-white" size={26} />
      </motion.div>
      <div>
        <p className="font-display text-lg font-medium text-white">{message ?? 'Analyzing profile'}</p>
        <p className="mt-1 text-sm text-slate-500">{pickMessage()}</p>
      </div>
    </div>
  );
}

function pickMessage() {
  return MESSAGES[Math.floor(Date.now() / 1400) % MESSAGES.length];
}
