"use client";

import React from "react";

// Codeforces Interface
export interface CodeforcesSubmission {
  id: number;
  creationTimeSeconds: number;
  verdict: string;
  programmingLanguage?: string;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    tags?: string[];
  };
}

// LeetCode Interface
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

interface NormalizedItem {
  id: string;
  title: string;
  url: string;
  timestamp: string | number;
  langOrTag?: string;
  status: string;
  isAccepted: boolean;
  platform: "leetcode" | "codeforces";
}

export default function RecentSubmissions({
  title = "Recent Accepted Submissions",
  leetcodeSubmissions,
  codeforcesSubmissions,
}: RecentSubmissionsProps) {
  const list = normalizeSubmissions(leetcodeSubmissions, codeforcesSubmissions);

  return (
    <section className="relative overflow-hidden mt-6 rounded-2xl border border-white/10 bg-[#121212]/80 p-6 backdrop-blur-xl shadow-2xl">
      {/* Subtle Orangish Top Accent Border */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400/80 to-transparent" />

      {/* Soft Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-orange-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">
            {title}
          </h2>

          <span className="text-[11px] font-mono font-medium text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
            Latest {list.length}
          </span>
        </div>

        {/* List Body */}
        <div className="mt-2 divide-y divide-white/[0.06]">
          {list.length === 0 ? (
            <p className="text-sm font-mono text-zinc-500 text-center py-8">
              No recent accepted submissions found.
            </p>
          ) : (
            list.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 py-3.5 px-3 -mx-3 rounded-xl transition-all duration-200 hover:bg-white/[0.03] hover:border-white/5 border border-transparent"
              >
                {/* Left side: Problem Title & Date */}
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </p>

                  <p className="text-[11px] font-mono text-zinc-500 mt-1">
                    {formatTimestamp(item.timestamp)}
                  </p>
                </div>

                {/* Right side: Language, Status Badge & Arrow */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Tag / Language Badge */}
                  {item.langOrTag && (
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono font-medium">
                      {item.langOrTag}
                    </span>
                  )}

                  {/* Status Indicator - Clean Soft Green */}
                  {item.isAccepted ? (
                    <span className="text-emerald-400 text-xs font-medium flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      Accepted
                    </span>
                  ) : (
                    <span className="text-amber-400 text-xs font-medium flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {item.status}
                    </span>
                  )}

                  {/* External Link Arrow */}
                  <span className="text-zinc-600 group-hover:text-zinc-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">
                    ↗
                  </span>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* Helper Functions */

function normalizeSubmissions(
  lcSubmissions?: LeetCodeSubmission[],
  cfSubmissions?: CodeforcesSubmission[]
): NormalizedItem[] {
  const items: NormalizedItem[] = [];

  if (Array.isArray(lcSubmissions)) {
    lcSubmissions.forEach((sub, i) => {
      items.push({
        id: `lc-${sub.id || sub.titleSlug}-${i}`,
        title: sub.title,
        url: `https://leetcode.com/problems/${sub.titleSlug}/`,
        timestamp: sub.timestamp,
        langOrTag: sub.lang,
        status: sub.statusDisplay || "Accepted",
        isAccepted: true,
        platform: "leetcode",
      });
    });
  }

  if (Array.isArray(cfSubmissions)) {
    cfSubmissions.forEach((sub) => {
      const prob = sub.problem;
      if (!prob) return;

      const isAccepted = sub.verdict === "OK";
      const url = prob.contestId
        ? `https://codeforces.com/contest/${prob.contestId}/problem/${prob.index}`
        : `https://codeforces.com/problemset/problem/${prob.index}`;

      items.push({
        id: `cf-${sub.id}`,
        title: `${prob.index ? `${prob.index}. ` : ""}${prob.name}`,
        url,
        timestamp: sub.creationTimeSeconds,
        langOrTag: sub.programmingLanguage || prob.tags?.[0],
        status: isAccepted ? "Accepted" : sub.verdict || "Submitted",
        isAccepted,
        platform: "codeforces",
      });
    });
  }

  return items;
}

function formatTimestamp(timestamp: string | number): string {
  if (!timestamp) return "";

  let ms = Number(timestamp);
  if (ms < 10000000000) {
    ms *= 1000;
  }

  const date = new Date(ms);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}