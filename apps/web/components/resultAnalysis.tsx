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
import { HtmlContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";


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
                            console.log('Unauthorized')
                            alert("Unauthorized")
                            router.push("/signin")
                        } else if (error.response?.status === 501) {
                            console.log("Answers length is 0")
                            alert("Internal server error")
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
            if (pointsUpdated) {
                return
            }
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

    if (mode === 'multiplayer') {
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
    }
    if (mode === 'singleplayer') {
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
    }

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
        <div className="flex justify-center mt-5">
            <div className="w-full  ">
                {mode === 'singleplayer' ? (
                    <div className="py-6 bg-card border border-border rounded-xl mb-5 flex flex-col justify-center items-center" >
                        <div><HiOutlineTrophy className="text-yellow-500 text-7xl " /></div>
                        <div className="text-4xl font-semibold">Quiz Completed </div>
                        <div className="text-sec mt-2">Great job! You scored {data?.score} out of {data?.questionIds.length}</div>
                    </div>
                ) : (
                    <div className="py-6 bg-card border border-border rounded-xl mb-5 flex flex-col justify-center items-center" >
                        <div><HiOutlineTrophy className={`text-7xl ${winnerStatus?.winnerEmail === session.data?.user.email ? "text-yellow-500" : "text-neutral-500 "} `} /></div>
                        <div className="text-4xl font-semibold">
                            {session.data?.user.email === winnerStatus?.winnerEmail
                                ? winnerStatus?.status
                                : loserStatus?.status || "Loading..."}
                        </div>
                        <div className="text-sec mt-2">{session.data?.user.email === winnerStatus?.winnerEmail ? "You win this round!" : `You lose this round!`}</div>
                    </div>
                )}
                <div className="flex justify-between mt-4">
                    {mode === 'singleplayer' && (
                        <div className="flex w-full">
                            <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl mr-2">
                                <div className="text-sec mt-4 text-sm">Your Score</div>
                                <div className="text-3xl m-1">{data?.score}</div>
                                <div className="text-sec mb-4">{((data?.score! / data?.questionIds.length!) * 100).toFixed(1)}% correct</div>
                            </div>
                            <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl ">
                                <div className="text-sec mt-4 text-sm">Time Taken</div>
                                <div className="text-3xl m-1">{String(timeTaken)}</div>
                                <div className="text-sec mb-4">{totalTime / 60} minutes</div>
                            </div>
                        </div>
                    )}
                    {mode === 'multiplayer' && (
                        <div className="flex w-full">
                            <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl mr-2">
                                <div className="text-sec mt-4 text-sm">Your Score</div>
                                <div className="text-3xl m-1">
                                    {session.data?.user.email === winnerStatus?.winnerEmail
                                        ? winnerStatus?.score
                                        : loserStatus?.score}
                                </div>
                                <div className="text-sec mb-4">{session.data?.user.email === winnerStatus?.winnerEmail ? ((Number(winnerStatus?.score) / allQuestions?.length!) * 100).toFixed(1) : ((Number(loserStatus?.score) / allQuestions?.length!) * 100).toFixed(1)}% correct</div>
                            </div>
                            <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl ">
                                <div className="text-sec mt-4 text-sm">Your time</div>
                                <div className="text-3xl m-1">{session.data?.user.email === winnerStatus?.winnerEmail ? `${winnerStatus?.timeTaken}` : `${loserStatus?.timeTaken}`}</div>
                                <div className="text-sec mb-4">{totalTime / 60} minutes</div>
                            </div>
                            <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl ml-2 ">
                                <div className="text-sec mt-4 text-sm">Opponent Score</div>
                                <div className="text-3xl m-1">{session.data?.user.email === winnerStatus?.winnerEmail ? `${loserStatus.score}` : `${winnerStatus.score}`}</div>
                                <div className="text-sec mb-4">{`out of ${allQuestions?.length}`} </div>
                            </div>
                            <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl ml-2 ">
                                <div className="text-sec mt-4 text-sm">Opponent time</div>
                                <div className="text-3xl m-1">{session.data?.user.email === winnerStatus?.winnerEmail ? `${loserStatus?.timeTaken}` : `${winnerStatus?.timeTaken}`}</div>
                                <div className="text-sec mb-4">{totalTime / 60} minutes</div>
                            </div>
                        </div>
                    )}
                </div>

                {mode === 'singleplayer' && (
                    <div className="border-2 border-yellow-500   bg-card rounded-xl py-4 mt-4">
                        <div className="m-5 flex items-center" >
                            <HiOutlineBolt className="text-yellow-500  text-5xl" />
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col ml-5">
                                    <div className="text-xl font-semibold">XP Earned: +{(data?.score ?? 0) * 50}</div>
                                    <div className="text-sec">{data?.score ?? 0} Correct answer(s) x 50 XP each</div>
                                </div>
                                <div className="flex flex-col " >
                                    <div>Total XP: {points}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {mode === 'multiplayer' && (
                    <div className={`border-2 bg-card rounded-xl mt-4 ${session.data?.user.email === winnerStatus.winnerEmail ? 'border-green-500' : 'border-red-500'}`}>
                        <div className="m-5 flex items-center" >
                            <HiOutlineBolt className="text-yellow-500  text-5xl" />
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col ml-5">
                                    <div className="text-xl font-semibold">{session.data?.user.email === winnerStatus?.winnerEmail ? `XP Earned: +${(25)}` : `XP Earned: -${(25)}`}</div>
                                    <div className="text-sec"> Winner: +25 XP each</div>
                                    <div className="text-sec"> Defeat: -25 XP each</div>
                                </div>
                                <div className="flex flex-col " >
                                    <div>Total XP: {points}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {mode === 'multiplayer' && (
                    <div className="border border-border mt-4 mb-4 p-5 rounded-xl bg-card">
                        <div className="text-lg font-semibold mb-2">
                            Match Result Criteria
                        </div>
                        <div className="text-sec mb-3">
                            The winner is determined based on the following rules:
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                                <span className="font-medium mr-2">1.</span>
                                <span>The player with the <span className="font-medium">higher score</span> is declared the winner.</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium mr-2">2.</span>
                                <span>If both players have the <span className="font-medium">same score</span>, the player with the <span className="font-medium">least time taken</span> wins.</span>
                            </div>
                        </div>
                    </div>
                )}
                {mode === 'singleplayer' && (
                    <div>
                        <div className="mt-4 text-2xl">Detailed Analysis</div>
                        <div className="border bg-card border-border hover:border-accent rounded-xl py-4 mt-4">
                            <div className="flex ">
                                <div className="bg-sec  ml-5 px-3 py-3 rounded-xl flex items-center">
                                    QUESTION NO {currentIndex + 1}
                                </div>
                                <div className="bg-bg ml-2 px-3 py-3 rounded-xl flex items-center">
                                    {questionType?.toUpperCase()}
                                </div>

                            </div>
                        </div>
                        <div className="ml-5 mt-5 pr-5 ">
                            <p className="text-2xl font-medium mb-5">{allQuestions?.[currentIndex]?.description}</p>
                            <div className="">
                                {allQuestions?.[currentIndex]?.code?.trim() ? (
                                    <SyntaxHighlighter
                                        language="javascript" style={vscDarkPlus} customStyle={{
                                            borderRadius: "12px",
                                            padding: "16px",
                                            fontSize: "20px",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        {allQuestions[currentIndex]?.code}
                                    </SyntaxHighlighter>
                                ) : null}
                            </div>
                            {question?.options?.map((opt) => {

                                const isSelected = userAnswer.includes(opt.id)
                                const isCorrect = correctAnswer.includes(opt.id)

                                return (
                                    <div
                                        key={opt.id}
                                        className={`border flex flex-col w-full rounded-xl py-3 pl-4 mb-2
                                ${isCorrect ? "border-green-500" : ""}
                                ${isSelected && !isCorrect ? "border-red-500" : ""}
                                ${!isSelected && !isCorrect ? "border-border bg-card" : ""}
                            `}
                                    >
                                        <div className="flex items-center">
                                            <div className="pr-1">
                                                <div className="bg-card flex items-center justify-center text-xl text-sec h-10 w-10 rounded-full">

                                                    {isCorrect ? (
                                                        <HiCheckCircle className="text-green-500 text-2xl" />
                                                    ) : isSelected ? (
                                                        <HiXCircle className="text-red-500 text-2xl" />
                                                    ) : (
                                                        opt.id
                                                    )}

                                                </div>
                                            </div>

                                            <div className="pl-1 flex justify-start">
                                                {opt.text}
                                            </div>
                                        </div>
                                    </div>

                                )
                            })}
                            <button
                                onClick={() => setShowExplanation(true)}
                                className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:scale-105 transition"
                            >
                                Show Explanation
                            </button>
                            <div className="flex flex-wrap gap-x-3 ">
                                {Array.from({ length: Number(allQuestions?.length) }).map((_, i) => (
                                    <button
                                        onClick={() => {
                                            setCurrentIndex(i)
                                        }}
                                        key={i}
                                        className={`text-2xl h-20 w-20 mt-5 rounded-xl border transition-all duration-200 hover:scale-110
                                ${currentIndex === i ? "bg-accent border-accent" : "bg-sec border-neutral-700"}
                                `}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            {showExplanation && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <div className="bg-card w-[80%] max-w-3xl p-6 rounded-xl shadow-lg relative">
                                        <button
                                            onClick={() => setShowExplanation(false)}
                                            className="absolute top-3 right-3 text-xl text-sec hover:text-white"
                                        >
                                            ✕
                                        </button>

                                        <div className="text-2xl font-semibold mb-4">
                                            Explanation
                                        </div>
                                        <div className="text-lg text-sec">
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