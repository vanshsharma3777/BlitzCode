"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";
import { Panel, SectionHead, type Accent } from "./ProfileUI";

export interface CodeforcesSubmission {
  id?: number;
  creationTimeSeconds: number;
  [key: string]: any;
}

export interface CodingHeatmapProps {
  /** LeetCode style JSON string: '{"1672531199": 2, ...}' */
  submissionCalendar?: string;
  /** Codeforces array of submissions containing `creationTimeSeconds` */
  recentSubmissions?: CodeforcesSubmission[];
  /** Or directly pass a date-count map: { '2024-05-12': 4 } */
  activityMap?: Record<string, number>;
  /** Colour theme: emerald for LeetCode, sky for Codeforces */
  accent?: Extract<Accent, "emerald" | "sky" | "orange">;
  title?: string;
  sub?: string;
}

interface CalendarDay {
  key: string;
  date: Date;
  count: number;
  isFuture: boolean;
  isToday: boolean;
  dayOfWeek: number;
  isEmptySlot?: boolean;
}

interface MonthGroup {
  label: string;
  weeks: CalendarDay[][];
}

const PALETTES = {
  emerald: ["#1d1d1f", "#064e3b", "#059669", "#10b981", "#34d399"],
  sky: ["#1d1d1f", "#0c4a6e", "#0284c7", "#38bdf8", "#7dd3fc"],
  orange: ["#1d1d1f", "#7c2d12", "#c2410c", "#f97316", "#fdba74"],
};

const level = (c: number) => (c <= 0 ? 0 : c < 3 ? 1 : c < 6 ? 2 : c < 10 ? 3 : 4);

