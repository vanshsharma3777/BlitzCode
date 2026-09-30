"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import Editor from "@monaco-editor/react"
import { LanguageKey, LANGUAGES } from "../../../types/languages"

type Problem = {
  id: string
  name: string
  description: string
  cfRating: number | null
  cfTags: string[]
  timeLimitSec: number
  memoryLimitMb: number
  examples: { input: string; output: string }[]
}

type Verdict = "AC" | "WA" | "TLE" | "RE" | "CE" | "ERR"

type JudgeResponse = {
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
}

const VERDICT_LABEL: Record<Verdict, string> = {
  AC: "Accepted",
  WA: "Wrong Answer",
  TLE: "Time Limit Exceeded",
  RE: "Runtime Error",
  CE: "Compilation Error",
  ERR: "Judge Error",
}

const STARTERS: Record<LanguageKey, string> = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    return 0;
}
`,
  python: `import sys
input = sys.stdin.readline

def main():
    pass

main()
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
    }
}
`,
  javascript: `const lines = require("fs").readFileSync(0, "utf8").split("\\n");
`,
}

const storageKey = (id: string, lang: LanguageKey) => `code:${id}:${lang}`
const color = (v: Verdict) => (v === "AC" ? "#16a34a" : "#dc2626")

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>()

  const [problem, setProblem] = useState<Problem | null>(null)
  const [loadError, setLoadError] = useState("")
  const [language, setLanguage] = useState<LanguageKey>("cpp")
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState<"run" | "submit" | null>(null)
  const [result, setResult] = useState<JudgeResponse | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    setProblem(null)
    setLoadError("")
    axios
      .get<Problem>(`/api/problems/${id}`, { signal: controller.signal })
      .then((r) => {
        setProblem(r.data) 
        console.log("data" , r.data)
    }
    )
      .catch((e) => {
        if (axios.isCancel(e)) return
        setLoadError(e.response?.data?.error ?? "Failed to load problem")
      })
    return () => controller.abort()
  }, [id])

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(storageKey(id, language))
    } catch {}
    setCode(saved ?? STARTERS[language])
    
    setResult(null)
    setError("")
  }, [id, language])

  const onCodeChange = (value: string | undefined) => {
    const v = value ?? ""
    setCode(v)
    try {
      localStorage.setItem(storageKey(id, language), v)
    } catch {}
  }

  const send = async (mode: "run" | "submit") => {
    if (busy) return
    if (!code.trim()) {
      setError("Write some code first")
      return
    }
    setBusy(mode)
    setError("")
    setResult(null)
    try {
      const { data } = await axios.post<JudgeResponse>(
        `/api/problems/${id}/judge`,
        { language, code, mode },
        { timeout: 70_000 }
      )
      setResult(data)
      console.log("check result" , data)
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(
          e.response?.data?.error ?? (e.code === "ECONNABORTED" ? "Request timed out" : e.message)
        )
      } else {
        setError("Something went wrong")
      }
    } finally {
      setBusy(null)
    }
  }

  if (loadError) return <p style={{ padding: 24, color: "red" }}>{loadError}</p>
  if (!problem) return <p style={{ padding: 24 }}>Loading...</p>

  return (
    <div style={{ display: "flex", gap: 16, padding: 16, height: "100vh", boxSizing: "border-box" }}>
  
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}>
        <h1>{problem.name}</h1>
        <p style={{ fontSize: 13 }}>
          Rating: {problem.cfRating ?? "-"} | Time: {problem.timeLimitSec}s | Memory:{" "}
          {problem.memoryLimitMb} MB
          {problem.cfTags.length > 0 && <> | {problem.cfTags.join(", ")}</>}
        </p>

        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{problem.description}</div>

        {problem.examples.map((ex, i) => (
          <div key={i} style={{ marginTop: 16 }}>
            <h4>Example {i + 1}</h4>
            <b>Input</b>
            <pre style={preStyle}>{ex.input}</pre>
            <b>Output</b>
            <pre style={preStyle}>{ex.output}</pre>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
          <select
            value={language}
            disabled={!!busy}
            onChange={(e) => setLanguage(e.target.value as LanguageKey)}
          >
            {(Object.keys(LANGUAGES) as LanguageKey[]).map((k) => (
              <option key={k} value={k}>
                {LANGUAGES[k].label}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (confirm("Reset code to the starter template?")) onCodeChange(STARTERS[language])
            }}
            disabled={!!busy}
          >
            Reset
          </button>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={() => send("run")} disabled={!!busy}>
              {busy === "run" ? "Running..." : "Run"}
            </button>
            <button onClick={() => send("submit")} disabled={!!busy}>
              {busy === "submit" ? "Judging..." : "Submit"}
            </button>
          </div>
        </div>

        <div style={{ height: "55%", border: "1px solid #444" }}>
          <Editor
            language={LANGUAGES[language].monaco}
            value={code}
            onChange={onCodeChange}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, tabSize: 4 }}
          />
        </div>

        <div style={{ flex: 1, overflowY: "auto", marginTop: 12 }}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {result && <ResultPanel r={result} />}
        </div>
      </div>
    </div>
  )
}

function ResultPanel({ r }: { r: JudgeResponse }) {
  return (
    <div>
      <h3 style={{ color: color(r.verdict), margin: "0 0 8px" }}>
        {VERDICT_LABEL[r.verdict]}
        {r.verdict !== "CE" && (
          <span style={{ color: "inherit", fontWeight: 400 }}>
            {" "}
            — passed {r.passed}/{r.total} tests
          </span>
        )}
      </h3>

      {r.verdict === "CE" && <pre style={preStyle}>{r.compile}</pre>}

      {r.mode === "submit" && r.verdict !== "CE" && (
        <>
          {r.failed && (
            <p>
              Failed on {r.failed.isPublic ? "example" : "hidden test"} #{r.failed.index} (
              {VERDICT_LABEL[r.failed.verdict]})
            </p>
          )}
          {r.verdict === "AC" && (
            <p>
              Max time: {r.maxTimeMs} ms | Max memory: {Math.round((r.maxMemoryKb ?? 0) / 1024)} MB
            </p>
          )}
        </>
      )}

      {r.mode === "run" &&
        r.results?.map((t) => (
          <div key={t.index} style={{ border: "1px solid #444", borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <b style={{ color: color(t.verdict) }}>
              Example {t.index}: {VERDICT_LABEL[t.verdict]}
            </b>
            {t.timeMs !== null && <span style={{ fontSize: 12 }}> ({t.timeMs} ms)</span>}
            <div style={labelStyle}>Input</div>
            <pre style={preStyle}>{t.input}</pre>
            <div style={labelStyle}>Expected</div>
            <pre style={preStyle}>{t.expected}</pre>
            <div style={labelStyle}>Your output</div>
            <pre style={preStyle}>{t.stdout || "(empty)"}</pre>
            {t.stderr && (
              <>
                <div style={labelStyle}>Error</div>
                <pre style={{ ...preStyle, color: "#dc2626" }}>{t.stderr}</pre>
              </>
            )}
          </div>
        ))}
    </div>
  )
}

const preStyle: React.CSSProperties = {
  background: "#1e1e1e",
  color: "#ddd",
  padding: 8,
  borderRadius: 6,
  overflowX: "auto",
  margin: "4px 0",
  whiteSpace: "pre-wrap",
}
const labelStyle: React.CSSProperties = { fontSize: 12, marginTop: 6, opacity: 0.7 }