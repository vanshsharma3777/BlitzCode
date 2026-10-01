"use client"

import React, { useState, useRef, useEffect } from "react"
import { Search, Filter, RotateCcw, Hash, ChevronDown, Check } from "lucide-react"
import { FilterState } from "../../types/problem"

interface ProblemFilterProps {
  onApplyFilters: (filters: FilterState) => void
}

const TAG_OPTIONS = ["graphs", "dp", "greedy", "math", "implementation", "strings", "trees"]

const INPUT =
  "bg-white/[0.04] border border-white/10 text-zinc-100 placeholder-zinc-500 text-sm rounded-xl px-3 h-11 outline-none transition-all focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/15"

/* ---------------- Tag dropdown ---------------- */

function TagDropdown({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const items = ["", ...options]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const toggle = () => {
    if (!open) setActiveIndex(Math.max(0, items.indexOf(value)))
    setOpen((o) => !o)
  }

  const select = (v: string) => {
    onChange(v)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!open) return toggle()
      setActiveIndex((i) => (i + 1) % items.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (!open) return toggle()
      setActiveIndex((i) => (i - 1 + items.length) % items.length)
    } else if (e.key === "Enter" && open) {
      e.preventDefault()
      select(items[activeIndex]!)
    }
  }

  return (
    <div ref={ref} className="relative min-w-[170px]" onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-11 w-full cursor-pointer items-center gap-2 rounded-xl border bg-white/[0.04] px-3 text-sm outline-none transition-all ${
          open ? "border-sky-400/60 ring-2 ring-sky-500/15" : "border-white/10 hover:border-sky-500/30"
        }`}
      >
        <Hash className={`h-3.5 w-3.5 shrink-0 ${value ? "text-sky-400" : "text-zinc-500"}`} />
        <span className={`flex-1 truncate text-left ${value ? "text-zinc-100" : "text-zinc-400"}`}>{value || "All tags"}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180 text-sky-400" : ""}`} />
      </button>

      <div
        role="listbox"
        className={`absolute left-0 right-0 top-full z-30 mt-2 origin-top rounded-xl border border-white/10 bg-[#141416]/95 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-150 ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        }`}
      >
        <div className="max-h-60 space-y-0.5 overflow-y-auto [scrollbar-width:thin]">
          {items.map((item, i) => {
            const selected = item === value
            return (
              <button
                key={item || "all"}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => select(item)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                  selected ? "bg-sky-500/15 text-sky-300" : i === activeIndex ? "bg-white/5 text-zinc-100" : "text-zinc-400"
                }`}
              >
                <Hash className={`h-3 w-3 shrink-0 ${selected ? "text-sky-400" : "text-zinc-600"}`} />
                <span className="flex-1 truncate">{item || "All tags"}</span>
                {selected && <Check className="h-3.5 w-3.5 text-sky-400" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Filter bar ---------------- */

export function ProblemFilter({ onApplyFilters }: ProblemFilterProps) {
  const [search, setSearch] = useState("")
  const [tag, setTag] = useState("")
  const [minRating, setMinRating] = useState("")
  const [maxRating, setMaxRating] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApplyFilters({ q: search, tag, minRating, maxRating })
  }

  const handleReset = () => {
    setSearch("")
    setTag("")
    setMinRating("")
    setMaxRating("")
    onApplyFilters({ q: "", tag: "", minRating: "", maxRating: "" })
  }

  return (
    // No overflow-hidden here: the tag dropdown has to spill out of the card.
    <form
      onSubmit={handleSubmit}
      className="relative z-20 mb-5 flex flex-col items-stretch gap-3 rounded-2xl border border-white/10 bg-[#121212]/80 p-4 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center"
    >
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by problem name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${INPUT} w-full pl-10`}
        />
      </div>

      <TagDropdown value={tag} onChange={setTag} options={TAG_OPTIONS} />

      <div className="flex items-center gap-2">
        <input type="number" placeholder="Min rating" value={minRating} onChange={(e) => setMinRating(e.target.value)} className={`${INPUT} w-28`} />
        <span className="text-zinc-600">–</span>
        <input type="number" placeholder="Max rating" value={maxRating} onChange={(e) => setMaxRating(e.target.value)} className={`${INPUT} w-28`} />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="flex h-11 cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:shadow-sky-500/45 active:scale-[0.98]"
        >
          <Filter className="h-3.5 w-3.5" />
          Apply
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </form>
  )
}