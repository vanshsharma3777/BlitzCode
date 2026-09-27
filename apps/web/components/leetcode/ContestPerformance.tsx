interface ContestPerformanceProps {
    rating: number;
    globalRanking: number;
    contests: number;
    topPercentage: number;
}

export default function ContestPerformance({
    rating,
    globalRanking,
    contests,
    topPercentage,
}: ContestPerformanceProps) {
    return (
        <section className="relative overflow-hidden mt-5 rounded-2xl border border-white/10 bg-[#121212]/80 p-6 backdrop-blur-xl shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative z-10">
                <SectionTitle>
                    Contest performance
                </SectionTitle>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                    <ContestStat
                        label="Rating"
                        value={rating ? Math.round(rating) : "N/A"}
                        accent="amber"
                    />

                    <ContestStat
                        label="Global Rank"
                        value={
                            globalRanking
                                ? globalRanking.toLocaleString()
                                : "N/A"
                        }
                        accent="amber"
                    />

                    <ContestStat
                        label="Contests"
                        value={contests}
                        accent="amber"
                    />

                    <ContestStat
                        label="Top Percentage"
                        value={topPercentage ? `${topPercentage.toFixed(2)}%` : "N/A"}
                        accent="amber"
                    />
                </div>
            </div>
        </section>
    );
}

function ContestStat({
    label,
    value,
    accent = "amber",
}: {
    label: string;
    value: string | number;
    accent?: "amber";
}) {
    return (
        <div className="group relative overflow-hidden rounded-xl bg-white/[0.025] border border-white/[0.06] p-4 transition-all duration-300 hover:border-amber-500/30 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/0 to-transparent transition-opacity duration-300 group-hover:via-amber-500/50" />

            <p className="text-xs text-zinc-600 group-hover:text-amber-400 transition-colors duration-200">
                {label}
            </p>

            <p className="text-xl font-bold text-zinc-200 mt-2 transition-transform duration-200 group-hover:translate-x-0.5">
                {value}
            </p>
        </div>
    );
}

function SectionTitle({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <h2 className="text-xs uppercase tracking-[0.14em] font-semibold text-zinc-500">
            {children}
        </h2>
    );
}