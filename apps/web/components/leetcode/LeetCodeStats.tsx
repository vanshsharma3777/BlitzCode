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
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
            <StatCard
                label="TOTAL SOLVED"
                value={totalSolved}
                description={`${easySolved} Easy · ${mediumSolved} Medium · ${hardSolved} Hard`}
                accent="green"
            />

            <StatCard
                label="HARD SOLVED"
                value={hardSolved}
                description={
                    totalSolved > 0
                        ? `${Math.round(
                              (hardSolved / totalSolved) * 100
                          )}% of solved`
                        : "0% of solved"
                }
                accent="red"
            />

            <StatCard
                label="CONTEST RATING"
                value={
                    contestRating !== null
                        ? Math.round(contestRating)
                        : "N/A"
                }
                description={
                    contestRating !== null
                        ? `${contests} contests`
                        : "No contest data"
                }
                accent="yellow"
            />

            <StatCard
                label="MAX STREAK"
                value={`${maxStreak} days`}
                description={`Current: ${currentStreak} days`}
                accent="orange"
            />
        </section>
    );
}

function StatCard({
    label,
    value,
    description,
    accent,
}: {
    label: string;
    value: string | number;
    description: string;
    accent: "green" | "red" | "yellow" | "orange";
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
    }[accent];

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/80 p-5 backdrop-blur-xl transition-all duration-300 ${accentStyles.border} ${accentStyles.shadow}`}
        >
            <div
                className={`pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full ${accentStyles.glow} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <p className="text-[10px] tracking-[0.14em] text-zinc-500 font-semibold">
                {label}
            </p>

            <p className="text-2xl font-bold text-zinc-100 mt-3 group-hover:scale-[1.01] transition-transform origin-left">
                {value}
            </p>

            <p className={`text-xs mt-2 ${accentStyles.text}`}>
                {description}
            </p>
        </div>
    );
}