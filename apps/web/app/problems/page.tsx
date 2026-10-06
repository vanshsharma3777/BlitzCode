"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { AlertTriangle, Layers } from "lucide-react"
import { FilterState, ProblemsApiResponse } from "../../types/problem"
import { Pagination } from "../../components/problems/Pagination"
import { ProblemTable } from "../../components/problems/ProblemTable"
import { ProblemFilter } from "../../components/problems/ProblemFilter"
import { Panel } from "../../components/ProfileUI"

export default function ProblemsPage() {
  const [data, setData] = useState<ProblemsApiResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  const [page, setPage] = useState<number>(1)
  const [filters, setFilters] = useState<FilterState>({ q: "", tag: "", minRating: "", maxRating: "" })

  useEffect(() => {
    const controller = new AbortController()

    const params: Record<string, string | number> = { page, limit: 20 }
    if (filters.q) params.q = filters.q
    if (filters.tag) params.tag = filters.tag
    if (filters.minRating) params.minRating = filters.minRating
    if (filters.maxRating) params.maxRating = filters.maxRating

    setLoading(true)
    setError("")

    axios
      .get<ProblemsApiResponse>("/api/problems", { params, signal: controller.signal })
      .then((res) => {
        setData(res.data)
      })
      .catch((e) => {
        if (axios.isCancel(e)) return
        setError(e.response?.data?.error ?? e.message ?? "Failed to load problems")
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [page, filters])

  const handleApplyFilters = (newFilters: FilterState) => {
    setPage(1)
    setFilters(newFilters)
  }

  return (
    <main className="min-h-screen bg-[#0d0d0c] px-4 py-8 text-zinc-200 md:px-8">
      <div className="mx-auto max-w-[1250px]">
        <Panel accent="sky" className="mb-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/25 to-sky-500/5 shadow-[0_0_22px_-4px_rgba(56,189,248,0.55)]">
                <Layers className="h-6 w-6 text-sky-400" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Problemset</h1>
                <p className="mt-1 max-w-xl text-sm text-zinc-400">
                  Find your next problem by rating and topic. The colour on each row shows its Codeforces tier.
                </p>
              </div>
            </div>

            {data && (
              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center">
                <p className="text-2xl font-extrabold text-white">{data.total.toLocaleString()}</p>
                <p className="text-xs text-sky-300">problems</p>
              </div>
            )}
          </div>
        </Panel>

        <ProblemFilter onApplyFilters={handleApplyFilters} />

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <ProblemTable problems={data?.items ?? []} loading={loading} />

        {data && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            hasNext={data.hasNext}
            hasPrev={data.hasPrev}
            loading={loading}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        <footer className="py-10 text-center text-xs text-zinc-700">Problemset powered by BlitzCode</footer>
      </div>
    </main>
  )
}