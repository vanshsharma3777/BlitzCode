"use client";

interface Props {
  handle: string;
  name?: string;
  country?: string;
  organization?: string;
  avatar: string;
}

export default function CodeforcesHeader({
  handle,
  name,
  country,
  organization,
  avatar,
}: Props) {
  return (
    <header className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-white/10 pb-6 pt-2">
      <div className="flex items-center gap-4">
        <div className="relative group shrink-0">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 opacity-40 blur transition-all duration-300 group-hover:opacity-80 group-hover:blur-md" />
          <img
                        src={avatar}
                        alt={name}
                        className="relative w-14 h-14 rounded-xl object-cover border border-white/10 bg-[#151515]"
                    />
        </div>

        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">
              {name || handle}
            </h1>

            {/* Orange Codeforces Tag */}
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.15)] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Codeforces
            </span>
          </div>

          <p className="text-sm text-gray-400 mt-1">
            @{handle}
          </p>

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-400">
            {country && <span>🌍 {country}</span>}
            {organization && <span>🏢 {organization}</span>}
          </div>
        </div>
      </div>

      {/* Right Side: Profile CTA Button */}
     <div className="flex items-center gap-3">
                {country && (
                    <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-zinc-400 backdrop-blur-md">
                        🌍 {country}
                    </div>
                )}

                <a
                    href={`https://leetcode.com/u/${name}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 transition-all duration-200 text-sm font-semibold text-white shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_25px_rgba(249,115,22,0.45)] active:scale-[0.98]"
                >
                    <span>Codeforces</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        ↗
                    </span>
                </a>
            </div>
    </header>
  );
}