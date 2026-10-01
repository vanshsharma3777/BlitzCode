"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, Check, Code2 } from "lucide-react"
import { LanguageKey } from "../../types/languages"


export interface LanguageOption {
  key: LanguageKey
  label: string
}

const DEFAULT_LANGUAGES: LanguageOption[] = [
  { key: "cpp", label: "C++" },
  { key: "java", label: "Java" },
  { key: "python", label: "Python" },
  { key: "javascript", label: "JavaScript" },
]

interface LanguageDropdownProps {
  value: LanguageKey
  onChange: (value: LanguageKey) => void
  disabled?: boolean
  options?: LanguageOption[]
}

export function LanguageDropdown({ value, onChange, disabled = false, options = DEFAULT_LANGUAGES }: LanguageDropdownProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const selected = options.find((o) => o.key === value) || options[0]

  const toggle = () => {
    if (disabled) return
    if (!open) setActiveIndex(Math.max(0, options.findIndex((o) => o.key === value)))
    setOpen((o) => !o)
  }

  const select = (k: LanguageKey) => {
    onChange(k)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === "Escape") return setOpen(false)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!open) return toggle()
      setActiveIndex((i) => (i + 1) % options.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (!open) return toggle()
      setActiveIndex((i) => (i - 1 + options.length) % options.length)
    } else if (e.key === "Enter" && open) {
      e.preventDefault()
      if (options[activeIndex]) select(options[activeIndex].key)
    }
  }

  return (
    <div ref={ref} className="relative min-w-[140px]" onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg border bg-white/[0.04] px-3 text-sm font-medium outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
          open ? "border-sky-400/60 ring-2 ring-sky-500/15" : "border-white/10 hover:border-white/20"
        }`}
      >
        <Code2 className="h-3.5 w-3.5 shrink-0 text-sky-400" />
        <span className="flex-1 truncate text-left text-zinc-200">{selected?.label ?? "Language"}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180 text-sky-400" : ""}`} />
      </button>

      <div
        role="listbox"
        className={`absolute left-0 right-0 top-full z-40 mt-2 origin-top rounded-xl border border-white/10 bg-[#161618] p-1.5 shadow-2xl transition-all duration-150 ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        }`}
      >
        {options.map((o, i) => {
          const sel = o.key === value
          return (
            <button
              key={o.key}
              type="button"
              role="option"
              aria-selected={sel}
              onClick={() => select(o.key)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                sel ? "bg-sky-500/15 font-semibold text-sky-300" : i === activeIndex ? "bg-white/5 text-zinc-100" : "text-zinc-400"
              }`}
            >
              <span className="flex-1 truncate">{o.label}</span>
              {sel && <Check className="h-3.5 w-3.5 text-sky-400" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}