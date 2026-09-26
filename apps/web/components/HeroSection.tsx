'use client'

import React from 'react'

export default function HeroSection() {
  return (
    <div className="relative text-center max-w-2xl mx-auto flex flex-col items-center select-none">
      
      {/* Background Soft Glow Aura */}
      <div 
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-[320px] sm:w-[480px] h-[180px] rounded-full blur-[100px] pointer-events-none opacity-30 dark:opacity-25 transition-all duration-500"
        style={{ background: 'var(--accent)' }}
      />

      {/* Gamified Status Pill Indicator */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-mono font-medium tracking-wider uppercase mb-6 shadow-sm backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-[var(--player-you)] animate-pulse" />
        Competitive Platform Ready
      </div>

      {/* Brand Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight transition-all duration-300">
        <span className="font-mono text-[var(--primary-text)] opacity-80">&lt;/&gt; </span>
        <span className="text-[var(--primary-text)]">Blitz</span>
        <span className="text-[var(--accent)] drop-shadow-[0_0_25px_var(--accent-glow)]">
          Code
        </span>
      </h1>

      {/* Hero Subtitle */}
      <p className="mt-4 text-sm sm:text-base md:text-lg text-[var(--secondary-text)] leading-relaxed font-normal max-w-lg px-2">
        Test your coding skills with interactive quizzes and real-time problem statements.
      </p>

    </div>
  )
}