"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { Panel, SectionHead, type Accent } from "../ProfileUI";

interface DifficultySplitProps {
  easy: number;
  medium: number;
  hard: number;
  total: number;
  easySubmissions?: number;
  mediumSubmissions?: number;
  hardSubmissions?: number;
}

type Difficulty = "Easy" | "Medium" | "Hard";

const META: Record<Difficulty, { accent: Accent; hex: string; text: string; desc: string }> = {
  Easy: { accent: "emerald", hex: "#34d399", text: "text-emerald-400", desc: "Core algorithms, data structures and clean implementation." },
  Medium: { accent: "amber", hex: "#fbbf24", text: "text-amber-400", desc: "Stronger algorithmic thinking, optimization and combining concepts." },
  Hard: { accent: "rose", hex: "#fb7185", text: "text-rose-400", desc: "Deep insight, tight optimization and careful implementation." },
};

export default function DifficultySplit({
  easy, medium, hard, total,
  easySubmissions = 0, mediumSubmissions = 0, hardSubmissions = 0,
}: DifficultySplitProps) {
  const [sel, setSel] = useState<Difficulty>("Easy");

  const data: Record<Difficulty, { solved: number; subs: number }> = {
    Easy: { solved: easy, subs: easySubmissions },
    Medium: { solved: medium, subs: mediumSubmissions },
    Hard: { solved: hard, subs: hardSubmissions },
  };

  const cur = data[sel];
  const m = META[sel];
  const acc = cur.subs > 0 ? Math.round((cur.solved / cur.subs) * 100) : 0;
  const share = total > 0 ? Math.round((cur.solved / total) * 100) : 0;

  const R = 40;
  const C = 2 * Math.PI * R;

  return (
    <Panel accent={m.accent} className="mt-5">
      <SectionHead icon={Layers} title="Difficulty breakdown" sub="Tap a level to see how you perform on it" accent={m.accent} />

      {/* segmented tabs */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1.5">
        {(Object.keys(data) as Difficulty[]).map((d) => {
          const on = d === sel;
          return (
            <button
              key={d}
              onClick={() => setSel(d)}
              className="cursor-pointer rounded-xl px-3 py-3 text-left transition-all duration-200"
              style={on ? { background: `${META[d].hex}1a`, boxShadow: `inset 0 0 0 1px ${META[d].hex}55` } : undefined}
            >
              <p className={`text-xs font-semibold ${on ? META[d].text : "text-zinc-500"}`}>{d}</p>
              <p className="mt-1 text-2xl font-extrabold text-white">{data[d].solved}</p>
            </button>
          );
        })}
      </div>

      {/* detail */}
      <div className="mt-5 grid items-center gap-6 md:grid-cols-[auto_1fr]">
        <div className="relative mx-auto h-32 w-32">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={R} fill="none" stroke={m.hex} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C - (acc / 100) * C}
              className="transition-all duration-700 ease-out"
              style={{ filter: `drop-shadow(0 0 6px ${m.hex}99)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-white">{acc}%</span>
            <span className="text-[11px] text-zinc-500">accepted</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-zinc-400">{m.desc}</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              ["Solved", cur.solved],
              ["Submissions", cur.subs],
              ["Share of total", `${share}%`],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                <p className="text-xs text-zinc-500">{l}</p>
                <p className="mt-1 text-lg font-bold text-white">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${share}%`, background: m.hex, boxShadow: `0 0 12px ${m.hex}88` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">{cur.solved} of {total} total solved</p>
        </div>
      </div>
    </Panel>
  );
}