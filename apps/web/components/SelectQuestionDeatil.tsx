'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Loader from "./Loader"
import axios from "axios"
import { diff } from "util"

export default function SelectQuestionsDetails() {
    const router = useRouter()
    const [language, setLanguage] = useState('')
    const [topic, setTopic] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [type, setType] = useState('')
    const [error, setError] = useState('')
    const [loader , setLoader] = useState(false)
    const session = useSession()
    if (session.status === "loading")
        return <Loader ></Loader>

    if (session.status === 'unauthenticated')
        router.replace('/signin')

    const handleSubmit = async (e: React.FormEvent) => {
         try{
            setError('')
            setLoader(true)
            e.preventDefault()
            if (!language || !topic || !difficulty || !type) {
                setError("Please fill all fields")
                return
            }
            const questionType = type
            setTopic(topic.trim().toLowerCase())
            const response = await axios.post('http://localhost:3002/create-questions' , {
                    topic ,
                    difficulty,
                    language ,
                    questionType ,
                })
            router.push(`/questions-set?topic=${topic}&difficulty=${difficulty}&language=${language}&questionType=${questionType}`)
                setTimeout(() => {
                    setLoader(false)
                }, 2000);
        }catch(error){
            console.log("error :" , error)
            if(axios.isAxiosError(error)){
                if(error.response?.status===404){
                    setError("Feilds not provided");
                }else if(error.response?.status===403 && error.response.data.success === false){
                    setError("Failed to create questions.")
                }
                else if(error.response?.status===403 && error.response.data.success === true){
                    setError("Failed to parse questions.")
                }
            }
        }
        finally{
            setLoader(false)
        }
    }
    return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-lg relative group rounded-[2.5rem] border border-slate-800 bg-slate-900/40 p-1 shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700"
      >
        <div className="rounded-[2.3rem] bg-slate-900/90 p-8 md:p-10 space-y-8">
                    <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">System Ready</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Practice Setup
            </h1>
            <p className="text-sm text-slate-500">Configure your training environment</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Language</label>
                <select 
                  value={language} 
                  disabled={loader}
                  onChange={e => setLanguage(e.target.value.trim().toLowerCase())} 
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer appearance-none"
                >
                  <option value="">Select Language</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="sql">SQL</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                  <option value="swift">Swift</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Topic</label>
                <input 
                  value={topic} 
                  disabled={loader}
                  onChange={e => setTopic(e.target.value)} 
                  placeholder="Array, DP, etc." 
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-700" 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Difficulty</label>
                <select 
                  value={difficulty} 
                  disabled={loader}
                  onChange={e => setDifficulty(e.target.value.trim().toLowerCase())} 
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer appearance-none"
                >
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Question Type</label>
                <select 
                  value={type}
                  disabled={loader} 
                  onChange={e => setType(e.target.value.trim().toLowerCase())} 
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer appearance-none"
                >
                  <option value="">Select Type</option>
                  <option value="single">Single Correct</option>
                  <option value="multiple">Multiple Correct</option>
                  <option value="bugfix">Bugfixer</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/5 border border-red-500/10 p-4 text-xs font-bold text-red-400 animate-pulse">
              <span className="text-sm">⚠️</span> {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={loader}
            className={`group relative w-full overflow-hidden rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl active:scale-[0.98] ${
              loader 
              ? "bg-slate-800 cursor-not-allowed text-slate-500" 
              : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/40"
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loader ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Initializing...
                </>
              ) : (
                <>
                  Start Session
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7" /></svg>
                </>
              )}
            </span>
            {!loader && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  )

}
