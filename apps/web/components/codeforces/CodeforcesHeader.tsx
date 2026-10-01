"use client";

import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { ProfileStyles } from "../ProfileUI";
import { colorForRank } from "../../utils/rankCF";

interface Props {
  handle: string;
  name?: string;
  country?: string;
  organization?: string;
  avatar: string;
  /** Optional: pass data.profile.rank to tint the avatar ring with the rank colour */
  rank?: string;
}

export default function CodeforcesHeader({ handle, name, country, organization, avatar, rank }: Props) {
  const ring = rank ? colorForRank(rank) : "#38bdf8";

  return (
    <header className="pf-rise relative overflow-hidden rounded-3xl border border-white/10 bg-[#121212]/80 p-6 shadow-2xl md:p-8">
      <ProfileStyles />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#fff 1px,transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom,#000,transparent 85%)",
        }}
      />
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-0 h-64 w-64 rounded-full opacity-10 blur-3xl" style={{ background: ring }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative h-24 w-24 shrink-0">
            <div className="absolute -inset-[3px] overflow-hidden rounded-full">
              <div
                className="pf-rot absolute -inset-8"
                style={{ background: `conic-gradient(from 0deg,${ring},#38bdf8,transparent 55%,${ring})` }}
              />
            </div>
            <img
              src={avatar}
              alt={name || handle}
              className="absolute inset-0 h-full w-full rounded-full border-4 border-[#121212] bg-[#151515] object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate text-3xl font-extrabold tracking-tight text-white">{name || handle}</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.25)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
                Codeforces
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-zinc-500">@{handle}</p>

            {(country || organization) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {country && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                    <MapPin className="h-3.5 w-3.5 text-sky-400" />
                    {country}
                  </span>
                )}
                {organization && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                    <Building2 className="h-3.5 w-3.5 text-sky-400" />
                    {organization}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <a
          href={`https://codeforces.com/profile/${encodeURIComponent(handle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all hover:shadow-[0_0_34px_rgba(56,189,248,0.55)] active:scale-[0.98]"
        >
          Open on Codeforces
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  );
}