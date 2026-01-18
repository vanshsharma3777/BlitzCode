'use client'

import React from "react"

export default function AnalysisHeader() {
    return (
        <header className="text-center mb-10 md:mb-16 relative group">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent drop-shadow-2xl">
                Quiz Analysis
            </h1>
            <div className="flex items-center justify-center gap-3 mt-4">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-slate-700" />
                <p className="text-slate-500 font-black tracking-[0.3em] uppercase text-[10px] bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800/50 backdrop-blur-sm">
                    Final Performance Report
                </p>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-slate-700" />
            </div>
        </header>
    )
}