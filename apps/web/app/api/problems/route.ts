// app/api/problems/route.ts
import { NextResponse } from "next/server"
import { and, asc, between, gte, lte, arrayContains, sql, SQL } from "drizzle-orm"
import { db, problems } from "@repo/db" // apna sahi import path do

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const sp = new URL(req.url).searchParams

    const page = Math.max(1, Number(sp.get("page")) || 1)
    const limit = Math.min(50, Math.max(1, Number(sp.get("limit")) || 20))
    const offset = (page - 1) * limit

    const tag = sp.get("tag")
    const q = sp.get("q")
    const minRating = sp.get("minRating")
    const maxRating = sp.get("maxRating")

    const conditions: SQL[] = []
    if (tag) conditions.push(arrayContains(problems.cfTags, [tag]))
    if (minRating && maxRating)
      conditions.push(between(problems.cfRating, Number(minRating), Number(maxRating)))
    else if (minRating) conditions.push(gte(problems.cfRating, Number(minRating)))
    else if (maxRating) conditions.push(lte(problems.cfRating, Number(maxRating)))
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
  db
    .select({ total: sql<number>`count(*)::int` })
    .from(problems)
    .where(where),
])

const total = countRows[0]?.total ?? 0
const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      items,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 })
  }
}