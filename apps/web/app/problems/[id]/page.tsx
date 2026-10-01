"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Loader2, AlertTriangle } from "lucide-react"
import { LanguageKey } from "../../../types/languages"

import type { Problem, JudgeResponse } from "../../../types/problem"
import { ProblemWorkspace } from "../../../components/problems/ProblemsWorkspace"

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

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>()

  const [problem, setProblem] = useState<Problem | null>(null)
  const [loadError, setLoadError] = useState("")
  const [language, setLanguage] = useState<LanguageKey>("java")
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState<"run" | "submit" | null>(null)
  const [result, setResult] = useState<JudgeResponse | null>(null)
  const [error, setError] = useState("")
  const [lastMode, setLastMode] = useState<"run" | "submit" | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setProblem(null)
    setLoadError("")
    axios
      .get<Problem>(`/api/problems/${id}`, { signal: controller.signal })
      .then((r) => setProblem(r.data))
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
    setLastMode(null)
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
    setLastMode(mode)
    if (!code.trim()) {
      setError("Write some code first")
      return
    }
    setBusy(mode)
    setError("")
    setResult(null)
    try {
      const { data } = await axios.post<JudgeResponse>(`/api/problems/${id}/judge`, { language, code, mode }, { timeout: 70_000 })
      setResult(data)
      console.log("data" , data)
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error ?? (e.code === "ECONNABORTED" ? "Request timed out" : e.message))
      } else {
        setError("Something went wrong")
      }
    } finally {
      setBusy(null)
    }
  }

  if (loadError)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0d0c] p-6">
        <div className="max-w-md rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-rose-400" />
          <p className="font-bold text-zinc-100">Couldn&apos;t load this problem</p>
          <p className="mt-1 text-sm text-rose-300/80">{loadError}</p>
        </div>
      </div>
    )

  if (!problem)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0d0d0c]">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        <p className="text-sm text-zinc-500">Loading problem...</p>
      </div>
    )

  return (
    <ProblemWorkspace
      problem={problem}
      language={language}
      onLanguageChange={setLanguage}
      code={code}
      onCodeChange={onCodeChange}
      onReset={() => onCodeChange(STARTERS[language])}
      busy={busy}
      onRun={() => send("run")}
      onSubmit={() => send("submit")}
      result={result}
      error={error}
      lastMode={lastMode}
    />
  )
}