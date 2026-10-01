"use client"

import { Clock, Cpu, Info } from "lucide-react"

export interface DistributionBucket {
  /** bucket start value (ms for runtime, MB for memory) */
  value: number
  /** how many accepted submissions fall in this bucket */
  count: number
}

interface ComplexityChartProps {
  kind: "runtime" | "memory"
  value: number | null | undefined
  unit: string
  percentile?: number | null
  distribution?: DistributionBucket[] | null
  /** time limit (ms) or memory limit (MB); used for the usage bar when no distribution exists */
  limit?: number | null
}

const META = {
  runtime: { title: "Runtime", Icon: Clock, empty: "No runtime was recorded for this submission." },
  memory: { title: "Memory", Icon: Cpu, empty: "No memory usage was recorded for this submission." },
}

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

function Note({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-3 text-xs text-zinc-500">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />
      <span>{text}</span>
    </div>
  )
}

export function ComplexityChart({ kind, value, unit, percentile, distribution, limit }: ComplexityChartProps) {
  const { title, Icon, empty } = META[kind]
  const hasValue = typeof value === "number" && Number.isFinite(value)
  const hasPercentile = typeof percentile === "number" && Number.isFinite(percentile)
  const hasChart = !!distribution && distribution.length >= 2 && distribution.some((b) => b.count > 0)
  const hasLimit = typeof limit === "number" && limit > 0
  const pct = hasLimit && hasValue ? Math.min(100, ((value as number) / (limit as number)) * 100) : 0

  let youIdx = 0
  let max = 1
  if (hasChart && hasValue) {
    max = Math.max(...distribution!.map((b) => b.count))
    distribution!.forEach((b, i) => {
      if (b.value <= (value as number)) youIdx = i
    })
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-sky-500/25 bg-sky-500/10">
          <Icon className="h-3.5 w-3.5 text-sky-400" />
        </div>
        <span className="text-sm font-semibold text-zinc-300">{title}</span>
      </div>

      {!hasValue ? (
        <Note text={empty} />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-zinc-100">{fmt(value as number)}</span>
              <span className="text-sm text-zinc-500">{unit}</span>
            </div>

            {hasPercentile ? (
              <div className="min-w-[150px]">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Beats</span>
                  <span className="font-bold text-sky-300">{(percentile as number).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-sky-400"
                    style={{ width: `${Math.min(100, Math.max(0, percentile as number))}%` }}
                  />
                </div>
              </div>
            ) : (
              <span className="text-xs text-zinc-600">Percentile not available yet</span>
            )}
          </div>

          {hasChart ? (
            <div>
              <div className="flex h-28 items-end gap-[3px] pt-5">
                {distribution!.map((b, i) => {
                  const you = i === youIdx
                  return (
                    <div key={i} className="group relative flex h-full flex-1 items-end">
                      {you && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-sky-500/20 px-1.5 text-[10px] font-bold text-sky-300">
                          You
                        </span>
                      )}
                      <div
                        title={`${fmt(b.value)} ${unit} · ${b.count} submissions`}
                        className={`w-full rounded-t-sm transition-colors ${you ? "bg-sky-400" : "bg-white/10 group-hover:bg-sky-400/40"}`}
                        style={{ height: `${Math.max(4, (b.count / max) * 100)}%` }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
                <span>{fmt(distribution![0]!.value)} {unit}</span>
                <span>{fmt(distribution![distribution!.length - 1]!.value)} {unit}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {hasLimit && (
                <div>
                  <div className="mb-1.5 flex justify-between text-xs text-zinc-500">
                    <span>Used {pct.toFixed(1)}% of limit</span>
                    <span>Limit {fmt(limit as number)} {unit}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.max(2, pct)}%` }} />
                  </div>
                </div>
              )}
              <Note text="Not enough accepted submissions yet to build a distribution. Yours could be one of the first!" />
            </div>
          )}
        </>
      )}
    </div>
  )
}