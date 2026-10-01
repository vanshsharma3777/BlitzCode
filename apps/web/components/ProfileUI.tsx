"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type Accent = "orange" | "emerald" | "amber" | "rose" | "sky" | "violet";

export const ACCENTS: Record<Accent, { hex: string; text: string; ring: string }> = {
  orange: { hex: "#f97316", text: "text-orange-400", ring: "hover:border-orange-500/40" },
  emerald: { hex: "#10b981", text: "text-emerald-400", ring: "hover:border-emerald-500/40" },
  amber: { hex: "#f59e0b", text: "text-amber-400", ring: "hover:border-amber-500/40" },
  rose: { hex: "#f43f5e", text: "text-rose-400", ring: "hover:border-rose-500/40" },
  sky: { hex: "#38bdf8", text: "text-sky-400", ring: "hover:border-sky-500/40" },
  violet: { hex: "#8b5cf6", text: "text-violet-400", ring: "hover:border-violet-500/40" },
};

/** One-time load animations. Render <ProfileStyles /> once (the header does). */
export function ProfileStyles() {
  return (
    <style>{`
      @keyframes pf-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
      @keyframes pf-rot{to{transform:rotate(360deg)}}
      @keyframes pf-draw{from{stroke-dasharray:0 1000}}
      .pf-rise{animation:pf-rise .7s cubic-bezier(.2,.8,.2,1) both}
      .pf-rot{animation:pf-rot 6s linear infinite}
      @media (prefers-reduced-motion:reduce){.pf-rise,.pf-rot{animation:none}}
    `}</style>
  );
}

/** Glass card with a coloured top edge and one soft corner glow. */
export function Panel({
  children,
  accent = "orange",
  className = "",
}: {
  children: ReactNode;
  accent?: Accent;
  className?: string;
}) {
  const a = ACCENTS[accent];
  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#121212]/80 p-5 shadow-2xl backdrop-blur-xl md:p-6 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-80"
        style={{ background: `linear-gradient(90deg,transparent,${a.hex},transparent)` }}
      />
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: a.hex }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export function SectionHead({
  icon: Icon,
  title,
  sub,
  accent = "orange",
  right,
}: {
  icon: LucideIcon;
  title: string;
  sub?: string;
  accent?: Accent;
  right?: ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl border"
          style={{ background: `${a.hex}1a`, borderColor: `${a.hex}40` }}
        >
          <Icon className={`h-[18px] w-[18px] ${a.text}`} />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          {sub && <p className="text-xs text-zinc-500">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function useCountUp(target: number, ms = 1000) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const s = performance.now();
    const tick = (n: number) => {
      const p = Math.min((n - s) / ms, 1);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export function AnimatedNumber({ value, suffix = "" }: { value: number | string; suffix?: string }) {
  const n = typeof value === "number" ? value : NaN;
  const v = useCountUp(Number.isFinite(n) ? n : 0);
  if (!Number.isFinite(n)) return <>{value}</>;
  return <>{v.toLocaleString()}{suffix}</>;
}

export function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  accent = "orange",
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  accent?: Accent;
}) {
  const a = ACCENTS[accent];
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.045] ${a.ring}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <Icon className={`h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100 ${a.text}`} />
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-white">
        <AnimatedNumber value={value} />
      </p>
      {hint && <p className={`mt-1.5 text-xs ${a.text}`}>{hint}</p>}
      <div
        className="absolute inset-x-4 bottom-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg,transparent,${a.hex},transparent)` }}
      />
    </div>
  );
}