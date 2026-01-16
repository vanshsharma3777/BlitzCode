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
            return router.push('/api/auth/signin')
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
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#111827] shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-100">Complete your profile</h1>
          <p className="text-sm text-gray-400">One last step to get started with Blitzcode 🚀</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Email</label>
          <input type="text" name="email" value={email} disabled className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-400 cursor-not-allowed" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Username</label>
          <input type="text" name="username" placeholder="Choose a unique username" ref={usernameRef} className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition" />
        </div>
        {error && (
          <div className="rounded-lg bg-red-900/30 border border-red-700 p-3 text-sm text-red-400">{error} ❌</div>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-lg bg-slate-800 border border-slate-700 py-2.5 font-medium text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition active:scale-[0.98]"
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>
        {success && (
          <div className="rounded-lg bg-green-900/30 border border-green-700 p-3 text-sm text-green-400">User Created Successfully ✅</div>
        )}
      </div>
    </div>

  )
}