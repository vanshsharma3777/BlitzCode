import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db, problems } from "@repo/db" // apna sahi path
import { parseLimits, toCases } from "../../../../lib/configs/judge"

export const runtime = "nodejs"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Invalid problem id" }, { status: 400 })

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

    return NextResponse.json({
      id: p.id,
      name: p.name,
      description: p.description,
      difficulty: p.difficulty,
      cfRating: p.cfRating,
      cfTags: p.cfTags ?? [],
      timeLimitSec: limits.timeSec,
      memoryLimitMb: Math.round(limits.memoryKb / 1024),
      examples: toCases(p.publicTests, "public").map((t) => ({ input: t.input, output: t.expected })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to load problem" }, { status: 500 })
  }
}