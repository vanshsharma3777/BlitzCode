"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  hasNext: boolean
  hasPrev: boolean
  loading: boolean
  onPageChange: (newPage: number) => void
}

const BTN =
  "flex h-10 cursor-pointer items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-zinc-200 transition hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-white/[0.04]"

export function Pagination({ page, totalPages, total, hasNext, hasPrev, loading, onPageChange }: PaginationProps) {
  const pages = Math.max(totalPages || 1, 1)

  return (
    <div className="mt-5 flex flex-col items-center justify-between gap-4 px-1 sm:flex-row">
      <div className="text-sm text-zinc-500">
        <span className="font-semibold text-zinc-200">{total.toLocaleString()}</span> problems · page{" "}
        <span className="font-semibold text-zinc-200">{page}</span> of {pages}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => onPageChange(page - 1)} disabled={!hasPrev || loading} className={BTN}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {/* progress through the set */}
        <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.06] sm:block">
          <div className="h-full rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-all duration-300" style={{ width: `${(page / pages) * 100}%` }} />
        </div>

        <button onClick={() => onPageChange(page + 1)} disabled={!hasNext || loading} className={BTN}>
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}