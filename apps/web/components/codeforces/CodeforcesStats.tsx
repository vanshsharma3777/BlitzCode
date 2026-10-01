"use client";

import { CheckCheck, Send, Swords, Target } from "lucide-react";
import { AnimatedNumber, Panel, StatTile } from "../ProfileUI";
import { nextTier, tierForRating } from "../../utils/rankCF";

export interface CodeforcesStatsProps {
  acceptedSubmissions: number;
  contestsParticipated: number;
  currentRating: number;
  highestRating: number;
  solvedProblems: number;
  totalSubmissions: number;
}

export default function CodeforcesStats({
  acceptedSubmissions,
  contestsParticipated,
  currentRating,
  highestRating,
  solvedProblems,
  totalSubmissions,
}: CodeforcesStatsProps) {
  const acceptance = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;
  const tier = tierForRating(currentRating);
  const peak = tierForRating(highestRating);
  const nxt = nextTier(currentRating);

  return (
    <section className="mt-5 grid gap-4 lg:grid-cols-5">
      {/* Hero: rating in rank colour with progress to next tier */}
      <Panel accent="sky" className="lg:col-span-2">
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full opacity-20 blur-3xl"
          style={{ background: tier.color }}
        />
        <p className="text-xs font-medium text-zinc-500">Current rating</p>
        <p className="mt-2 text-6xl font-extrabold tracking-tight" style={{ color: tier.color, textShadow: `0 0 28px ${tier.color}66` }}>
          {currentRating ? <AnimatedNumber value={currentRating} /> : "Unrated"}
        </p>
        <p className="mt-1 text-sm font-semibold" style={{ color: tier.color }}>{tier.name}</p>

        {currentRating > 0 && (
          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${nxt.pct}%`, background: tier.color, boxShadow: `0 0 12px ${tier.color}88` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              {nxt.name ? `${nxt.gap} points to ${nxt.name}` : "Top tier reached"}
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
          <span className="text-xs text-zinc-500">Peak rating</span>
          <span className="text-sm font-bold" style={{ color: peak.color }}>
            {highestRating || "Unrated"}
            {highestRating > 0 && <span className="ml-2 text-xs font-medium text-zinc-500">{peak.name}</span>}
          </span>
        </div>
      </Panel>

      {/* Supporting tiles */}
      <div className="grid grid-cols-2 gap-4 lg:col-span-3">
        <StatTile icon={Target} label="Problems solved" value={solvedProblems} hint="Unique problems" accent="emerald" />
        <StatTile icon={CheckCheck} label="Accepted" value={acceptedSubmissions} hint={`${acceptance}% acceptance`} accent="sky" />
        <StatTile icon={Send} label="Submissions" value={totalSubmissions} hint="All verdicts" accent="amber" />
        <StatTile icon={Swords} label="Contests" value={contestsParticipated} hint="Rated participations" accent="violet" />
      </div>
    </section>
  );
}