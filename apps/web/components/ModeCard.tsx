'use client'

import { ReactNode } from 'react'

interface ModeCardProps {
  title: string
  description: string
  icon: ReactNode
  onClick: () => void
}

export default function ModeCard({ title, description, icon, onClick }: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-2xl bg-[var(--card-bg)] hover:bg-[var(--card-hover)] h-auto min-h-[200px] md:h-[230px] w-full max-w-[450px] p-6 sm:p-8 flex flex-col items-center justify-center border border-[var(--borders)] hover:border-[var(--accent)] transition-all duration-300 ease-in-out hover:scale-[1.02] md:hover:scale-105 shadow-lg hover:shadow-[0_0_25px_-5px_var(--accent-glow)] cursor-pointer overflow-hidden"
    >
      {/* Ambient Inner Hover Glow */}
      <div className="pointer-events-none absolute -inset-full rounded-2xl bg-gradient-to-r from-transparent via-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon Container */}
      <div className="relative h-16 w-16 bg-[var(--bg-sec)] border border-[var(--borders)] rounded-2xl flex justify-center items-center transition-all duration-300 group-hover:border-[var(--accent)]/50 group-hover:bg-[var(--accent)]/10 group-hover:shadow-[0_0_15px_-3px_var(--accent-glow)] group-hover:scale-110">
        <div className="text-[var(--primary-text)] group-hover:text-[var(--accent)] transition-colors duration-300">
          {icon}
        </div>
      </div>

      {/* Card Title */}
      <div className="font-extrabold text-xl sm:text-2xl text-[var(--primary-text)] mt-4 tracking-tight transition-colors duration-200">
        {title}
      </div>

      {/* Card Description */}
      <div className="text-[var(--secondary-text)] mt-2 text-xs sm:text-sm md:text-base max-w-[280px] text-center leading-relaxed">
        {description}
      </div>
    </button>
  )
}