'use client'

import { useEffect, useState } from 'react'
import ConfigurationCard from '../../../components/atoms/ConfiguratinCard'
import { useParams, useRouter } from 'next/navigation'
import Loader from '../../../components/Loader'
import Navbar from '../../../components/Navbar'
import { useSession } from 'next-auth/react'
import { Sliders } from 'lucide-react'
import { ACCENT } from '../../../lib/configs/thems'
import { Accent } from '../../../components/ProfileUI'

const STEPS = ['Language', 'Topic', 'Question Type', 'Difficulty Level', 'Question Length']

export default function Configuration() {
  const router = useRouter()
  const params = useParams()
  const { status } = useSession()
  const mode = params.mode as string
  const accent: Accent = mode === 'multiplayer' ? 'violet' : 'sky'
  const t = ACCENT[accent]

  const [loader, setLoader] = useState(false)
  const [config, setConfig] = useState({
    language: null,
    topic: null,
    questionType: null as 'single correct' | 'multiple correct' | 'bugfixer' | null,
    difficulty: null as 'easy' | 'medium' | 'hard' | null,
    questionLength: null as '5' | '10' | '15' | null,
  })

  const done = Object.values(config).filter((v) => v !== null).length

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/signin')
  }, [status, router])

  useEffect(() => {
    if (
      config.topic !== null &&
      config.questionLength !== null &&
      config.questionType !== null &&
      config.difficulty !== null &&
      config.language !== null
    ) {
      setLoader(true)
      const queryParams = `topic=${config.topic}&difficulty=${config.difficulty}&language=${config.language}&questionType=${config.questionType}&questionLength=${config.questionLength}`

      if (mode === 'multiplayer') {
        router.push(`/multiplayer/find-match?${queryParams}`)
      } else if (mode === 'singleplayer') {
        router.push(`/singleplayer/questions-page?${queryParams}`)
      }

      const timeout = setTimeout(() => setLoader(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [config, mode, router])

  if (loader || status === 'loading') return <Loader />
  if (status === 'unauthenticated') return null

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0d0d0c] text-zinc-200">
      {/* soft grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 30%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 30%, black 20%, transparent 100%)',
        }}
      />
      {/* soft glow */}
      <div
        className={`pointer-events-none absolute left-1/2 top-[18%] h-[380px] w-[380px] -translate-x-1/2 rounded-full blur-[160px] ${t.glowBg}`}
      />

      <Navbar />

      <main className="relative z-10 flex-1 px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center">
          {/* mode pill */}
          <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider backdrop-blur ${t.pill}`}>
            <Sliders className="h-3.5 w-3.5" />
            <span>{mode || 'Match'} setup</span>
          </div>

          <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Configure Your <span className={`${t.text} ${t.glow}`}>Match</span>
          </h1>

          <p className="mb-6 mt-3 max-w-md text-center text-sm leading-relaxed text-zinc-400 md:text-base">
            Select your parameters below. Tap an active choice again to deselect it.
          </p>

          {/* progress */}
          <div className="mb-8 w-full max-w-5xl ">
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              <span>Progress</span>
              <span className={done === STEPS.length ? t.text : ''}>
                {done} / {STEPS.length}
              </span>
            </div>
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    i < done ? t.bar : 'bg-white/[0.07]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* cards */}
          <div className="flex w-full max-w-5xl flex-col gap-5">
            {STEPS.map((heading, i) => (
              <ConfigurationCard
                key={heading}
                heading={heading}
                step={i + 1}
                accent={accent}
                setConfig={setConfig}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}