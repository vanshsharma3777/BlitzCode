'use client'

import React from 'react'
import { signIn } from "next-auth/react"

export default function SignIn() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[2.5rem] blur-xl opacity-50"></div>
        
        <div className="relative rounded-[2.5rem] bg-slate-900/80 border border-slate-800 p-8 md:p-12 shadow-2xl backdrop-blur-xl border-t-slate-700/50">
                    <div className="text-center mb-10">
            <div className="relative inline-flex mb-6 group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 blur-md opacity-40 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700"></div>
                            <div className="relative h-16 w-16 bg-slate-950 rounded-2xl border border-slate-700 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                <div className="absolute h-20 w-[2px] bg-blue-500/20 rotate-[30deg] -translate-x-2"></div>
                <span className="text-3xl font-black text-white relative z-10 flex items-center">
                  <span className="text-blue-500 mr-[1px]">{'{'}</span>
                  B
                  <span className="text-indigo-500 ml-[1px]">{'}'}</span>
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
              Blitz
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 not-italic">
                code
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-[1px] w-4 bg-slate-800"></div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
                Master the Syntax
              </p>
              <div className="h-[1px] w-4 bg-slate-800"></div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/setup' })}
              className="group w-full flex items-center justify-center gap-4 rounded-2xl bg-white px-4 py-4 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => signIn('github', { callbackUrl: '/setup' })}
              className="group w-full flex items-center justify-center gap-4 rounded-2xl bg-slate-800 border border-slate-700 px-4 py-4 text-sm font-bold text-white transition-all hover:bg-slate-700 hover:border-slate-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] active:scale-[0.98]">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Continue with GitHub
            </button>
          </div>
          <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            Secure Access Gateway
          </p>
        </div>
      </div>
    </div>
  )
}