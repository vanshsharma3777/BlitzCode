
import { and, eq, inArray } from "drizzle-orm"
import { db, problems, submissions } from "@repo/db"


async function withSolved<T extends { items: { id: string }[] }>(
  payload: T,
  userId: string | null
) {
  if (!userId || payload.items.length === 0) {
    return { ...payload, items: payload.items.map((p) => ({ ...p, solved: false })) }
  }

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
  return { ...payload, items: payload.items.map((p) => ({ ...p, solved: solved.has(p.id) })) }
}