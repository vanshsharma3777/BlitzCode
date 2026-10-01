'use client'

import { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

type Accent = 'sky' | 'violet'

// Tailwind ko full class names chahiye, isliye string concat nahi kiya
const THEME: Record<Accent, Record<string, string>> = {
  sky: {
    line: 'via-sky-400',
    box: 'border-sky-500/30 from-sky-500/25 to-sky-500/5 shadow-[0_0_22px_-4px_rgba(56,189,248,0.55)]',
    icon: 'text-sky-400',
    tag: 'border-sky-500/25 bg-sky-500/10 text-sky-300',
    card: 'hover:border-sky-400/40 hover:shadow-[0_0_45px_-12px_rgba(56,189,248,0.55)]',
    blob: 'bg-sky-500/20',
    cta: 'text-sky-300',
    water: 'text-sky-400/[0.06] group-hover:text-sky-400/[0.12]',
  },
  violet: {
    line: 'via-violet-400',
    box: 'border-violet-500/30 from-violet-500/25 to-violet-500/5 shadow-[0_0_22px_-4px_rgba(167,139,250,0.55)]',
    icon: 'text-violet-400',
    tag: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
    card: 'hover:border-violet-400/40 hover:shadow-[0_0_45px_-12px_rgba(167,139,250,0.55)]',
    blob: 'bg-violet-500/20',
    cta: 'text-violet-300',
    water: 'text-violet-400/[0.06] group-hover:text-violet-400/[0.12]',
  },
}

interface ModeCardProps {
  title: string
  description: string
  icon: ReactNode
  onClick: () => void
  tag?: string
  cta?: string
  accent?: Accent
}

export default function ModeCard({
  title,
  description,
  icon,
  onClick,
  tag = 'Mode',
  cta = 'Start now',
  accent = 'sky',
}: ModeCardProps) {
  const t = THEME[accent]

  return (
    <button
      onClick={onClick}
      className={`group relative w-full max-w-[450px] cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#121212]/80 p-7 text-left shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 ${t.card}`}
    >
      {/* top gradient line */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${t.line} to-transparent opacity-80`} />

      {/* ambient glow blob */}
      <div className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[70px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${t.blob}`} />

      {/* big watermark icon */}
      <div className={`pointer-events-none absolute -bottom-6 -right-4 transition-colors duration-300 [&>svg]:!h-40 [&>svg]:!w-40 ${t.water}`}>
        {icon}
      </div>

      <div className="relative flex items-start justify-between">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border bg-gradient-to-br transition-transform duration-300 group-hover:scale-110 ${t.box}`}>
          <div className={t.icon}>{icon}</div>
        </div>

        <span className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${t.tag}`}>
          {tag}
        </span>
      </div>

      <h3 className="relative mt-6 text-2xl font-extrabold tracking-tight text-white">{title}</h3>
      <p className="relative mt-2 max-w-[300px] text-sm leading-relaxed text-zinc-400">{description}</p>

      <div className={`relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${t.cta}`}>
        {cta}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </button>
  )
}