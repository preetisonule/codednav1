import { motion } from 'framer-motion';
import { Award, Boxes, Sparkles } from 'lucide-react';
import { RoadmapStage } from '@/types';

export default function RoadmapTimeline({ stages }: { stages: RoadmapStage[] }) {
  return (
    <div className="glass-card p-6 sm:p-8">
      <h3 className="mb-1 text-lg font-semibold text-white">Career Roadmap</h3>
      <p className="mb-8 text-sm text-slate-400">A staged plan to grow your Developer Score and market readiness.</p>

      <ol className="relative space-y-10 border-l border-white/10 pl-8">
        {stages.map((stage, i) => (
          <motion.li
            key={stage.stage}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative"
          >
            <span className="absolute -left-[2.35rem] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-accent-violet/40 bg-base-900 font-mono text-[11px] text-accent-violet">
              {i + 1}
            </span>

            <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h4 className="text-base font-semibold text-white">{stage.stage}</h4>
              <span className="text-xs font-mono text-slate-500">{stage.timeframe}</span>
            </div>

            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Boxes size={13} /> Technologies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stage.technologies.map((t) => (
                    <span key={t} className="pill">{t}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Sparkles size={13} /> Project ideas
                </div>
                <ul className="space-y-1 text-sm text-slate-300">
                  {stage.projects.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Award size={13} /> Certifications
                </div>
                {stage.certifications.length > 0 ? (
                  <ul className="space-y-1 text-sm text-slate-300">
                    {stage.certifications.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">Optional at this stage</p>
                )}
              </div>
            </div>

            <p className="mt-3 text-xs font-medium text-accent-cyan">{stage.estimatedImprovement}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
