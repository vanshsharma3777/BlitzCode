export const TIERS = [
  { min: 3000, name: "Legendary Grandmaster", color: "#ef4444" },
  { min: 2600, name: "International Grandmaster", color: "#ef4444" },
  { min: 2400, name: "Grandmaster", color: "#ef4444" },
  { min: 2300, name: "International Master", color: "#fb923c" },
  { min: 2100, name: "Master", color: "#fb923c" },
  { min: 1900, name: "Candidate Master", color: "#c084fc" },
  { min: 1600, name: "Expert", color: "#60a5fa" },
  { min: 1400, name: "Specialist", color: "#22d3ee" },
  { min: 1200, name: "Pupil", color: "#4ade80" },
  { min: 1, name: "Newbie", color: "#a1a1aa" },
] as const;

export function tierForRating(rating: number) {
  return TIERS.find((t) => rating >= t.min) ?? { min: 0, name: "Unrated", color: "#71717a" };
}

/** Colour for a rank string like "candidate master" (as returned by the CF API). */
export function colorForRank(rank?: string) {
  const r = (rank || "").toLowerCase();
  return TIERS.find((t) => t.name.toLowerCase() === r)?.color ?? "#71717a";
}

/** Progress (0-100) towards the next tier, plus the next tier's name and gap. */
export function nextTier(rating: number) {
  const asc = [...TIERS].reverse();
  const next = asc.find((t) => t.min > rating);
  if (!next) return { pct: 100, name: null as string | null, gap: 0 };
  const cur = tierForRating(rating);
  const lo = rating >= 1 ? cur.min : 0;
  return { pct: Math.min(100, Math.max(0, ((rating - lo) / (next.min - lo)) * 100)), name: next.name, gap: next.min - rating };
}