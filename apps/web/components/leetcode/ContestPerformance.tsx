import { Award, Globe2, Hash, Percent, Swords } from "lucide-react";
import { AnimatedNumber, Panel, SectionHead, StatTile } from "../ProfileUI";

interface ContestPerformanceProps {
  rating: number;
  globalRanking: number;
  contests: number;
  topPercentage: number;
}

export default function ContestPerformance({ rating, globalRanking, contests, topPercentage }: ContestPerformanceProps) {
  return (
    <Panel accent="amber" className="mt-5">
      <SectionHead icon={Swords} title="Contest performance" sub="How you rank against other contestants" accent="amber" />

      <div className="grid gap-4 md:grid-cols-3">
        {/* hero rating */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/15 via-amber-500/[0.04] to-transparent p-5 md:row-span-1">
          <Award className="absolute -bottom-4 -right-3 h-24 w-24 -rotate-12 text-amber-400 opacity-[0.08]" />
          <p className="text-xs font-medium text-amber-300/80">Contest rating</p>
          <p className="mt-2 text-5xl font-extrabold tracking-tight text-white">
            {rating ? <AnimatedNumber value={Math.round(rating)} /> : "N/A"}
          </p>
          {topPercentage ? (
            <p className="mt-2 text-xs text-amber-300">Top {topPercentage.toFixed(2)}% worldwide</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-2">
          <StatTile icon={Globe2} label="Global rank" value={globalRanking || "N/A"} accent="amber" />
          <StatTile icon={Hash} label="Contests" value={contests} accent="orange" />
          <StatTile icon={Percent} label="Top percentage" value={topPercentage ? `${topPercentage.toFixed(2)}%` : "N/A"} accent="emerald" />
        </div>
      </div>
    </Panel>
  );
}