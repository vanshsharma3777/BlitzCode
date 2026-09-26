'use client'

import { useEffect, useState } from "react"
import ConfigurationCard from "../../../components/atoms/ConfiguratinCard"
import { useParams, useRouter } from "next/navigation"
import Loader from "../../../components/Loader"
import Navbar from "../../../components/Navbar"
import { useSession } from "next-auth/react"
import { Sliders, Sparkles } from "lucide-react"

export default function Configuration() {
    const router = useRouter()
    const params = useParams()
    const { status } = useSession()
    const mode = params.mode as string
    const [loader, setLoader] = useState(false)
    const [config, setConfig] = useState({
        language: null,
        topic: null,
        questionType: null as "single correct" | "multiple correct" | "bugfixer" | null,
        difficulty: null as "easy" | "medium" | "hard" | null,
        questionLength: null as "5" | "10" | "15" | null
    })

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/signin")
        }
    }, [status, router])

    useEffect(() => {
        if (
            config.topic !== null && 
            config.questionLength !== null && 
            config.questionType !== null && 
            config.difficulty !== null && 
            config.language !== null
        ) {
            setLoader(true)
            const queryParams = `topic=${config.topic}&difficulty=${config.difficulty}&language=${config.language}&questionType=${config.questionType}&questionLength=${config.questionLength}`

            if (mode === 'multiplayer') {
                router.push(`/multiplayer/find-match?${queryParams}`)
            } else if (mode === 'singleplayer') {
                router.push(`/singleplayer/questions-page?${queryParams}`)
            }

            const timeout = setTimeout(() => {
                setLoader(false)
            }, 2000)

            return () => clearTimeout(timeout)
        }
    }, [config, mode, router])

    if (loader || status === "loading") return <Loader />
    if (status === "unauthenticated") return null

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--primary-text)] flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Ambient Background Glow */}
            <div 
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20 dark:opacity-15"
                style={{ background: 'var(--accent)' }}
            />

            <Navbar />

            <main className="flex-1 px-4 py-8 md:px-8 md:py-12 relative z-10">
                <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
                    
                    {/* Mode Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-mono font-medium tracking-wider uppercase mb-4 shadow-sm backdrop-blur-sm">
                        <Sliders className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>{mode || "Match"} Setup</span>
                    </div>

                    {/* Page Header */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight leading-tight">
                        Configure Your <span className="text-[var(--accent)] drop-shadow-[0_0_20px_var(--accent-glow)]">Match</span>
                    </h1>

                    <p className="mt-3 mb-8 text-[var(--secondary-text)] text-center max-w-md text-sm md:text-base leading-relaxed">
                        Select your parameters below. Tap an active choice again to deselect it.
                    </p>

                    {/* Cards Container */}
                    <div className="flex flex-col gap-5 w-full items-center max-w-2xl">
                        <ConfigurationCard heading="Language" setConfig={setConfig} />
                        <ConfigurationCard heading="Topic" setConfig={setConfig} />
                        <ConfigurationCard heading="Question Type" setConfig={setConfig} />
                        <ConfigurationCard heading="Difficulty Level" setConfig={setConfig} />
                        <ConfigurationCard heading="Question Length" setConfig={setConfig} />
                    </div>

                </div>
            </main>
        </div>
    )
}