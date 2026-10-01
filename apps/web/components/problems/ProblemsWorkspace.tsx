"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import {
  Clock, Cpu, Hash, Play, Send, RotateCcw, Copy, Check, FileText, Trophy, Loader2,
  CheckCircle2, XCircle, Terminal, AlertTriangle, Maximize2, Minimize2, Expand, Shrink,
} from "lucide-react"
import { LANGUAGES } from "../../types/languages"
import type { Verdict, JudgeResponse, ProblemWorkspaceProps } from "../../types/problem"
import { ComplexityChart } from "./ComplexityChart"
import { LanguageDropdown } from "./LanguageDropDown"
import { tierForRating } from "../../utils/rankCF"

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-xs text-zinc-600">Loading editor...</div>,
})

const VERDICT_LABEL: Record<Verdict, string> = {
  AC: "Accepted",
  WA: "Wrong Answer",
  TLE: "Time Limit Exceeded",
  RE: "Runtime Error",
  CE: "Compilation Error",
  ERR: "Judge Error",
}

const verdictText = (v: Verdict) => (v === "AC" ? "text-emerald-400" : v === "TLE" ? "text-amber-400" : "text-rose-400")

const SECTION_RE = /^(input|output|constraints?|notes?|explanation|subtasks?|examples?|sample input|sample output)\s*:?$/i

type Block = { type: "h" | "p"; text: string }

function parseDescription(text: string): Block[] {
  const blocks: Block[] = []
  let buf: string[] = []
  const flush = () => {
    if (buf.length) blocks.push({ type: "p", text: buf.join("\n") })
    buf = []
  }
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim()
    if (!line) flush()
    else if (SECTION_RE.test(line)) {
      flush()
      blocks.push({ type: "h", text: line.replace(/:$/, "") })
    } else buf.push(line)
  }
  flush()
  return blocks
}

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi)

// Softer than the old indigo-on-near-black: slightly lifted panels, muted borders, no heavy glows.
const PANEL = "flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#131315]"

/* ------------------------------ Component ------------------------------ */

