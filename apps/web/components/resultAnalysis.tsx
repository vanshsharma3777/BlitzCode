'use client'

import { useEffect, useMemo, useState } from "react";
import { MatchType, Response } from "../types/allTypes";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Loader from "./Loader";
import Navbar from "../components/Navbar";
import { 
    Trophy, 
    Zap, 
    CheckCircle2, 
    XCircle, 
    ChevronLeft, 
    ChevronRight, 
    BookOpen, 
    X, 
    Clock, 
    Target, 
    HelpCircle,
    Info,
    Swords
} from "lucide-react";

export default function ResultAnalysis({ 
    answers, 
    allQuestions, 
    pointsUpdated, 
    questionType, 
    winnerStatus, 
    loserStatus, 
    timeTaken, 
    totalTime, 
    quizId 
}: MatchType) {
    const params = useParams()
    const mode = params.mode as string
    const session = useSession()
    const router = useRouter()
    const [loader, setLoader] = useState(false)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [showExplanation, setShowExplanation] = useState(false)
    const [data, setData] = useState<Response>()
    const [points, setPoints] = useState<number>(0)

    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.replace("/signin")
        }
    }, [session.status, router])

    if (mode === 'singleplayer') {
        useEffect(() => {
            setLoader(true)
            async function getResponse() {
                try {
                    const res = await axios.post('/api/submit-answers', { answers, quizId })
                    if (res.data) {
                        setData(res.data.data)
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 401) {
                            router.push("/signin")
                        }
                    }
                } finally {
                    setLoader(false)
                }
            }
            getResponse()
        }, [])
    }

    if (mode === 'singleplayer') {
        useEffect(() => {
            if (pointsUpdated) return
            if (data) {
                sessionStorage.setItem("pointsUpdated", "true")
                async function getScore() {
                    const email = session.data?.user.email
                    const score = Number(data?.score) * 50
                    const res = await axios.post('/api/score', { userEmail: email, score })
                    setPoints(res.data.points)
                }
                getScore()
            }
        }, [data])
    }

    if (mode === 'multiplayer') {
        useEffect(() => {
            if (pointsUpdated) return
            if (winnerStatus && loserStatus) {
                sessionStorage.setItem("pointsUpdated", "true")
                if (session.data?.user.email === winnerStatus.winnerEmail) {
                    async function getScore() {
                        const email = session.data?.user.email
                        const score = 25
                        const res = await axios.post('/api/score', { userEmail: email, score })
                        setPoints(res.data.points)
                    }
                    getScore()
                } else if (session.data?.user.email === loserStatus.loserEmail) {
                    async function getScore() {
                        const email = session.data?.user.email
                        const score = -25
                        const res = await axios.post('/api/score', { userEmail: email, score })
                        setPoints(res.data.points)
                    }
                    getScore()
                }
            }
        }, [winnerStatus, loserStatus])
    }

    useEffect(() => {
        async function getPoints() {
            const email = session.data?.user.email
            const res = await axios.post('/api/get-points', { userEmail: email })
            setPoints(res.data.points)
        }
        if (session.data?.user.email) {
            getPoints()
        }
    }, [session])

    useEffect(() => {
        if (showExplanation) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showExplanation]);

    const question = data?.questions?.[currentIndex]

    const userAnswer = useMemo(() => {
        return (
            answers?.find((a) => a.questionId === question?.questionId)?.userAnswer ?? []
        );
    }, [answers, question]);

    const correctAnswer = question?.correctOptions ?? []

    if (loader) return <Loader />

    const isWinner = winnerStatus?.winnerEmail === session.data?.user.email;

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--primary-text)] flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Ambient Background Radial Glow */}
            <div 
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 dark:opacity-15"
                style={{ background: 'var(--accent)' }}
            />

            <Navbar />

            <main className="flex-1 flex justify-center px-4 py-8 relative z-10">
                <div className="w-full max-w-4xl space-y-6">
                    
                    {/* Banner Trophy Card */}
                    {mode === 'singleplayer' ? (
                        <div className="relative overflow-hidden bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl">
                            <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]">
                                <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--primary-text)]">
                                Quiz Completed
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-[var(--secondary-text)]">
                                Great job! You scored <span className="text-[var(--accent)] font-bold">{data?.score}</span> out of {data?.questionIds?.length || 0}
                            </p>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl">
                            <div className={`inline-flex p-4 rounded-2xl mb-4 shadow-xl ${
                                isWinner 
                                    ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]" 
                                    : "bg-[var(--bg-sec)] border border-[var(--borders)] text-[var(--text-muted)]"
                            }`}>
                                <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--primary-text)]">
                                {isWinner
                                    ? winnerStatus?.status
                                    : loserStatus?.status || "Match Concluded"}
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-[var(--secondary-text)] font-medium">
                                {isWinner ? "You won this round!" : "You lost this round!"}
                            </p>
                        </div>
                    )}

                    {/* Stats Grid */}
                    {mode === 'singleplayer' && (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-[var(--card-bg)] border border-[var(--borders)] hover:border-[var(--accent)]/40 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-md transition-all duration-300">
                                <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Target className="w-3.5 h-3.5 text-[var(--accent)]" /> Your Score
                                </span>
                                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--primary-text)]">
                                    {data?.score ?? 0}
                                </div>
                                <span className="text-xs font-mono text-[var(--accent)] font-semibold mt-1">
                                    {(((data?.score ?? 0) / (data?.questionIds?.length || 1)) * 100).toFixed(1)}% correct
                                </span>
                            </div>

                            <div className="bg-[var(--card-bg)] border border-[var(--borders)] hover:border-[var(--accent)]/40 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-md transition-all duration-300">
                                <span className="text-xs font-mono text-[var(--secondary-text)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[var(--accent)]" /> Time Taken
                                </span>
                                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--primary-text)]">
                                    {String(timeTaken)}s
                                </div>
                                <span className="text-xs font-mono text-[var(--secondary-text)] mt-1">
                                    {(totalTime / 60).toFixed(1)} min allocated
                                </span>
                            </div>
                        </div>
                    )}

                    {mode === 'multiplayer' && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-[var(--card-bg)] border border-[var(--borders)] rounded-2xl p-4 flex flex-col items-center text-center shadow-lg backdrop-blur-md">
                                <span className="text-[11px] font-mono text-[var(--secondary-text)] uppercase tracking-wider">Your Score</span>
                                <div className="text-xl sm:text-2xl font-mono font-extrabold text-[var(--primary-text)] mt-1">
                                    {isWinner ? winnerStatus?.score : loserStatus?.score}
                                </div>
                            </div>

                            <div className="bg-[var(--card-bg)] border border-[var(--borders)] rounded-2xl p-4 flex flex-col items-center text-center shadow-lg backdrop-blur-md">
                                <span className="text-[11px] font-mono text-[var(--secondary-text)] uppercase tracking-wider">Your Time</span>
                                <div className="text-xl sm:text-2xl font-mono font-extrabold text-[var(--primary-text)] mt-1">
                                    {isWinner ? `${winnerStatus?.timeTaken}s` : `${loserStatus?.timeTaken}s`}
                                </div>
                            </div>

                            <div className="bg-[var(--card-bg)] border border-[var(--borders)] rounded-2xl p-4 flex flex-col items-center text-center shadow-lg backdrop-blur-md">
                                <span className="text-[11px] font-mono text-[var(--secondary-text)] uppercase tracking-wider">Opp. Score</span>
                                <div className="text-xl sm:text-2xl font-mono font-extrabold text-[var(--primary-text)] mt-1">
                                    {isWinner ? `${loserStatus?.score}` : `${winnerStatus?.score}`}
                                </div>
                            </div>

                            <div className="bg-[var(--card-bg)] border border-[var(--borders)] rounded-2xl p-4 flex flex-col items-center text-center shadow-lg backdrop-blur-md">
                                <span className="text-[11px] font-mono text-[var(--secondary-text)] uppercase tracking-wider">Opp. Time</span>
                                <div className="text-xl sm:text-2xl font-mono font-extrabold text-[var(--primary-text)] mt-1">
                                    {isWinner ? `${loserStatus?.timeTaken}s` : `${winnerStatus?.timeTaken}s`}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* XP Progression Banner */}
                    <div className={`p-4 sm:p-5 rounded-2xl border bg-[var(--card-bg)] shadow-xl backdrop-blur-md transition-all ${
                        mode === 'multiplayer' 
                            ? isWinner ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-rose-500/40 bg-rose-500/5'
                            : 'border-amber-500/40 bg-amber-500/5'
                    }`}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
                                <Zap className="w-6 h-6 fill-amber-400" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                                <div>
                                    <div className="text-base sm:text-lg font-bold text-[var(--primary-text)]">
                                        {mode === 'singleplayer' 
                                            ? `XP Earned: +${(data?.score ?? 0) * 50}` 
                                            : isWinner ? `XP Earned: +25` : `XP Earned: -25`}
                                    </div>
                                    <div className="text-xs text-[var(--secondary-text)]">
                                        {mode === 'singleplayer' 
                                            ? `${data?.score ?? 0} Correct answer(s) × 50 XP` 
                                            : `Win: +25 XP | Loss: -25 XP`}
                                    </div>
                                </div>
                                <div className="text-sm font-mono font-bold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                                    Total XP: {points}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Multiplayer Criteria Modal Card */}
                    {mode === 'multiplayer' && (
                        <div className="p-5 rounded-2xl border border-[var(--borders)] bg-[var(--card-bg)] shadow-lg backdrop-blur-md">
                            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[var(--primary-text)] mb-3">
                                <Info className="w-4 h-4 text-[var(--accent)]" />
                                <span>Match Result Criteria</span>
                            </div>
                            <div className="space-y-2 text-xs sm:text-sm text-[var(--secondary-text)] leading-relaxed">
                                <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-[var(--accent)]">1.</span>
                                    <span>The player with the <strong className="text-[var(--primary-text)]">higher overall score</strong> is declared the winner.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-[var(--accent)]">2.</span>
                                    <span>If scores are tied, the player with the <strong className="text-[var(--primary-text)]">least time taken</strong> wins the round.</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Detailed Question Analysis Section */}
                    {mode === 'singleplayer' && (
                        <div className="pt-4 pb-10 space-y-5">
                            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--primary-text)]">
                                Detailed Analysis
                            </h2>

                            {/* Analysis Question Header Bar */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--borders)] shadow-lg backdrop-blur-md">
                                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                    <span className="px-3.5 py-1.5 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider">
                                        QUESTION {currentIndex + 1} OF {allQuestions?.length || 0}
                                    </span>
                                    {questionType && (
                                        <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)] text-[var(--secondary-text)] font-mono text-xs font-semibold uppercase tracking-wider">
                                            {questionType}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                    <button 
                                        type="button"
                                        onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                                        disabled={currentIndex === 0}
                                        className="p-2.5 rounded-xl border border-[var(--borders)] bg-[var(--bg-sec)] text-[var(--primary-text)] hover:border-[var(--accent)] hover:bg-[var(--card-hover)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
                                        aria-label="Previous question"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, (allQuestions?.length || 1) - 1))}
                                        disabled={currentIndex === (allQuestions?.length || 1) - 1}
                                        className="p-2.5 rounded-xl border border-[var(--borders)] bg-[var(--bg-sec)] text-[var(--primary-text)] hover:border-[var(--accent)] hover:bg-[var(--card-hover)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
                                        aria-label="Next question"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Question Card Details */}
                            <div className="p-5 sm:p-7 rounded-3xl bg-[var(--card-bg)] border border-[var(--borders)] shadow-xl backdrop-blur-xl space-y-6">
                                <p className="text-base sm:text-lg font-semibold text-[var(--primary-text)] leading-relaxed">
                                    {allQuestions?.[currentIndex]?.description}
                                </p>

                                {/* Code Block */}
                                {allQuestions?.[currentIndex]?.code?.trim() && (
                                    <div className="overflow-hidden rounded-2xl border border-[var(--borders)] shadow-lg">
                                        <SyntaxHighlighter
                                            language="javascript"
                                            style={vscDarkPlus}
                                            customStyle={{
                                                borderRadius: "0px",
                                                padding: "20px",
                                                fontSize: "15px",
                                                margin: 0,
                                                background: "var(--bg-sec)",
                                                lineHeight: "1.6"
                                            }}
                                        >
                                            {allQuestions[currentIndex]?.code}
                                        </SyntaxHighlighter>
                                    </div>
                                )}

                                {/* Option Cards */}
                                <div className="space-y-3">
                                    {question?.options?.map((opt) => {
                                        const isSelected = userAnswer.includes(opt.id)
                                        const isCorrect = correctAnswer.includes(opt.id)

                                        return (
                                            <div 
                                                key={opt.id} 
                                                className={`flex items-center justify-between p-4 rounded-2xl border text-sm sm:text-base font-medium transition-all ${
                                                    isCorrect 
                                                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-semibold shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]" 
                                                        : isSelected 
                                                            ? "border-rose-500/50 bg-rose-500/10 text-rose-400 font-semibold shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]" 
                                                            : "border-[var(--borders)] bg-[var(--bg-sec)]/60 text-[var(--secondary-text)]"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3.5 pr-4">
                                                    <div className={`flex items-center justify-center h-8 w-8 shrink-0 rounded-xl font-mono text-sm font-bold border ${
                                                        isCorrect 
                                                            ? "bg-emerald-500 border-emerald-500 text-white" 
                                                            : isSelected 
                                                                ? "bg-rose-500 border-rose-500 text-white" 
                                                                : "bg-[var(--card-bg)] border-[var(--borders)] text-[var(--secondary-text)]"
                                                    }`}>
                                                        {opt.id}
                                                    </div>
                                                    <span className="leading-snug">{opt.text}</span>
                                                </div>

                                                <div className="shrink-0">
                                                    {isCorrect ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                    ) : isSelected ? (
                                                        <XCircle className="w-5 h-5 text-rose-400" />
                                                    ) : null}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Show Explanation CTA Button */}
                                <div className="pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setShowExplanation(true)}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-[var(--accent)]/25 active:scale-95"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        <span>Show Explanation</span>
                                    </button>
                                </div>
                            </div>

                            {/* Explanation Modal Overlay */}
                            {showExplanation && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
                                    <div className="bg-[var(--card-bg)] border border-[var(--borders)] w-full max-w-2xl p-6 sm:p-8 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200">
                                        <button 
                                            type="button"
                                            onClick={() => setShowExplanation(false)}
                                            className="absolute top-5 right-5 p-2 rounded-xl text-[var(--secondary-text)] hover:text-[var(--primary-text)] hover:bg-[var(--bg-sec)] transition-colors cursor-pointer"
                                            aria-label="Close modal"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        <div className="flex items-center gap-2 text-xl font-bold text-[var(--primary-text)] mb-4 border-b border-[var(--borders)] pb-3">
                                            <HelpCircle className="w-5 h-5 text-[var(--accent)]" />
                                            <span>Detailed Explanation</span>
                                        </div>

                                        <div className="text-sm sm:text-base text-[var(--secondary-text)] leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                                            {question?.explanation || "No explanation provided for this question."}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>
        </div>
    )
}