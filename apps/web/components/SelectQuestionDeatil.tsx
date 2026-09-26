'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Loader from "./Loader"
import Navbar from "../components/Navbar"
import axios from "axios"
import { Sliders, ArrowRight, AlertTriangle } from "lucide-react"

export default function SelectQuestionsDetails() {
    const router = useRouter()
    const [language, setLanguage] = useState('')
    const [topic, setTopic] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [questionLength, setQuestionLength] = useState<number>(5)
    const [type, setType] = useState('')
    const [error, setError] = useState('')
    const [loader, setLoader] = useState(false)
    const session = useSession()

    if (session.status === "loading") return <Loader />
    if (session.status === 'unauthenticated') router.replace('/signin')

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setError('')
            setLoader(true)

            if (!language || !topic || !difficulty || !type) {
                setError("Please fill all fields")
                setLoader(false)
                return
            }

            const questionType = type
            const normalizedTopic = topic.trim().toLowerCase()

            router.push(`/questions-set?topic=${normalizedTopic}&difficulty=${difficulty}&language=${language}&questionType=${questionType}&questionLength=${questionLength}`)
            
            setTimeout(() => {
                setLoader(false)
            }, 2000)
        } catch (error) {
            console.log("error :", error)
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setError("Fields not provided");
                } else if (error.response?.status === 403 && error.response.data.success === false) {
                    setError("Failed to create questions.")
                } else if (error.response?.status === 403 && error.response.data.success === true) {
                    setError("Failed to parse questions.")
                }
            }
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--primary-text)] flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Ambient Background Glow */}
            <div 
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[150px] pointer-events-none opacity-20 dark:opacity-15"
                style={{ background: 'var(--accent)' }}
            />

            <Navbar />

            <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
                <form 
                    onSubmit={handleSubmit} 
                    className="w-full max-w-xl bg-[var(--card-bg)] hover:bg-[var(--card-hover)]/40 rounded-3xl border border-[var(--borders)] p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300"
                >
                    <div className="space-y-6">
                        
                        {/* Title Header */}
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-mono font-medium tracking-wider uppercase backdrop-blur-sm shadow-sm">
                                <Sliders className="w-3.5 h-3.5 text-[var(--accent)]" />
                                <span>Practice Session</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--primary-text)]">
                                Configure Your <span className="text-[var(--accent)] drop-shadow-[0_0_20px_var(--accent-glow)]">Training</span>
                            </h1>

                            <p className="text-xs sm:text-sm text-[var(--secondary-text)]">
                                Set up your parameters to launch a personalized problem set
                            </p>
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Language Field */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--secondary-text)] font-semibold">
                                        Language
                                    </label>
                                    <select 
                                        value={language} 
                                        disabled={loader}
                                        onChange={e => setLanguage(e.target.value.trim().toLowerCase())} 
                                        className="w-full rounded-xl bg-[var(--bg-main)] border border-[var(--borders)] px-4 py-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--accent)] transition-all cursor-pointer"
                                    >
                                        <option value="">Select Language</option>
                                        <option value="c">C</option>
                                        <option value="cpp">C++</option>
                                        <option value="java">Java</option>
                                        <option value="python">Python</option>
                                        <option value="javascript">JavaScript</option>
                                        <option value="typescript">TypeScript</option>
                                        <option value="sql">SQL</option>
                                        <option value="rust">Rust</option>
                                        <option value="go">Go</option>
                                        <option value="swift">Swift</option>
                                    </select>
                                </div>

                                {/* Topic Field */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--secondary-text)] font-semibold">
                                        Topic
                                    </label>
                                    <input 
                                        value={topic} 
                                        disabled={loader}
                                        onChange={e => setTopic(e.target.value)} 
                                        placeholder="e.g. Array, Tree, Graph" 
                                        className="w-full rounded-xl bg-[var(--bg-main)] border border-[var(--borders)] px-4 py-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-muted)]" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Difficulty Field */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--secondary-text)] font-semibold">
                                        Difficulty
                                    </label>
                                    <select 
                                        value={difficulty} 
                                        disabled={loader}
                                        onChange={e => setDifficulty(e.target.value.trim().toLowerCase())} 
                                        className="w-full rounded-xl bg-[var(--bg-main)] border border-[var(--borders)] px-4 py-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--accent)] transition-all cursor-pointer"
                                    >
                                        <option value="">Select Difficulty</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>

                                {/* Question Type Field */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--secondary-text)] font-semibold">
                                        Question Type
                                    </label>
                                    <select 
                                        value={type}
                                        disabled={loader} 
                                        onChange={e => setType(e.target.value.trim().toLowerCase())} 
                                        className="w-full rounded-xl bg-[var(--bg-main)] border border-[var(--borders)] px-4 py-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--accent)] transition-all cursor-pointer"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="single correct">Single Correct</option>
                                        <option value="multiple correct">Multiple Correct</option>
                                        <option value="bugfixer">Bugfixer</option>
                                    </select>
                                </div>
                            </div>

                            {/* Question Count Field */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--secondary-text)] font-semibold">
                                    Number of Questions
                                </label>
                                <select 
                                    value={questionLength}
                                    disabled={loader} 
                                    onChange={e => setQuestionLength(Number(e.target.value))} 
                                    className="w-full rounded-xl bg-[var(--bg-main)] border border-[var(--borders)] px-4 py-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--accent)] transition-all cursor-pointer"
                                >
                                    <option value={5}>05 Questions</option>
                                    <option value={10}>10 Questions</option>
                                    <option value={15}>15 Questions</option>
                                </select>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs font-semibold text-rose-500 shadow-sm backdrop-blur-md">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loader}
                            className="group relative flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[var(--accent)]/25 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                        >
                            {loader ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Initializing Session...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Start Session</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>

                    </div>
                </form>
            </main>
        </div>
    )
}