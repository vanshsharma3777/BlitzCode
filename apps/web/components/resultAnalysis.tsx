'use client'

import { useEffect, useMemo, useState } from "react";
import { HiOutlineTrophy } from "react-icons/hi2";
import { HiOutlineBolt } from "react-icons/hi2";
import { Question, SolvedQuestion } from "../types/allTypes";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { HiCheckCircle, HiXCircle } from "react-icons/hi"
import axios, { Axios, isAxiosError } from "axios";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Loader from "./Loader";
type Status = {
    status: string,
    winnerEmail?: string,
    loserEmail?: string,
    score: string
    timeTaken:string
}
type MatchType = {
    matchType: string,
    answers?: SolvedQuestion[]
    allQuestions?: Question[]
    questionType?: string,
    timeTaken?: string,
    status?: Status
    totalTime: number,
    quizId: string,
    winnerStatus: Status
    loserStatus: Status
}
type Response = {
    success: boolean,
    score: number,
    questionIds: string[],
    questions: Question[]
}
export default function ResultAnalysis({ matchType, answers, allQuestions, questionType, winnerStatus, loserStatus, timeTaken, totalTime, quizId }: MatchType) {
    const params = useParams()
    const mode = params.mode as string
    console.log("mode :", mode)
    const session = useSession()
    console.log("time : ", timeTaken)
    const router = useRouter()
    const [loader, setLoader] = useState(false)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [showExplanation, setShowExplanation] = useState(false);
    const [data, setData] = useState<Response>()
    console.log("winer", winnerStatus)
    console.log("loser", loserStatus)
    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.replace("/signin")
        }
    }, [session.status, router])
    console.log("status", status)
    if (mode === 'singleplayer') {
        useEffect(() => {
            setLoader(true)
            async function getResponse() {
                console.log("answers :", answers)
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
    useEffect(() => {
        console.log("data :", data)
    }, [data])

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
        <div className="flex justify-center mt-10">
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
                                : loserStatus?.score || "Loading..."}
                                </div>
                                <div className="text-sec mb-4">{session.data?.user.email===winnerStatus?.winnerEmail ? ((Number(winnerStatus?.score) / allQuestions?.length!) * 100).toFixed(1) : ((Number(loserStatus?.score) / allQuestions?.length!) * 100).toFixed(1)}% correct</div>
                            </div>
                            <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl ">
                                <div className="text-sec mt-4 text-sm">Time Taken</div>
                                <div className="text-3xl m-1">{session.data?.user.email === winnerStatus?.winnerEmail ? `${winnerStatus?.timeTaken}` : `${loserStatus.timeTaken}` }</div>
                                <div className="text-sec mb-4">{totalTime / 60} minutes</div>
                            </div>
                            <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl ml-2 ">
                                <div className="text-sec mt-4 text-sm">{session.data?.user.email === winnerStatus?.winnerEmail ? `${winnerStatus?.winnerEmail}` : `Opponent` }</div>
                                <div className="text-3xl m-1">Won</div>
                                <div className="text-sec mb-4">{winnerStatus?.winnerEmail===session.data?.user.email ? `${winnerStatus?.score} out of ${allQuestions?.length}` : `${loserStatus.score} out of ${allQuestions?.length}` } </div>
                            </div>
                        </div>
                    )}
                </div>
                {matchType === 'singlePlayer' ? (
                    <div className="border-2 border-yellow-500   bg-card rounded-xl py-4 mt-4">
                        <div className="m-5 flex items-center" >
                            <HiOutlineBolt className="text-yellow-500  text-5xl" />
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col ml-5">
                                    <div className="text-xl font-semibold">XP Earned: +{(data!.score * 50)}</div>
                                    <div className="text-sec">{data!.score} Correct answer(s) x 50 XP each</div>
                                </div>
                                <div className="flex flex-col " >
                                    <div>Total XP: 200</div>
                                    <div className="text-sec"> {1000 - (data!.score * 50)} XP to level 2</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ):(
                    <div className="border-2 border-yellow-500   bg-card rounded-xl py-4 mt-4">
                        <div className="m-5 flex items-center" >
                            <HiOutlineBolt className="text-yellow-500  text-5xl" />
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col ml-5">
                                    <div className="text-xl font-semibold">{session.data?.user.email === winnerStatus?.winnerEmail ? `XP Earned: +${(Number(winnerStatus?.score) * 50)}` :  `XP Earned: +${(Number(loserStatus?.score) * 50)}`}</div>
                                    <div className="text-sec">{session.data?.user.email=== winnerStatus?.winnerEmail ? `${winnerStatus?.score}` : `${loserStatus?.score}` } Correct answer(s) x 50 XP each</div>
                                </div>
                                <div className="flex flex-col " > 
                                    <div>Total XP: 200</div>
                                    <div className="text-sec"> {session.data?.user.email=== winnerStatus?.winnerEmail ? `1000 - ${(Number(winnerStatus?.score) * 50)}`: `1000 - ${(Number(loserStatus?.score) * 50)}`} XP to level 2</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                

            </div>
        </div>
    )
}