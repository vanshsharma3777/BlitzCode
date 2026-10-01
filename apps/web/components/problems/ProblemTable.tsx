"use client"

import Link from "next/link"
import { ArrowUpRight, Hash, SearchX, Check } from "lucide-react"
import { Problem } from "../../types/problem"
import { tierForRating } from "../../utils/rankCF"

interface ProblemTableProps {
  problems: Problem[]
  loading: boolean
}

const MAX_VISIBLE_TAGS = 3
const SHELL = "relative overflow-hidden rounded-3xl border border-white/10 bg-[#121212]/80 shadow-2xl backdrop-blur-xl"
const COLS = "md:grid-cols-[minmax(0,1.4fr)_170px_minmax(0,1fr)_24px]"

function TopLine() {
  return <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-80" />
}

export function ProblemTable({ problems, loading }: ProblemTableProps) {
  if (loading) {
    return (
      <div className={SHELL}>
        <TopLine />
        <div className="space-y-2 p-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex animate-pulse items-center gap-4 rounded-2xl bg-white/[0.03] px-5 py-4">
              <div className="h-3 w-1/3 rounded-full bg-white/[0.06]" />
              <div className="ml-auto hidden h-6 w-24 rounded-full bg-white/[0.06] md:block" />
              <div className="hidden h-6 w-40 rounded-full bg-white/[0.06] md:block" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className={`${SHELL} p-14 text-center`}>
        <TopLine />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/25 bg-sky-500/10">
          <SearchX className="h-6 w-6 text-sky-400" />
        </div>
        <p className="text-lg font-bold text-white">No problems match</p>
        <p className="mt-1 text-sm text-zinc-500">Widen the rating range, pick another tag, or clear the search.</p>
      </div>
    )
  }

  return (
    <div className={SHELL}>
      <TopLine />

      {/* column heads (desktop only) */}
      <div className={`hidden gap-4 border-b border-white/[0.07] px-6 py-3 text-xs font-medium text-zinc-500 md:grid ${COLS}`}>
        <span>Problem</span>
        <span>Rating</span>
        <span>Tags</span>
        <span />
      </div>

      <ul className="divide-y divide-white/[0.05]">
        {problems.map((p) => {
          const tags = p.cfTags?.filter((t) => t.trim().length > 0) ?? []
          const shown = tags.slice(0, MAX_VISIBLE_TAGS)
          const extra = tags.length - shown.length
          const tier = p.cfRating ? tierForRating(p.cfRating) : null
          const color = tier?.color ?? "#71717a"
          const edge = p.solved ? "#34d399" : color // solved par edge green

          return (
            <li key={p.id}>
              <Link
                href={`/problems/${p.id}`}
                className={`group relative grid items-center gap-x-4 gap-y-2 px-6 py-4 transition-colors ${COLS} ${
                  p.solved
                    ? "bg-gradient-to-r from-emerald-500/[0.12] via-emerald-500/[0.04] to-transparent hover:from-emerald-500/[0.18]"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                {/* left edge: solved = green + always tall, else rating colour, grows on hover */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full transition-all duration-200 ${
                    p.solved
                      ? "h-10 w-[4px] opacity-100"
                      : "h-6 w-[3px] opacity-60 group-hover:h-10 group-hover:opacity-100"
                  }`}
                  style={{ background: edge, boxShadow: `0 0 10px ${edge}99` }}
                />

                {/* problem name + solved indicators */}
                <span className="flex min-w-0 items-center gap-2.5">
                  {p.solved && (
                    <span
                      aria-label="Solved"
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]"
                    >
                      <Check className="h-3.5 w-3.5 text-[#0d0d0c]" strokeWidth={3} />
                    </span>
                  )}

                  <span
                    className={`truncate text-sm font-semibold transition-colors ${
                      p.solved ? "text-emerald-100" : "text-zinc-200 group-hover:text-white"
                    }`}
                  >
                    {p.name}
                  </span>

                  {p.solved && (
                    <span className="hidden shrink-0 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 sm:inline">
                      Solved
                    </span>
                  )}
                </span>

                <span className="inline-flex w-fit items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                  <span className="font-mono font-bold" style={{ color }}>{p.cfRating || "N/A"}</span>
                  {tier && <span className="hidden text-xs text-zinc-500 lg:inline">{tier.name}</span>}
                </span>

                <span className="flex flex-wrap items-center gap-1.5">
                  {shown.length > 0 ? (
                    <>
                      {shown.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-zinc-400 transition-colors group-hover:border-sky-500/25 group-hover:text-zinc-200">
                          <Hash className="h-2.5 w-2.5 text-sky-400" />
                          {t.trim()}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span title={tags.slice(MAX_VISIBLE_TAGS).join(", ")} className="rounded-md bg-sky-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-sky-300">
                          +{extra}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-zinc-600">No tags</span>
                  )}
                </span>

                <ArrowUpRight className="hidden h-4 w-4 text-zinc-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-400 md:block" />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}