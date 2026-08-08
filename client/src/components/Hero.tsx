import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

const EXAMPLE_USERS = ['torvalds', 'gaearon', 'sindresorhus', 'yyx990803'];

export default function Hero() {
  const navigate = useNavigate();

  const handleAnalyze = (username: string) => {
    navigate(`/analyze/${encodeURIComponent(username)}`);
  };

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28">
      {/* Ambient background: floating gradient blobs, kept behind a grid fade */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent-violet/20 blur-[110px] animate-blob" />
        <div className="absolute right-[8%] top-[20%] h-[26rem] w-[26rem] rounded-full bg-accent-cyan/15 blur-[100px] animate-blob-slow" />
        <div className="absolute left-[5%] top-[35%] h-[22rem] w-[22rem] rounded-full bg-accent-magenta/15 blur-[100px] animate-blob" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pill mx-auto mb-6 border-accent-violet/30 bg-accent-violet/10 text-accent-violet"
        >
          Every commit tells a story
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-5xl font-semibold leading-[1.05] text-white sm:text-6xl md:text-7xl"
        >
          Code<span className="gradient-text">DNA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-3 max-w-xl text-lg text-slate-400 sm:text-xl"
        >
          AI-powered Developer Growth Platform
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-base text-slate-400"
        >
          Analyze GitHub profiles, evaluate engineering skills, generate AI insights
          and personalized career recommendations — in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26 }}
          className="mt-10"
        >
          <SearchBar onSubmit={handleAnalyze} />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>Try:</span>
            {EXAMPLE_USERS.map((u) => (
              <button
                key={u}
                onClick={() => handleAnalyze(u)}
                className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 font-mono transition-colors hover:border-white/20 hover:text-white"
              >
                {u}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
