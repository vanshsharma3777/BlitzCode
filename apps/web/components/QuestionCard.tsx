'use client'

import { Question, SolvedQuestion } from "../types/allTypes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User, AlertCircle, X, Timer, TrendingUp, Mail, CheckCircle2 } from "lucide-react";
import { createTime } from "../lib/functions/createTime";
import { updateAnswers } from "../lib/functions/selectOptions";
import QuestionDescription from "./atoms/QuestionDescription";
import QuestionLoader from "./atoms/QuestionLoader";

const THEME = {
    sky: {
        line: 'via-sky-400',
        box: 'border-sky-500/30 from-sky-500/25 to-sky-500/5 shadow-[0_0_18px_-4px_rgba(56,189,248,0.55)]',
        icon: 'text-sky-400',
        text: 'text-sky-400',
        bar: 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]',
        glow: 'bg-sky-500/[0.08]',
        card: 'hover:border-sky-400/30',
        dotCurrent: 'border-sky-400 bg-sky-500/20 text-white shadow-[0_0_14px_-2px_rgba(56,189,248,0.8)]',
        dotDone: 'border-sky-400/40 bg-sky-400 text-[#0d0d0c]',
        dotIdle: 'hover:border-sky-400/40',
        symbol: 'text-sky-300',
    },
    violet: {
        line: 'via-violet-400',
        box: 'border-violet-500/30 from-violet-500/25 to-violet-500/5 shadow-[0_0_18px_-4px_rgba(167,139,250,0.55)]',
        icon: 'text-violet-400',
        text: 'text-violet-400',
        bar: 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.7)]',
        glow: 'bg-violet-500/[0.08]',
        card: 'hover:border-violet-400/30',
        dotCurrent: 'border-violet-400 bg-violet-500/20 text-white shadow-[0_0_14px_-2px_rgba(167,139,250,0.8)]',
        dotDone: 'border-violet-400/40 bg-violet-400 text-[#0d0d0c]',
        dotIdle: 'hover:border-violet-400/40',
        symbol: 'text-violet-300',
    },
}

const SYMBOLS: [string, string, string, string, string, string][] = [
    ['</>', '8%', '6%', 'text-5xl', '0s', '9s'],
    ['{ }', '18%', '86%', 'text-6xl', '1.5s', '11s'],
    ['[ ]', '42%', '3%', 'text-5xl', '3s', '10s'],
    ['=>', '55%', '92%', 'text-4xl', '0.8s', '8s'],
    ['#', '72%', '8%', 'text-6xl', '2.2s', '12s'],
    ['&&', '82%', '84%', 'text-5xl', '4s', '9s'],
    ['( )', '30%', '94%', 'text-4xl', '2.8s', '10s'],
    [';', '90%', '45%', 'text-6xl', '1s', '11s'],
    ['0 1', '4%', '48%', 'text-4xl', '3.5s', '13s'],
]

