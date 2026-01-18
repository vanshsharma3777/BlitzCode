'use client'

import { useSession } from "next-auth/react"
import Loader from "./Loader"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import React from "react"
import axios, { isCancel } from "axios"
import AnalysisHeader from "./atoms/AnalysisHeader"
import ScoreCard from "./atoms/ScoreCard"
import { getScoreColor } from "../lib/functions/getColor"
import ContextDetails from "./atoms/ContextDetails"
import { Options, Question, SolvedQuestion } from "../types/allTypes"

export default function Analysis() {
    const session = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const rawData = searchParams.get('data')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [question, setQuestion] = useState<Question[]>([])
    const [correct, setCorrect] = useState<number>(0);

    if (!rawData) return <div className="text-white p-10">No analysis data found.</div>

    if (!rawData) return null
    const analysisData = JSON.parse(decodeURIComponent(rawData))
    useEffect(() => {
        if (!analysisData) return
        const { totalTime, topic, difficulty, language, questionType, description, questionId , solvedQuestions, attemptId } = analysisData
        try {
        async function getResponse() {
            const response = await axios.post('/api/submit-attempt', { attemptId, topic, difficulty, language, questionType, solvedQuestions })

            if (response.data.success) {
                setQuestion(response.data.originalQuestions)
                const ques = analysisData.questionId
            }
        }
        getResponse()
    } catch (error) {
        console.log(error)
    }
    }, [])

    useEffect(() => {
        if (!analysisData || question.length === 0) return;
                calculateCorrect();
    }, [analysisData, question]);

        function calculateCorrect() {
            let count = 0;
            analysisData.solvedQuestions.forEach((opt: Options) => {
            const q = question.find(
                q => q.correctOptions.includes(opt.selectedOptionId)
            );

            if (q) {
             count++;
            }
                });

    setCorrect(count);
    }

    const theme = getScoreColor((correct / question.length) * 100);
    const currentQuestion = question[currentIndex];
    if (session.status === 'loading') return <Loader />
    if (session.status === 'unauthenticated') return router.replace('/api/auth/signin')
    return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-4 py-6 md:py-10 font-sans">
        <div className="max-w-4xl mx-auto">

            <AnalysisHeader></AnalysisHeader>
            <ScoreCard analysisData={analysisData} question={question} theme={theme} correct={correct}></ScoreCard>
            <ContextDetails analysisData={analysisData}></ContextDetails>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-lg shadow-blue-900/20">
                                Q{currentIndex + 1}
                            </span>
                            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Question Analysis</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors border border-slate-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <span className="text-xs font-mono text-slate-500 px-2">{currentIndex + 1} / {question.length}</span>
                            <button
                                onClick={() => setCurrentIndex(prev => Math.min(question.length - 1, prev + 1))}
                                disabled={currentIndex === question.length - 1}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors border border-slate-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>

                    <h3 className="text-lg md:text-xl font-semibold leading-relaxed mb-6">
                        {currentQuestion?.description}
                    </h3>

                    {currentQuestion?.code && (
                        <div className="relative mb-8 group">
                            <div className="absolute top-0 right-0 p-3 text-[10px] text-slate-600 font-mono group-hover:text-blue-500 transition-colors uppercase">{analysisData.language}</div>
                            <pre className="rounded-2xl bg-slate-950 p-6 text-sm border border-slate-800/50 font-mono overflow-x-auto shadow-inner">
                                <code className="text-blue-300/90 leading-relaxed italic">
                                    {currentQuestion.code}
                                </code>
                            </pre>
                        </div>
                        )}
    <div className="grid grid-cols-1 gap-3 mb-8">
        {currentQuestion?.options.map((option: any, idx: number) => {
            const solved = analysisData.solvedQuestions.find(
                (sq: SolvedQuestion) =>
                    sq.questionId === currentQuestion.questionId
            );
            const userAnswers: string[] = solved?.userAnswer ?? [];
            const optionLetter = String.fromCharCode(65 + idx);
            const isCorrectOption =
                currentQuestion.correctOptions.includes(optionLetter);
            const isUserSelected =
                userAnswers.includes(optionLetter);
            let borderClass = "border-slate-800 bg-slate-800/20";
            let icon = <span className="text-slate-600">{idx + 1}</span>;
            let textClass = "text-slate-300";
            if (isCorrectOption) {
                borderClass = "border-emerald-500/50 bg-emerald-500/5";
                icon = <span className="text-emerald-500 font-bold">✓</span>;
                textClass = "text-emerald-400 font-medium";
            }
            if (isUserSelected && !isCorrectOption) {
                borderClass = "border-red-500/50 bg-red-500/5";
                icon = <span className="text-red-500 font-bold">×</span>;
                textClass = "text-red-400";
            }
            return (
                <div
                key={option.id}
                className={`flex items-center p-4 rounded-2xl border transition-all ${borderClass}`}
            >
                <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center mr-4">
                    {icon}
                </div>

                <span className={`text-sm md:text-base ${textClass}`}>
                    {option.text}
                </span>
                </div>
            );
        })}
                </div>


        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex gap-4 items-start">
            <div className="bg-blue-500/20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
                <h4 className="text-[10px] font-black text-blue-500 text-sm uppercase tracking-widest mb-1">Deep Explanation</h4>
                <p className="text-sm text-slate-400 leading-relaxed ">
                 {currentQuestion?.explanation || "No explanation provided for this question."}
                </p>
            </div>
        </div>
            </div>
        </div>
    </div>
        </div>
    );
}