export function ProblemWorkspace({
  problem, language, onLanguageChange, code, onCodeChange, onReset,
  busy, onRun, onSubmit, result, error, lastMode,
}: ProblemWorkspaceProps) {
  const [leftTab, setLeftTab] = useState<"description" | "submission">("description")
  const [consoleTab, setConsoleTab] = useState<"testcase" | "result">("testcase")
  const [caseIdx, setCaseIdx] = useState(0)

  // layout
  const [leftPct, setLeftPct] = useState(42)
  const [consoleH, setConsoleH] = useState(290)
  const [expanded, setExpanded] = useState<null | "left" | "right">(null)
  const [dragH, setDragH] = useState(false)
  const [dragV, setDragV] = useState(false)
  const [isFs, setIsFs] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const vStart = useRef<{ y: number; h: number } | null>(null)

  /* remember the split between visits */
  useEffect(() => {
    try {
      const s = Number(localStorage.getItem("workspace:leftPct"))
      if (s >= 25 && s <= 70) setLeftPct(s)
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem("workspace:leftPct", String(Math.round(leftPct)))
    } catch {}
  }, [leftPct])

  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", onFs)
    return () => document.removeEventListener("fullscreenchange", onFs)
  }, [])

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [expanded])

  const toggleBrowserFs = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else rootRef.current?.requestFullscreen?.()
  }

  /* horizontal splitter (left <-> right) */
  const startH = (e: React.PointerEvent) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragH(true)
  }
  const moveH = (e: React.PointerEvent) => {
    if (!dragH || !wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    setLeftPct(clamp(((e.clientX - r.left) / r.width) * 100, 25, 70))
  }
  const onSplitKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setLeftPct((p) => clamp(p - 2, 25, 70))
    if (e.key === "ArrowRight") setLeftPct((p) => clamp(p + 2, 25, 70))
  }
  const startV = (e: React.PointerEvent) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    vStart.current = { y: e.clientY, h: consoleH }
    setDragV(true)
  }
  const moveV = (e: React.PointerEvent) => {
    if (!vStart.current) return
    setConsoleH(clamp(vStart.current.h + (vStart.current.y - e.clientY), 150, 600))
  }
  const endV = () => {
    vStart.current = null
    setDragV(false)
  }

  const blocks = useMemo(() => parseDescription(problem.description ?? ""), [problem.description])
  const tier = tierForRating(problem.cfRating ?? 0)
  const tags = (problem.cfTags ?? []).filter((t) => t.trim())

  const runResult = result?.mode === "run" ? result : null
  const submission = result?.mode === "submit" ? result : null
  const activeRunCase = runResult?.results?.[Math.min(caseIdx, (runResult.results?.length ?? 1) - 1)]

  const handleRun = () => {
    setConsoleTab("result")
    setCaseIdx(0)
    onRun()
  }
  const handleSubmit = () => {
    setLeftTab("submission")
    onSubmit()
  }

  const hideLeft = expanded === "right"
  const hideRight = expanded === "left"

  return (
    <div
      ref={rootRef}
      className={`bg-[#0d0d0c] p-2 text-zinc-300 md:p-3 lg:h-screen ${dragH || dragV ? "select-none" : ""}`}
      style={dragH ? { cursor: "col-resize" } : dragV ? { cursor: "row-resize" } : undefined}
    >
      <div
        ref={wrapRef}
        className="mx-auto flex h-full max-w-[1900px] flex-col gap-3 lg:flex-row lg:gap-0"
        style={{ ["--lw" as string]: `${leftPct}%` }}
      >
        {/* ======================= LEFT: problem ======================= */}
        <section
          className={`${PANEL} min-h-[520px] lg:min-h-0 ${hideLeft ? "hidden" : ""} ${
            expanded === "left" ? "flex-1" : "lg:w-[var(--lw)] lg:shrink-0"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] px-3 pt-2">
            <div className="flex items-center gap-1">
              {([
                ["description", "Description", FileText],
                ["submission", "Submission", Trophy],
              ] as const).map(([key, label, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLeftTab(key)}
                  className={`relative flex cursor-pointer items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition ${
                    leftTab === key ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${leftTab === key ? "text-sky-400" : ""}`} />
                  {label}
                  {leftTab === key && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-sky-400" />}
                </button>
              ))}
            </div>
            <IconBtn
              title={expanded === "left" ? "Restore (Esc)" : "Maximize panel"}
              onClick={() => setExpanded(expanded === "left" ? null : "left")}
            >
              {expanded === "left" ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </IconBtn>
          </div>

          <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:thin]">
            {leftTab === "description" ? (
              <div className="mx-auto max-w-[78ch]">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{problem.name}</h1>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{ color: tier.color, borderColor: `${tier.color}40`, background: `${tier.color}14` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: tier.color }} />
                    {problem.cfRating || "Unrated"}
                    {problem.cfRating ? <span className="font-medium opacity-70">· {tier.name}</span> : null}
                  </span>
                  <Pill icon={Clock}>{problem.timeLimitSec}s</Pill>
                  <Pill icon={Cpu}>{problem.memoryLimitMb} MB</Pill>
                </div>

                {tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                        <Hash className="h-2.5 w-2.5 text-sky-400" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="my-5 h-px bg-white/[0.07]" />

                <div className="space-y-3">
                  {blocks.map((b, i) =>
                    b.type === "h" ? (
                      <h2 key={i} className="flex items-center gap-2 pt-3 text-sm font-bold text-zinc-100">
                        <span className="h-4 w-1 rounded-full bg-sky-400" />
                        {b.text}
                      </h2>
                    ) : (
                      <p key={i} className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-300">
                        {b.text}
                      </p>
                    )
                  )}
                </div>

                {problem.examples.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-100">
                      <span className="h-4 w-1 rounded-full bg-sky-400" />
                      Examples
                    </h2>
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                        <span className="text-xs font-semibold text-sky-300">Example {i + 1}</span>
                        <CodeBox label="Input" text={ex.input} />
                        <CodeBox label="Output" text={ex.output} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <SubmissionView busy={busy === "submit"} r={submission} error={lastMode === "submit" ? error : ""} />
            )}
          </div>
        </section>

        {/* ===================== drag handle: left <-> right ===================== */}
        {!expanded && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panels"
            aria-valuenow={Math.round(leftPct)}
            tabIndex={0}
            onPointerDown={startH}
            onPointerMove={moveH}
            onPointerUp={() => setDragH(false)}
            onPointerCancel={() => setDragH(false)}
            onDoubleClick={() => setLeftPct(42)}
            onKeyDown={onSplitKey}
            title="Drag to resize · double-click to reset"
            className="group hidden w-3 shrink-0 cursor-col-resize touch-none items-center justify-center outline-none lg:flex"
          >
            <div className={`h-12 w-1 rounded-full transition-colors group-hover:bg-sky-400 group-focus-visible:bg-sky-400 ${dragH ? "bg-sky-400" : "bg-white/10"}`} />
          </div>
        )}

        {/* ======================= RIGHT: editor + console ======================= */}
        <section className={`flex min-h-[640px] min-w-0 flex-1 flex-col gap-3 lg:min-h-0 ${hideRight ? "hidden" : ""}`}>
          <div className={`${PANEL} min-h-[320px] flex-1`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-3 py-2">
              <div className="flex items-center gap-2">
                <LanguageDropdown value={language} onChange={onLanguageChange} disabled={!!busy} />
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={onReset}
                  className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100 disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={!!busy}
                  className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-zinc-200 transition hover:border-sky-500/40 hover:bg-white/10 disabled:opacity-50"
                >
                  {busy === "run" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 text-sky-400" />}
                  {busy === "run" ? "Running..." : "Run"}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!!busy}
                  className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-sky-500 px-4 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
                >
                  {busy === "submit" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  {busy === "submit" ? "Judging..." : "Submit"}
                </button>

                <span className="mx-1 h-5 w-px bg-white/10" />

                <IconBtn
                  title={expanded === "right" ? "Restore (Esc)" : "Maximize editor"}
                  onClick={() => setExpanded(expanded === "right" ? null : "right")}
                >
                  {expanded === "right" ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </IconBtn>
                <IconBtn title={isFs ? "Exit browser fullscreen" : "Browser fullscreen"} onClick={toggleBrowserFs}>
                  {isFs ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                </IconBtn>
              </div>
            </div>

            <div className="min-h-0 flex-1">
              <Editor
                height="100%"
                language={LANGUAGES[language].monaco}
                value={code}
                onChange={onCodeChange}
                theme="blitz-soft"
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme("blitz-soft", {
                    base: "vs-dark",
                    inherit: true,
                    rules: [],
                    colors: {
                      "editor.background": "#131315",
                      "editor.foreground": "#d4d4d8",
                      "editorLineNumber.foreground": "#4b4b55",
                      "editorLineNumber.activeForeground": "#a1a1aa",
                      "editor.lineHighlightBackground": "#ffffff06",
                      "editor.selectionBackground": "#38bdf826",
                      "editor.inactiveSelectionBackground": "#38bdf814",
                      "editorCursor.foreground": "#7dd3fc",
                      "editorIndentGuide.background1": "#ffffff0d",
                      "editorIndentGuide.activeBackground1": "#ffffff22",
                      "editorWidget.background": "#161618",
                      "scrollbarSlider.background": "#ffffff14",
                    },
                  })
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 22,
                  fontFamily: "'JetBrains Mono','Fira Code',ui-monospace,Menlo,Consolas,monospace",
                  fontLigatures: true,
                  automaticLayout: true,
                  tabSize: 4,
                  padding: { top: 14, bottom: 14 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  bracketPairColorization: { enabled: true },
                  renderLineHighlight: "line",
                  overviewRulerBorder: false,
                }}
              />
            </div>
          </div>

          {/* ---------- console (resizable) ---------- */}
          <div className={`${PANEL} relative shrink-0`} style={{ height: `${consoleH}px` }}>
            <div
              onPointerDown={startV}
              onPointerMove={moveV}
              onPointerUp={endV}
              onPointerCancel={endV}
              onDoubleClick={() => setConsoleH(290)}
              title="Drag to resize · double-click to reset"
              className="group flex h-3 w-full shrink-0 cursor-row-resize touch-none items-center justify-center"
            >
              <div className={`h-1 w-12 rounded-full transition-colors group-hover:bg-sky-400 ${dragV ? "bg-sky-400" : "bg-white/10"}`} />
            </div>

            <div className="flex items-center gap-1 border-b border-white/[0.08] px-3">
              {([
                ["testcase", "Testcase"],
                ["result", "Result"],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setConsoleTab(key)}
                  className={`relative flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs font-medium transition ${
                    consoleTab === key ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Terminal className={`h-3 w-3 ${consoleTab === key ? "text-sky-400" : ""}`} />
                  {label}
                  {consoleTab === key && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-sky-400" />}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:thin]">
              {consoleTab === "testcase" ? (
                problem.examples.length === 0 ? (
                  <EmptyNote text="No sample testcases available for this problem." />
                ) : (
                  <>
                    <CasePills count={problem.examples.length} active={caseIdx} onPick={setCaseIdx} />
                    <CodeBox label="Input" text={problem.examples[Math.min(caseIdx, problem.examples.length - 1)]!.input} />
                  </>
                )
              ) : busy === "run" ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-zinc-500">
                  <Loader2 className="h-5 w-5 animate-spin text-sky-400" /> Running your code...
                </div>
              ) : error && lastMode === "run" ? (
                <ErrorBox title="Error" text={error} />
              ) : !runResult ? (
                <EmptyNote text="Press Run to test your code against the example cases." />
              ) : runResult.verdict === "CE" ? (
                <ErrorBox title="Compilation Error" text={runResult.compile || "Your code failed to compile."} />
              ) : !runResult.results || runResult.results.length === 0 ? (
                <EmptyNote text="The judge returned no testcase output." />
              ) : (
                <>
                  <div className={`mb-3 flex items-center gap-2 text-sm font-bold ${verdictText(runResult.verdict)}`}>
                    {runResult.verdict === "AC" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {VERDICT_LABEL[runResult.verdict]}
                    <span className="text-xs font-normal text-zinc-500">· {runResult.passed}/{runResult.total} passed</span>
                  </div>
                  <CasePills
                    count={runResult.results.length}
                    active={caseIdx}
                    onPick={setCaseIdx}
                    results={runResult.results.map((t) => t.verdict === "AC")}
                  />
                  {activeRunCase && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`font-bold ${verdictText(activeRunCase.verdict)}`}>{VERDICT_LABEL[activeRunCase.verdict]}</span>
                        {activeRunCase.timeMs !== null && <span className="font-mono text-zinc-500">{activeRunCase.timeMs} ms</span>}
                      </div>
                      <CodeBox label="Input" text={activeRunCase.input} />
                      <CodeBox label="Your output" text={activeRunCase.stdout || "(empty)"} />
                      <CodeBox label="Expected" text={activeRunCase.expected} />
                      {activeRunCase.stderr && <ErrorBox title="stderr" text={activeRunCase.stderr} />}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

/* ----------------------------- Sub components ----------------------------- */

function IconBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.07] hover:text-zinc-100"
    >
      {children}
    </button>
  )
}

function Pill({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
      <Icon className="h-3 w-3 text-sky-400" />
      {children}
    </span>
  )
}

function SubmissionView({ busy, r, error }: { busy: boolean; r: JudgeResponse | null; error: string }) {
  if (busy) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
        Judging your solution...
      </div>
    )
  }
  if (error) return <ErrorBox title="Submission failed" text={error} />
  if (!r) return <EmptyNote text="No submission yet. Press Submit to see your verdict, runtime and memory." />

  const ac = r.verdict === "AC"
  const memoryMb = r.maxMemoryKb ? r.maxMemoryKb / 1024 : null

  return (
    <div className="mx-auto max-w-[78ch] space-y-4">
      <div className={`rounded-2xl border p-4 ${ac ? "border-emerald-500/25 bg-emerald-500/[0.06]" : "border-rose-500/25 bg-rose-500/[0.06]"}`}>
        <div className={`flex items-center gap-2 text-xl font-bold ${verdictText(r.verdict)}`}>
          {ac ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          {VERDICT_LABEL[r.verdict]}
        </div>
        {r.verdict !== "CE" && <p className="mt-1 text-sm text-zinc-400">{r.passed} / {r.total} testcases passed</p>}
        {r.failed && (
          <p className="mt-2 text-sm text-zinc-300">
            Failed on {r.failed.isPublic ? "example" : "hidden test"} #{r.failed.index}{" "}
            <span className="text-zinc-500">({VERDICT_LABEL[r.failed.verdict]})</span>
          </p>
        )}
        {r.verdict === "CE" && (
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/30 p-3 font-mono text-xs text-rose-200/80">
            {r.compile || "Your code failed to compile."}
          </pre>
        )}
      </div>

      {ac ? (
        <>
          <ComplexityChart kind="runtime" value={r.maxTimeMs ?? null} unit="ms" percentile={r.runtimePercentile} distribution={r.runtimeDistribution} />
          <ComplexityChart kind="memory" value={memoryMb} unit="MB" percentile={r.memoryPercentile} distribution={r.memoryDistribution} />
        </>
      ) : (
        <EmptyNote text="Runtime and memory stats appear once a submission is accepted." />
      )}
    </div>
  )
}

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-[80px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-zinc-500">
      {text}
    </div>
  )
}

function ErrorBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.06] p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-rose-400">
        <AlertTriangle className="h-4 w-4" />
        {title}
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-rose-200/80">{text}</pre>
    </div>
  )
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text)
        setDone(true)
        setTimeout(() => setDone(false), 1200)
      }}
      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/10 hover:text-zinc-200"
      aria-label="Copy"
    >
      {done ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
    </button>
  )
}

function CodeBox({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500">{label}</span>
        <CopyBtn text={text} />
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-[#0f0f11] p-3 font-mono text-[13px] leading-6 text-zinc-300">
        {text}
      </pre>
    </div>
  )
}

function CasePills({ count, active, onPick, results }: { count: number; active: number; onPick: (i: number) => void; results?: boolean[] }) {
  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(i)}
          className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
            active === i ? "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30" : "bg-white/5 text-zinc-400 hover:bg-white/10"
          }`}
        >
          {results && <span className={`h-1.5 w-1.5 rounded-full ${results[i] ? "bg-emerald-400" : "bg-rose-400"}`} />}
          Case {i + 1}
        </button>
      ))}
    </div>
  )
}