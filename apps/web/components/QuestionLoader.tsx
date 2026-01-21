'use client'

import React from 'react';

export default function GenerationLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#020617] z-[999] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative flex flex-col items-center">
        {/* Main Visual: The "Scanner" */}
        <div className="relative w-32 h-32">
          {/* Outer Hexagon/Square Frame */}
          <div className="absolute inset-0 border border-slate-800 rotate-45 scale-110 animate-[pulse_2s_ease-in-out_infinite]" />
          <div className="absolute inset-0 border border-blue-500/30 -rotate-45 scale-125 animate-[pulse_3s_ease-in-out_infinite]" />
          
          {/* Central Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-sm rotate-45 animate-spin shadow-[0_0_30px_rgba(37,99,235,0.6)]">
               <div className="w-full h-full border border-white/20" />
            </div>
          </div>

          {/* Orbiting Particles */}
          <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
            <div className="h-2 w-2 bg-blue-400 rounded-full absolute -top-2 left-1/2 shadow-[0_0_10px_#60a5fa]" />
          </div>
          <div className="absolute inset-0 animate-[spin_6s_linear_infinite_reverse]">
            <div className="h-2 w-2 bg-indigo-500 rounded-full absolute -bottom-2 left-1/2 shadow-[0_0_10px_#6366f1]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-12 flex flex-col items-center">
          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-bold text-lg tracking-tight">
            Generating New Questions
          </h3>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mt-2 animate-pulse">
            Consulting Neural Engine
          </p>
          
          {/* Scanning Progress Bar */}
          <div className="mt-6 w-48 h-[2px] bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full -translate-x-full animate-[loading_1.5s_infinite]" />
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 flex flex-col items-center space-y-1">
        <p className="text-[10px] font-medium text-slate-700 tracking-widest uppercase">
          Blitzcode <span className="text-slate-800 px-1">|</span> Engine v2.0
        </p>
      </div>

      <style jsx>{`
        @keyframes loading {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}