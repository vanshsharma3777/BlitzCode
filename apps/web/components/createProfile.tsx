'use client'
import axios, { isAxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import Loader from "./Loader"
import { useRouter } from "next/navigation"
import ButtonLoader from "./btnLoader"

export default function CreateProfile({ email }: { email: string }) {
  const usernameRef = useRef<null | HTMLInputElement>(null)
  const [error, setError] = useState<string>('')
  const [loading, setloading] = useState<boolean>(false);
  const [btnLoader, setBtnLoader] = useState<boolean>(false);
  const router = useRouter()
  const session = useSession()
  if(session.status === "loading"){
    return <div className="flex justify-center items-center min-h-screen"><Loader></Loader></div>
  }
  const handleSubmit = async () => {
    try {
      setBtnLoader(true)
      if (status === "unauthenticated") {
             <div className="text-gray-300">Please sign in</div>;
            return router.push('/signin')
  }
      const username = usernameRef.current?.value.trim()
      if (!username) {
        setError("Please provide valid username")
        setBtnLoader(false)
        return
      }
      setError('')
      setloading(true)

      const res = await axios.post("/api/username", { email, username })
      if (res.status === 200) {
        router.replace('/home')
        setBtnLoader(false)
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
      setBtnLoader(false)
    }

    if(btnLoader){
      <ButtonLoader></ButtonLoader>
    }
  }
  return (
    <div className="min-h-screen text-pri flex justify-center items-center">
      <div className="bg-card w-[350px] p-5  rounded-2xl border-2 border-border hover:border-neutral-700">
        <div className="text-4xl text-center">
          Create Username 
        </div>
        <div className="text-sm text-sec mt-2 text-center">
          Welcome to {"</>"}BlitzCode
        </div>
        <div className="mt-7   flex flex-col text-left">
  <label className="text-sm text-sec mb-2">
    Email
  </label>
  <input
    type="email" placeholder={email}  disabled
    className="w-full bg-bg  text-pri  px-4 py-2.5 rounded-lg border border-neutral-800 placeholder:text-neutral-500 focus:bg-neutral-900  outline-none transition focus:border-accent cursor-not-allowed" />
  <label className="text-sm mt-3 text-sec mb-2">
    Username
  </label>
  <input
    type="username" placeholder="Enter your username" ref={usernameRef}
    className="w-full bg-bg  text-pri  px-4 py-2.5 rounded-lg border border-neutral-800 placeholder:text-neutral-500 focus:bg-neutral-900  outline-none focus:border-accent transition" />
    {error && (
      <div className="text-red-400 mt-1"> 
        {error}❌ 
      </div>
    )}
    <button onClick={handleSubmit} className="mt-5 border flex justify-center font-medium rounded-lg border-neutral-800 bg-bg py-2 hover:border-blue-700 hover:brightness-110 transform transiton-all duration-200 ease-in-out hover:scale-105">{btnLoader ? <ButtonLoader /> : "Submit"}</button>
</div>
      </div>
    </div>
  )
}