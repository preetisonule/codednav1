/** Formats a raw count into a compact display string (1200 -> "1.2k"). */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

/** Formats an ISO date string into "Jan 2021" style. */
export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(iso));
}

/** Maps a Developer Score (0-100) to a qualitative tier label + color token. */
export function scoreTier(score: number): { label: string; colorClass: string } {
  if (score >= 80) return { label: 'Exceptional', colorClass: 'text-accent-cyan' };
  if (score >= 60) return { label: 'Strong', colorClass: 'text-accent-violet' };
  if (score >= 35) return { label: 'Developing', colorClass: 'text-amber-400' };
  return { label: 'Early Stage', colorClass: 'text-rose-400' };
}

/** Deterministic color per language, drawn from the brand accent palette. */
const LANGUAGE_COLORS = ['#8b7cf6', '#4fd1e8', '#f45fb0', '#fbbf24', '#34d399', '#60a5fa', '#f97316', '#a78bfa'];
export function colorForIndex(index: number): string {
  return LANGUAGE_COLORS[index % LANGUAGE_COLORS.length];
}
