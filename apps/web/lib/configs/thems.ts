export type Accent = 'sky' | 'violet'

export const ACCENT: Record<Accent, Record<string, string>> = {
  sky: {
    line: 'via-sky-400',
    box: 'border-sky-500/30 from-sky-500/25 to-sky-500/5 shadow-[0_0_18px_-4px_rgba(56,189,248,0.55)]',
    icon: 'text-sky-400',
    pill: 'border-sky-500/25 bg-sky-500/10 text-sky-300',
    text: 'text-sky-400',
    glow: 'drop-shadow-[0_0_18px_rgba(56,189,248,0.45)]',
    card: 'hover:border-sky-400/30',
    selected: 'border-sky-400/60 bg-sky-500/15 text-white shadow-[0_0_16px_-4px_rgba(56,189,248,0.6)]',
    idle: 'hover:border-sky-500/30 hover:bg-sky-500/[0.06]',
    check: 'border-sky-400 bg-sky-400 text-[#0d0d0c]',
    checkIdle: 'group-hover:border-sky-400/50',
    bar: 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]',
    glowBg: 'bg-sky-500/[0.08]',
  },
  violet: {
    line: 'via-violet-400',
    box: 'border-violet-500/30 from-violet-500/25 to-violet-500/5 shadow-[0_0_18px_-4px_rgba(167,139,250,0.55)]',
    icon: 'text-violet-400',
    pill: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
    text: 'text-violet-400',
    glow: 'drop-shadow-[0_0_18px_rgba(167,139,250,0.45)]',
    card: 'hover:border-violet-400/30',
    selected: 'border-violet-400/60 bg-violet-500/15 text-white shadow-[0_0_16px_-4px_rgba(167,139,250,0.6)]',
    idle: 'hover:border-violet-500/30 hover:bg-violet-500/[0.06]',
    check: 'border-violet-400 bg-violet-400 text-[#0d0d0c]',
    checkIdle: 'group-hover:border-violet-400/50',
    bar: 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.7)]',
    glowBg: 'bg-violet-500/[0.08]',
  },
}