export default function CodingHeatmap({
  submissionCalendar,
  recentSubmissions,
  activityMap,
  accent = "emerald",
  title = "Coding activity",
  sub = "Your daily submissions over the last year",
}: CodingHeatmapProps) {
  const monthGroups = useMemo(
    () => buildCalendarByMonths({ submissionCalendar, recentSubmissions, activityMap }),
    [submissionCalendar, recentSubmissions, activityMap]
  );

  const palette = PALETTES[accent];

  const summary = useMemo(() => {
    let total = 0, active = 0, best = 0;
    monthGroups.forEach((g) =>
      g.weeks.forEach((w) =>
        w.forEach((d) => {
          if (d.isEmptySlot || d.isFuture) return;
          total += d.count;
          if (d.count > 0) active++;
          best = Math.max(best, d.count);
        })
      )
    );
    return { total, active, best };
  }, [monthGroups]);

  return (
    <Panel accent={accent} className="mt-5">
      <SectionHead
        icon={Activity}
        title={title}
        sub={sub}
        accent={accent}
        right={
          <div className="hidden gap-2 sm:flex">
            <Chip label="submissions" value={summary.total} color={palette[3]!} />
            <Chip label="active days" value={summary.active} color={palette[3]!} />
            <Chip label="best day" value={summary.best} color={palette[3]!} />
          </div>
        }
      />

      {monthGroups.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-500">No activity yet. Submit a solution and your first square will light up.</p>
      ) : (
        <>
          <div className="overflow-x-auto pb-2 pt-1">
            <div className="mx-auto flex w-max gap-3 px-1 pb-10">
              {monthGroups.map((group, gi) => (
                <div key={`${group.label}-${gi}`} className="flex flex-col">
                  <div className="mb-2 select-none pl-0.5 text-[11px] font-medium text-zinc-500">{group.label}</div>
                  <div className="flex gap-[3px]">
                    {group.weeks.map((week, wi) => (
                      <div key={`w-${gi}-${wi}`} className="flex w-[13px] shrink-0 flex-col gap-[3px]">
                        {week.map((d) => (
                          <HeatCell key={d.key} day={d} palette={palette} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between gap-3">
            {/* mobile summary */}
            <p className="text-xs text-zinc-500 sm:hidden">
              <span className="font-semibold text-zinc-300">{summary.total}</span> submissions ·{" "}
              <span className="font-semibold text-zinc-300">{summary.active}</span> active days
            </p>
            <div className="ml-auto flex select-none items-center gap-1.5">
              <span className="mr-1 text-[11px] text-zinc-500">Less</span>
              {palette.map((c, i) => (
                <div key={i} className="h-[11px] w-[11px] rounded-[3px]" style={{ background: c, border: "1px solid rgba(255,255,255,0.06)" }} />
              ))}
              <span className="ml-1 text-[11px] text-zinc-500">More</span>
            </div>
          </div>
        </>
      )}
    </Panel>
  );
}

function Chip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-center">
      <p className="text-base font-bold leading-none text-white">{value.toLocaleString()}</p>
      <p className="mt-1 text-[10px]" style={{ color }}>{label}</p>
    </div>
  );
}

function HeatCell({ day, palette }: { day: CalendarDay; palette: string[] }) {
  if (day.isEmptySlot || day.isFuture) return <div className="h-[13px] w-[13px]" />;

  const lv = level(day.count);
  const color = palette[lv]!;
  const label = day.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const text = day.count === 0 ? "No submissions" : day.count === 1 ? "1 submission" : `${day.count} submissions`;
  const below = day.dayOfWeek <= 1;

  return (
    <div className="group relative h-[13px] w-[13px]">
      <div
        className="h-[13px] w-[13px] cursor-pointer rounded-[3px] transition-transform duration-150 ease-out group-hover:z-30 group-hover:scale-[1.35]"
        style={{
          background: color,
          border: `1px solid ${lv === 0 ? "rgba(255,255,255,0.05)" : palette[Math.min(lv + 1, 4)]}`,
          boxShadow: lv === 4 ? `0 0 10px ${color}88` : day.isToday ? `0 0 0 1.5px #fff` : undefined,
        }}
      />
      <div
        className={`pointer-events-none absolute left-1/2 z-[100] -translate-x-1/2 scale-95 opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 ${
          below ? "top-full mt-2" : "bottom-full mb-2"
        }`}
      >
        <div className="whitespace-nowrap rounded-xl border border-white/10 bg-[#161616]/95 px-3 py-1.5 shadow-2xl backdrop-blur-xl">
          <p className="text-[11px] font-semibold text-zinc-200">{label}{day.isToday ? " (today)" : ""}</p>
          <p className="mt-0.5 text-[11px] font-medium" style={{ color: day.count > 0 ? palette[3] : "#71717a" }}>{text}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Data builder (logic unchanged apart from isToday) ---------- */

function buildCalendarByMonths({ submissionCalendar, recentSubmissions, activityMap }: CodingHeatmapProps): MonthGroup[] {
  const byDate: Record<string, number> = {};

  if (activityMap) Object.assign(byDate, activityMap);

  if (submissionCalendar) {
    try {
      const parsed: Record<string, number> = JSON.parse(submissionCalendar || "{}");
      Object.entries(parsed).forEach(([ts, count]) => {
        const k = formatDateKey(new Date(Number(ts) * 1000));
        byDate[k] = (byDate[k] || 0) + Number(count);
      });
    } catch {
      /* ignore bad JSON */
    }
  }

  if (Array.isArray(recentSubmissions)) {
    recentSubmissions.forEach((s) => {
      if (!s?.creationTimeSeconds) return;
      const k = formatDateKey(new Date(s.creationTimeSeconds * 1000));
      byDate[k] = (byDate[k] || 0) + 1;
    });
  }

  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const todayKey = formatDateKey(today);

  const start = new Date(today);
  start.setUTCDate(1);
  start.setUTCMonth(start.getUTCMonth() - 11);

  const groups: MonthGroup[] = [];
  const cur = new Date(start);

  while (cur <= today) {
    const year = cur.getUTCFullYear();
    const month = cur.getUTCMonth();
    const label = cur.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

    const weeks: CalendarDay[][] = [];
    let week: CalendarDay[] = [];

    const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
    for (let i = 0; i < first; i++) {
      week.push({ key: `es-${year}-${month}-${i}`, date: new Date(Date.UTC(year, month, 1)), count: 0, isFuture: false, isToday: false, dayOfWeek: i, isEmptySlot: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Date.UTC(year, month, d));
      const key = formatDateKey(date);
      const isFuture = date > today;
      week.push({ key, date, count: isFuture ? 0 : byDate[key] || 0, isFuture, isToday: key === todayKey, dayOfWeek: date.getUTCDay() });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push({ key: `ee-${year}-${month}-${week.length}`, date: new Date(Date.UTC(year, month, daysInMonth)), count: 0, isFuture: false, isToday: false, dayOfWeek: week.length, isEmptySlot: true });
      }
      weeks.push(week);
    }

    groups.push({ label, weeks });
    cur.setUTCMonth(cur.getUTCMonth() + 1);
  }

  return groups;
}

function formatDateKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}