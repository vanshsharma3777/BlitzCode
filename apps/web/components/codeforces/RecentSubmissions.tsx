// components/codeforces/RecentSubmissions.tsx
"use client";

interface Submission {
  id: number;
  creationTimeSeconds: number;
  verdict: string;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    tags: string[];
  };
}

export default function RecentSubmissions({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) {
    return (
      <section className="mt-5 rounded-2xl border border-white/10 bg-[#151514] p-6">
        <h2 className="text-lg font-bold text-white mb-3">Recent Submissions</h2>
        <p className="text-sm text-zinc-500">No recent submissions found.</p>
      </section>
    );
  }
  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-[#151514] p-6">
      <h2 className="text-lg font-bold text-white mb-4">Recent Accepted Submissions</h2>
      <div className="space-y-2">
        {submissions.map(sub => {
          const date = new Date(sub.creationTimeSeconds * 1000);
          const formatted = date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
          // Construct problem URL
          const prob = sub.problem;
          const url = prob.contestId
            ? `https://codeforces.com/contest/${prob.contestId}/problem/${prob.index}`
            : `https://codeforces.com/problemset/problem/${prob.index}`;
          return (
            <a key={sub.id} href={url} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.05] transition">
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">{prob.name}</p>
                <p className="text-xs text-zinc-500 mt-1">{formatted}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-green-500/20 text-green-400 text-[11px]">
                  {sub.verdict}
                </span>
                <span className="text-zinc-600">↗</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
