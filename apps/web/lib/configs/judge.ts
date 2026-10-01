import { LanguageKey, LANGUAGES } from "../../types/languages";
import { TestCase, TestResult, Verdict } from "../../types/problem";


export class JudgeUnavailable extends Error {}

const BASE = process.env.JUDGE0_URL
const KEY = process.env.JUDGE0_KEY
const BATCH_SIZE = 20 
const POLL_MS = 700
const POLL_MAX = 45

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64")
const unb64 = (s: string | null | undefined) => (s ? Buffer.from(s, "base64").toString("utf8") : "")
const clip = (s: string, n = 2000) => (s.length > n ? s.slice(0, n) + "\n…(truncated)" : s)
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))


export function toCases(raw: unknown, group: TestCase["group"]): TestCase[] {
  const t = raw as { input?: unknown; output?: unknown } | null
  if (!t || !Array.isArray(t.input) || !Array.isArray(t.output)) return []
  const cases: TestCase[] = []
  for (let i = 0; i < t.input.length; i++) {
    const input = t.input[i]
    const expected = t.output[i]
    if (typeof input === "string" && typeof expected === "string") {
      cases.push({ input, expected, group })
    }
  }
  return cases
}

export function parseLimits(timeLimit: unknown, memoryBytes: number | null) {
  const t = timeLimit as { seconds?: number | string; nanos?: number } | null
  const sec = Number(t?.seconds ?? 0) + Number(t?.nanos ?? 0) / 1e9
  return {
    timeSec: sec > 0 ? sec : 2,
    memoryKb: memoryBytes && memoryBytes > 0 ? Math.round(memoryBytes / 1024) : 262144,
  }
}

// whitespace/line-ending ka farak ignore karta hai (tokens compare)
const tokens = (s: string) => s.trim().split(/\s+/).filter(Boolean)
export function sameOutput(actual: string, expected: string) {
  const a = tokens(actual)
  const b = tokens(expected)
  return a.length === b.length && a.every((tok, i) => tok === b[i])
}


async function call<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) throw new JudgeUnavailable("Judge server is not configured")
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (KEY) {
    headers["X-RapidAPI-Key"] = KEY
    headers["X-RapidAPI-Host"] = new URL(BASE).host
  }
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers, cache: "no-store" })
  } catch {
    throw new JudgeUnavailable("Judge server unreachable")
  }
  if (!res.ok) throw new JudgeUnavailable(`Judge server error (${res.status})`)
  return (await res.json()) as T
}

type Raw = {
  token: string
  status: { id: number }
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  time: string | null
  memory: number | null
}

async function runBatch(
  code: string,
  language: LanguageKey,
  chunk: TestCase[],
  cfg: { cpuSec: number; memoryKb: number }
): Promise<Raw[]> {
  const created = await call<{ token?: string }[]>("/submissions/batch?base64_encoded=true", {
    method: "POST",
    body: JSON.stringify({
      submissions: chunk.map((t) => ({
        source_code: b64(code),
        language_id: LANGUAGES[language].id,
        stdin: b64(t.input),
        cpu_time_limit: cfg.cpuSec,
        wall_time_limit: Math.min(cfg.cpuSec * 2 + 2, 20),
        memory_limit: cfg.memoryKb,
      })),
    }),
  })

  const tokenList: string[] = []
  for (const c of created) {
    if (!c.token) throw new JudgeUnavailable("Judge rejected the submission")
    tokenList.push(c.token)
  }

  const fields = "token,status,stdout,stderr,compile_output,time,memory"
  for (let i = 0; i < POLL_MAX; i++) {
    await sleep(POLL_MS)
    const r = await call<{ submissions: Raw[] }>(
      `/submissions/batch?tokens=${tokenList.join(",")}&base64_encoded=true&fields=${fields}`
    )
    if (r.submissions.every((s) => s.status.id > 2)) {
      const byToken = new Map(r.submissions.map((s) => [s.token, s]))
      return tokenList.map((tk) => byToken.get(tk)).filter((s): s is Raw => !!s)
    }
  }
  throw new JudgeUnavailable("Judge timed out")
}

function toResult(raw: Raw, expected: string): TestResult {
  const stdout = unb64(raw.stdout)
  const id = raw.status.id
  let verdict: Verdict
  if (id === 3) verdict = sameOutput(stdout, expected) ? "AC" : "WA"
  else if (id === 5) verdict = "TLE"
  else if (id === 6) verdict = "CE"
  else if (id >= 7 && id <= 12) verdict = "RE"
  else verdict = "ERR"

  return {
    verdict,
    stdout: clip(stdout),
    stderr: clip(unb64(raw.stderr)),
    compile: clip(unb64(raw.compile_output), 4000),
    timeMs: raw.time ? Math.round(parseFloat(raw.time) * 1000) : null,
    memoryKb: raw.memory,
  }
}

export async function judge(opts: {
  code: string
  language: LanguageKey
  tests: TestCase[]
  timeLimitSec: number
  memoryLimitKb: number
}): Promise<TestResult[]> {
  const cfg = {
    cpuSec: clamp(opts.timeLimitSec * LANGUAGES[opts.language].timeMultiplier, 1, 15),
    memoryKb: clamp(opts.memoryLimitKb, 131072, 512000),
  }

  const results: TestResult[] = []
  for (let i = 0; i < opts.tests.length; i += BATCH_SIZE) {
    const chunk = opts.tests.slice(i, i + BATCH_SIZE)
    const raws = await runBatch(opts.code, opts.language, chunk, cfg)
    chunk.forEach((t, j) => {
      const raw = raws[j]
      results.push(
        raw
          ? toResult(raw, t.expected)
          : { verdict: "ERR", stdout: "", stderr: "", compile: "", timeMs: null, memoryKb: null }
      )
    })
    if (results.some((r) => r.verdict === "CE")) break
  }
  return results
}


