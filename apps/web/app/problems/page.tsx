// app/problems/page.tsx
"use client"

import axios from "axios"
import { useEffect, useState } from "react"

type Problem = {
  id: string
  name: string
  difficulty: number | null
  cfRating: number | null
  cfTags: string[] | null
}

type Response = {
  items: Problem[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function ProblemsPage() {
  const [data, setData] = useState<Response | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [q, setQ] = useState("") 
  const [tag, setTag] = useState("")
  const [minRating, setMinRating] = useState("")
  const [maxRating, setMaxRating] = useState("")

useEffect(() => {
  const controller = new AbortController()

  const params: Record<string, string | number> = { page, limit: 20 }
  if (q) params.q = q
  if (tag) params.tag = tag
  if (minRating) params.minRating = minRating
  if (maxRating) params.maxRating = maxRating

  setLoading(true)
  setError("")

  axios.get<Response>("/api/problems", { params, signal: controller.signal })
    .then((res) => {
      console.log("data", res.data)
      setData(res.data)
    })
    .catch((e) => {
      if (axios.isCancel(e)) return 
      setError(e.response?.data?.error ?? e.message ?? "Failed to load")
    })
    .finally(() => setLoading(false))

  return () => controller.abort() 
}, [page, q, tag, minRating, maxRating])

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setQ(search)
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Problems</h1>

      <form onSubmit={applySearch} style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0" }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={tag}
          onChange={(e) => {
            setPage(1)
            setTag(e.target.value)
          }}
        >
          <option value="">All tags</option>
          <option value="graphs">graphs</option>
          <option value="dp">dp</option>
          <option value="greedy">greedy</option>
          <option value="math">math</option>
          <option value="implementation">implementation</option>
          <option value="strings">strings</option>
          <option value="trees">trees</option>
        </select>
        <input
          type="number"
          placeholder="Min rating"
          value={minRating}
          onChange={(e) => {
            setPage(1)
            setMinRating(e.target.value)
          }}
          style={{ width: 110 }}
        />
        <input
          type="number"
          placeholder="Max rating"
          value={maxRating}
          onChange={(e) => {
            setPage(1)
            setMaxRating(e.target.value)
          }}
          style={{ width: 110 }}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && data?.items.length === 0 && <p>No problems found.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {data?.items.map((p) => (
          <li
            key={p.id}
            style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, marginBottom: 8 }}
          >
            <a href={`/problems/${p.id}`} style={{ fontWeight: 600 }}>
              {p.name}
            </a>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Rating: {p.cfRating ?? "-"} &nbsp;|&nbsp; Tags:{" "}
              {p.cfTags?.length ? p.cfTags.join(", ") : "-"}
            </div>
          </li>
        ))}
      </ul>

      {data && (
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", marginTop: 16 }}>
          <button disabled={!data.hasPrev || loading} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            Page {data.page} / {data.totalPages || 1} ({data.total} problems)
          </span>
          <button disabled={!data.hasNext || loading} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  )
}