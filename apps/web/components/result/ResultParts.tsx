'use client'

import { ReactNode } from 'react'
import { LucideIcon, CheckCircle2, XCircle, X, HelpCircle, Zap } from 'lucide-react'

export type Tone = 'sky' | 'violet' | 'amber' | 'emerald' | 'rose'

// Tailwind ko full class names chahiye, isliye concat nahi kiya
const TONE: Record<Tone, Record<string, string>> = {
  sky: {
    line: 'via-sky-400',
    box: 'border-sky-500/30 from-sky-500/25 to-sky-500/5 shadow-[0_0_18px_-4px_rgba(56,189,248,0.55)]',
    icon: 'text-sky-400', text: 'text-sky-400', glow: 'bg-sky-500/15',
    pill: 'border-sky-500/25 bg-sky-500/10 text-sky-300',
  },
  violet: {
    line: 'via-violet-400',
    box: 'border-violet-500/30 from-violet-500/25 to-violet-500/5 shadow-[0_0_18px_-4px_rgba(167,139,250,0.55)]',
    icon: 'text-violet-400', text: 'text-violet-400', glow: 'bg-violet-500/15',
    pill: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
  },
  amber: {
    line: 'via-amber-400',
    box: 'border-amber-500/30 from-amber-500/25 to-amber-500/5 shadow-[0_0_18px_-4px_rgba(251,191,36,0.55)]',
    icon: 'text-amber-400', text: 'text-amber-400', glow: 'bg-amber-500/15',
    pill: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  },
  emerald: {
    line: 'via-emerald-400',
    box: 'border-emerald-500/30 from-emerald-500/25 to-emerald-500/5 shadow-[0_0_18px_-4px_rgba(52,211,153,0.55)]',
    icon: 'text-emerald-400', text: 'text-emerald-400', glow: 'bg-emerald-500/15',
    pill: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  },
  rose: {
    line: 'via-rose-400',
    box: 'border-rose-500/30 from-rose-500/25 to-rose-500/5 shadow-[0_0_18px_-4px_rgba(244,63,94,0.55)]',
    icon: 'text-rose-400', text: 'text-rose-400', glow: 'bg-rose-500/15',
    pill: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  },
}

export function Panel({ tone = 'sky', className = '', children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#121212]/80 shadow-2xl backdrop-blur-xl ${className}`}>
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${TONE[tone].line} to-transparent opacity-80`} />
      {children}
    </div>
  )
}

export function IconBox({ icon: Icon, tone = 'sky', big = false }: { icon: LucideIcon; tone?: Tone; big?: boolean }) {
  const t = TONE[tone]
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br ${t.box} ${big ? 'h-20 w-20' : 'h-11 w-11'}`}>
      <Icon className={`${big ? 'h-10 w-10' : 'h-5 w-5'} ${t.icon}`} />
    </div>
  )
}

export function Pill({ tone = 'sky', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${TONE[tone].pill}`}>
      {children}
    </span>
  )
}

export function Hero({ tone, icon, title, subtitle }: { tone: Tone; icon: LucideIcon; title: string; subtitle: ReactNode }) {
  return (
    <Panel tone={tone} className="p-8 text-center">
      <div className={`pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full blur-[90px] ${TONE[tone].glow}`} />
      <div className="relative flex flex-col items-center">
        <IconBox icon={icon} tone={tone} big />
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">{subtitle}</p>
      </div>
    </Panel>
  )
}

export function StatTile({ label, value, sub, icon: Icon, tone = 'sky' }: {
  label: string; value: ReactNode; sub?: string; icon?: LucideIcon; tone?: Tone
}) {
  const t = TONE[tone]
  return (
    <Panel tone={tone} className="p-4 text-center sm:p-5">
      <p className="flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        {Icon && <Icon className={`h-3.5 w-3.5 ${t.icon}`} />}
        {label}
      </p>
      <p className="mt-2 font-mono text-2xl font-extrabold text-white sm:text-3xl">{value}</p>
      {sub && <p className={`mt-1 font-mono text-xs ${t.text}`}>{sub}</p>}
    </Panel>
  )
}

export function XpBanner({ tone, title, sub, total }: { tone: Tone; title: string; sub: string; total: number }) {
  return (
    <Panel tone={tone} className="p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <IconBox icon={Zap} tone="amber" />
        <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <p className="text-base font-bold text-white sm:text-lg">{title}</p>
            <p className="text-xs text-zinc-500">{sub}</p>
          </div>
          <Pill tone="amber">Total XP: {total}</Pill>
        </div>
      </div>
    </Panel>
  )
}

export function OptionRow({ id, text, isCorrect, isSelected }: { id: string; text: string; isCorrect: boolean; isSelected: boolean }) {
  const state = isCorrect
    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_16px_-4px_rgba(16,185,129,0.4)]'
    : isSelected
    ? 'border-rose-500/50 bg-rose-500/10 text-rose-300 shadow-[0_0_16px_-4px_rgba(244,63,94,0.4)]'
    : 'border-white/10 bg-white/[0.03] text-zinc-400'
  const badge = isCorrect
    ? 'border-emerald-400 bg-emerald-400 text-[#0d0d0c]'
    : isSelected
    ? 'border-rose-400 bg-rose-400 text-[#0d0d0c]'
    : 'border-white/10 bg-white/[0.04] text-zinc-500'
  return (
    <div className={`flex items-center justify-between rounded-2xl border p-4 text-sm font-medium sm:text-base ${state}`}>
      <div className="flex items-center gap-3.5 pr-4">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-bold ${badge}`}>{id}</span>
        <span className="leading-snug">{text}</span>
      </div>
      {isCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" /> : isSelected ? <XCircle className="h-5 w-5 shrink-0 text-rose-400" /> : null}
    </div>
  )
}

export function ExplanationModal({ open, onClose, text }: { open: boolean; onClose: () => void; text?: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
        <Panel tone="sky" className="p-6 sm:p-8">
          <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 cursor-pointer rounded-xl p-2 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white">
            <X className="h-5 w-5" />
          </button>
          <div className="mb-4 flex items-center gap-3 border-b border-white/[0.07] pb-4">
            <IconBox icon={HelpCircle} tone="sky" />
            <h3 className="text-xl font-bold text-white">Detailed Explanation</h3>
          </div>
          <div className="max-h-[60vh] overflow-y-auto pr-2 text-sm leading-relaxed text-zinc-400 sm:text-base">
            {text || 'No explanation provided for this question.'}
          </div>
        </Panel>
      </div>
    </div>
  )
}