'use client'

import { Award, CheckCircle, Sparkles } from "lucide-react"

interface CareerProgressionProps {
    points: number
}

export default function CareerProgression({ points }: CareerProgressionProps) {
    const targetPoints = points >= 1000 ? 2000 : points >= 500 ? 1000 : 500
    const progressPercent = Math.min((points / targetPoints) * 100, 100)

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--borders)] pb-4">
                <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-[var(--accent)]" />
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--primary-text)]">
                        Career Progression
                    </h2>
                </div>
                <span className="text-xs font-mono text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1 rounded-full">
                    XP System (+50 Win / -25 Loss)
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-[var(--secondary-text)]">
                    <span>Level Progress</span>
                    <span>{points} / {targetPoints} XP</span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-sec)] rounded-full border border-[var(--borders)] overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--accent)] to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--bg-sec)]/70 border border-[var(--borders)]">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                        <div className="text-xs font-bold text-[var(--primary-text)]">First Blood</div>
                        <div className="text-[11px] text-[var(--secondary-text)]">Completed your initial coding challenge</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--bg-sec)]/70 border border-[var(--borders)]">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                        <div className="text-xs font-bold text-[var(--primary-text)]">Blitz Competitor</div>
                        <div className="text-[11px] text-[var(--secondary-text)]">Participated in 1v1 multiplayer arena</div>
                    </div>
                </div>
            </div>
        </div>
    )
}