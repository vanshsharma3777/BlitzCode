'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import Loader from "./Loader";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Timer from "./Timer";
import { diff } from "util";
import { Question } from "../types/allTypes";
import SubmitConfirmation from "./atoms/SubmitConfirmation";


export default function RenderQuestion() {
  const session = useSession()
  const router = useRouter()
  const [data, setData] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState<Question[]>([])
  const [loader, setLoader] = useState<boolean>(false)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic')?.trim().toLowerCase() || ''
  const questionType = searchParams.get('questionType')?.trim().toLowerCase()
  const difficulty = searchParams.get('difficulty')?.trim().toLowerCase()
  const questionLength = searchParams.get('questionLength')?.trim().toLowerCase()
  const language = searchParams.get('language')?.trim().toLowerCase()
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/signin")
    }
  }, [session.status, router])

  const fetchQuestions = async () => {
    try {
      setLoader(true)
      const response = await axios.post('/api/get-questions', {
        topic:topic.trim().toLowerCase(),
        difficulty,
        language,
        questionType,
        questionLength,
      }, { withCredentials: true })
      console.log("question came form worker")
      console.log(response.data)
      return response
    } catch (error) {
      console.log("catch running")
    } finally {
      setLoader(false)
    }
  }
  useEffect(() => {
    if (session.status !== "authenticated") return
    async function getResponse() {
      const res = await fetchQuestions()
      if (!res?.data?.data) return
      setData(res?.data.data)
      console.log(res.data.data.length)
    }
    getResponse()
  }, [session.status])
  const handleSubmit = async () => {
    const solvedQuestions = data.map((q) => {
      const ans = answers[q.questionId];

      return {
        questionId: q.questionId,
        userAnswer: Array.isArray(ans) ? ans : ans ? [ans] : [],
      };
    });

    const attemptId = crypto.randomUUID()
    const payload = {
      totalTime,
      attemptId,
      topic,
      difficulty,
      language,
      questionType,
      questionLength,
      solvedQuestions
    }
    router.replace(`/result?data=${encodeURIComponent(JSON.stringify(payload))}`)
  }


  const ques = data[currentIndex]
  if (!ques) return null
  if (!data.length) return <Loader />
  if (session.status === "loading" || loader === true) return <Loader />
  if (session.status === "unauthenticated") return <Loader />
  const answeredCount = Object.values(answers).filter(a =>
    Array.isArray(a) ? a.length > 0 : a !== undefined && a !== ""
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 py-6">
      <header className="mx-4 md:mx-10 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-700/50 
                        bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 shadow-xl backdrop-blur-md">
          <div className="text-2xl font-bold text-slate-100 tracking-tight">Question Context</div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Timer onStop={setTotalTime} />
            <span className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              {topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : "Topic"}
            </span>
            <span className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              {language ? language.charAt(0).toUpperCase() + language?.slice(1) : "Language"}
            </span>
            <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              {questionType ? questionType.charAt(0).toUpperCase() + questionType.slice(1) : "Type"}
            </span>
            <span className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "Level"}
            </span>
          </div>
        </div>
      </header>

      <main key={ques.questionId} className="select-none mx-4 md:mx-10 mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/50 px-6 py-8 md:px-10 md:py-10 shadow-2xl backdrop-blur-sm">
        <div className="mb-4 inline-block rounded-lg bg-slate-800/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-700">
          Question {currentIndex + 1} of {data.length}
        </div>

        <div className="mb-8 text-xl font-semibold text-slate-100 leading-snug">
          {ques.description}
        </div>

        {ques.code && (
          <div className="group relative mb-8">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <pre className="relative rounded-xl border border-slate-700 bg-slate-950 p-5 text-sm font-mono leading-relaxed text-blue-300/90 italic overflow-x-auto shadow-inner">
              <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-slate-800 pb-1">Code Snippet</div>
              <code>{ques.code}</code>
            </pre>
          </div>
        )}

        <div className="space-y-3">
          {ques.options.map((opt) => {
            const answer = answers[ques.questionId]
            const isSelected = ques.questionType === "multiple"
              ? Array.isArray(answer) && answer.includes(opt.id)
              : answer === opt.id

            return (
              <button
                className="w-full text-left outline-none"
                key={opt.id}
                onClick={() => {
                  setAnswers(prev => {
                    const current = prev[ques.questionId]
                    if (ques.questionType === 'multiple') {
                      const currentArray = Array.isArray(current) ? current : []
                      if (currentArray.includes(opt.id)) {
                        return { ...prev, [ques.questionId]: currentArray.filter(id => id !== opt.id) }
                      }
                      return { ...prev, [ques.questionId]: [...currentArray, opt.id] }
                    }
                    if (current === opt.id) {
                      const updated = { ...prev }
                      delete updated[ques.questionId]
                      return updated
                    }
                    return { ...prev, [ques.questionId]: opt.id }
                  })
                }}
              >
                <div className={`cursor-pointer rounded-2xl border-2 px-6 py-4 transition-all duration-200 active:scale-[0.98]
                  ${isSelected
                    ? "border-blue-500 bg-blue-500/10 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                    : "border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-300 ${isSelected ? "border-blue-400 bg-blue-500 text-white" : "border-slate-700 bg-slate-900 group-hover:border-slate-500"
                      }`}>
                      {isSelected && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                    <span className="text-base font-medium">{opt.text}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-12 flex items-center justify-end gap-4 border-t border-slate-800 pt-8">
          {currentIndex !== 0 && (
            <button
              onClick={() => setCurrentIndex(i => i - 1)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-700 hover:border-slate-500 active:scale-95 shadow-lg"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (currentIndex === (data.length - 1)) {
                setCurrentIndex(data.length - 1)
                setIsModalOpen(true);
              } else {
                setCurrentIndex(i => i + 1);
              }
            }}
            className="group relative flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-2.5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95 shadow-xl"
          >
            {currentIndex === data.length - 1 ? "Submit Exam" : "Next Question"}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </main>

      <SubmitConfirmation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubmit}
        totalQuestions={data.length}
        answeredCount={answeredCount}
      />
    </div>
  )
}