'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"

import { 
    User, 
    Zap, 
    Trophy, 
    Shield, 
    Mail, 
    Calendar, 
    Award, 
    Code, 
    CheckCircle,
    Swords,
    Sparkles
} from "lucide-react"
import Navbar from "../../components/Navbar"
import Loader from "../../components/Loader"

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [points, setPoints] = useState<number>(0)
    const [loadingPoints, setLoadingPoints] = useState<boolean>(true)
    const [imgError, setImgError] = useState<boolean>(false)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/signin")
        }
    }, [status, router])

    useEffect(() => {
        async function fetchPoints() {
            if (!session?.user?.email) return
            try {
                setLoadingPoints(true)
                const res = await axios.post('/api/get-points', { 
                    userEmail: session.user.email 
                })
                setPoints(res.data.points || 0)
            } catch (err) {
                console.error("Failed to fetch user points:", err)
            } finally {
                setLoadingPoints(false)
            }
        }

        if (session?.user?.email) {
            fetchPoints()
        }
    }, [session?.user?.email])

    if (status === "loading") return <Loader />
    if (status === "unauthenticated") return null

    // Determine Rank Badge based on XP
    const getRank = (xp: number) => {
        if (xp >= 1000) return { title: "Grandmaster Coder", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" }
        if (xp >= 500) return { title: "Senior Developer", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" }
        if (xp >= 200) return { title: "Code Competitor", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" }
        return { title: "Novice Hacker", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" }
    }

    const currentRank = getRank(points)
    const userImage = session?.user?.image

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--primary-text)] flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Background Radial Glow */}
            <div 
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 dark:opacity-15"
                style={{ background: 'var(--accent)' }}
            />

            <Navbar />

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 relative z-10 space-y-6">
                
                {/* Profile Header Hero Card */}
                <div className="relative overflow-hidden rounded-3xl bg-[var(--card-bg)] border border-[var(--borders)] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                    <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-80" />

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden border-2 border-[var(--borders)] bg-[var(--bg-sec)] flex items-center justify-center shadow-xl">
                                {userImage && !imgError ? (
                                    <img 
                                        src={userImage} 
                                        alt={session?.user?.name || "User Avatar"} 
                                        className="h-full w-full object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <User className="h-12 w-12 text-[var(--secondary-text)]" />
                                )}
                            </div>
                            
                            {/* Online Status Indicator */}
                            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[var(--player-you)] border-4 border-[var(--card-bg)] shadow-md" />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center sm:text-left space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--primary-text)] font-sans">
                                    {session?.user?.name || "BlitzCoder"}
                                </h1>

                                {/* Rank Pill Badge */}
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-wide uppercase ${currentRank.bg} ${currentRank.color} self-center sm:self-auto`}>
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>{currentRank.title}</span>
                                </div>
                            </div>

                            <p className="text-sm text-[var(--secondary-text)] flex items-center justify-center sm:justify-start gap-2">
                                <Mail className="w-4 h-4 text-[var(--accent)]" />
                                <span>{session?.user?.email}</span>
                            </p>

                            <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3 text-xs font-mono text-[var(--text-muted)]">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)]">
                                    <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" /> Active Member
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)]">
                                    <Code className="w-3.5 h-3.5 text-[var(--accent)]" /> Full-Stack Competitor
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Statistics Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* XP Card */}
                    <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--borders)] hover:border-[var(--accent)]/50 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md transition-all duration-300">
                        <div className="p-3.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)] shrink-0">
                            <Zap className="w-7 h-7 fill-amber-400" />
                        </div>
                        <div>
                            <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider">Total Points</span>
                            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--primary-text)]">
                                {loadingPoints ? "..." : points} <span className="text-xs text-amber-400 font-sans">XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Rank Tier Card */}
                    <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--borders)] hover:border-[var(--accent)]/50 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md transition-all duration-300">
                        <div className="p-3.5 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 shadow-[0_0_15px_-3px_var(--accent-glow)] shrink-0">
                            <Trophy className="w-7 h-7" />
                        </div>
                        <div>
                            <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider">Current Tier</span>
                            <div className="text-base sm:text-lg font-extrabold text-[var(--primary-text)]">
                                {currentRank.title}
                            </div>
                        </div>
                    </div>

                    {/* Arena Mode Card */}
                    <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--borders)] hover:border-[var(--accent)]/50 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md transition-all duration-300">
                        <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] shrink-0">
                            <Swords className="w-7 h-7" />
                        </div>
                        <div>
                            <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider">Arena Status</span>
                            <div className="text-base sm:text-lg font-extrabold text-emerald-400">
                                Match Ready
                            </div>
                        </div>
                    </div>

                </div>

                {/* Achievements / Progression Section */}
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

                    {/* Progress Bar towards Next Tier */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-[var(--secondary-text)]">
                            <span>Level Progress</span>
                            <span>{points} / {points >= 1000 ? 2000 : points >= 500 ? 1000 : 500} XP</span>
                        </div>
                        <div className="w-full h-3 bg-[var(--bg-sec)] rounded-full border border-[var(--borders)] overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-[var(--accent)] to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((points / (points >= 1000 ? 2000 : points >= 500 ? 1000 : 500)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Achievements List */}
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

            </main>
        </div>
    )
}