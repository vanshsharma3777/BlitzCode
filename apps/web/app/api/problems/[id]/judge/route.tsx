import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db, problems, problemTests } from "@repo/db" // problemTests bhi export hona chahiye
import { isLanguage } from "../../../../../types/languages"
import { judge, JudgeUnavailable, parseLimits, TestCase, toCases } from "../../../../../lib/configs/judge"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_CODE = 64 * 1024
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const fail = (status: number, error: string) => NextResponse.json({ error }, { status })

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID_RE.test(id)) return fail(400, "Invalid problem id")

  const body = (await req.json().catch(() => null)) as
    | { language?: unknown; code?: unknown; mode?: unknown }
    | null
  if (!body) return fail(400, "Invalid request body")

  const { language, code, mode } = body
  if (!isLanguage(language)) return fail(400, "Unsupported language")
  if (typeof code !== "string" || !code.trim()) return fail(400, "Code is empty")
  if (code.length > MAX_CODE) return fail(413, "Code is too large (max 64 KB)")
  if (mode !== "run" && mode !== "submit") return fail(400, "mode must be 'run' or 'submit'")

  try {
    const [problem] = await db
      .select({
        timeLimit: problems.timeLimit,
        memoryLimitBytes: problems.memoryLimitBytes,
        publicTests: problems.publicTests,
      })
      .from(problems)
      .where(eq(problems.id, id))
      .limit(1)
    if (!problem) return fail(404, "Problem not found")

    let tests: TestCase[] = toCases(problem.publicTests, "public")

    if (mode === "submit") {
      const [hidden] = await db
        .select({ priv: problemTests.privateTests, gen: problemTests.generatedTests })
        .from(problemTests)
        .where(eq(problemTests.problemId, id))
        .limit(1)
      tests = [...tests, ...toCases(hidden?.priv, "private"), ...toCases(hidden?.gen, "generated")]
    }

    if (tests.length === 0) return fail(422, "This problem has no test cases")

    const limits = parseLimits(problem.timeLimit, problem.memoryLimitBytes)
    const results = await judge({
      code,
      language,
      tests,
      timeLimitSec: limits.timeSec,
      memoryLimitKb: limits.memoryKb,
    })

    const ce = results.find((r) => r.verdict === "CE")
    if (ce) {
      return NextResponse.json({
        mode,
        verdict: "CE",
        passed: 0,
        total: tests.length,
        compile: ce.compile || "Compilation failed",
      })
    }

    const passed = results.filter((r) => r.verdict === "AC").length
    const firstFail = results.findIndex((r) => r.verdict !== "AC")
    const failedResult = firstFail >= 0 ? results[firstFail] : undefined
    const failedTest = firstFail >= 0 ? tests[firstFail] : undefined
    const verdict = failedResult?.verdict ?? "AC"

    if (mode === "run") {

      return NextResponse.json({
        mode,
        verdict,
        passed,
        total: tests.length,
        results: tests.map((t, i) => {
          const r = results[i]
          return {
            index: i + 1,
            verdict: r?.verdict ?? "ERR",
            input: t.input,
            expected: t.expected,
            stdout: r?.stdout ?? "",
            stderr: r?.stderr ?? "",
            timeMs: r?.timeMs ?? null,
            memoryKb: r?.memoryKb ?? null,
          }
        }),
      })
    }

    return NextResponse.json({
      mode,
      verdict,
      passed,
      total: tests.length,
      failed:
        failedResult && failedTest
          ? {
              index: firstFail + 1,
              isPublic: failedTest.group === "public",
              verdict: failedResult.verdict,
            }
          : null,
      maxTimeMs: Math.max(0, ...results.map((r) => r.timeMs ?? 0)),
      maxMemoryKb: Math.max(0, ...results.map((r) => r.memoryKb ?? 0)),
    })
  } catch (err) {
    if (err instanceof JudgeUnavailable) {
      console.error("Judge:", err.message)
      return fail(503, "Judge is unavailable right now. Please try again in a moment.")
    }
    console.error(err)
    return fail(500, "Something went wrong while judging")
  }
}