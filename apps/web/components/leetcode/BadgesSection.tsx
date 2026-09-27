interface Badge {
    id: string;
    displayName: string;
    icon: string;
    creationDate: string;
}

export default function BadgesSection({
    badges,
}: {
    badges: Badge[];
}) {
    if (!badges?.length) return null;

    return (
        <section className="relative overflow-hidden mt-5 rounded-2xl border border-white/10 bg-[#121212]/80 p-6 backdrop-blur-xl shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative z-10">
                <h2 className="text-xs uppercase tracking-[0.14em] font-semibold text-zinc-500">
                    Badges
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-5">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] p-4 text-center hover:bg-white/[0.05] hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.12)] transition-all duration-300"
                        >
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/0 to-transparent transition-opacity duration-300 group-hover:via-amber-500/50" />

                            <img
                                src={badge.icon}
                                alt={badge.displayName}
                                className="w-14 h-14 object-contain mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                            />

                            <p className="text-xs text-zinc-400 mt-3 group-hover:text-zinc-200 transition-colors duration-200">
                                {badge.displayName}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}