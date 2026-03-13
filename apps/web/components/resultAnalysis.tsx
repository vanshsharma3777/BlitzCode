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
import { time } from "console";
import Loader from "./Loader";

type MatchType = {
    matchType: string,
    answers: SolvedQuestion[]
    allAnswers: Question[]
    questionType: string,
    timeTaken: string,
    totalTime: number
}
type Response = {
    success: boolean,
    score: number,
    questionIds: string[],
    questions: Question[]
}
export default function ResultAnalysis({ matchType, answers, allAnswers, questionType, timeTaken, totalTime }: MatchType) {
    const params = useParams()
    const mode = params.mode as string
    const session = useSession()
    console.log("time : ", timeTaken)
    const router = useRouter()
    const [loader, setLoader] = useState(false)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [Questions, setQuestions] = useState<Question[]>([])
    const [data, setData] = useState<Response>()
    useEffect(() => {
        console.log("all an", allAnswers)
        if (session.status === "unauthenticated") {
            router.replace("/signin")
        }
    }, [session.status, router])

    useEffect(() => {
        setLoader(true)
        async function getResponse() {
            console.log("answers :", answers)
            try {

                const res = await axios.post('/api/submit-answers', { answers })
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
    useEffect(() => {
        console.log("data :", data)
    }, [data])


    const question = data?.questions?.[currentIndex]

    const userAnswer = useMemo(() => {
        return (
            answers?.find((a) => a.questionId === question?.questionId)?.userAnswer ?? []
        );
    }, [answers, question]);
    const correctAnswer = question?.correctOptions ?? []
    if (loader ||  !data) return <Loader />

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full  ">
                {mode === 'singleplayer' ? (
                    <div className="py-6 bg-card border border-border rounded-xl mb-5 flex flex-col justify-center items-center" >
                        <div><HiOutlineTrophy className="text-yellow-500 text-7xl " /></div>
                        <div className="text-4xl font-semibold">Quiz Completed </div>
                        <div className="text-sec mt-2">Great job! You scored {data.score} out of {data.questionIds.length}</div>
                    </div>
                ) : (
                    <div className="py-6 bg-card border border-border rounded-xl mb-5 flex flex-col justify-center items-center" >
                        <div><HiOutlineTrophy className="text-neutral-800 text-7xl " /></div>
                        <div className="text-4xl font-semibold">Defeat</div>
                        <div className="text-sec mt-2">ByteCoders won this round!</div>
                    </div>
                )}
                <div className="flex justify-between mt-4">
                    <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl mr-2">
                        <div className="text-sec mt-4 text-sm">Your Score</div>
                        <div className="text-3xl m-1">{data?.score}</div>
                        <div className="text-sec mb-4">{((data?.score! / data?.questionIds.length!) * 100).toFixed(1)}% correct</div>
                    </div>
                    {matchType === 'multiple player' && (
                        <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl ml-2 ">
                            <div className="text-sec mt-4 text-sm">{session.data?.user.name} </div>
                            <div className="text-3xl m-1">Won</div>
                            <div className="text-sec mb-4">5 out of 5</div>
                        </div>
                    )}
                    <div className="bg-card border  flex justify-center flex-col items-center w-full border-border rounded-xl ml-2">
                        <div className="text-sec mt-4 text-sm">Time Taken</div>
                        <div className="text-3xl m-1">{String(timeTaken)}</div>
                        <div className="text-sec mb-4">{totalTime / 60} minutes</div>
                    </div>
                </div>
                <div className="border-2 border-yellow-500   bg-card rounded-xl py-4 mt-4">
                    <div className="m-5 flex items-center" >
                        <HiOutlineBolt className="text-yellow-500  text-5xl" />
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col ml-5">
                                <div className="text-xl font-semibold">XP Earned: +{(data.score*50)}</div>
                                <div className="text-sec">{data.score} Correct answer(s) x 50 XP each</div>
                            </div>
                            <div className="flex flex-col " >
                                <div>Total XP: 200</div>
                                <div className="text-sec"> {1000 - (data.score*50)} XP to level 2</div>
                            </div>
                        </div>
                    </div>
                </div>
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
                    <p className="text-2xl font-medium mb-5">{allAnswers?.[currentIndex]?.description}</p>
                    <div className="">
                        {allAnswers?.[currentIndex]?.code?.trim() ? (
                            <SyntaxHighlighter
                                language="javascript" style={vscDarkPlus} customStyle={{
                                    borderRadius: "12px",
                                    padding: "16px",
                                    fontSize: "20px",
                                    marginBottom: "12px",
                                }}
                            >
                                {allAnswers[currentIndex]?.code}
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
                    <div className="flex flex-wrap gap-x-3 ">
                        {Array.from({ length: Number(allAnswers?.length) }).map((_, i) => (
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
                </div>

            </div>
        </div>
    )
}