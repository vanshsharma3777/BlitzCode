"use client";

import React from "react";

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
  const acceptanceRate =
    totalSubmissions > 0
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-5">
      <StatCard
        label="PROBLEMS SOLVED"
        value={solvedProblems.toLocaleString()}
        description="Unique problems solved"
        accent="green"
      />

      <StatCard
        label="ACCEPTED"
        value={acceptedSubmissions.toLocaleString()}
        description={`${acceptanceRate}% acceptance rate`}
        accent="green"
      />

      <StatCard
        label="SUBMISSIONS"
        value={totalSubmissions.toLocaleString()}
        description="Total submissions"
        accent="yellow"
      />

      <StatCard
        label="CONTESTS"
        value={contestsParticipated}
        description="Contests participated"
        accent="cyan"
      />

      <StatCard
        label="CURRENT RATING"
        value={currentRating || "Unrated"}
        description={getRatingRankLabel(currentRating)}
        accent={getRatingAccent(currentRating)}
      />

      <StatCard
        label="HIGHEST RATING"
        value={highestRating || "Unrated"}
        description={getRatingRankLabel(highestRating)}
        accent={getRatingAccent(highestRating)}
      />
    </section>
  );
}

/* Individual StatCard Replicating LeetCode Card Architecture */
function StatCard({
  label,
  value,
  description,
  accent,
}: {
  label: string;
  value: string | number;
  description: string;
  accent: "green" | "red" | "yellow" | "orange" | "cyan" | "purple";
}) {
  const accentStyles = {
    green: {
      text: "text-emerald-400",
      glow: "bg-emerald-500/10",
      border: "hover:border-emerald-500/30",
      shadow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]",
    },
    red: {
      text: "text-rose-400",
      glow: "bg-rose-500/10",
      border: "hover:border-rose-500/30",
      shadow: "hover:shadow-[0_0_20px_rgba(244,63,94,0.12)]",
    },
    yellow: {
      text: "text-amber-400",
      glow: "bg-amber-500/10",
      border: "hover:border-amber-500/30",
      shadow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.12)]",
    },
    orange: {
      text: "text-orange-400",
      glow: "bg-orange-500/10",
      border: "hover:border-orange-500/30",
      shadow: "hover:shadow-[0_0_20px_rgba(249,115,22,0.12)]",
    },
    cyan: {
      text: "text-cyan-400",
      glow: "bg-cyan-500/10",
      border: "hover:border-cyan-500/30",
      shadow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.12)]",
    },
    purple: {
      text: "text-purple-400",
      glow: "bg-purple-500/10",
      border: "hover:border-purple-500/30",
      shadow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]",
    },
  }[accent];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/80 p-5 backdrop-blur-xl transition-all duration-300 ${accentStyles.border} ${accentStyles.shadow}`}
    >
      {/* Top Right Glow Circle */}
      <div
        className={`pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full ${accentStyles.glow} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <p className="text-[10px] tracking-[0.14em] text-zinc-500 font-semibold">
        {label}
      </p>

      <p className="text-2xl font-bold text-zinc-100 mt-3 group-hover:scale-[1.01] transition-transform origin-left">
        {value}
      </p>

      <p className={`text-xs mt-2 font-medium ${accentStyles.text}`}>
        {description}
      </p>
    </div>
  );
}

/* Accent Mapping Helpers */
function getRatingAccent(
  rating: number
): "green" | "red" | "yellow" | "orange" | "cyan" | "purple" {
  if (rating >= 2100) return "orange";
  if (rating >= 1900) return "purple";
  if (rating >= 1600) return "cyan";
  if (rating >= 1400) return "cyan";
  if (rating >= 1200) return "green";
  return "yellow";
}

function getRatingRankLabel(rating: number): string {
  if (rating >= 3000) return "Legendary Grandmaster";
  if (rating >= 2400) return "Grandmaster";
  if (rating >= 2100) return "Master";
  if (rating >= 1900) return "Candidate Master";
  if (rating >= 1600) return "Expert";
  if (rating >= 1400) return "Specialist";
  if (rating >= 1200) return "Pupil";
  if (rating > 0) return "Newbie";
  return "Unrated";
}