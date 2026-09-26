'use client'

import React from 'react';
import { Code2, Terminal } from 'lucide-react';

export default function QuestionLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-main)]/80 backdrop-blur-md z-50 transition-colors duration-300 overflow-hidden">
      

      <div 
        className="absolute w-[350px] h-[350px] rounded-full blur-[130px] pointer-events-none opacity-30 dark:opacity-25 animate-pulse"
        style={{ background: 'var(--accent)' }}
      />

      <div className="relative flex flex-col items-center gap-7 p-10 glass-panel rounded-3xl border border-[var(--borders)] shadow-2xl shadow-black/40 max-w-sm w-full mx-4">
 
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] shadow-sm">
            <Code2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-[var(--primary-text)] font-mono">Blitz</span>
            <span className="text-[var(--accent)] drop-shadow-[0_0_12px_var(--accent-glow)] font-mono">Code</span>
          </h1>
        </div>


        <div className="relative flex items-center justify-center w-16 h-16 my-1">
  
          <div className="absolute inset-0 rounded-full border-2 border-[var(--borders)] opacity-60"></div>

          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--accent)] border-r-[var(--accent)] animate-spin shadow-[0_0_15px_-3px_var(--accent-glow)]"></div>

          <div 
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-[var(--accent)] opacity-80 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '0.85s' }}
          ></div>

          <div className="w-2.5 h-2.5 bg-[var(--accent)] rounded-full shadow-[0_0_12px_var(--accent)] animate-ping" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-sec)] border border-[var(--borders)] shadow-inner">
            <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-[11px] font-mono font-semibold text-[var(--secondary-text)] tracking-wider uppercase">
              GENERATING QUESTION SET
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-1 animate-pulse font-mono">
            Compiling problem statements...
          </p>
        </div>

      </div>
    </div>
  );
}