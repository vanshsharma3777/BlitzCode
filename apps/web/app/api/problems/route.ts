// app/api/problems/route.ts
import { NextResponse } from "next/server"
import { and, asc, between, gte, lte, arrayContains, sql, SQL, eq, inArray } from "drizzle-orm"
import { db, problems, submissions } from "@repo/db"
import { redis } from "../../../lib/configs/redis"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/configs/authOptions"

export const runtime = "nodejs"

const CACHE_TTL_SEC = 60 * 60 * 24
const VERSION_KEY = "problems:list:version"

const toNum = (v: string | null) => {
  if (v === null || v === "") return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

// Cache mein solved nahi hota (sab users ke liye shared hai),
// isliye response bhejne se pehle har user ke hisaab se merge karte hain.
async function withSolved<T extends { items: { id: string }[] }>(
  payload: T,
  userId: string | null
) {
  const unsolved = () => ({
    ...payload,
    items: payload.items.map((p) => ({ ...p, solved: false })),
  })

  if (!userId || payload.items.length === 0) return unsolved()

  try {
    const rows = await db
      .selectDistinct({ id: submissions.problemId })
      .from(submissions)
      .where(
        and(
          eq(submissions.userId, userId),
          inArray(submissions.problemId, payload.items.map((p) => p.id))
        )
      )

    const solved = new Set(rows.map((r) => r.id))
    return {
      ...payload,
      items: payload.items.map((p) => ({ ...p, solved: solved.has(p.id) })),
    }
  } catch (err) {
    console.error("Failed to load solved problems:", err)
    return unsolved() // solved fail hone par bhi list dikhni chahiye
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id
    console.log("session" , session?.user.id)
    if(!userId)
      return NextResponse.json({
    error:"Session Not found"
  })

    const sp = new URL(req.url).searchParams

    const page = Math.max(1, Number(sp.get("page")) || 1)
    const limit = Math.min(50, Math.max(1, Number(sp.get("limit")) || 20))
    const offset = (page - 1) * limit

    const tag = sp.get("tag")?.trim() || undefined
    const q = sp.get("q")?.trim() || undefined
    const minRating = toNum(sp.get("minRating"))
    const maxRating = toNum(sp.get("maxRating"))

    let key: string | null = null
    try {
      const version = (await redis.get(VERSION_KEY)) ?? "0"
      key = `problems:list:v${version}:${JSON.stringify({
        page,
        limit,
        tag: tag ?? null,
        q: q?.toLowerCase() ?? null,
        minRating: minRating ?? null,
        maxRating: maxRating ?? null,
      })}`

      const cached = await redis.get(key)
      if (cached) {
        console.log("cache hit")
        const data = typeof cached === "string" ? JSON.parse(cached) : cached

        return NextResponse.json(await withSolved(data, userId), {
          headers: { "X-Cache": "HIT", "Cache-Control": "private, no-store" },
        })
      }
    } catch (err) {
      console.error("Redis get failed:", err)
      key = null
    }
    console.log("cache miss")

    const conditions: SQL[] = []
    if (tag) conditions.push(arrayContains(problems.cfTags, [tag]))
    if (minRating !== undefined && maxRating !== undefined)
      conditions.push(between(problems.cfRating, minRating, maxRating))
    else if (minRating !== undefined) conditions.push(gte(problems.cfRating, minRating))
    else if (maxRating !== undefined) conditions.push(lte(problems.cfRating, maxRating))
    if (q)
      conditions.push(
        sql`to_tsvector('english', ${problems.name} || ' ' || ${problems.description}) @@ plainto_tsquery('english', ${q})`
      )

    const where = conditions.length ? and(...conditions) : undefined

    const [items, countRows] = await Promise.all([
      db
        .select({
          id: problems.id,
          name: problems.name,
          difficulty: problems.difficulty,
          cfRating: problems.cfRating,
          cfTags: problems.cfTags,
        })
        .from(problems)
        .where(where)
        .orderBy(asc(problems.id))
        .limit(limit)
        .offset(offset),
      db.select({ total: sql<number>`count(*)::int` }).from(problems).where(where),
    ])

    const total = countRows[0]?.total ?? 0
    const totalPages = Math.ceil(total / limit)

    const payload = {
      items,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }

    if (key) {
      redis
        .set(key, JSON.stringify(payload), { ex: CACHE_TTL_SEC })
        .catch((err) => console.error("Redis set failed:", err))
      console.log("redis stored")
    }

    return NextResponse.json(await withSolved(payload, userId), {
      headers: { "X-Cache": "MISS", "Cache-Control": "private, no-store" },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 })
  }
}