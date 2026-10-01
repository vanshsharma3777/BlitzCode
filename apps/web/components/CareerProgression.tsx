'use client'

import { Award, CheckCircle, Sparkles, Code2, Swords, Medal, Crown, Lock, Check, Infinity as InfinityIcon } from "lucide-react"

interface CareerProgressionProps {
    points: number
}

// Thresholds page.tsx ke getRank() se match karte hain: 0 / 200 / 500 / 1000
const TIERS = [
    { name: "Novice Hacker", min: 0, Icon: Code2, text: "text-emerald-400", reached: "bg-emerald-500/15 border-emerald-500/40", glow: "shadow-[0_0_20px_-2px_rgba(16,185,129,0.55)]" },
    { name: "Code Competitor", min: 200, Icon: Swords, text: "text-blue-400", reached: "bg-blue-500/15 border-blue-500/40", glow: "shadow-[0_0_20px_-2px_rgba(59,130,246,0.55)]" },
    { name: "Senior Developer", min: 500, Icon: Medal, text: "text-purple-400", reached: "bg-purple-500/15 border-purple-500/40", glow: "shadow-[0_0_20px_-2px_rgba(168,85,247,0.55)]" },
    { name: "Grandmaster Coder", min: 1000, Icon: Crown, text: "text-amber-400", reached: "bg-amber-500/15 border-amber-500/40", glow: "shadow-[0_0_20px_-2px_rgba(245,158,11,0.55)]" },
] as const

const PRESTIGE_STEP = 1000 // Grandmaster ke baad har 1000 XP par ek naya level
const fmt = (n: number) => n.toLocaleString("en-US")

