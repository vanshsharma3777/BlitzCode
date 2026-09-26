'use client'

import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-main)]/80 backdrop-blur-md z-50 transition-colors duration-300 overflow-hidden">
      
      {/* Ambient background accent glow */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-30 dark:opacity-25 animate-pulse"
        style={{ background: 'var(--accent)' }}
      />

      <div className="relative flex flex-col items-center gap-8 p-10 glass-panel rounded-3xl border border-[var(--borders)] shadow-2xl shadow-black/40">
        
        {/* Animated Brand Header */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-2xl text-[var(--accent)] font-semibold tracking-tighter select-none">&lt;/&gt;</span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-[var(--primary-text)]">Blitz</span>
            <span className="text-[var(--accent)]">Code</span>
          </h1>
        </div>

        {/* Premium Layered Spinner */}
        <div className="relative flex items-center justify-center w-16 h-16">
          {/* Subtle Outer Track */}
          <div className="absolute inset-0 rounded-full border-2 border-[var(--borders)]"></div>

          {/* Outer Pulsing Glow Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--accent)] animate-spin"></div>

          {/* Inner Counter-Rotating Ring */}
          <div 
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-[var(--accent)] opacity-80 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '0.85s' }}
          ></div>

          {/* Center Glowing Indicator Core */}
          <div className="w-2.5 h-2.5 bg-[var(--accent)] rounded-full shadow-[0_0_12px_var(--accent)] animate-ping" />
        </div>

        {/* Sleek Terminal Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-sec)] border border-[var(--borders)] shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[var(--player-you)] animate-pulse"></span>
          <span className="text-xs font-mono font-medium text-[var(--secondary-text)] tracking-wide">
            INITIALIZING SYSTEM...
          </span>
        </div>

      </div>
    </div>
  );
}