'use client'

import { Question, SolvedQuestion } from "../types/allTypes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineTimer } from "react-icons/md";
import { User, AlertCircle, X } from "lucide-react";
import Loader from "./Loader";
import { createTime } from "../lib/functions/createTime";
import { updateAnswers } from "../lib/functions/selectOptions";
import QuestionDescription from "./atoms/QuestionDescription";
import QuestionLoader from "./atoms/QuestionLoader";

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
            console.log("came in error")
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
                console.log("QuizId not found")
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

    return (
        <div className="min-h-screen flex flex-col items-center gap-6 px-4 py-8 bg-[var(--bg-main)] text-[var(--primary-text)] relative transition-colors duration-300">
            
            <div 
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-20 dark:opacity-15"
                style={{ background: 'var(--accent)' }}
            />

            <div className="w-full max-w-5xl z-10">
                {!loader && (
                    <div className="grid grid-cols-3 gap-3 sm:gap-5 mt-4">
                        {/* Timer Card */}
                        <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--borders)] hover:border-[var(--accent)]/50 rounded-2xl py-4 px-4 sm:px-5 flex items-center justify-between sm:justify-start shadow-xl backdrop-blur-md transition-all duration-300">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                                    <MdOutlineTimer className="w-5 h-5" />
                                </div>
                                <span className="hidden sm:inline text-xs sm:text-sm font-semibold tracking-wide text-[var(--secondary-text)]">
                                    Time Left:
                                </span>
                            </div>
                            <div className="font-mono font-bold text-sm sm:text-base text-[var(--primary-text)] tracking-wider sm:ml-2">
                                {formatTime(totalTime)}
                            </div>
                        </div>

                        {/* Progress Card */}
                        <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--borders)] hover:border-[var(--accent)]/50 rounded-2xl py-4 px-4 sm:px-5 flex items-center justify-between sm:justify-start shadow-xl backdrop-blur-md transition-all duration-300">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                                    <FaChartLine className="w-4 h-4" />
                                </div>
                                <span className="hidden sm:inline text-xs sm:text-sm font-semibold tracking-wide text-[var(--secondary-text)]">
                                    Progress:
                                </span>
                            </div>
                            <div className="font-mono font-bold text-sm sm:text-base text-[var(--primary-text)] tracking-wider sm:ml-2">
                                <span className="text-[var(--accent)]">{currentIndex + 1}</span> / {questionLength}
                            </div>
                        </div>

                        {/* User Email/Avatar Card */}
                        <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] border border-[var(--borders)] hover:border-[var(--accent)]/50 rounded-2xl py-4 px-4 sm:px-5 flex items-center justify-center sm:justify-start shadow-xl backdrop-blur-md transition-all duration-300">
                            <div className="flex items-center gap-3 truncate">
                                <div className="p-2 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] hidden sm:flex shrink-0">
                                    <HiOutlineMail className="w-5 h-5" />
                                </div>
                                
                                {/* User Email for Desktop */}
                                <span className="hidden sm:inline font-semibold text-xs sm:text-sm text-[var(--primary-text)] truncate tracking-tight">
                                    {session.data?.user?.email || "Guest User"}
                                </span>

                                {/* User Image or Lucide Fallback Avatar for Mobile */}
                                <div className="sm:hidden relative h-9 w-9 rounded-full overflow-hidden border border-[var(--borders)] bg-[var(--bg-sec)] flex items-center justify-center shrink-0">
                                    {userImage && !imgError ? (
                                        <img
                                            src={userImage}
                                            alt="User profile"
                                            className="h-full w-full object-cover"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <User className="h-5 w-5 text-[var(--secondary-text)]" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="w-full max-w-5xl z-10 bg-rose-500/10 border border-rose-500/30 text-rose-500 px-4 py-3 rounded-xl flex items-center justify-between shadow-lg backdrop-blur-md transition-all">
                    <div className="flex items-center gap-2.5 text-sm font-semibold">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>

                    <button
                        onClick={() => setError(null)}
                        className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                        aria-label="Dismiss error"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Question Description View */}
            <div className="w-full max-w-5xl z-10">
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
        </div>
    )
}