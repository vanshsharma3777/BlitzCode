'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loader from '../../components/Loader'
import Navbar from '../../components/Navbar'
import HeroSection from '../../components/HeroSection'
import ModeCard from '../../components/ModeCard'
import { User, Users, Layers, Sparkles } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/signin')
  }, [status, router])

  if (status === 'loading') return <Loader />
  if (status === 'unauthenticated') return null

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Coder'

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0d0d0c] text-zinc-200">
      {/* grid background, edges par fade */}
      {/* grid background, bahut halka, edges par fade */}
<div
  className="pointer-events-none absolute inset-0"
  style={{
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
    backgroundSize: '56px 56px',
    maskImage: 'radial-gradient(ellipse 65% 55% at 50% 40%, black 20%, transparent 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 40%, black 20%, transparent 100%)',
  }}
/>

{/* colour glows, soft */}
<div className="pointer-events-none absolute left-[20%] top-[24%] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-sky-500/[0.08] blur-[160px]" />
<div className="pointer-events-none absolute right-[14%] top-[40%] h-[360px] w-[360px] rounded-full bg-violet-500/[0.08] blur-[160px]" />
      <Navbar />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 md:py-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          {/* welcome pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-xs text-zinc-400 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            Welcome back, <span className="font-semibold text-white">{firstName}</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>

          <HeroSection />

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-5 sm:mt-12 md:mt-14 md:flex-row md:items-stretch md:gap-6">
            <ModeCard
              accent="sky"
              tag="Solo"
              cta="Start practicing"
              title="Single Player"
              description="Practice coding challenges at your own pace"
              icon={<User className="h-6 w-6" />}
              onClick={() => router.push('/singleplayer/configuration')}
            />
            <ModeCard
              accent="violet"
              tag="Live"
              cta="Enter the arena"
              title="Multiplayer"
              description="Challenge other coders in real-time battles"
              icon={<Users className="h-6 w-6" />}
              onClick={() => router.push('/multiplayer/configuration')}
            />
          </div>

          {/* quick link to problemset */}
          <button
            onClick={() => router.push('/problems')}
            className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-400 backdrop-blur transition-all hover:border-sky-500/30 hover:bg-sky-500/[0.06] hover:text-white"
          >
            <Layers className="h-4 w-4 text-sky-400" />
            Browse the Problemset
          </button>
        </div>
      </main>
    </div>
  )
}