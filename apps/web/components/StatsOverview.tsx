'use client'

import { Zap, Trophy, Swords } from "lucide-react"

interface StatsOverviewProps {
    points: number
    loadingPoints: boolean
    currentRankTitle: string
}

export default function StatsOverview({ points, loadingPoints, currentRankTitle }: StatsOverviewProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--borders)] hover:border-[var(--accent)]/50 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md transition-all duration-300">
                <div className="p-3.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)] shrink-0">
                    <Zap className="w-7 h-7 fill-amber-400" />
                </div>
                <div>
                    <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider">Total Points</span>
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--primary-text)]">
                        {loadingPoints ? "..." : points}
                        <span className="text-xs text-amber-400 font-sans"> XP</span>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--borders)] hover:border-[var(--accent)]/50 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md transition-all duration-300">
                <div className="p-3.5 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 shadow-[0_0_15px_-3px_var(--accent-glow)] shrink-0">
                    <Trophy className="w-7 h-7" />
                </div>
                <div>
                    <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider">Current Tier</span>
                    <div className="text-base sm:text-lg font-extrabold text-[var(--primary-text)]">
                        {currentRankTitle}
                    </div>
                </div>
            </div>

            <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--borders)] hover:border-[var(--accent)]/50 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md transition-all duration-300">
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] shrink-0">
                    <Swords className="w-7 h-7" />
                </div>
                <div>
                    <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider">Arena Status</span>
                    <div className="text-base sm:text-lg font-extrabold text-emerald-400">Match Ready</div>
                </div>
            </div>
        </div>
    )
}