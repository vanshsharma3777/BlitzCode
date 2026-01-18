'use client'

import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#020617] z-[999]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full animate-pulse" />
      <div className="relative flex flex-col items-center">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-2 border-slate-800 border-t-blue-500 animate-[spin_1.5s_linear_infinite]" />
                    <div className="absolute inset-2 rounded-full border-2 border-slate-800 border-b-indigo-500 animate-[spin_2s_linear_infinite_reverse]" />
                    <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
        </div>
                <div className="mt-8 flex flex-col items-center space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">
            System Initializing
          </span>
          <div className="flex items-center gap-1">
            <span className="h-1 w-1 bg-slate-700 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-1 w-1 bg-slate-700 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-1 w-1 bg-slate-700 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10">
        <p className="text-[10px] font-medium text-slate-600 tracking-widest uppercase">
          Blitzcode AI Engine v2.0
        </p>
      </div>
    </div>
  );
}