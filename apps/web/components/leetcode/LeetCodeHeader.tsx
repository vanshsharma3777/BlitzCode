"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { ProfileStyles } from "../ProfileUI";

interface LeetCodeHeaderProps {
  username: string;
  realName: string | null;
  avatar: string;
  country: string | null;
}

export default function LeetCodeHeader({ username, realName, avatar, country }: LeetCodeHeaderProps) {
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
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          {/* avatar with rotating ring */}
          <div className="relative h-24 w-24 shrink-0">
            <div className="absolute -inset-[3px] overflow-hidden rounded-full">
              <div
                className="pf-rot absolute -inset-8"
                style={{ background: "conic-gradient(from 0deg,#f97316,#fbbf24,transparent 55%,#f97316)" }}
              />
            </div>
            <img
              src={avatar}
              alt={username}
              className="absolute inset-0 h-full w-full rounded-full border-4 border-[#121212] bg-[#151515] object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate text-3xl font-extrabold tracking-tight text-white">
                {realName || username}
              </h1>
              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-300 shadow-[0_0_14px_rgba(249,115,22,0.25)]">
                LeetCode
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-zinc-500">@{username}</p>
            {country && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                <MapPin className="h-3.5 w-3.5 text-orange-400" />
                {country}
              </p>
            )}
          </div>
        </div>

        <a
          href={`https://leetcode.com/u/${username}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(249,115,22,0.35)] transition-all hover:shadow-[0_0_34px_rgba(249,115,22,0.55)] active:scale-[0.98]"
        >
          Open on LeetCode
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  );
}