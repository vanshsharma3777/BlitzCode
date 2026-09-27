'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"

import Navbar from "../../components/Navbar"
import Loader from "../../components/Loader"

import ProfileHeader from "./components/ProfileHeader"
import StatsOverview from "./components/StatsOverview"
import CodingProfilesCard from "./components/CodingProfilesCard"
import CareerProgression from "./components/CareerProgression"

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [points, setPoints] = useState<number>(0)
    const [loadingPoints, setLoadingPoints] = useState<boolean>(true)

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

    const getRank = (xp: number) => {
        if (xp >= 1000) return { title: "Grandmaster Coder", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" }
        if (xp >= 500) return { title: "Senior Developer", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" }
        if (xp >= 200) return { title: "Code Competitor", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" }
        return { title: "Novice Hacker", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" }
    }

    const currentRank = getRank(points)

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--primary-text)] flex flex-col relative overflow-hidden transition-colors duration-300">
            <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 dark:opacity-15"
                style={{ background: 'var(--accent)' }}
            />

            <Navbar />

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 relative z-10 space-y-6">
                <ProfileHeader session={session} currentRank={currentRank} />
                <StatsOverview points={points} loadingPoints={loadingPoints} currentRankTitle={currentRank.title} />
                <CodingProfilesCard userEmail={session?.user?.email} />
                <CareerProgression points={points} />
            </main>
        </div>
    )
// }