export default function CareerProgression({ points }: CareerProgressionProps) {
    const xp = Math.max(0, Math.floor(points))

    let tierIdx = 0
    TIERS.forEach((t, i) => {
        if (xp >= t.min) tierIdx = i
    })
    const current = TIERS[tierIdx]!
    const next = TIERS[tierIdx + 1]
    const isMax = !next

    // Max tier mein level aur level ke andar ka progress
    const over = Math.max(0, xp - current.min)
    const level = Math.floor(over / PRESTIGE_STEP) + 1 // Grandmaster Lv. 1, 2, 3...
    const intoLevel = over % PRESTIGE_STEP
    const nextLevelAt = current.min + level * PRESTIGE_STEP // total XP jahan next level milega

    let barPercent: number
    let barTitle: string
    let barRight: string
    let barHint: string

    if (next) {
        barPercent = ((xp - current.min) / (next.min - current.min)) * 100
        barTitle = `Next tier: ${next.name}`
        barRight = `${fmt(xp)} / ${fmt(next.min)} XP`
        barHint = `${fmt(next.min - xp)} XP to unlock`
    } else {
        barPercent = (intoLevel / PRESTIGE_STEP) * 100
        barTitle = `Grandmaster Lv. ${level} → Lv. ${level + 1}`
        barRight = `${fmt(intoLevel)} / ${fmt(PRESTIGE_STEP)} XP in this level`
        barHint = `Lv. ${level + 1} unlocks at ${fmt(nextLevelAt)} XP total`
    }

    // Roadmap line fill: max tier par poori, warna tier + partial
    const roadmapPercent = isMax ? 100 : ((tierIdx + barPercent / 100) / (TIERS.length - 1)) * 100

    return (
        <div className="relative overflow-hidden bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-7">
            <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-80" />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--borders)] pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/25">
                        <Award className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--primary-text)]">
                        Career Progression
                    </h2>
                </div>
                <span className="text-xs font-mono text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1 rounded-full">
                    XP System (+50 Win / -25 Loss)
                </span>
            </div>

            {/* Summary: total XP, tier aur level ek jagah, taaki numbers confuse na karein */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[var(--borders)] bg-[var(--bg-sec)]/60 p-4">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--secondary-text)]">Total XP earned</div>
                    <div className="mt-1 text-2xl font-extrabold font-mono text-[var(--primary-text)]">
                        {fmt(xp)} <span className="text-xs font-sans text-amber-400">XP</span>
                    </div>
                </div>
                <div className="rounded-2xl border border-[var(--borders)] bg-[var(--bg-sec)]/60 p-4">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--secondary-text)]">Current tier</div>
                    <div className={`mt-1 text-base sm:text-lg font-extrabold ${current.text}`}>{current.name}</div>
                </div>
                <div className="rounded-2xl border border-[var(--borders)] bg-[var(--bg-sec)]/60 p-4">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--secondary-text)]">
                        {isMax ? "Grandmaster level" : "Tiers unlocked"}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-base sm:text-lg font-extrabold text-[var(--primary-text)]">
                        {isMax ? (
                            <>
                                Lv. {level}
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-amber-400">
                                    <InfinityIcon className="w-3 h-3" /> No cap
                                </span>
                            </>
                        ) : (
                            <>{tierIdx + 1} / {TIERS.length}</>
                        )}
                    </div>
                </div>
            </div>

            {/* Tier roadmap */}
            <div className="relative px-1">
                <div className="absolute left-[12.5%] right-[12.5%] top-6 h-1 rounded-full bg-[var(--bg-sec)] border border-[var(--borders)]" />
                <div className="absolute left-[12.5%] right-[12.5%] top-6 h-1">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-[var(--accent)] to-amber-400 transition-all duration-700 ease-out shadow-[0_0_10px_var(--accent-glow)]"
                        style={{ width: `${Math.min(100, roadmapPercent)}%` }}
                    />
                </div>

                <div className="relative grid grid-cols-4">
                    {TIERS.map((t, i) => {
                        const unlocked = i <= tierIdx
                        const active = i === tierIdx
                        const sub = active ? (isMax ? `Lv. ${level}` : "Current") : unlocked ? "Unlocked" : `${fmt(t.min)} XP`
                        return (
                            <div key={t.name} className="flex flex-col items-center text-center gap-2">
                                <div
                                    className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500 ${
                                        unlocked
                                            ? `${t.reached} ${t.text} ${active ? t.glow : ""}`
                                            : "bg-[var(--bg-sec)] border-[var(--borders)] text-[var(--secondary-text)]"
                                    } ${active ? "scale-110" : ""}`}
                                >
                                    {unlocked ? <t.Icon className="w-5 h-5" /> : <Lock className="w-4 h-4 opacity-70" />}
                                    {unlocked && !active && (
                                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 border-2 border-[var(--card-bg)]">
                                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                        </span>
                                    )}
                                    {active && (
                                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[var(--player-you)] border-2 border-[var(--card-bg)]" />
                                    )}
                                </div>
                                <div className="space-y-0.5">
                                    <div className={`text-[11px] sm:text-xs font-bold leading-tight ${unlocked ? "text-[var(--primary-text)]" : "text-[var(--secondary-text)]"}`}>
                                        {t.name}
                                    </div>
                                    <div className={`text-[10px] font-mono ${active ? t.text : "text-[var(--secondary-text)]"}`}>{sub}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Progress card */}
            <div className="rounded-2xl border border-[var(--borders)] bg-[var(--bg-sec)]/60 p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-sm font-bold ${isMax ? current.text : "text-[var(--primary-text)]"}`}>{barTitle}</span>
                    <span className="text-xs font-mono text-[var(--secondary-text)]">{barRight}</span>
                </div>

                <div className="w-full h-3 bg-[var(--bg-main)] rounded-full border border-[var(--borders)] overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--accent)] to-purple-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_var(--accent-glow)]"
                        style={{ width: `${Math.max(2, Math.min(100, barPercent))}%` }}
                    />
                </div>

                <div className="text-[11px] font-mono text-[var(--secondary-text)]">{barHint}</div>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--bg-sec)]/70 border border-[var(--borders)] hover:border-emerald-500/40 transition-colors">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 shrink-0">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-[var(--primary-text)]">First Blood</div>
                        <div className="text-[11px] text-[var(--secondary-text)]">Completed your initial coding challenge</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--bg-sec)]/70 border border-[var(--borders)] hover:border-amber-500/40 transition-colors">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 shrink-0">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-[var(--primary-text)]">Blitz Competitor</div>
                        <div className="text-[11px] text-[var(--secondary-text)]">Participated in 1v1 multiplayer arena</div>
                    </div>
                </div>
            </div>
        </div>
    )
}