'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import Loader from "./Loader";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Timer from "./Timer";

interface Question {
    description: string;
    questionId: string;
    code?: string;
    options: {
        id: string;
        text: string;
    }[];
    questionType: "single correct" | "multiple correct" | "bugfixer";
}

export default function RenderQuestion() {
    const session = useSession()
    const router = useRouter()
    const [data, setData] = useState<Question[]>([])
    const [questionsLength, setQuestionsLength] = useState<number>(0)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [totalTime, setTotalTime] = useState(0)
    const [loader, setLoader] = useState<boolean>(false)
    const [answers , setAnswers] = useState<Record<string , string>>({})
    const searchParams = useSearchParams()

    const topic= searchParams.get('topic')?.trim().toLowerCase()
    const questionType = searchParams.get('questionType')?.trim().toLowerCase()
    const difficulty = searchParams.get('difficulty')?.trim().toLowerCase()
    const language = searchParams.get('language')?.trim().toLowerCase()

    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.replace("/api/auth/signin")
        }
    }, [session.status, router])

    const fetchQuestions = async () => {
        try {
            setLoader(true)
            const response = await axios.post('http://localhost:3002/get-questions', {
                topic,
                difficulty,
                language,
                questionType,
            })
            return response
        } catch (error) {

        } finally {
            setLoader(false)
        }
    }
    useEffect(() => {
        let p = 0
        async function getResponse() {
            const res = await fetchQuestions()
            setData(res?.data.data)
            if (questionsLength <= 3) {
                const res = await axios.post('http://localhost:3002/get-questions', {
                topic,
                difficulty,
                language,
                questionType,
            })  
                setData(prev => {
                    const existingIds = new Set(prev?.map(q => q.description))

                    const newOnes = res?.data.data.filter(
                        (q: Question) => !existingIds.has(q.description)
                    );
                    return [...prev, ...newOnes]
                })
            }
        }
        getResponse()
    }, [questionsLength])

    console.log(answers )
    const handleSubmit=()=>{
        const payload = {
            totalTime ,
            answers: Object.entries(answers).map(([questionId , optionId])=>({
                questionId,
                selectedOptionId: optionId
            })) 
        }

        router.replace(`/result?data=${encodeURIComponent(JSON.stringify(payload))}`)
    }
    const ques = data[currentIndex]
    if (!ques) return null
    if (!data.length) return <Loader />
    if (session.status === "loading" || loader === true) return <Loader />
    if (session.status === "unauthenticated") return <Loader />
     
    return (
        <div>
            <header className="mx-10 mt-6">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-700 
                                bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 shadow-lg backdrop-blur">
                    <div className="text-2xl font-semibold text-slate-100 tracking-wide">Question Context</div>
                    <div className="flex flex-wrap gap-3 text-sm font-medium">
                        <Timer onStop={setTotalTime}></Timer>
                        <span className="rounded-lg border border-blue-500/30  bg-blue-500/10 px-4 py-1  text-blue-400">
                            {topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : "Topic"}
                        </span>
                        <span className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-purple-400">
                            {language ? language.charAt(0).toUpperCase() + language?.slice(1) : "Language"}
                        </span>
                        <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-emerald-400">
                            {questionType ? questionType.charAt(0).toUpperCase() + questionType.slice(1) : "Topic"}
                        </span>
                        <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-amber-400">
                            {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "Topic"}
                        </span>
                    </div>
                </div>
            </header>
            
                    <main key={ques.questionId} className="select-none mx-10 mt-8 rounded-2xl border border-slate-700 bg-slate-900 px-8 py-6 shadow-xl">
                    <div className="mb-4 text-sm font-medium text-slate-400">Question {currentIndex + 1}</div>
                    <div  className="mb-6 text-lg font-semibold text-slate-100 leading-relaxed">{ques.description}</div>
                    {!ques.code ?'' : <pre className="mb-6 rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200 overflow-x-auto">
                        Code Snippet :
                        <div>
                            {ques.code}
                        </div>
                    </pre> }
                    <div className="space-y-3">
                        {ques.options.map((opt)=>
                            <button className="w-full text-left" key={opt.id}    onClick={() => {
                                setAnswers(prev => {
                                    const current = prev[ques.questionId]   
                                    if (current === opt.id) {
                                    const updated = { ...prev }
                                    delete updated[ques.questionId]
                                    return updated
                                    }
                                     return {
                                    ...prev,
                                    [ques.questionId]: opt.id
                                        }
                                    })
                            }
                                
                            }><div
                        className={`cursor-pointer rounded-xl border px-4 py-3 transition
                        ${
                            answers[ques.questionId] === opt.id ? "border-blue-500 bg-blue-500/20 text-blue-300" : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                        }`}
                    >
                        {opt.text}
                    </div></button>
                    )}
                    </div>
                    <div className="mt-8 flex justify-end">
                        {currentIndex!==0 && (
                            <div className="px-3"> 
                                <button
                                 onClick={() => {
                                 setCurrentIndex(i => i- 1)
                        }}
                        
                        className="rounded-xl bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-500 transition disabled:opacity-50">
                            Back
                        </button>
                            </div>
                        )}
                        <button
                        onClick={() => {
                            setCurrentIndex(i => i + 1)
                            if(currentIndex===(data.length-1)){
                               setCurrentIndex(data.length-1) 
                               handleSubmit()
                            }
                        }}
                        
                        className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition disabled:opacity-50">
                            {currentIndex === data.length - 1 ? "Submit" : "Next"}
                        </button>
                    </div>
                    </main>

        </div>
    )
}