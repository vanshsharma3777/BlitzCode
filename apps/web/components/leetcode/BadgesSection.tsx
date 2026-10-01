import { Medal } from "lucide-react";
import { Panel, SectionHead } from "../ProfileUI";

interface Badge {
  id: string;
  displayName: string;
  icon: string;
  creationDate: string;
}

export default function BadgesSection({ badges }: { badges: Badge[] }) {
  if (!badges?.length) return null;

  return (
    <Panel accent="amber" className="mt-5">
      <SectionHead
        icon={Medal}
        title="Badges"
        sub="Milestones earned on LeetCode"
        accent="amber"
        right={<span className="font-mono text-xs text-zinc-500">{badges.length} earned</span>}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {badges.map((b) => (
          <div
            key={b.id}
            className="group relative flex flex-col items-center rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:bg-white/[0.05]"
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.18),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <img
              src={b.icon}
              alt={b.displayName}
              className="relative h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.45)]"
            />
            <p className="relative mt-3 text-xs font-medium text-zinc-400 transition-colors group-hover:text-white">{b.displayName}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}