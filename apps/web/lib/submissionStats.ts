import { sql } from "drizzle-orm"
import { db, submissions } from "@repo/db"

const BUCKETS = 20
const MIN_SAMPLES = 5 // isse kam accepted submissions hon to graph nahi banta (UI message dikhata hai)

type Bucket = { value: number; count: number }

// node-postgres => { rows: [...] }, postgres-js => [...]
const rowsOf = <T,>(res: unknown): T[] =>
  (res as { rows?: T[] }).rows ?? (res as T[])

async function metricStats(
  problemId: string,
  language: string,
  column: "runtime_ms" | "memory_kb",
  mine: number
): Promise<{ percentile: number; distribution: Bucket[] } | null> {
  const col = sql.raw(column)
  const where = sql`problem_id = ${problemId} AND language = ${language} AND verdict = 'AC' AND ${col} IS NOT NULL`

  const aggRes = await db.execute(sql`
    SELECT
      min(${col})::int AS min,
      max(${col})::int AS max,
      count(*)::int AS total,
      (count(*) FILTER (WHERE ${col} > ${mine}))::int AS slower
    FROM ${submissions}
    WHERE ${where}
  `)
  const agg = rowsOf<{ min: number | null; max: number | null; total: number; slower: number }>(aggRes)[0]
  if (!agg || agg.min == null || agg.max == null || agg.total < MIN_SAMPLES) return null

  const n = Math.max(2, Math.min(BUCKETS, agg.max - agg.min + 1))
  const hi = agg.max + 1
  const step = (hi - agg.min) / n

  const bucketRes = await db.execute(sql`
    SELECT
      width_bucket(${col}::numeric, ${agg.min}::numeric, ${hi}::numeric, ${n}::int) AS b,
      count(*)::int AS count
    FROM ${submissions}
    WHERE ${where}
    GROUP BY b
  `)
  const counts = new Map(
    rowsOf<{ b: number; count: number }>(bucketRes).map((r) => [Number(r.b), Number(r.count)])
  )

  // empty buckets bhi daalo, taaki histogram continuous dikhe
  const distribution: Bucket[] = Array.from({ length: n }, (_, i) => ({
    value: agg.min! + i * step,
    count: counts.get(i + 1) ?? 0,
  }))

  return { percentile: (agg.slower / agg.total) * 100, distribution }
}

export async function recordSubmission(input: {
  problemId: string
  language: string
  userId :string
  timeMs?: number | null
  runtimeMs?: number | null
  memoryKb?: number | null
}) {
 await db.insert(submissions).values({
  userId: input.userId,
  problemId: input.problemId,
  language: input.language,
  timeMs: input.timeMs ?? 0,
  memoryKb: input.memoryKb ?? 0,
});
}

/** Accepted submission ke baad call karo. Ye UI ke JudgeResponse ke optional fields return karta hai. */
export async function getSubmissionStats(
  problemId: string,
  language: string,
  runtimeMs: number,
  memoryKb: number
) {
  const [rt, mem] = await Promise.all([
    metricStats(problemId, language, "runtime_ms", Math.round(runtimeMs)),
    metricStats(problemId, language, "memory_kb", Math.round(memoryKb)),
  ])
  return {
    runtimePercentile: rt?.percentile ?? null,
    runtimeDistribution: rt?.distribution ?? null,
    memoryPercentile: mem?.percentile ?? null,
    // UI memory MB mein dikhata hai, DB mein KB hai
    memoryDistribution: mem ? mem.distribution.map((b) => ({ value: b.value / 1024, count: b.count })) : null,
  }
}