import { Flame, Swords, Target } from "lucide-react";
import { AnimatedNumber, Panel, StatTile } from "../ProfileUI";

interface LeetCodeStatsProps {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number | null;
  contests: number;
  maxStreak: number;
  currentStreak: number;
}

const SEGMENTS = [
  { key: "Easy", color: "#34d399", dot: "bg-emerald-400" },
  { key: "Medium", color: "#fbbf24", dot: "bg-amber-400" },
  { key: "Hard", color: "#fb7185", dot: "bg-rose-400" },
] as const;

export default function LeetCodeStats({
  totalSolved,
  easySolved,
  mediumSolved,
  hardSolved,
  contestRating,
  contests,
  maxStreak,
  currentStreak,
}: LeetCodeStatsProps) {
  const values = [easySolved, mediumSolved, hardSolved];
  const r = 52;
  const C = 2 * Math.PI * r;
  const gap = totalSolved > 0 ? 6 : 0;
  let offset = 0;

  return (
    <section className="mt-5 grid gap-4 lg:grid-cols-5">
      {/* Hero: segmented donut */}
      <Panel accent="emerald" className="lg:col-span-2">
        <div className="flex items-center gap-6">
          <div className="relative h-40 w-40 shrink-0">
            <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
              <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              {totalSolved > 0 &&
                values.map((v, i) => {
                  const len = Math.max((v / totalSolved) * C - gap, 0);
                  const el = (
                    <circle
                      key={i}
                      cx="64"
                      cy="64"
                      r={r}
                      fill="none"
                      stroke={SEGMENTS[i]!.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${len} ${C - len}`}
                      strokeDashoffset={-offset}
                      style={{ filter: `drop-shadow(0 0 5px ${SEGMENTS[i]!.color}88)`, animation: "pf-draw 1.1s ease-out both" }}
                    />
                  );
                  offset += (v / totalSolved) * C;
                  return el;
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white">
                <AnimatedNumber value={totalSolved} />
              </span>
              <span className="text-xs text-zinc-500">solved</span>
            </div>
          </div>

          <ul className="flex-1 space-y-3">
            {SEGMENTS.map((s, i) => (
              <li key={s.key} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-400">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  {s.key}
                </span>
                <span className="font-bold text-white">{values[i]}</span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      {/* Supporting tiles */}
      <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
        <StatTile
          icon={Target}
          label="Hard solved"
          value={hardSolved}
          hint={`${totalSolved > 0 ? Math.round((hardSolved / totalSolved) * 100) : 0}% of solved`}
          accent="rose"
        />
        <StatTile
          icon={Swords}
          label="Contest rating"
          value={contestRating !== null ? Math.round(contestRating) : "N/A"}
          hint={contestRating !== null ? `${contests} contests` : "No contest data"}
          accent="amber"
        />
        <StatTile
          icon={Flame}
          label="Max streak"
          value={maxStreak}
          hint={`${currentStreak} day current streak`}
          accent="orange"
        />
      </div>
    </section>
  );
}