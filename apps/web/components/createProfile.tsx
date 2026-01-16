'use client'
import axios, { isAxiosError } from "axios"
import { useRef, useState } from "react"


export default function CreateProfile({email}:{email:string}){
    const usernameRef = useRef<null | HTMLInputElement>(null)
    const [userName , setUserName] = useState<string>();
    const [ error , setError] = useState<string>('')
    const handleSubmit = async()=>{
        try{
            const value = usernameRef.current?.value.trim()
        if(!value){
            setError("Please provide valid username")
        }
        setUserName(usernameRef.current?.value)
        const res = await axios.post("/api/username" , {email ,userName })
        console.log(res.data)
        }catch(error){
            console.log("error in submitting the username")
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
    <button onClick={handleSubmit} className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 font-semibold text-white hover:opacity-90 transition active:scale-[0.98]">Create Profile</button>
  </div>
</div>

    )
}