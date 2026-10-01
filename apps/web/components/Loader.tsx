'use client'

import { Code2 } from 'lucide-react'

interface LoaderProps {
  text?: string
}

export default function Loader({ text = 'Loading' }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0d0d0c]/95">
      {/* ek halka glow */}
      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-sky-500/[0.07] blur-[90px]" />

      <div className="relative flex flex-col items-center gap-6">
        {/* floating logo */}
        <div className="blitz-float flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/25 to-sky-500/5 shadow-[0_0_28px_-4px_rgba(56,189,248,0.6)]">
          <Code2 className="h-7 w-7 text-sky-400" />
        </div>

        {/* brand */}
        <div className="font-mono text-xl font-extrabold tracking-tight text-white">
          Blitz<span className="text-sky-400">Code</span>
        </div>

        {/* bouncing dots */}
        <div className="flex items-center gap-2" role="status" aria-label={text}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
            />
          ))}
        </div>

        {/* shimmer bar */}
        <div className="h-[3px] w-32 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="blitz-shimmer h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">{text}</p>
      </div>

      <style>{`
        @keyframes blitz-float {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes blitz-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .blitz-float { animation: blitz-float 2.2s ease-in-out infinite; }
        .blitz-shimmer { animation: blitz-shimmer 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .blitz-float, .blitz-shimmer { animation: none; }
        }
      `}</style>
    </div>
  )
}