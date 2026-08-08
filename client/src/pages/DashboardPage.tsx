import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  CheckCircle2,
  FileText,
  GaugeCircle,
  Sparkles,
  TrendingDown,
} from 'lucide-react';

import { useGithubAnalysis } from '@/hooks/useGithubAnalysis';
import ProfileCard from '@/components/ProfileCard';
import StatsGrid from '@/components/StatsGrid';
import LanguagePieChart from '@/components/LanguagePieChart';
import TopRepositoryCard from '@/components/TopRepositoryCard';
import DeveloperScore from '@/components/DeveloperScore';
import AIInsightCard from '@/components/AIInsightCard';
import RoadmapTimeline from '@/components/RoadmapTimeline';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import SearchBar from '@/components/SearchBar';

export default function DashboardPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { status, data, error, analyze } = useGithubAnalysis();

  useEffect(() => {
    if (username) analyze(username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  if (status === 'loading' || status === 'idle') {
    return <Loading message={`Analyzing @${username}`} />;
  }

  if (status === 'error' && error) {
    return (
      <div className="px-6 py-24">
        <ErrorMessage status={error.status} message={error.message} onRetry={() => username && analyze(username)} />
      </div>
    );
  }

  if (!data) return null;

  const { insights } = data;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-lg">
        <SearchBar initialValue={username} onSubmit={(u) => navigate(`/analyze/${u}`)} loading={false} />
      </motion.div>

      <ProfileCard profile={data.profile} />
      <StatsGrid analysis={data} />

      <div className="grid gap-6 lg:grid-cols-2">
        <LanguagePieChart data={data.languageBreakdown} />
        <TopRepositoryCard repo={data.topRepository} />
      </div>

      <DeveloperScore score={data.developerScore} />

      {/* AI INSIGHTS SECTION */}
      <div>
        <div className="mb-5 flex items-center gap-2">
          <Sparkles size={18} className="text-accent-violet" />
          <h2 className="text-xl font-semibold text-white">AI Insights</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <AIInsightCard title="Strengths" icon={CheckCircle2} accentClass="text-emerald-400" delay={0}>
            <ul className="space-y-2 text-sm text-slate-300">
              {insights.strengths.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" /> {s}
                </li>
              ))}
            </ul>
          </AIInsightCard>

          <AIInsightCard title="Weaknesses" icon={TrendingDown} accentClass="text-rose-400" delay={0.05}>
            <ul className="space-y-2 text-sm text-slate-300">
              {insights.weaknesses.map((w) => (
                <li key={w} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" /> {w}
                </li>
              ))}
            </ul>
          </AIInsightCard>

          <AIInsightCard title="Engineering Level & Suggested Role" icon={Briefcase} accentClass="text-accent-cyan" delay={0.1}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Engineering Level</span>
                <span className="pill border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan">{insights.engineeringLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Suggested Role</span>
                <span className="text-sm font-medium text-white">{insights.suggestedRole}</span>
              </div>
            </div>
          </AIInsightCard>

          <AIInsightCard title="Interview Readiness" icon={GaugeCircle} accentClass="text-amber-400" delay={0.15}>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-accent-magenta"
                  style={{ width: `${insights.interviewReadiness.score}%` }}
                />
              </div>
              <span className="font-mono text-sm text-white">{insights.interviewReadiness.score}/100</span>
            </div>
            <ul className="space-y-1.5 text-sm text-slate-300">
              {insights.interviewReadiness.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" /> {n}
                </li>
              ))}
            </ul>
          </AIInsightCard>

          <div className="md:col-span-2">
            <AIInsightCard title="Resume Summary" icon={FileText} accentClass="text-accent-violet" delay={0.2}>
              <p className="text-sm leading-relaxed text-slate-300">{insights.resumeSummary}</p>
            </AIInsightCard>
          </div>
        </div>
      </div>

      <RoadmapTimeline stages={insights.learningRoadmap} />
    </div>
  );
}
