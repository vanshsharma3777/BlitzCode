'use client'

import React from "react"
import { AnalysisData } from "../../types/allTypes"

export default function ContextDetails({ analysisData }: { analysisData: AnalysisData }) {
    const chips = [
        { label: 'Topic', val: analysisData.topic, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
        { label: 'Language', val: analysisData.language, color: 'text-indigo-400', border: 'border-indigo-500/20', bg: 'bg-indigo-500/5' },
        { label: 'Level', val: analysisData.difficulty, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
        { label: 'Type', val: analysisData.questionType, color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5' }
    ]

    return (
        <div className="flex flex-wrap gap-3 mb-7 justify-center md:justify-start">
            {chips.map((item, i) => (
                <div 
                    key={i} 
                    className={`flex items-center gap-2 ${item.bg} border ${item.border} px-4 py-2 rounded-2xl shadow-sm transition-all duration-300 hover:scale-105 hover:border-slate-600 group`}
                >
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">
                        {item.label}
                    </span>
                    <div className="h-3 w-[1px] bg-slate-800" />
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${item.color}`}>
                        {item.val}
                    </span>
                </div>
            ))}
        </div>
    )
}