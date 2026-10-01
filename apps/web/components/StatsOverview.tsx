'use client'

import { Zap, Trophy, Swords } from "lucide-react"

interface StatsOverviewProps {
    points: number
    loadingPoints: boolean
    currentRankTitle: string
}

export default function StatsOverview({ points, loadingPoints, currentRankTitle }: StatsOverviewProps) {
    const card =
        "group relative overflow-hidden bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--borders)] rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Points */}
            <div className={`${card} hover:border-amber-500/50`}>
                <Zap className="pointer-events-none absolute -right-3 -bottom-4 w-24 h-24 text-amber-400 opacity-[0.06] -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />
                <div className="p-3.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)] shrink-0">
                    <Zap className="w-7 h-7 fill-amber-400" />
                </div>
                <div className="relative">
                    <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider">Total Points</span>
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--primary-text)]">
                        {loadingPoints ? (
                            <span className="inline-block h-7 w-20 rounded-lg bg-[var(--bg-sec)] animate-pulse align-middle" />
                        ) : (
                            points.toLocaleString("en-US")
                        )}
                        <span className="text-xs text-amber-400 font-sans"> XP</span>
                    </div>
                </div>
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Current Tier */}
            <div className={`${card} hover:border-[var(--accent)]/50`}>
                <Trophy className="pointer-events-none absolute -right-3 -bottom-4 w-24 h-24 text-[var(--accent)] opacity-[0.06] -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />
                <div className="p-3.5 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 shadow-[0_0_15px_-3px_var(--accent-glow)] shrink-0">
                    <Trophy className="w-7 h-7" />
                </div>
                <div className="relative">
                    <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider">Current Tier</span>
                    <div className="text-base sm:text-lg font-extrabold text-[var(--primary-text)]">
                        {currentRankTitle}
                    </div>
                </div>
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Arena Status */}
            <div className={`${card} hover:border-emerald-500/50`}>
                <Swords className="pointer-events-none absolute -right-3 -bottom-4 w-24 h-24 text-emerald-400 opacity-[0.06] -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] shrink-0">
                    <Swords className="w-7 h-7" />
                </div>
                <div className="relative">
                    <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider">Arena Status</span>
                    <div className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-emerald-400">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </span>
                        Match Ready
                    </div>
                </div>
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    )
}