'use client'

import { Check } from "lucide-react"

type Props = {
    field: string
    value: string
    selected: string
    onClick: () => void
}

export default function TopicsCard({ field, value, selected, onClick }: Props) {
    const isSelected = selected === value

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative flex items-center justify-between w-full h-11 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
                isSelected
                    ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] shadow-[0_0_15px_-3px_var(--accent-glow)] font-semibold"
                    : "border-[var(--borders)] bg-[var(--bg-sec)]/60 text-[var(--secondary-text)] hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)] hover:text-[var(--primary-text)]"
            }`}
        >
            <span className="truncate">{field}</span>

            {/* Selection Checkmark Indicator */}
            <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                    isSelected
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm"
                        : "border-[var(--borders)] bg-transparent group-hover:border-[var(--accent)]/40"
                }`}
            >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
        </button>
    )
}