'use client'

import React from 'react'

interface Details {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalQuestions: number;
  answeredCount: number;
}

export default function SubmitConfirmation({ isOpen, onClose, onConfirm, totalQuestions, answeredCount }: Details) {
  if (!isOpen) return null;

  const isIncomplete = answeredCount < totalQuestions;
  const missingCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900 p-1 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transition-all">
        <div className="rounded-[2.3rem] bg-slate-950 p-8 text-center">
          
          {/* Status Icon with Glow */}
          <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-2xl transition-all duration-500 ${
            isIncomplete 
            ? "border-amber-500/20 bg-amber-500/10 text-amber-500 shadow-amber-500/20 animate-pulse" 
            : "border-blue-500/20 bg-blue-500/10 text-blue-500 shadow-blue-500/20"
          }`}>
            {isIncomplete ? (
              <span className="text-4xl">⚠️</span>
            ) : (
              <span className="text-4xl">🚀</span>
            )}
          </div>

          <h3 className="mb-2 text-3xl font-black tracking-tight text-white">
            {isIncomplete ? "Wait a minute!" : "All set!"}
          </h3>
          
          {/* Progress Mini-Bar inside Modal */}
          <div className="mt-4 mb-6 flex items-center justify-center gap-2">
            <div className="h-1.5 w-32 rounded-full bg-slate-800 overflow-hidden">
               <div 
                 className={`h-full transition-all duration-700 ${isIncomplete ? 'bg-amber-500' : 'bg-blue-500'}`}
                 style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
               />
            </div>
            <span className="text-xs font-mono text-slate-500">{answeredCount}/{totalQuestions}</span>
          </div>

          <p className="mb-8 text-sm leading-relaxed text-slate-400 px-4">
            {isIncomplete ? (
              <>
                You haven't answered <span className="text-amber-500 font-bold underline decoration-amber-500/30 underline-offset-4">{missingCount} questions</span> yet. 
                Skipping these might lower your final score analysis.
              </>
            ) : (
              "Everything looks perfect! Ready to see your performance analysis and detailed results?"
            )}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className={`w-full rounded-2xl py-4 text-sm font-black text-white transition-all active:scale-95 shadow-xl hover:brightness-110 ${
                isIncomplete 
                ? "bg-gradient-to-r from-amber-600 to-orange-600 shadow-orange-900/20" 
                : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-900/20"
              }`}
            >
              {isIncomplete ? "Yes, End Quiz Anyway" : "Submit & View Results"}
            </button>
            
            <button
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 py-4 text-sm font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white active:scale-95"
            >
              Continue Solving
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}