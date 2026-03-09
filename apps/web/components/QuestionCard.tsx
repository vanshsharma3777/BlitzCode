'use client'

import { Answers, Question, SolvedQuestion } from "../types/allTypes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi"
import { MdOutlineTimer } from "react-icons/md";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { diff } from "util";
import Loader from "./Loader";
import { createTime } from "../lib/functions/createTime";
import { Answer } from "../types/wsTypes";
export default function QuestionCard() {
    const session = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const questionType = searchParams.get("questionType")
    const difficulty = searchParams.get("difficulty")
    const language = searchParams.get("language")
    const topic = searchParams.get("topic")
    const questionLength = searchParams.get("questionLength")
    const [show, setShow] = useState(false)
    const [data, setData] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [totalTime, setTotalTime] = useState(0)
    const [loader, setLoader] = useState<boolean>(false)
    const [answers, setAnswers] = useState<SolvedQuestion[]>([])
    const currentAnswer = answers.find(
        a => a.questionId === data[currentIndex]?.questionId
    )

    console.log("currentAnswer ", answers)
    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.replace("/signin")
        }
    }, [session.status, router])

    useEffect(() => {
        if (data.length === 0) {
            setLoader(true)
        }
        console.log("effect qorking")
        if (session.status !== "authenticated") {
            getResponse()
        }
    }, []);

    useEffect(() => {
        if (data.length < Number(questionLength)) {
            getResponse()
        }
    }, [data])
    console.log("totalTime ", totalTime)

    useEffect(() => {
        const initialTime = createTime(
            Number(questionLength),
            difficulty as "easy" | "medium" | "hard"
        )

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
    }, [data])

    async function getResponse() {
        console.log("functn working")
        try {
            setLoader(true);
            const res = await axios.post("/api/get-questions", {
                topic, difficulty, language, questionType, questionLength
            },
                { withCredentials: true }
            );
            console.log("response ", res.data)
            const questions =
                typeof res.data.data === "string"
                    ? JSON.parse(res.data.data)
                    : res.data.data

            res.data.data.map((q: any) => {
                if (!q.questionId) {
                    console.log("question if not present of questions , (question-page)")
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
        } finally {
            setLoader(false);
        }
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toString().padStart(2, "0")}`
    }

    function selectOption(questionId: string, optionId: string) {
        setAnswers(prev => {
            const exists = prev.find(q => q.questionId === questionId)
            if (exists) {
                if (exists.userAnswer.includes(optionId)) {
                    return prev.filter(q => q.questionId !== questionId)
                }
                return prev.map(q =>
                    q.questionId === questionId
                        ? { ...q, userAnswer: [optionId] }
                        : q
                )
            }
            return [...prev, { questionId, userAnswer: [optionId] }]
        })
    }

    function handleSubmit() {
        const payload = {
            answers,
            topic,
            language,
            difficulty,
            questionLength,
            questionType
        }
        sessionStorage.setItem("matchData", JSON.stringify(payload))
        router.replace('/result')
    }

    if (loader) {
        return <Loader />
    }

    return (
        <div className={`min-h-screen flex flex-col justify-center gap-5  items-center  text-pri `}>
            <div className="w-[85%] ">
                {loader === false && (
                    <div className="grid grid-cols-3 mt-16">
                        <div className="bg-card border border-border rounded-xl py-5 px-4 mr-5 flex items-center">
                            <div className="lg:pr-1 pr-3 ">
                                <MdOutlineTimer />
                            </div>
                            <div className="hidden  sm:inline  pr-3">
                                Time Left :
                            </div>
                            {
                                <div className="font-medium">
                                    {formatTime((totalTime))} </div>
                            }
                        </div>
                        <div className="bg-card border border-border rounded-xl py-5 px-4 mr-5 flex items-center">
                            <div className="lg:pr-1 pr-3">
                                <FaChartLine />
                            </div>
                            <div className="hidden sm:inline  pr-3">
                                Your Progress :
                            </div>
                            <div className="font-medium">
                                {currentIndex + 1} / {questionLength}
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-xl py-5 px-4  flex  items-center justify-center">
                            <div className="pr-2 hidden sm:inline">
                                <HiOutlineMail />
                            </div>
                            <div className="hidden sm:inline font-medium md:truncate">
                                {session.data?.user.email}
                            </div>
                            <div className=" lg:hidden md:hidden h-10 w-10 rounded-full overflow-hidden border border-border">
                                <img
                                    src={session.data?.user.image || " "}
                                    alt="profile"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className={`w-[85%] bg-card border border-border  rounded-xl py-8 transform transition-all duration-200 ease-out${show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"} text-pri  rounded-xl`}>
                <div className="flex ">
                    <div className="bg-sec  ml-5 px-3 py-3 rounded-xl flex items-center">
                        QUESTION NO {currentIndex + 1}
                    </div>
                    <div className="bg-bg ml-2 px-3 py-3 rounded-xl flex items-center">
                        {questionType?.toUpperCase()}
                    </div>
                    <button onClick={() => handleSubmit()} className="bg-bg ml-2 px-3 py-3 rounded-xl border hover:bg-accent border-border hover:border-blue-600 flex items-center fixed right-5 transition-all duration-300 ease-in-out hover:scale-105 ">
                        SUBMIT
                    </button>
                </div>

                <div className="ml-5 mt-5 pr-5 ">
                    <p className="text-2xl font-medium mb-5">{data[currentIndex]?.description}</p>
                    <div className="">
                        {data[currentIndex]?.code?.trim() ? (
                            <SyntaxHighlighter
                                language="javascript" style={vscDarkPlus} customStyle={{
                                    borderRadius: "12px",
                                    padding: "16px",
                                    fontSize: "20px",
                                    marginBottom: "12px",
                                }}
                            >
                                {data[currentIndex]?.code}
                            </SyntaxHighlighter>
                        ) : null}
                    </div>
                    {data[currentIndex]?.options?.map((opt) => {

                        const isSelected = currentAnswer?.userAnswer.includes(opt.id)

                        return (
                            <button
                                key={opt.id}
                                onClick={() =>
                                    selectOption(data[currentIndex]?.questionId!, opt.id)
                                }
                                className={`border flex flex-col w-full rounded-xl py-3 pl-4 mb-2 transition-all duration-200 ease-in-out hover:scale-[1.01]
      ${isSelected
                                        ? "bg-accent border-accent"
                                        : "bg-bg border-border hover:border-accent"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div className="pr-1">
                                        <div className="bg-card flex items-center justify-center text-xl text-sec h-10 w-10 rounded-full">
                                            {opt.id}
                                        </div>
                                    </div>

                                    <div className="pl-1 flex justify-start">
                                        {opt.text}
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                    <div className="flex flex-wrap gap-x-3 ">
                        {Array.from({ length: Number(questionLength) }).map((_, i) => (
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