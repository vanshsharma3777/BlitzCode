'use client'

import { useEffect, useRef, useState } from "react"
import Loader from "../../../components/Loader"
import { useSession } from "next-auth/react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { updateAnswers } from "../../../lib/functions/selectOptions"
import { Question, SolvedQuestion, WSQuestionData } from "../../../types/allTypes"
import { connectSocket } from "../../../lib/websocket"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import SyntaxHighlighter from "react-syntax-highlighter"
import { createTime } from "../../../lib/functions/createTime"
import { Timer, TrendingUp, Mail, User, AlertCircle, X, Send, Check, Lock, Swords } from "lucide-react"

// background ke floating code symbols: [text, top, left, size, delay, duration]
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

const CARD = "group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/80 px-4 py-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-violet-400/30 sm:px-5"

export default function MacthPage() {
    const session = useSession()
    const params = useParams()
    const mode = params.mode as string
    const socketRef = useRef<WebSocket | null>(null)
    const answersRef = useRef<SolvedQuestion[]>([])
    const questionsRef = useRef<Question[]>([])
    const completeTime = useRef<number>(0)
    const router = useRouter()
    const searchParams = useSearchParams()
    const questionType = searchParams.get("questionType")
    const difficulty = searchParams.get("difficulty")
    const language = searchParams.get("language")
    const topic = searchParams.get("topic")
    const questionLength = searchParams.get("questionLength")
    const [loader, setLoader] = useState(false)
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [error, setError] = useState<string | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [totalTime, setTotalTime] = useState(0)
    const [timer, setTimer] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<SolvedQuestion[]>([])
    const [imgError, setImgError] = useState(false)
    const currentQuestion = questions[currentIndex]

    useEffect(() => {
        if (session.status === "loading") {
            setLoader(true)
            return
        }

        if (session.status === "unauthenticated") {
            setLoader(false)
            setError("User not authenticated")
            return router.replace("/signin")
        }

        if (session.status === "authenticated") {
            setLoader(false)
        }
    }, [session.status])

    useEffect(() => {
        answersRef.current = answers
    }, [answers])

    useEffect(() => {
        questionsRef.current = questions
    }, [questions])

    useEffect(() => {
        setLoader(true)

        const socket = connectSocket()
        socketRef.current = socket

        if (socket.readyState === WebSocket.OPEN) {
            fetchQuestion()
        }

        socket.onmessage = (event) => {
            const parsed = JSON.parse(event.data)

            if (
                parsed?.type === "ERROR" &&
                parsed?.payload?.error === "Game is still initializing"
            ) {
                console.log("Retrying in 5 sec...");

                setLoader(true);

                if (retryTimeoutRef.current) {
                    clearTimeout(retryTimeoutRef.current);
                }

                retryTimeoutRef.current = setTimeout(() => {
                    fetchQuestion();
                }, 5000);

                return;
            }
            if (parsed?.payload?.error) {
                setError(parsed.payload.error)
                setLoader(false)
                return
            }

            if (parsed?.data) {
                const wsData: WSQuestionData = parsed.data
                if (parsed.type === "start_game") {
                    setTimer(true)
                }
                setQuestions((prev) => {
                    const alreadyExists = prev.some(
                        (q) => q.questionId === wsData.question.questionId
                    )

                    if (alreadyExists) {
                        const existingIndex = prev.findIndex(
                            (q) => q.questionId === wsData.question.questionId
                        )
                        if (existingIndex !== -1) {
                            setCurrentIndex(existingIndex)
                        }
                        return prev
                    }

                    const updated = [...prev, wsData.question]
                    setCurrentIndex(updated.length - 1)
                    return updated
                })
            }
            if (parsed.type === "over_game") {
                const email = session.data?.user.email
                const player = parsed.payload.find((p: any) => {
                    return p.email === email
                })
                const payload = {
                    winner: parsed.winner,
                    payload: parsed.payload,
                    reason: parsed.reason,
                    totalTime: completeTime.current,
                    answers: answersRef.current,
                    allQuestions: questionsRef.current,
                    questionType,
                    timeTaken: player.timeTaken,
                    questionLength,
                }
                const pointsUpdated = false;
                sessionStorage.setItem("multiPlayerMatchData", JSON.stringify(payload))
                sessionStorage.setItem("pointsUpdated", JSON.stringify(pointsUpdated))
                router.replace("/multiplayer/result");
            }

            setLoader(false)
        }

        socket.onerror = (err) => {
            setError("Socket connection error")
            setLoader(false)
        }

        socket.onclose = () => {
            console.log("socket disconnected")
        }

        return () => {
            console.log("socket disconnected")
            socket.close()
        }
    }, [session.data?.user.email, session.status])

    useEffect(() => {
        const initialTime = createTime(
            Number(questionLength),
            difficulty as "easy" | "medium" | "hard"
        )
        completeTime.current = initialTime!
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
    }, [timer])

    const handleOptionClick = (questionId: string, userAnswer: string[]) => {
        socketRef.current?.send(JSON.stringify({
            type: "ANSWER",
            payload: {
                questionId,
                answer: userAnswer
            }
        }));

        if (currentIndex === Number(questionLength) - 1) {
            socketRef.current?.send(JSON.stringify({
                type: "over_game",
                payload: {
                    endType: "manual",
                }
            }));
        }
    };

    function selectOption(questionId: string, optionId: string, questionType: string) {
        setAnswers(prev =>
            updateAnswers(prev, questionId, optionId, questionType)
        )
    }

    const fetchQuestion = () => {
        if (!socketRef.current) return

        if (socketRef.current.readyState !== WebSocket.OPEN) {
            return
        }

        setLoader(true)

        socketRef.current.send(JSON.stringify({
            type: "next_ques",
            payload: {
                topic,
                questionLength,
                difficulty,
                questionType,
                language,
            },
            meta: {
                emailId: session.data?.user.email
            }
        }))
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toString().padStart(2, "0")}`
    }

    const currentAnswer = answers.find(
        a => a.questionId === currentQuestion?.questionId
    )

    const goToQuestion = (i: number) => {
        if (questions[i]) {
            setCurrentIndex(i)
        } else {
            fetchQuestion()
        }
    }

    if (loader && questions.length == 0) {
        return <Loader />
    }

    const total = Number(questionLength) || questions.length
    const timePct = completeTime.current > 0 ? Math.max(0, Math.min(100, (totalTime / completeTime.current) * 100)) : 0
    const urgent = completeTime.current > 0 && totalTime <= 60
    const userImage = session.data?.user.image
    const answeredCount = questions.filter(q => answers.some(a => a.questionId === q.questionId && a.userAnswer?.length)).length
    const isLast = currentIndex === total - 1

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#0d0d0c] px-4 py-8 text-zinc-200">

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

            <div aria-hidden className="pointer-events-none absolute left-1/2 top-[14%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-500/[0.09] blur-[160px]" />
            <div aria-hidden className="pointer-events-none absolute bottom-[8%] right-[6%] h-[320px] w-[320px] rounded-full bg-fuchsia-500/[0.04] blur-[150px]" />

            <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
                {SYMBOLS.map(([sym, top, left, size, delay, dur], i) => (
                    <span
                        key={i}
                        className={`mp-float absolute font-mono font-bold text-violet-300 opacity-[0.05] ${size}`}
                        style={{ top, left, animationDelay: delay, animationDuration: dur }}
                    >
                        {sym}
                    </span>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-5xl space-y-5">

                <div className="flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                        <Swords className="h-3 w-3" />
                        Live match
                    </span>
                </div>

                {error && (
                    <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-300 shadow-lg backdrop-blur-xl">
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

                {currentQuestion && (
                    <>
                        {loader === false && (
                            <div className="grid grid-cols-3 gap-3 sm:gap-5">

                                <div className={`${CARD} ${urgent ? '!border-rose-500/40' : ''}`}>
                                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${urgent ? 'via-rose-400' : 'via-violet-400'} to-transparent opacity-80`} />
                                    <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-3">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${urgent ? 'border-rose-500/40 from-rose-500/25 to-rose-500/5 shadow-[0_0_18px_-4px_rgba(244,63,94,0.6)]' : 'border-violet-500/30 from-violet-500/25 to-violet-500/5 shadow-[0_0_18px_-4px_rgba(167,139,250,0.55)]'}`}>
                                            <Timer className={`h-5 w-5 ${urgent ? 'animate-pulse text-rose-400' : 'text-violet-400'}`} />
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
                                            className={`h-full rounded-full transition-all duration-1000 ease-linear ${urgent ? 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.7)]' : 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.7)]'}`}
                                            style={{ width: `${timePct}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className={CARD}>
                                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-80" />
                                    <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/25 to-violet-500/5 shadow-[0_0_18px_-4px_rgba(167,139,250,0.55)]">
                                            <TrendingUp className="h-5 w-5 text-violet-400" />
                                        </div>
                                        <div className="text-right sm:text-left">
                                            <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:block">Question</p>
                                            <p className="font-mono text-lg font-extrabold tracking-wider text-white sm:text-xl">
                                                <span className="text-violet-400">{currentIndex + 1}</span>
                                                <span className="text-zinc-600"> / {total}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                                        <div
                                            className="h-full rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.7)] transition-all duration-500"
                                            style={{ width: `${total ? (answeredCount / total) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Player */}
                                <div className={CARD}>
                                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-80" />
                                    <div className="flex items-center justify-center gap-3 sm:justify-start">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-400/40 bg-white/[0.04]">
                                            {userImage && !imgError ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={userImage}
                                                    alt="profile"
                                                    referrerPolicy="no-referrer"
                                                    className="h-full w-full object-cover"
                                                    onError={() => setImgError(true)}
                                                />
                                            ) : (
                                                <User className="h-5 w-5 text-zinc-400" />
                                            )}
                                        </div>
                                        <div className="hidden min-w-0 sm:block">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Logged in as</p>
                                            <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-zinc-100">
                                                <Mail className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                                                <span className="truncate">{session.data?.user.email}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400 sm:flex">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                                        {answeredCount} answered
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* question panel */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121212]/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-80" />

                            {/* header */}
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                                        Question {currentIndex + 1}
                                    </span>
                                    {questionType && (
                                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                            {questionType}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() =>
                                        handleOptionClick(
                                            currentQuestion.questionId,
                                            currentAnswer?.userAnswer!
                                        )
                                    }
                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_22px_-4px_rgba(167,139,250,0.8)] transition-all hover:bg-violet-400 active:scale-95"
                                >
                                    <Send className="h-4 w-4" />
                                    {isLast ? 'Submit & Finish' : 'Submit'}
                                </button>
                            </div>

                            {/* description */}
                            <p className="mt-6 text-lg font-semibold leading-relaxed text-white md:text-2xl">
                                {currentQuestion?.description}
                            </p>

                            {/* code */}
                            {currentQuestion?.code?.trim() && (
                                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                                    <SyntaxHighlighter
                                        language="javascript"
                                        style={vscDarkPlus}
                                        customStyle={{
                                            borderRadius: 0,
                                            padding: "18px",
                                            fontSize: "15px",
                                            margin: 0,
                                            background: "#0d0d0c",
                                            lineHeight: "1.6",
                                        }}
                                    >
                                        {currentQuestion?.code}
                                    </SyntaxHighlighter>
                                </div>
                            )}

                            <div className="mt-6 space-y-3">
                                {currentQuestion.options?.map((opt , idx) => {
                                    const isSelected = !!currentAnswer?.userAnswer.includes(opt.id)

                                    return (
                                        <button
                                            key={`${opt.id}-${idx}`}
                                            onClick={() =>
                                                selectOption(currentQuestion?.questionId!, opt.id, questionType!)
                                            }
                                            aria-pressed={isSelected}
                                            className={`group/opt flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.995] ${
                                                isSelected
                                                    ? "border-violet-400/60 bg-violet-500/15 text-white shadow-[0_0_20px_-4px_rgba(167,139,250,0.6)]"
                                                    : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-violet-500/30 hover:bg-violet-500/[0.06]"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-mono text-base font-bold transition-colors ${
                                                    isSelected
                                                        ? "border-violet-400 bg-violet-400 text-[#0d0d0c]"
                                                        : "border-white/10 bg-white/[0.04] text-zinc-500 group-hover/opt:text-violet-300"
                                                }`}>
                                                    {opt.id}
                                                </span>
                                                <span className="leading-relaxed">{opt.text}</span>
                                            </div>
                                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                                                isSelected ? "border-violet-400 bg-violet-400 text-[#0d0d0c]" : "border-white/15"
                                            }`}>
                                                {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="mt-8 border-t border-white/[0.07] pt-5">
                                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                                    Jump to question
                                </p>

                                <div className="flex flex-wrap gap-2.5">
                                    {Array.from({ length: Number(questionLength) }).map((_, i) => {
                                        const isFetched = !!questions[i];
                                        const isNextFetchable = i === questions.length;
                                        const locked = !isFetched && !isNextFetchable
                                        const current = currentIndex === i
                                        const done = isFetched && answers.some(a => a.questionId === questions[i]!.questionId && a.userAnswer?.length)

                                        return (
                                            <button
                                                key={i}
                                                disabled={locked}
                                                onClick={() => {
                                                    goToQuestion(i);

                                                    handleOptionClick(
                                                        currentQuestion.questionId,
                                                        currentAnswer?.userAnswer!
                                                    );
                                                }}
                                                aria-label={`Question ${i + 1}`}
                                                className={`relative flex h-12 w-12 items-center justify-center rounded-xl border font-mono text-sm font-bold transition-all duration-200 active:scale-95 ${
                                                    current
                                                        ? "border-violet-400 bg-violet-500/20 text-white shadow-[0_0_16px_-2px_rgba(167,139,250,0.8)]"
                                                        : done
                                                        ? "border-violet-400/40 bg-violet-400 text-[#0d0d0c]"
                                                        : isFetched
                                                        ? "cursor-pointer border-white/10 bg-white/[0.04] text-zinc-300 hover:border-violet-400/40 hover:text-white"
                                                        : isNextFetchable
                                                        ? "cursor-pointer animate-pulse border-dashed border-violet-400/40 bg-violet-500/[0.06] text-violet-300"
                                                        : "cursor-not-allowed border-white/5 bg-white/[0.02] text-zinc-700"
                                                }`}
                                            >
                                                {locked ? <Lock className="h-3.5 w-3.5" /> : i + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes mp-float {
                    0%, 100% { transform: translateY(0) rotate(-4deg); }
                    50% { transform: translateY(-14px) rotate(4deg); }
                }
                .mp-float { animation: mp-float 10s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) { .mp-float { animation: none; } }
            `}</style>
        </div>
    )
}