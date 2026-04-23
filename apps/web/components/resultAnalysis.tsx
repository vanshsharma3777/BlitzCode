'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineTrophy } from "react-icons/hi2";
import { HiOutlineBolt } from "react-icons/hi2";
import { MatchType, Response } from "../types/allTypes";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { HiCheckCircle, HiXCircle } from "react-icons/hi"
import axios from "axios";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Loader from "./Loader";

export default function ResultAnalysis({ answers, allQuestions, pointsUpdated, questionType, winnerStatus, loserStatus, timeTaken, totalTime, quizId }: MatchType) {
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

    return (
        <div className="flex justify-center mt-5 px-4 md:px-0">
            <div className="w-full max-w-4xl">
                {mode === 'singleplayer' ? (
                    <div className="py-6 bg-card border border-border rounded-xl mb-5 flex flex-col justify-center items-center text-center" >
                        <div><HiOutlineTrophy className="text-yellow-500 text-6xl md:text-7xl " /></div>
                        <div className="text-2xl md:text-4xl font-semibold">Quiz Completed </div>
                        <div className="text-sec mt-2 text-sm md:text-base">Great job! You scored {data?.score} out of {data?.questionIds.length}</div>
                    </div>
                ) : (
                    <div className="py-6 bg-card border border-border rounded-xl mb-5 flex flex-col justify-center items-center text-center" >
                        <div><HiOutlineTrophy className={`text-6xl md:text-7xl ${winnerStatus?.winnerEmail === session.data?.user.email ? "text-yellow-500" : "text-neutral-500 "} `} /></div>
                        <div className="text-2xl md:text-4xl font-semibold">
                            {session.data?.user.email === winnerStatus?.winnerEmail
                                ? winnerStatus?.status
                                : loserStatus?.status || "Loading..."}
                        </div>
                        <div className="text-sec mt-2 text-sm md:text-base">{session.data?.user.email === winnerStatus?.winnerEmail ? "You win this round!" : `You lose this round!`}</div>
                    </div>
                )}

                <div className="flex flex-col gap-4 mt-4">
                    {mode === 'singleplayer' && (
                        <div className="flex flex-row w-full gap-2">
                            <div className="bg-card border flex justify-center flex-col items-center w-full border-border rounded-xl p-4">
                                <div className="text-sec text-xs md:text-sm">Your Score</div>
                                <div className="text-2xl md:text-3xl m-1">{data?.score}</div>
                                <div className="text-sec text-[10px] md:text-sm">{((data?.score! / data?.questionIds.length!) * 100).toFixed(1)}% correct</div>
                            </div>
                            <div className="bg-card border flex justify-center flex-col items-center w-full border-border rounded-xl p-4">
                                <div className="text-sec text-xs md:text-sm">Time Taken</div>
                                <div className="text-2xl md:text-3xl m-1">{String(timeTaken)}</div>
                                <div className="text-sec text-[10px] md:text-sm">{totalTime / 60} minutes</div>
                            </div>
                        </div>
                    )}

                    {mode === 'multiplayer' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                            <div className="bg-card border flex justify-center flex-col items-center border-border rounded-xl p-3">
                                <div className="text-sec text-xs">Your Score</div>
                                <div className="text-xl md:text-2xl font-bold">{session.data?.user.email === winnerStatus?.winnerEmail ? winnerStatus?.score : loserStatus?.score}</div>
                            </div>
                            <div className="bg-card border flex justify-center flex-col items-center border-border rounded-xl p-3">
                                <div className="text-sec text-xs">Your Time</div>
                                <div className="text-xl md:text-2xl font-bold">{session.data?.user.email === winnerStatus?.winnerEmail ? `${winnerStatus?.timeTaken}s` : `${loserStatus?.timeTaken}s`}</div>
                            </div>
                            <div className="bg-card border flex justify-center flex-col items-center border-border rounded-xl p-3">
                                <div className="text-sec text-xs">Opp. Score</div>
                                <div className="text-xl md:text-2xl font-bold">{session.data?.user.email === winnerStatus?.winnerEmail ? `${loserStatus.score}` : `${winnerStatus.score}`}</div>
                            </div>
                            <div className="bg-card border flex justify-center flex-col items-center border-border rounded-xl p-3">
                                <div className="text-sec text-xs">Opp. Time</div>
                                <div className="text-xl md:text-2xl font-bold">{session.data?.user.email === winnerStatus?.winnerEmail ? `${loserStatus?.timeTaken}s` : `${winnerStatus?.timeTaken}s`}</div>
                            </div>
                        </div>
                    )}
                </div>

                {mode === 'singleplayer' && (
                    <div className="border-2 border-yellow-500 bg-card rounded-xl py-4 mt-4">
                        <div className="mx-4 md:m-5 flex items-center" >
                            <HiOutlineBolt className="text-yellow-500 text-4xl md:text-5xl shrink-0" />
                            <div className="flex flex-col md:flex-row justify-between w-full ml-4 gap-2">
                                <div className="flex flex-col">
                                    <div className="text-lg md:text-xl font-semibold">XP Earned: +{(data?.score ?? 0) * 50}</div>
                                    <div className="text-sec text-xs md:text-sm">{data?.score ?? 0} Correct answer(s) x 50 XP</div>
                                </div>
                                <div className="text-sm md:text-base font-medium">Total XP: {points}</div>
                            </div>
                        </div>
                    </div>
                )}

                {mode === 'multiplayer' && (
                    <div className={`border-2 bg-card rounded-xl mt-4 ${session.data?.user.email === winnerStatus.winnerEmail ? 'border-green-500' : 'border-red-500'}`}>
                        <div className="mx-4 md:m-5 flex items-center" >
                            <HiOutlineBolt className="text-yellow-500 text-4xl md:text-5xl shrink-0" />
                            <div className="flex flex-col md:flex-row justify-between w-full ml-4 gap-2">
                                <div className="flex flex-col">
                                    <div className="text-lg md:text-xl font-semibold">{session.data?.user.email === winnerStatus?.winnerEmail ? `XP Earned: +25` : `XP Earned: -25`}</div>
                                    <div className="text-sec text-xs">Win: +25 | Loss: -25</div>
                                </div>
                                <div className="text-sm md:text-base font-medium">Total XP: {points}</div>
                            </div>
                        </div>
                    </div>
                )}
                {mode === 'multiplayer' && (
    <div className="border border-border mt-4 mb-4 p-4 md:p-5 rounded-xl bg-card">
        <div className="text-base md:text-lg font-semibold mb-2">
            Match Result Criteria
        </div>
        <div className="text-sec text-xs md:text-sm mb-3">
            The winner is determined based on the following rules:
        </div>
        <div className="space-y-3 md:space-y-2 text-xs md:text-sm">
            <div className="flex items-start">
                <span className="font-bold mr-2 text-accent">1.</span>
                <span className="leading-relaxed">
                    The player with the <span className="font-semibold text-white">higher score</span> is declared the winner.
                </span>
            </div>
            <div className="flex items-start">
                <span className="font-bold mr-2 text-accent">2.</span>
                <span className="leading-relaxed">
                    If both players have the <span className="font-semibold text-white">same score</span>, the player with the <span className="font-semibold text-white">least time taken</span> wins.
                </span>
            </div>
        </div>
    </div>
)}
                {mode === 'singleplayer' && (
                    <div className="pb-10">
                        <div className="text-xl md:text-2xl mt-8 font-semibold">Detailed Analysis</div>
                        <div className="border bg-card flex flex-col md:flex-row justify-between items-center border-border hover:border-accent rounded-xl py-4 mt-4 px-4 md:pr-5 gap-4">
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="bg-sec text-[10px] md:text-xs px-3 py-3 rounded-xl flex items-center font-bold">
                                    QUESTION {currentIndex + 1}
                                </div>
                                <div className="bg-bg text-[10px] md:text-xs px-3 py-3 rounded-xl flex items-center font-bold">
                                    {questionType?.toUpperCase()}
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto justify-center">
                                <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                                    className="bg-bg px-6 py-2 rounded-xl border border-border hover:border-blue-600 transition-all font-semibold text-2xl active:scale-95">
                                    {"<"}
                                </button>
                                <button onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, allQuestions!.length - 1))}
                                    className="bg-bg px-6 py-2 rounded-xl border border-border hover:border-blue-600 transition-all font-semibold text-2xl active:scale-95">
                                    {">"}
                                </button>
                            </div>
                        </div>
                    
                        <div className="mt-6">
                            <p className="text-lg md:text-2xl font-medium mb-5">{allQuestions?.[currentIndex]?.description}</p>
                            <div className="overflow-x-auto rounded-xl mb-4">
                                {allQuestions?.[currentIndex]?.code?.trim() ? (
                                    <SyntaxHighlighter
                                        language="javascript" style={vscDarkPlus} customStyle={{
                                            borderRadius: "12px",
                                            padding: "16px",
                                            fontSize: "16px",
                                            lineHeight: "1.5"
                                        }}
                                    >
                                        {allQuestions[currentIndex]?.code}
                                    </SyntaxHighlighter>
                                ) : null}
                            </div>
                            
                            <div className="space-y-2">
                                {question?.options?.map((opt) => {
                                    const isSelected = userAnswer.includes(opt.id)
                                    const isCorrect = correctAnswer.includes(opt.id)

                                    return (
                                        <div key={opt.id} className={`border flex items-start w-full rounded-xl py-4 px-4 
                                            ${isCorrect ? "border-green-500 bg-green-500/5" : ""}
                                            ${isSelected && !isCorrect ? "border-red-500 bg-red-500/5" : ""}
                                            ${!isSelected && !isCorrect ? "border-border bg-card" : ""}`}
                                        >
                                            <div className="flex-shrink-0 mr-3">
                                                <div className="flex items-center justify-center text-sm font-bold h-8 w-8 rounded-full border border-border">
                                                    {isCorrect ? (
                                                        <HiCheckCircle className="text-green-500 text-2xl" />
                                                    ) : isSelected ? (
                                                        <HiXCircle className="text-red-500 text-2xl" />
                                                    ) : (
                                                        opt.id
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-sm md:text-base pt-1">{opt.text}</div>
                                        </div>
                                    )
                                })}
                            </div>

                            <button onClick={() => setShowExplanation(true)}
                                className="w-full md:w-auto mt-6 px-8 py-3 bg-accent text-white rounded-xl font-semibold transition active:scale-95"
                            >
                                Show Explanation
                            </button>
                            
                            {showExplanation && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                                    <div className="bg-card w-full max-w-2xl p-6 rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
                                        <button onClick={() => setShowExplanation(false)}
                                            className="absolute top-4 right-4 text-xl text-sec hover:text-white p-2"
                                        >
                                            ✕
                                        </button>
                                        <div className="text-xl md:text-2xl font-semibold mb-4 border-b border-border pb-2">
                                            Explanation
                                        </div>
                                        <div className="text-sm md:text-lg text-sec leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                                            {question?.explanation || "No explanation available"}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}