'use client'

import { useEffect, useRef, useState } from "react"
import Loader from "../../../components/Loader"
import { MdOutlineTimer } from "react-icons/md"
import { FaChartLine } from "react-icons/fa"
import { HiOutlineMail } from "react-icons/hi"
import { useSession } from "next-auth/react"
import QuestionDescription from "../../../components/atoms/QuestionDescription"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { updateAnswers } from "../../../lib/functions/selectOptions"
import { Question, SolvedQuestion } from "../../../types/allTypes"
import { connectSocket } from "../../../lib/websocket"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import SyntaxHighlighter from "react-syntax-highlighter"
import { createTime } from "../../../lib/functions/createTime"

type WSQuestionData = {
    question: Question,
    questionNumber: number,
    total: number
}
export default function MacthPage() {
    const session = useSession()
    const params = useParams()
    const mode = params.mode as string
    const socketRef = useRef<WebSocket | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const questionType = searchParams.get("questionType")
    const difficulty = searchParams.get("difficulty")
    const language = searchParams.get("language")
    const topic = searchParams.get("topic")
    const questionLength = searchParams.get("questionLength")
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [totalTime, setTotalTime] = useState(0)

    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<SolvedQuestion[]>([])

    const currentQuestion = questions[currentIndex]
    useEffect(() => {
        if (session.status === "loading") {
            setLoader(true)
            return
        }

        if (session.status === "unauthenticated") {
            setLoader(false)
            setError("User not authenticated")
            return
        }

        if (session.status === "authenticated") {
            setLoader(false)
        }
    }, [session.status])

    useEffect(() => {
        console.log("to[")
        setLoader(true)

        const socket = connectSocket()
        socketRef.current = socket

        if (socket.readyState === WebSocket.OPEN) {
            console.log("socket connected")
            fetchQuestion()
        }

        socket.onmessage = (event) => {
            const parsed = JSON.parse(event.data)
            console.log("data on match-page:", parsed)

            if (parsed?.payload?.error) {
                setError(parsed.payload.error)
                setLoader(false)
                return
            }

            if (parsed?.data) {
                const wsData: WSQuestionData = parsed.data

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

            setLoader(false)
        }

        socket.onerror = (err) => {
            console.log("socket error:", err)
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
    }, [questions])

    function selectOption(questionId: string, optionId: string, questionType: string) {
        console.log(answers)
        setAnswers(prev =>
            updateAnswers(prev, questionId, optionId, questionType)
        )
    }

    const fetchQuestion = () => {
        if (!socketRef.current) return

        if (socketRef.current.readyState !== WebSocket.OPEN) {
            console.log("socket not open yet")
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
                language
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
    return (
        <div className={`min-h-screen w-full flex flex-col justify-center gap-5  items-center  text-pri `}>
            {currentQuestion && (
                <div className="w-[85%]">
                    <div >
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
                                            {formatTime((totalTime))}
                                        </div>
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
                    <div className="bg-card  mt-4 border border-border  rounded-xl py-8 transform transition-all duration-200 ease-out">
                        <div className="flex ">
                            <div className="bg-sec  ml-5 px-3 py-3 rounded-xl flex items-center">
                                QUESTION NO {currentIndex + 1}
                            </div>
                            <div className="bg-bg ml-2 px-3 py-3 rounded-xl flex items-center">
                                {questionType?.toUpperCase()}
                            </div>
                            <button className="bg-bg ml-2 px-3 py-3 rounded-xl border hover:bg-accent border-border hover:border-blue-600 flex items-center fixed right-5 transition-all duration-300 ease-in-out hover:scale-105 ">
                                SUBMIT
                            </button>
                        </div>
                    </div>
                    <div className="ml-5 mt-5 pr-5 ">
                        <p className="text-2xl font-medium mb-5">{currentQuestion?.description}</p>
                        <div className="">
                            {currentQuestion?.code?.trim() ? (
                                <SyntaxHighlighter
                                    language="javascript" style={vscDarkPlus} customStyle={{
                                        borderRadius: "12px",
                                        padding: "16px",
                                        fontSize: "20px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    {currentQuestion?.code}
                                </SyntaxHighlighter>
                            ) : null}
                        </div>
                        {currentQuestion.options?.map((opt) => {

                            const isSelected = currentAnswer?.userAnswer.includes(opt.id)

                            return (
                                <button
                                    key={opt.id}
                                    onClick={() =>
                                        selectOption(currentQuestion?.questionId!, opt.id, questionType!)
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
                            {Array.from({ length: Number(questionLength) }).map((_, i) => {
                                const isFetched = !!questions[i]
                                const isNextFetchable = i === questions.length

                                return (
                                    <button
                                        onClick={() => goToQuestion(i)}
                                        key={i}
                                        disabled={!isFetched && !isNextFetchable}
                                        className={`text-2xl h-20 w-20 mt-5 rounded-xl border transition-all duration-200
                ${currentIndex === i ? "bg-accent border-accent" : "bg-sec border-neutral-700"}
                ${!isFetched && !isNextFetchable ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
            `}
                                    >
                                        {i + 1}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

            )}
            {error && (
                <div className="w-[85%] bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                    <span>{error}</span>

                    <button
                        onClick={() => setError(null)}
                        className="ml-4 text-red-700 font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}

        </div>
    )
}