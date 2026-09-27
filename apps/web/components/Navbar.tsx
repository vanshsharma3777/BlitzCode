'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Sun, Moon, User, LogOut, Code2, ChevronDown, Info } from 'lucide-react'

export default function Navbar() {
    const { data: session } = useSession()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!session) return null

    return (
        <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-5 font-sans">
            <div className="mx-auto max-w-6xl">
                <div className="relative flex h-[64px] items-center justify-between rounded-2xl border border-[var(--borders)] bg-[var(--card-bg)]/80 px-3 shadow-xl backdrop-blur-xl transition-all duration-300 sm:px-4 overflow-hidden">
                    
                    <div 
                        className="pointer-events-none absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-90 transition-transform duration-1000 ease-out origin-center"
                        style={{
                            transform: mounted ? 'scaleX(1)' : 'scaleX(0)',
                            willChange: 'transform'
                        }}
                    />

                    <Link
                        href="/"
                        className="group relative flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all duration-200"
                    >
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/20 group-hover:shadow-[0_0_20px_-3px_var(--accent-glow)]">
                            <Code2 className="h-5 w-5 text-[var(--accent)] transition-transform duration-300 group-hover:rotate-12" />
                        </div>

                        <div className="hidden sm:block">
                            <div className="text-[15px] font-extrabold tracking-tight text-[var(--primary-text)] font-mono">
                                Blitz<span className="text-[var(--accent)] drop-shadow-[0_0_10px_var(--accent-glow)]">Code</span>
                            </div>
                            <div className="text-[9px] font-mono font-medium uppercase tracking-[0.2em] text-[var(--secondary-text)] opacity-80">
                                Competitive Coding
                            </div>
                        </div>
                    </Link>

                    <div className="relative flex items-center gap-2 sm:gap-2.5">
                        
                     

                        <Link
                            href="/about"
                            className="group flex h-10 items-center gap-2 rounded-xl border border-[var(--borders)] bg-[var(--bg-main)]/70 px-3 text-[var(--primary-text)] transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--card-hover)] hover:shadow-[0_0_15px_-3px_var(--accent-glow)] active:scale-95"
                        >
                            <Info className="h-4 w-4 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110" />
                            <span className="hidden sm:inline text-xs font-semibold">About</span>
                        </Link>
                        <Link
                            href="/profile"
                            className="group flex h-10 items-center gap-2.5 rounded-xl border border-[var(--borders)] bg-[var(--bg-main)]/70 px-2.5 text-[var(--primary-text)] transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--card-hover)] hover:shadow-[0_0_15px_-3px_var(--accent-glow)] active:scale-95 sm:px-3"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-white">
                                <User className="h-4 w-4" />
                            </div>

                            <div className="hidden max-w-[120px] sm:block">
                                <div className="truncate text-xs font-semibold leading-tight text-[var(--primary-text)]">
                                    {session.user?.name || 'Profile'}
                                </div>
                                <div className="mt-0.5 text-[9px] font-mono uppercase tracking-wider text-[var(--secondary-text)] opacity-80">
                                    Account
                                </div>
                            </div>

                            <ChevronDown className="hidden h-3.5 w-3.5 text-[var(--secondary-text)] transition-transform duration-300 group-hover:translate-y-0.5 sm:block" />
                        </Link>

                        <button
                            onClick={() => signOut({ callbackUrl: '/signin' })}
                            className="group flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-2.5 text-rose-500 transition-all duration-300 hover:border-rose-500/40 hover:bg-rose-500/15 hover:shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)] active:scale-95 cursor-pointer sm:px-3"
                        >
                            <LogOut className="h-[17px] w-[17px] transition-transform duration-300 group-hover:-translate-x-0.5" />
                            <span className="hidden text-xs font-semibold sm:inline">
                                Logout
                            </span>
                        </button>

                    </div>
                </div>
            </div>
        </header>
    )
}