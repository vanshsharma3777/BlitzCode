'use client'

import React, { useState } from 'react'
import { signIn } from "next-auth/react"
import { FaGithub, FaGoogle } from "react-icons/fa"
import ButtonLoader from '../../components/btnLoader'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [btnLoader, setBtnLoader] = useState<boolean>(false)
  const [field, setField] = useState<string>("")
  const router = useRouter()

  const handleNavigate = async (provider: "google" | "github") => {
    try {
      setBtnLoader(true)
      setField(provider)
      
      // Specifying redirect: true prevents NextAuth from pulling server-side 
      // callback utilities into client bundles which triggers the 'fs' module error.
      await signIn(provider, { callbackUrl: "/dashboard", redirect: true })
    } catch (error) {
      console.error("Sign in failed:", error)
      setBtnLoader(false)
      setField("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] text-[var(--primary-text)] relative overflow-hidden p-4 transition-colors duration-300">

      {/* Ambient Background Glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none opacity-40 dark:opacity-30"
        style={{ background: 'var(--accent)' }}
      />

      <div className="relative w-full max-w-[420px] glass-panel rounded-2xl p-8 shadow-2xl border border-[var(--borders)] transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_30px_-5px_var(--accent-glow)]">
        
        {/* Top Accent Badge */}
        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 text-[11px] font-mono tracking-wider uppercase rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 font-medium">
            Gamified Competitive Coding
          </span>
        </div>

        <div className="text-center">
          
          {/* Brand Logo */}
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            <span className="font-mono text-[var(--primary-text)] opacity-90">&lt;/&gt; </span>
            <span className="text-[var(--primary-text)]">Blitz</span>
            <span className="text-[var(--accent)]">Code</span>
          </h1>

          <p className="text-sm text-[var(--secondary-text)] mb-8 font-normal">
            Sign in to unlock challenges and competitive multiplayer
          </p>

          <div className="space-y-3.5">
            {/* Google OAuth Button */}
            <button 
              type="button"
              disabled={btnLoader} 
              onClick={() => handleNavigate("google")} 
              className="group relative flex items-center justify-center gap-3 w-full bg-[var(--bg-sec)] hover:bg-[var(--card-hover)] text-[var(--primary-text)] font-medium py-3 px-4 rounded-xl border border-[var(--borders)] hover:border-[var(--accent)] transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {btnLoader && field === 'google' ? (
                <ButtonLoader />
              ) : (
                <>
                  <FaGoogle size={18} className="text-[var(--primary-text)] opacity-90 group-hover:scale-105 transition-transform" /> 
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* GitHub OAuth Button */}
            <button 
              type="button"
              disabled={btnLoader} 
              onClick={() => handleNavigate("github")} 
              className="group relative flex items-center justify-center gap-3 w-full bg-[var(--bg-sec)] hover:bg-[var(--card-hover)] text-[var(--primary-text)] font-medium py-3 px-4 rounded-xl border border-[var(--borders)] hover:border-[var(--accent)] transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {btnLoader && field === 'github' ? (
                <ButtonLoader />
              ) : (
                <>
                  <FaGithub size={19} className="text-[var(--primary-text)] opacity-90 group-hover:scale-105 transition-transform" /> 
                  <span>Continue with GitHub</span>
                </>
              )}
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-[var(--borders)]">
            <p className="text-sm text-[var(--secondary-text)]">
              Want to explore first?{" "}
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-[var(--accent)] font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-[var(--accent)] rounded px-1"
              >
                Go to Landing Page
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}