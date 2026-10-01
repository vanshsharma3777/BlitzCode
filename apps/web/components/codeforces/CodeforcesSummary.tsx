"use client";

import { Award, Crown, HeartHandshake } from "lucide-react";
import { Panel, SectionHead } from "../ProfileUI";
import { colorForRank } from "../../utils/rankCF";

interface Props {
  rank: string;
  maxRank: string;
  contribution: number;
}

export default function CodeforcesSummary({ rank, maxRank, contribution }: Props) {
  const cColor = contribution > 0 ? "#34d399" : contribution < 0 ? "#fb7185" : "#a1a1aa";

  const items = [
    { icon: Award, label: "Current rank", value: cap(rank), color: colorForRank(rank) },
    { icon: Crown, label: "Max rank", value: cap(maxRank), color: colorForRank(maxRank) },
    { icon: HeartHandshake, label: "Contribution", value: contribution > 0 ? `+${contribution}` : String(contribution), color: cColor },
  ];

  return (
    <Panel accent="sky" className="mt-5">
      <SectionHead icon={Award} title="Profile summary" sub="Rank, peak and community standing" accent="sky" />
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.045]"
            style={{ ["--c" as string]: color }}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-30" style={{ background: color }} />
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Icon className="h-4 w-4" style={{ color }} />
              {label}
            </div>
            <p className="mt-3 text-xl font-extrabold" style={{ color }}>{value || "N/A"}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function cap(rank?: string) {
  if (!rank || rank === "N/A") return "Unrated";
  return rank.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}