interface AboutSectionProps {
    aboutMe: string | null;
    school: string | null;
    company: string | null;
    location: string | null;
}

export default function AboutSection({
    aboutMe,
    school,
    company,
    location,
}: AboutSectionProps) {
    if (!aboutMe && !school && !company && !location) {
        return null;
    }

    return (
        <section className="relative overflow-hidden mt-5 rounded-2xl border border-white/10 bg-[#121212]/80 p-6 backdrop-blur-xl shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />

            <div className="relative z-10">
                <h2 className="text-xs uppercase tracking-[0.14em] font-semibold text-zinc-500">
                    About
                </h2>

                <div className="mt-4 space-y-3 text-sm text-zinc-500">
                    {aboutMe && (
                        <p className="text-zinc-300 leading-relaxed">
                            {aboutMe}
                        </p>
                    )}

                    <div className="flex flex-col gap-2.5 pt-1">
                        {school && (
                            <p className="flex items-center gap-2 text-zinc-400">
                                <span className="text-base">🎓</span> {school}
                            </p>
                        )}

                        {company && (
                            <p className="flex items-center gap-2 text-zinc-400">
                                <span className="text-base">💼</span> {company}
                            </p>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}