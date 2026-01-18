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
        router.replace('/api/auth/signin')

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
<div className="min-h-screen flex items-center justify-center  px-4">
    <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-[#0B1120] shadow-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-[#E5E7EB] text-center">Practice Setup</h1>
    <select value={language} onChange={e => setLanguage(e.target.value.trim().toLowerCase())} className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30">
        <option value="">Select Language</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="tyescript">TypeScript</option>
        <option value="sql">SQL</option>
        <option value="rust">Rust</option>
        <option value="go">Go</option>
        <option value="swift">Swift</option>
    </select>
    <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic (Array, DP, Graphs)" className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" />
    <select value={difficulty} onChange={e => setDifficulty(e.target.value.trim().toLowerCase())} className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30">
        <option value="">Select Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
    </select>
    <select value={type} onChange={e => setType(e.target.value.trim().toLowerCase())} className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30">
        <option value="">Select Question Type</option>
        <option value="single">Single Correct</option>
        <option value="multiple">Multiple Correct</option>
        <option value="bugfix">Bugfixer</option>
    </select>
    {error && <div className="text-sm text-red-400">{error}</div>}
        {loader ?
         <button type="submit" disabled={loader} className="w-full rounded-lg bg-blue-500 py-2.5 cursor-not-allowed font-semibold text-white hover:bg-blue-600 transition active:scale-[0.98]">Generating Questions...</button>
        :   <button type="submit" disabled={loader} className="w-full rounded-lg bg-blue-500 py-2.5 font-semibold text-white hover:bg-blue-600 transition active:scale-[0.98]">Start Practice</button> }

    
</form>
        </div>
    )
}
