import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db, problems } from "@repo/db"
import { parseLimits, toCases } from "../../../../lib/configs/judge"
import { redis } from "../../../../lib/configs/redis"

export const runtime = "nodejs"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const CACHE_TTL_SEC = 60 * 60*24
const cacheKey = (id: string) => `problem:${id}`

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Invalid problem id" }, { status: 400 })

  const key = cacheKey(id)
  try {
    const cached = await redis.get(key)
    if (cached) {
      const data = typeof cached === "string" ? JSON.parse(cached) : cached
      return NextResponse.json(data, { headers: { "X-Cache": "HIT" } })
    }
  } catch (err) {
    console.error("Redis get failed:", err)
  }
  try {
    const [p] = await db
      .select({
        id: problems.id,
        name: problems.name,
        description: problems.description,
        difficulty: problems.difficulty,
        cfRating: problems.cfRating,
        cfTags: problems.cfTags,
        timeLimit: problems.timeLimit,
        memoryLimitBytes: problems.memoryLimitBytes,
        publicTests: problems.publicTests,
        
      })
      .from(problems)
      .where(eq(problems.id, id))
      .limit(1)

    if (!p) return NextResponse.json({ error: "Problem not found" }, { status: 404 })

    const limits = parseLimits(p.timeLimit, p.memoryLimitBytes)

    const payload = {
      id: p.id,
      name: p.name,
      description: p.description,
      difficulty: p.difficulty,
      cfRating: p.cfRating,
      cfTags: p.cfTags ?? [],
      timeLimitSec: limits.timeSec,
      memoryLimitMb: Math.round(limits.memoryKb / 1024),
      examples: toCases(p.publicTests, "public").map((t) => ({ input: t.input, output: t.expected })),
    }

    redis.set(key, JSON.stringify(payload),{
         ex: CACHE_TTL_SEC
      })
      .catch((err) => console.error("Redis set failed:", err))
      console.log("redis stored ")
    return NextResponse.json(payload, { headers: { "X-Cache": "MISS" } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to load problem" }, { status: 500 })
  }
}