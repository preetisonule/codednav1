import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { LanguageBreakdown } from '@/types';
import { colorForIndex } from '@/utils/format';

export default function LanguagePieChart({ data }: { data: LanguageBreakdown[] }) {
  if (data.length === 0) {
    return (
      <div className="glass-card flex h-full flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-slate-500">No language data available for this profile yet.</p>
      </div>
    );
  }

  const top = data[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Language Distribution</h3>
        <span className="pill">
          Most used: <span className="font-medium text-white">{top.language}</span>
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="h-56 w-full sm:w-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="language"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colorForIndex(i)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} repos`, name]}
                contentStyle={{
                  background: '#11141c',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  fontSize: 12,
                  color: '#e2e8f0',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="w-full flex-1 space-y-2.5">
          {data.slice(0, 6).map((lang, i) => (
            <li key={lang.language} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorForIndex(i) }} />
                {lang.language}
              </span>
              <span className="font-mono text-xs text-slate-500">{lang.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
