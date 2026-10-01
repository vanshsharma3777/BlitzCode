'use client'

import { Check } from 'lucide-react'
import { ACCENT, Accent } from '../../lib/configs/thems'

type Props = {
  field: string
  value: string
  selected: string
  onClick: () => void
  accent?: Accent
}

export default function TopicsCard({ field, value, selected, onClick, accent = 'sky' }: Props) {
  const isSelected = selected === value
  const t = ACCENT[accent]

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`group relative flex h-11 w-full cursor-pointer select-none items-center justify-between rounded-xl border px-3.5 text-xs font-medium transition-all duration-200 active:scale-[0.97] sm:text-sm ${
        isSelected
          ? `${t.selected} font-semibold`
          : `border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-100 ${t.idle}`
      }`}
    >
      <span className="truncate">{field}</span>

      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
          isSelected ? t.check : `border-white/15 bg-transparent ${t.checkIdle}`
        }`}
      >
        {isSelected && <Check className="h-3 w-3" strokeWidth={3.5} />}
      </span>
    </button>
  )
}