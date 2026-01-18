'use client'

import { useSession } from "next-auth/react"
import Loader from "./Loader"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import React from "react"
import axios from "axios"
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
            console.log(response.data)
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
    if (session.status === 'unauthenticated') return router.replace('/signin')
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 px-4 py-6 md:py-10 font-sans selection:bg-blue-500/30">
            <div className="max-w-4xl mx-auto">
                <AnalysisHeader />
                <ScoreCard analysisData={analysisData} question={question} theme={theme} correct={correct} />
                <ContextDetails analysisData={analysisData} />
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                    <div className="p-6 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg shadow-blue-900/40 uppercase tracking-wider">
                                    Question {currentIndex + 1}
                                </span>
                                <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Analysis Report</h2>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800">
                                <button
                                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentIndex === 0}
                                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-20 transition-all active:scale-90 border border-slate-700"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <span className="text-xs font-mono font-bold text-slate-400 px-3 tracking-tighter">
                                    {currentIndex + 1} <span className="text-slate-700">/</span> {question.length}
                                </span>
                                <button
                                    onClick={() => setCurrentIndex(prev => Math.min(question.length - 1, prev + 1))}
                                    disabled={currentIndex === question.length - 1}
                                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-20 transition-all active:scale-90 border border-slate-700"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-slate-100 leading-tight mb-8">
                            {currentQuestion?.description}
                        </h3>
                        {currentQuestion?.code && (
                            <div className="relative mb-8 group">
                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative">
                                    <div className="absolute top-0 right-0 p-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">{analysisData.language}</div>
                                    <pre className="rounded-2xl bg-slate-950 p-6 text-sm border border-slate-800/50 font-mono overflow-x-auto shadow-inner">
                                        <code className="text-blue-300/90 leading-relaxed italic">
                                            {currentQuestion.code}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-3 mb-10">
                            {currentQuestion?.options.map((option: any, idx: number) => {
                                const solved = analysisData.solvedQuestions.find(
                                    (sq: SolvedQuestion) => sq.questionId === currentQuestion.questionId
                                );
                                const userAnswers: string[] = solved?.userAnswer ?? [];
                                const optionLetter = String.fromCharCode(65 + idx);
                                const isCorrectOption = currentQuestion.correctOptions.includes(optionLetter);
                                const isUserSelected = userAnswers.includes(optionLetter);

                                let borderClass = "border-slate-800 bg-slate-800/30";
                                let iconBg = "bg-slate-950 border-slate-800";
                                let icon = <span className="text-slate-600 font-bold">{idx + 1}</span>;
                                let textClass = "text-slate-400";

                                if (isCorrectOption) {
                                    borderClass = "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
                                    iconBg = "bg-emerald-500 border-emerald-400";
                                    icon = <span className="text-white text-xs font-black">✓</span>;
                                    textClass = "text-emerald-300 font-bold";
                                } else if (isUserSelected && !isCorrectOption) {
                                    borderClass = "border-red-500/50 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.1)]";
                                    iconBg = "bg-red-500 border-red-400";
                                    icon = <span className="text-white text-xs font-black">×</span>;
                                    textClass = "text-red-300 font-bold";
                                }

                                return (
                                    <div
                                        key={option.id}
                                        className={`flex items-center p-4 rounded-2xl border transition-all duration-300 ${borderClass}`}
                                    >   
                                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${iconBg}`}>
                                            {icon}
                                        </div>
                                        <span className={`text-sm md:text-base ${textClass}`}>
                                            {option.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="group p-6 rounded-[1.8rem] bg-slate-950 border border-slate-800 flex gap-5 items-start transition-all hover:border-blue-500/30">
                            <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">Detailed Insight</h4>
                                <p className="text-sm text-slate-400 leading-relaxed italic">
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