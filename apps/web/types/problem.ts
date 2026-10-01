import type { LanguageKey } from "./languages"

export type Verdict = "AC" | "WA" | "TLE" | "RE" | "CE" | "ERR"

export type TestCase = { input: string; expected: string; group: "public" | "private" | "generated" }

export type TestResult = {
  verdict: Verdict
  stdout: string
  stderr: string
  compile: string
  timeMs: number | null
  memoryKb: number | null
}

export type Problem = {
  id: string
  name: string
  description: string
  cfRating: number | null
  cfTags: string[]
  timeLimitSec: number
  memoryLimitMb: number
  examples: { input: string; output: string }[]
  solved : boolean
}

export type ProblemsApiResponse = {
  items: Problem[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type FilterState = {
  q: string
  tag: string
  minRating: string
  maxRating: string
}


export type DistributionBucket = { value: number; count: number }

export type JudgeResponse = {
  mode: "run" | "submit"
  verdict: Verdict
  passed: number
  total: number
  compile?: string
  results?: {
    index: number
    verdict: Verdict
    input: string
    expected: string
    stdout: string
    stderr: string
    timeMs: number | null
  }[]
  failed?: { index: number; isPublic: boolean; verdict: Verdict } | null
  maxTimeMs?: number
  maxMemoryKb?: number
  // optional, backend se bhejoge to graphs chalu ho jayenge
  runtimePercentile?: number | null
  memoryPercentile?: number | null
  runtimeDistribution?: DistributionBucket[] | null
  memoryDistribution?: DistributionBucket[] | null
}

export interface ProblemWorkspaceProps {
  problem: Problem
  language: LanguageKey
  onLanguageChange: (lang: LanguageKey) => void
  code: string
  onCodeChange: (value: string | undefined) => void
  onReset: () => void
  busy: "run" | "submit" | null
  onRun: () => void
  onSubmit: () => void
  result: JudgeResponse | null
  error: string
  lastMode: "run" | "submit" | null
}

/* ---------- Legacy (optional, abhi koi component use nahi karta) ---------- */

export interface RunCase {
  input: string
  expected: string
  output: string
  passed: boolean
}

export interface RunResult {
  status: "ok" | "compile_error" | "runtime_error" | "error"
  message?: string
  cases: RunCase[]
}

export interface SubmissionResult {
  verdict: string
  accepted: boolean
  passed: number
  total: number
  runtimeMs: number | null
  memoryMb: number | null
  runtimePercentile?: number | null
  memoryPercentile?: number | null
  runtimeDistribution?: DistributionBucket[] | null
  memoryDistribution?: DistributionBucket[] | null
  message?: string
}