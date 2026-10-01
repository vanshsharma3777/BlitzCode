"use client";

import { ArrowUpRight, CheckCircle2, History } from "lucide-react";
import { Panel, SectionHead } from "./ProfileUI";

export interface CodeforcesSubmission {
  id: number;
  creationTimeSeconds: number;
  verdict: string;
  programmingLanguage?: string;
  problem: { contestId?: number; index: string; name: string; tags?: string[] };
}

export interface LeetCodeSubmission {
  id?: string | number;
  title: string;
  titleSlug: string;
  timestamp: string | number;
  lang?: string;
  statusDisplay?: string;
}

export interface RecentSubmissionsProps {
  title?: string;
  leetcodeSubmissions?: LeetCodeSubmission[];
  codeforcesSubmissions?: CodeforcesSubmission[];
}

interface Item {
  id: string;
  title: string;
  url: string;
  timestamp: string | number;
  langOrTag?: string;
  status: string;
  isAccepted: boolean;
  platform: "leetcode" | "codeforces";
}

const STRIPE = { leetcode: "#f97316", codeforces: "#38bdf8" } as const;

export default function RecentSubmissions({
  title = "Recent submissions",
  leetcodeSubmissions,
  codeforcesSubmissions,
}: RecentSubmissionsProps) {
  const list = normalize(leetcodeSubmissions, codeforcesSubmissions);
  const accent = codeforcesSubmissions?.length && !leetcodeSubmissions?.length ? "sky" : "orange";

  return (
    <Panel accent={accent} className="mt-5">
      <SectionHead
        icon={History}
        title={title}
        sub="Jump straight back into a problem"
        accent={accent}
        right={
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
            Latest {list.length}
          </span>
        }
      />

      {list.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">No submissions yet. Solve a problem and it will show up here.</p>
      ) : (
        <div className="space-y-2">
          {list.map((it) => (
            <a
              key={it.id}
              href={it.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 pl-5 pr-4 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.045]"
            >
              <span className="absolute inset-y-0 left-0 w-1" style={{ background: STRIPE[it.platform] }} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-200 transition-colors group-hover:text-white">{it.title}</p>
                <p className="mt-0.5 font-mono text-[11px] text-zinc-500">{fmt(it.timestamp)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                {it.langOrTag && (
                  <span className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-zinc-400 sm:inline">
                    {it.langOrTag}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${
                    it.isAccepted
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                      : "border-rose-500/25 bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {it.isAccepted && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {it.status}
                </span>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-300" />
              </div>
            </a>
          ))}
        </div>
      )}
    </Panel>
  );
}

function normalize(lc?: LeetCodeSubmission[], cf?: CodeforcesSubmission[]): Item[] {
  const items: Item[] = [];
  lc?.forEach((s, i) =>
    items.push({
      id: `lc-${s.id || s.titleSlug}-${i}`,
      title: s.title,
      url: `https://leetcode.com/problems/${s.titleSlug}/`,
      timestamp: s.timestamp,
      langOrTag: s.lang,
      status: s.statusDisplay || "Accepted",
      isAccepted: true,
      platform: "leetcode",
    })
  );
  cf?.forEach((s) => {
    const p = s.problem;
    if (!p) return;
    const ok = s.verdict === "OK";
    items.push({
      id: `cf-${s.id}`,
      title: `${p.index ? `${p.index}. ` : ""}${p.name}`,
      url: p.contestId
        ? `https://codeforces.com/contest/${p.contestId}/problem/${p.index}`
        : `https://codeforces.com/problemset/problem/${p.index}`,
      timestamp: s.creationTimeSeconds,
      langOrTag: s.programmingLanguage || p.tags?.[0],
      status: ok ? "Accepted" : s.verdict || "Submitted",
      isAccepted: ok,
      platform: "codeforces",
    });
  });
  return items;
}

function fmt(t: string | number) {
  if (!t) return "";
  let ms = Number(t);
  if (ms < 1e10) ms *= 1000;
  return new Date(ms).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}