export default function QuestionCard() {
    const session = useSession()
    const params = useParams()
    const mode = params.mode as string
    const router = useRouter()
    const searchParams = useSearchParams()
    const questionType = searchParams.get("questionType")
    const difficulty = searchParams.get("difficulty")
    const language = searchParams.get("language")
    const topic = searchParams.get("topic")
    const questionLength = searchParams.get("questionLength")
    const [show, setShow] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [quizId, setQuizId] = useState("")
    const [totalTime, setTotalTime] = useState(0)
    const [timeToPlay, setTimeToPlay] = useState(0)
    const [loader, setLoader] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [answers, setAnswers] = useState<SolvedQuestion[]>([])
    const [seconds, setSeconds] = useState(0)
    const [imgError, setImgError] = useState(false)

    const t = THEME[mode === 'multiplayer' ? 'violet' : 'sky']

    const currentAnswer = answers.find(
        a => a.questionId === data[currentIndex]?.questionId
    )

    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.replace("/signin")
        }
    }, [session.status, router])

    useEffect(() => {
        if (data.length === 0) {
            setLoader(true)
        }
        if (session.status !== "authenticated") {
            getResponse()
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (seconds >= 25) {
                return
            }
            if (data.length < Number(questionLength)) {
                getResponse()
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, [data, seconds, questionLength])

    useEffect(() => {
        const initialTime = createTime(
            Number(questionLength),
            difficulty as "easy" | "medium" | "hard"
        )
        setTimeToPlay(initialTime!)
        setTotalTime(initialTime!)

        const interval = setInterval(() => {
            setTotalTime(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [data, questionLength, difficulty])

    async function getResponse() {
        try {
            const res = await axios.post("/api/questions", {
                topic, difficulty, language, questionType, questionLength
            },
                { withCredentials: true }
            );
            const questions =
                typeof res.data.data === "string"
                    ? JSON.parse(res.data.data)
                    : res.data.data
            const matchId = res.data.quizId;
            setQuizId(matchId)
            if (res.data.data !== 0) {
                setLoader(false)
            }
            res.data.data.forEach((q: any) => {
                if (!q.questionId) {
                    return
                }
            })
            setData(prev => {
                const existingIds = new Set(prev.map(q => q.questionId))

                const filtered = questions.filter(
                    (q: any) => !existingIds.has(q.questionId)
                )

                return [...prev, ...filtered]
            });
            setShow(true);
        } catch (e: any) {
            console.error(e);
            if (e.response?.status === 500) {
                console.log("Server error (500)", e.response.data)
            }
        }
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toString().padStart(2, "0")}`
    }

    function selectOption(questionId: string, optionId: string, questionType: string) {
        setAnswers(prev =>
            updateAnswers(prev, questionId, optionId, questionType)
        )
    }

    async function handleSubmit() {

        const unanswered = data?.filter(
            (q) => !answers.some((a) => a.questionId === q.questionId)
        )
        if (unanswered && unanswered.length > 0) {
            setError("Please answer all questions before submitting the quiz.")
            return
        }
        const payload = {
            topic,
            language,
            difficulty,
            questionLength,
            questionType,
            answers,
            totalTime: timeToPlay,
            leftTime: totalTime,
            allQuestions: data,
            quizId
        }
        const pointsUpdated = false;
        sessionStorage.setItem("singlePlayerMatchData", JSON.stringify(payload))
        sessionStorage.setItem("pointsUpdated", JSON.stringify(pointsUpdated))
        try {
            if (quizId.length === 0) {
                return setError("QuizId not found")
            }
            const res = await axios.post('/api/submit-answers', { answers, quizId })
            if (res.data) {
                if (mode === 'multiplayer') router.replace('/multiplayer/result')
                else if (mode === 'singleplayer') router.replace('/singleplayer/result')
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    console.log("err , ", err.response.data)
                }
            }
        }

    }

    if (loader) {
        return <QuestionLoader />
    }

    const userImage = session.data?.user?.image;

    const total = Number(questionLength) || data.length
    const answeredCount = data.filter(q => answers.some(a => a.questionId === q.questionId)).length
    const timePct = timeToPlay > 0 ? Math.max(0, Math.min(100, (totalTime / timeToPlay) * 100)) : 0
    const urgent = timeToPlay > 0 && totalTime <= 60
    const CARD = `group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/80 px-4 py-4 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:px-5 ${t.card}`

    return (
        <div className="relative flex min-h-screen flex-col items-center gap-6 overflow-hidden bg-[#0d0d0c] px-4 py-8 text-zinc-200">

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
                    backgroundSize: '52px 52px',
                    maskImage: 'radial-gradient(ellipse 80% 70% at 50% 35%, black 25%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 35%, black 25%, transparent 100%)',
                }}
            />

            <div aria-hidden className={`pointer-events-none absolute left-1/2 top-[14%] h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-[160px] ${t.glow}`} />
            <div aria-hidden className="pointer-events-none absolute bottom-[8%] right-[6%] h-[320px] w-[320px] rounded-full bg-amber-500/[0.04] blur-[150px]" />

            
            <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
                {SYMBOLS.map(([sym, top, left, size, delay, dur], i) => (
                    <span
                        key={i}
                        className={`qc-float absolute font-mono font-bold opacity-[0.05] ${size} ${t.symbol}`}
                        style={{ top, left, animationDelay: delay, animationDuration: dur }}
                    >
                        {sym}
                    </span>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-5xl">
                <div className="mt-2 grid grid-cols-3 gap-3 sm:gap-5">

                    <div className={`${CARD} ${urgent ? '!border-rose-500/40' : ''}`}>
                        <div className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${urgent ? 'via-rose-400' : t.line} to-transparent opacity-80`} />
                        <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${urgent ? 'border-rose-500/40 from-rose-500/25 to-rose-500/5 shadow-[0_0_18px_-4px_rgba(244,63,94,0.6)]' : t.box}`}>
                                <Timer className={`h-5 w-5 ${urgent ? 'text-rose-400 animate-pulse' : t.icon}`} />
                            </div>
                            <div className="text-right sm:text-left">
                                <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:block">Time left</p>
                                <p className={`font-mono text-lg font-extrabold tracking-wider sm:text-xl ${urgent ? 'text-rose-400' : 'text-white'}`}>
                                    {formatTime(totalTime)}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-linear ${urgent ? 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.7)]' : t.bar}`}
                                style={{ width: `${timePct}%` }}
                            />
                        </div>
                    </div>

                    
                    <div className={CARD}>
                        <div className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${t.line} to-transparent opacity-80`} />
                        <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${t.box}`}>
                                <TrendingUp className={`h-5 w-5 ${t.icon}`} />
                            </div>
                            <div className="text-right sm:text-left">
                                <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:block">Question</p>
                                <p className="font-mono text-lg font-extrabold tracking-wider text-white sm:text-xl">
                                    <span className={t.text}>{currentIndex + 1}</span>
                                    <span className="text-zinc-600"> / {total}</span>
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${t.bar}`}
                                style={{ width: `${total ? (answeredCount / total) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                    {/* User */}
                    <div className={CARD}>
                        <div className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${t.line} to-transparent opacity-80`} />
                        <div className="flex items-center justify-center gap-3 sm:justify-start">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-400/40 bg-white/[0.04]">
                                {userImage && !imgError ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={userImage}
                                        alt="User profile"
                                        referrerPolicy="no-referrer"
                                        className="h-full w-full object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <User className="h-5 w-5 text-zinc-400" />
                                )}
                            </div>
                            <div className="hidden min-w-0 sm:block">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Player</p>
                                <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-zinc-100">
                                    <Mail className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                                    <span className="truncate">{session.data?.user?.email || "Guest User"}</span>
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400 sm:flex">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                            {answeredCount} answered
                        </div>
                    </div>
                </div>

                {total > 0 && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        {Array.from({ length: total }).map((_, i) => {
                            const q = data[i]
                            const loaded = !!q
                            const done = loaded && answers.some(a => a.questionId === q.questionId)
                            const current = i === currentIndex
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={!loaded}
                                    onClick={() => setCurrentIndex(i)}
                                    aria-label={`Question ${i + 1}`}
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl border font-mono text-xs font-bold transition-all duration-200 active:scale-95 ${
                                        current
                                            ? t.dotCurrent
                                            : done
                                            ? t.dotDone
                                            : loaded
                                            ? `border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white ${t.dotIdle}`
                                            : 'animate-pulse cursor-not-allowed border-white/5 bg-white/[0.02] text-zinc-700'
                                    }`}
                                >
                                    {done && !current ? <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {error && (
                <div className="relative z-10 flex w-full max-w-5xl items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-300 shadow-lg backdrop-blur-xl">
                    <div className="flex items-center gap-2.5 text-sm font-semibold">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="cursor-pointer rounded-lg p-1 text-rose-300 transition-colors hover:bg-rose-500/20"
                        aria-label="Dismiss error"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="relative z-10 w-full max-w-5xl">
                <QuestionDescription
                    show={show}
                    currentIndex={currentIndex}
                    questionType={questionType as 'single correct' | 'bugfixer' | 'multple correct'}
                    handleSubmit={handleSubmit}
                    data={data}
                    currentAnswer={currentAnswer}
                    selectOption={selectOption}
                    questionLength={Number(questionLength)}
                    setCurrentIndex={setCurrentIndex}
                    setIsSubmitting={setIsSubmitting}
                />
            </div>

            <style>{`
                @keyframes qc-float {
                    0%, 100% { transform: translateY(0) rotate(-4deg); }
                    50% { transform: translateY(-14px) rotate(4deg); }
                }
                .qc-float { animation: qc-float 10s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) { .qc-float { animation: none; } }
            `}</style>
        </div>
    )
}