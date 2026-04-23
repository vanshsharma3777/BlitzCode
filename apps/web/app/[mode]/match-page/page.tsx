'use client'

import { useEffect, useRef, useState } from "react"
import Loader from "../../../components/Loader"
import { MdOutlineTimer } from "react-icons/md"
import { FaChartLine } from "react-icons/fa"
import { HiOutlineMail } from "react-icons/hi"
import { useSession } from "next-auth/react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { updateAnswers } from "../../../lib/functions/selectOptions"
import { Question, SolvedQuestion, WSQuestionData } from "../../../types/allTypes"
import { connectSocket } from "../../../lib/websocket"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import SyntaxHighlighter from "react-syntax-highlighter"
import { createTime } from "../../../lib/functions/createTime"

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
    return (

        <div className={`min-h-screen w-full flex flex-col justify-center gap-5  items-center  text-pri `}>
            {currentQuestion && (
                <div className="w-full max-w-7xl mx-auto">
                    {error && (
                        <div className="mt-3  mb-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-xl flex items-center justify-between">
                            <span>{error}</span>

                            <button
                                onClick={() => setError(null)}
                                className="ml-4 text-red-700 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    <div >
                        {loader === false && (
                            <div className="grid  grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                                    <MdOutlineTimer className="text-xl text-accent" />
                                    <div>
                                        <div className="text-xs text-sec">Time Left</div>
                                        <div className="font-semibold text-lg">
                                            {formatTime(totalTime)}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                                    <FaChartLine className="text-xl text-accent" />

                                    <div>
                                        <div className="text-xs text-sec">Progress</div>
                                        <div className="font-semibold text-lg">
                                            {currentIndex + 1} / {questionLength}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 overflow-hidden">
                                    <div className="h-10 w-10 rounded-full overflow-hidden border border-border shrink-0">
                                        <img
                                            src={session.data?.user.image || "profile.png"}
                                            alt="profile"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="truncate w-full">
                                        <div className="text-xs text-sec">Logged in as</div>
                                        <div className="font-medium truncate">
                                            {session.data?.user.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-card  mt-4 border border-border  rounded-xl p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-wrap gap-2">

              <div className="bg-sec px-4 py-2 rounded-xl text-sm md:text-base">
                QUESTION {currentIndex + 1}
              </div>

              <div className="bg-bg px-4 py-2 rounded-xl text-sm md:text-base">
                {questionType?.toUpperCase()}
              </div>
            </div>

            <button
              onClick={() =>
                handleOptionClick(
                  currentQuestion.questionId,
                  currentAnswer?.userAnswer!
                )
              }
              className="bg-accent px-5 py-2 rounded-xl font-medium hover:scale-105 transition"
            >
              SUBMIT
            </button>

          </div>
                    </div>
                    <div className="mt-5">
                        <p className="text-lg md:text-2xl font-medium mb-5 leading-relaxed">{currentQuestion?.description}</p>
                        <div className="">
                            {currentQuestion?.code?.trim() && (
                                <SyntaxHighlighter
                                    language="javascript" style={vscDarkPlus} customStyle={{
                                        borderRadius: "14px",
                                        padding: "16px",
                                        fontSize: "16px",
                                        marginBottom: "16px",
                                    }}
                                >
                                    {currentQuestion?.code}
                                </SyntaxHighlighter>
                            )}
                        </div>
                        <div className="space-y-3">
                            {currentQuestion.options?.map((opt) => {

                            const isSelected = currentAnswer?.userAnswer.includes(opt.id)

                            return (
                                <button
                                    key={opt.id}
                                    onClick={() =>
                                        selectOption(currentQuestion?.questionId!, opt.id, questionType!)
                                    }
                                    className={`border  w-full text-left rounded-xl p-4 transition-all duration-200 ease-in-out hover:scale-[1.01]
                                        ${isSelected
                                            ? "bg-accent border-accent"
                                            : "bg-bg border-border hover:border-accent"
                                        }`}
                                >
                                    <div className="flex gap-3 items-center items-start">
                                        <div className="bg-card flex items-center justify-center text-xl shirnk-0 text-sec h-10 w-10 rounded-full">
                                                {opt.id}
                                            </div>

                                        <div className="leading-relaxed">
                                            {opt.text}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                        </div>
                       <div className="mt-6">

            <div className="text-sm text-sec mb-3">
              Jump to Question
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 mb-5">

              {Array.from({
                length: Number(questionLength),
              }).map((_, i) => {
                const isFetched = !!questions[i];
                const isNextFetchable =
                  i === questions.length;

                return (
                  <button
                    key={i}
                    disabled={!isFetched && !isNextFetchable}
                    onClick={() => {
                      goToQuestion(i);

                      handleOptionClick(
                        currentQuestion.questionId,
                        currentAnswer?.userAnswer!
                      );
                    }}
                    className={`h-14 rounded-xl border font-semibold transition
                    ${
                      currentIndex === i
                        ? "bg-accent border-accent"
                        : "bg-card border-border"
                    }
                    ${
                      !isFetched && !isNextFetchable
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

            )}


        </div>
    )
}