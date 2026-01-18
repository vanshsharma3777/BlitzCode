'use client'
import axios, { isAxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import Loader from "./Loader"
import { useRouter } from "next/navigation"

export default function CreateProfile({ email }: { email: string }) {
  const usernameRef = useRef<null | HTMLInputElement>(null)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setloading] = useState<boolean>(false);
  const router = useRouter()
  const session = useSession()
  if(session.status === "loading"){
    return <div className="flex justify-center items-center min-h-screen"><Loader></Loader></div>
  }
  const handleSubmit = async () => {
    try {
      if (status === "unauthenticated") {
             <div className="text-gray-300">Please sign in</div>;
            return router.push('/signin')
  }
      const username = usernameRef.current?.value.trim()
      if (!username) {
        setError("Please provide valid username")
        return
      }

      setSuccess(false)
      setError('')
      setloading(true)

      const res = await axios.post("/api/username", { email, username })
      if (res.status === 200) {
        setSuccess(true)
        router.replace('/dashboard')
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 501)
          setError("Username already exists")
      }
      else {
        setError("Something went wrong");
      }
    }finally{
      setloading(false)
    }
  }
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="w-full max-w-md relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

        <div className="relative rounded-[2rem] bg-slate-900 border border-slate-800 p-8 md:p-10 shadow-2xl space-y-8 backdrop-blur-sm">
                    <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4 shadow-inner">
               <span className="text-3xl">🛡️</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Complete profile
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              One last step to get started with <span className="text-blue-400">Blitzcode</span> 🚀
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Verified Email</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={email} 
                  disabled 
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-500 cursor-not-allowed italic" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/50 text-xs">✓ Verified</div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Username</label>
              <input 
                type="text" 
                placeholder="Choose a unique username" 
                ref={usernameRef} 
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200" 
              />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/5 border border-red-500/20 p-4 text-xs font-bold text-red-400 animate-shake">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-xs font-bold text-emerald-400">
              <span>✅</span> Profile setup complete! Redirecting...
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-blue-600 py-4 font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/40"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Initializing...
                </>
              ) : (
                "Create Profile"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          <p className="text-center text-[10px] text-slate-600 font-medium">
            By continuing, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}