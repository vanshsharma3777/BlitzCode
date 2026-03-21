'use client'

import { Answers, Question, SolvedQuestion } from "../types/allTypes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi"
import { MdOutlineTimer } from "react-icons/md";
import Loader from "./Loader";
import { createTime } from "../lib/functions/createTime";
import { updateAnswers } from "../lib/functions/selectOptions";
import QuestionDescription from "./atoms/QuestionDescription";
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
    const [totalTime, setTotalTime] = useState(0)
    const [timeToPlay, setTimeToPlay] = useState(0)
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
    }, [data])

    async function getResponse() {
        try {
            const res = await axios.post("/api/questions", {
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
            totalTime : timeToPlay,
            leftTime : totalTime,
            allQuestions: data
        }
        sessionStorage.setItem("matchData", JSON.stringify(payload))
        try {
            const res = await axios.post('/api/submit-answers', { answers })
            if (res.data) {
                if(mode === 'multiplayer') router.replace('/multiplayer/result')
                else if(mode === 'singleplayer') router.replace('/singleplayer/result')
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
            {error && (
                <div className=" bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                    <span>{error}</span>

                    <button
                        onClick={() => setError(null)}
                        className="ml-4 text-red-700 font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}
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
            />
        </div>
    )
}