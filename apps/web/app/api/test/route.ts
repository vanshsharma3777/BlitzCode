// app/api/problems/graph-medium/route.ts
import { NextResponse } from "next/server"
import { and, between, arrayContains, sql } from "drizzle-orm"
import { db, problems } from "@repo/db" // apna sahi import path do

export const runtime = "nodejs"

export async function GET() {
  try {
    const rows = await db
      .select({
        id: problems.id,
        name: problems.name,
        description: problems.description,
        cfRating: problems.cfRating,
        cfTags: problems.cfTags,
        timeLimit: problems.timeLimit,
        memoryLimitBytes: problems.memoryLimitBytes,
        publicTests: problems.publicTests,
      })
      .from(problems)
      .where(
        and(
          arrayContains(problems.cfTags, ["graphs"]),
          between(problems.cfRating, 1200, 1800)
        )
      )
      .orderBy(sql`random()`)
      .limit(10)

    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 })
  }
}