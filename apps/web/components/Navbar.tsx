'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { LogOut, Code2, ChevronDown, Info, Layers, User } from 'lucide-react'

const NAV_LINKS = [
  { href: '/problems', label: 'Problems', icon: Layers },
  { href: '/about', label: 'About', icon: Info },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!session) return null

  const image = session.user?.image

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 font-sans sm:px-5">
      <div className="mx-auto max-w-6xl">
        <div className="relative flex h-[64px] items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#121212]/80 px-3 shadow-2xl backdrop-blur-xl sm:px-4">
          {/* top gradient line, load par center se phailti hai */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-center bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-90 transition-transform duration-1000 ease-out"
            style={{ transform: mounted ? 'scaleX(1)' : 'scaleX(0)', willChange: 'transform' }}
          />

          {/* logo */}
          <Link href="/home" className="group relative flex items-center gap-2.5 rounded-xl px-2 py-1.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-500/25 to-sky-500/5 shadow-[0_0_18px_-4px_rgba(56,189,248,0.55)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_-3px_rgba(56,189,248,0.7)]">
              <Code2 className="h-5 w-5 text-sky-400 transition-transform duration-300 group-hover:rotate-12" />
            </div>

            <div className="hidden sm:block">
              <div className="font-mono text-[15px] font-extrabold tracking-tight text-white">
                Blitz<span className="text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]">Code</span>
              </div>
              <div className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                Competitive Coding
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* nav links */}
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname?.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex h-10 items-center gap-2 rounded-xl border px-3 transition-all duration-300 active:scale-95 ${
                    active
                      ? 'border-sky-500/40 bg-sky-500/10 text-white shadow-[0_0_15px_-4px_rgba(56,189,248,0.6)]'
                      : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:border-sky-500/30 hover:bg-sky-500/[0.06] hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 text-sky-400 transition-transform duration-200 group-hover:scale-110" />
                  <span className="hidden text-xs font-semibold sm:inline">{label}</span>
                </Link>
              )
            })}

            {/* profile */}
            <Link
              href="/profile"
              className={`group flex h-10 items-center gap-2.5 rounded-xl border px-2.5 transition-all duration-300 active:scale-95 sm:px-3 ${
                pathname?.startsWith('/profile')
                  ? 'border-sky-500/40 bg-sky-500/10 shadow-[0_0_15px_-4px_rgba(56,189,248,0.6)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-sky-500/30 hover:bg-sky-500/[0.06]'
              }`}
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-lg border border-amber-400/40 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white">
                  <User className="h-4 w-4" />
                </div>
              )}

              <div className="hidden max-w-[120px] sm:block">
                <div className="truncate text-xs font-semibold leading-tight text-zinc-100">
                  {session.user?.name || 'Profile'}
                </div>
                <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">Account</div>
              </div>

              <ChevronDown className="hidden h-3.5 w-3.5 text-zinc-500 transition-transform duration-300 group-hover:translate-y-0.5 sm:block" />
            </Link>

            {/* logout */}
            <button
              onClick={() => signOut({ callbackUrl: '/signin' })}
              className="group flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-2.5 text-rose-400 transition-all duration-300 hover:border-rose-500/40 hover:bg-rose-500/15 hover:shadow-[0_0_15px_-3px_rgba(244,63,94,0.35)] active:scale-95 sm:px-3"
            >
              <LogOut className="h-[17px] w-[17px] transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="hidden text-xs font-semibold sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}