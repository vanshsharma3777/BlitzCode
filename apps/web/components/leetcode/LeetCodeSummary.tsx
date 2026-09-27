interface LeetCodeSummaryProps {
    ranking: number;
    activeDays: number;
    reputation: number;
    profileViews: number;
}

export default function LeetCodeSummary({
    ranking,
    activeDays,
    reputation,
    profileViews,
}: LeetCodeSummaryProps) {
    return (
        <section className="relative overflow-hidden mt-6 rounded-2xl border border-white/10 bg-[#121212]/80 p-5 md:p-6 backdrop-blur-xl shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-12 -left-12 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-emerald-600/10 blur-3xl" />

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                <MiniInfo
                    label="Global Ranking"
                    value={
                        ranking
                            ? ranking.toLocaleString()
                            : "N/A"
                    }
                />

                <MiniInfo
                    label="Active Days"
                    value={activeDays}
                />

                <MiniInfo
                    label="Reputation"
                    value={reputation}
                />

                <MiniInfo
                    label="Profile Views"
                    value={profileViews}
                />
            </div>
        </section>
    );
}

function MiniInfo({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent transition-opacity duration-300 group-hover:via-emerald-500/50" />

            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold group-hover:text-emerald-400 transition-colors duration-200">
                {label}
            </p>

            <p className="text-lg font-bold text-zinc-200 mt-1 transition-transform duration-200 group-hover:translate-x-0.5">
                {value}
            </p>
        </div>
    );
}