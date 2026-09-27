"use client";

import React from "react";

interface Props {
  rank: string;
  maxRank: string;
  contribution: number;
}

export default function CodeforcesSummary({
  rank,
  maxRank,
  contribution,
}: Props) {
  const summaryItems = [
    {
      label: "Current Rank",
      value: capitalizeRank(rank),
     
    },
    {
      label: "Max Rank",
      value: capitalizeRank(maxRank),
    },
    {
      label: "Contribution",
      value: contribution > 0 ? `+${contribution}` : contribution,
      colorClass:
        contribution > 0
          ? "text-emerald-400"
          : contribution < 0
          ? "text-rose-400"
          : "text-zinc-400",
    },
  ];

  return (
    <section className="relative overflow-hidden mt-6 rounded-2xl border border-white/10 bg-[#121212]/80 p-6 backdrop-blur-xl shadow-2xl">
      {/* Subtle Top Orangish Gradient Border */}

      {/* Soft Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-orange-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <h2 className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">
            Profile Summary
          </h2>
          
        </div>

        {/* Aligned 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center transition-all duration-200 hover:border-white/10 hover:bg-white/[0.04]"
            >
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                {item.label}
              </p>
              <p
                className={`text-xl font-bold font-mono mt-2 transition-transform duration-200 group-hover:scale-105 ${item.colorClass}`}
              >
                {item.value || "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function capitalizeRank(rank?: string): string {
  if (!rank) return "Unrated";
  return rank
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}