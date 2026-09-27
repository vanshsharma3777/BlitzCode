"use client";

import { useMemo } from "react";

// Codeforces Submission interface
export interface CodeforcesSubmission {
  id?: number;
  creationTimeSeconds: number;
  [key: string]: any;
}

// Flexible props interface supporting LeetCode string, Codeforces array, or a normalized key-value map
export interface CodingHeatmapProps {
  /** LeetCode style JSON string: '{"1672531199": 2, ...}' */
  submissionCalendar?: string;
  /** Codeforces array of submissions containing `creationTimeSeconds` */
  recentSubmissions?: CodeforcesSubmission[];
  /** Or directly pass a date-count map: { '2024-05-12': 4 } */
  activityMap?: Record<string, number>;
}

interface CalendarDay {
  key: string;
  date: Date;
  count: number;
  isFuture: boolean;
  dayOfWeek: number; // 0 = Sun, 6 = Sat
  isEmptySlot?: boolean;
}

interface MonthGroup {
  label: string;
  weeks: CalendarDay[][];
}

export default function CodingHeatmap({
  submissionCalendar,
  recentSubmissions,
  activityMap,
}: CodingHeatmapProps) {
  const monthGroups = useMemo(() => {
    return buildCalendarByMonths({
      submissionCalendar,
      recentSubmissions,
      activityMap,
    });
  }, [submissionCalendar, recentSubmissions, activityMap]);

  if (monthGroups.length === 0) {
    return (
      <div className="text-sm font-mono text-neutral-500 text-center py-6">
        No activity data available.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/80 p-6 backdrop-blur-xl shadow-2xl mt-6">
      {/* Top Accent Gradient Border */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-80" />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-emerald-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-80 rounded-full bg-teal-500/5 blur-2xl" />

      <div className="relative z-10 w-full pb-2 pt-4 flex flex-col items-center">
        <div className="inline-block max-w-full ">
          <div className="flex gap-3">
            {monthGroups.map((group, groupIdx) => (
              <div key={`${group.label}-${groupIdx}`} className="flex flex-col">
                {/* Month Label Header */}
                <div className="text-[10px] font-mono text-neutral-400 font-bold mb-2 text-left pl-0.5 select-none truncate tracking-wider uppercase">
                  {group.label}
                </div>

                {/* Month Columns */}
                <div className="flex gap-[3px]">
                  {group.weeks.map((week, weekIdx) => (
                    <div
                      key={`week-${groupIdx}-${weekIdx}`}
                      className="flex flex-col gap-[3px] w-[13px] shrink-0"
                    >
                      {week.map((day) => (
                        <HeatCell
                          key={day.key}
                          count={day.count}
                          date={day.date}
                          isFuture={day.isFuture}
                          dayOfWeek={day.dayOfWeek}
                          isEmptySlot={day.isEmptySlot}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend Footer */}
          <div className="flex items-center justify-end gap-2 mt-6 select-none">
            <span className="text-[10px] font-mono text-neutral-400 font-medium tracking-wider">
              Less
            </span>

            <LegendCell level={0} />
            <LegendCell level={1} />
            <LegendCell level={2} />
            <LegendCell level={3} />
            <LegendCell level={4} />

            <span className="text-[10px] font-mono text-neutral-400 font-medium tracking-wider">
              More
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeatCell({
  count,
  date,
  isFuture,
  dayOfWeek,
  isEmptySlot,
}: {
  count: number;
  date: Date;
  isFuture: boolean;
  dayOfWeek: number;
  isEmptySlot?: boolean;
}) {
  if (isEmptySlot || isFuture) {
    return <div className="w-[13px] h-[13px] rounded-[2px] bg-transparent" />;
  }

  let color = "bg-[#1d1d1f] border border-white/5";

  if (count >= 1 && count < 3) {
    color = "bg-[#064e3b] border border-[#047857]";
  } else if (count >= 3 && count < 6) {
    color = "bg-[#059669] border border-[#10b981]";
  } else if (count >= 6 && count < 10) {
    color = "bg-[#10b981] border border-[#34d399]";
  } else if (count >= 10) {
    color =
      "bg-[#34d399] border border-[#6ee7b7] shadow-[0_0_10px_rgba(52,211,153,0.45)]";
  }

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const submissionText =
    count === 0
      ? "No submissions"
      : count === 1
      ? "1 submission"
      : `${count} submissions`;

  const isTopRow = dayOfWeek <= 1;

  return (
    <div className="relative group w-[13px] h-[13px]">
      <div
        className={`
          w-[13px]
          h-[13px]
          rounded-[2px]
          ${color}
          cursor-pointer
          transition-all
          duration-150
          ease-out
          group-hover:scale-125
          group-hover:z-30
          group-hover:border-emerald-300
          group-hover:shadow-[0_0_8px_rgba(52,211,153,0.6)]
        `}
      />

      {/* Tooltip */}
      <div
        className={`
          pointer-events-none
          absolute
          left-1/2
          -translate-x-1/2
          ${isTopRow ? "top-full mt-2" : "bottom-full mb-2"}
          opacity-0
          scale-95
          group-hover:opacity-100
          group-hover:scale-100
          transition-all
          duration-150
          z-[100]
        `}
      >
        <div className="whitespace-nowrap rounded-xl border border-white/10 bg-[#161616]/95 px-3 py-1.5 shadow-2xl backdrop-blur-xl">
          <p className="text-[11px] font-semibold text-neutral-200 font-sans">
            {formattedDate}
          </p>
          <p
            className={`text-[10px] font-mono mt-0.5 ${
              count > 0 ? "text-emerald-400 font-bold" : "text-neutral-500"
            }`}
          >
            {submissionText}
          </p>
        </div>
      </div>
    </div>
  );
}

function LegendCell({ level }: { level: number }) {
  const colors = [
    "bg-[#1d1d1f] border border-white/5",
    "bg-[#064e3b] border border-[#047857]",
    "bg-[#059669] border border-[#10b981]",
    "bg-[#10b981] border border-[#34d399]",
    "bg-[#34d399] border border-[#6ee7b7]",
  ];

  return <div className={`w-[11px] h-[11px] rounded-[2px] ${colors[level]}`} />;
}

/* ================================================= */
/* Multi-Source Calendar Normalizer & Builder       */
/* ================================================= */

function buildCalendarByMonths({
  submissionCalendar,
  recentSubmissions,
  activityMap,
}: CodingHeatmapProps): MonthGroup[] {
  const activityByDate: Record<string, number> = {};

  // Case 1: Pre-formatted date-count map { "2024-05-12": 3 }
  if (activityMap) {
    Object.assign(activityByDate, activityMap);
  }

  // Case 2: LeetCode style JSON string '{"1672531199": 2, ...}'
  if (submissionCalendar) {
    try {
      const parsed: Record<string, number> = JSON.parse(submissionCalendar || "{}");
      Object.entries(parsed).forEach(([timestamp, count]) => {
        const date = new Date(Number(timestamp) * 1000);
        const dateKey = formatDateKey(date);
        activityByDate[dateKey] = (activityByDate[dateKey] || 0) + Number(count);
      });
    } catch {
      // JSON parse fallback
    }
  }

  // Case 3: Codeforces array of submissions [{ creationTimeSeconds: 1672531199 }, ...]
  if (Array.isArray(recentSubmissions)) {
    recentSubmissions.forEach((sub) => {
      if (!sub?.creationTimeSeconds) return;
      const date = new Date(sub.creationTimeSeconds * 1000);
      const dateKey = formatDateKey(date);
      activityByDate[dateKey] = (activityByDate[dateKey] || 0) + 1;
    });
  }

  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const startDate = new Date(today);
  startDate.setUTCDate(1);
  startDate.setUTCMonth(startDate.getUTCMonth() - 11);

  const monthGroups: MonthGroup[] = [];
  let currentMonth = new Date(startDate);

  while (currentMonth <= today) {
    const year = currentMonth.getUTCFullYear();
    const month = currentMonth.getUTCMonth();

    const monthLabel = currentMonth.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    });

    const totalDaysInMonth = new Date(
      Date.UTC(year, month + 1, 0)
    ).getUTCDate();

    const weeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];

    // Pad first week
    const firstDayOfWeek = new Date(Date.UTC(year, month, 1)).getUTCDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        key: `empty-start-${year}-${month}-${i}`,
        date: new Date(Date.UTC(year, month, 1)),
        count: 0,
        isFuture: false,
        dayOfWeek: i,
        isEmptySlot: true,
      });
    }

    // Add days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(Date.UTC(year, month, day));
      const dateKey = formatDateKey(date);

      const isFuture = date > today;
      const count = isFuture ? 0 : activityByDate[dateKey] || 0;
      const dayOfWeek = date.getUTCDay();

      currentWeek.push({
        key: dateKey,
        date,
        count,
        isFuture,
        dayOfWeek,
        isEmptySlot: false,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Pad last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({
          key: `empty-end-${year}-${month}-${currentWeek.length}`,
          date: new Date(Date.UTC(year, month, totalDaysInMonth)),
          count: 0,
          isFuture: false,
          dayOfWeek: currentWeek.length,
          isEmptySlot: true,
        });
      }
      weeks.push(currentWeek);
    }

    monthGroups.push({
      label: monthLabel,
      weeks,
    });

    currentMonth.setUTCMonth(currentMonth.getUTCMonth() + 1);
  }

  return monthGroups;
}

function formatDateKey(date: Date): string {
  return (
    `${date.getUTCFullYear()}-` +
    `${String(date.getUTCMonth() + 1).padStart(2, "0")}-` +
    `${String(date.getUTCDate()).padStart(2, "0")}`
  );
}