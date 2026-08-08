import { motion } from 'framer-motion';
import { Building2, ExternalLink, MapPin, Users } from 'lucide-react';
import { GithubUser } from '@/types';
import { formatCompactNumber, formatMonthYear } from '@/utils/format';

export default function ProfileCard({ profile }: { profile: GithubUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 sm:p-7"
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row">
        <img
          src={profile.avatar_url}
          alt={`${profile.login} avatar`}
          className="h-20 w-20 rounded-2xl border border-white/10 object-cover shadow-card sm:h-24 sm:w-24"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-semibold text-white">{profile.name ?? profile.login}</h2>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sm text-accent-cyan transition-colors hover:text-accent-cyan/80"
            >
              @{profile.login} <ExternalLink size={13} />
            </a>
          </div>

          {profile.bio && <p className="mt-2 max-w-xl text-sm text-slate-400">{profile.bio}</p>}

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {profile.location}
              </span>
            )}
            {profile.company && (
              <span className="flex items-center gap-1.5">
                <Building2 size={14} /> {profile.company}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users size={14} /> {formatCompactNumber(profile.followers)} followers · {formatCompactNumber(profile.following)} following
            </span>
            <span>Joined {formatMonthYear(profile.created_at)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
