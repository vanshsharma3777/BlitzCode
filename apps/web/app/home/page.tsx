'use client'
import axios from "axios";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";

export default function HomePage() {
    const session = useSession()
    const [loader, setLoader] = useState(false)
    const [username, setUsername] = useState<string>('')
    const router = useRouter()
    useEffect(() => {
        console.log(session.status)
        if (session.status === 'unauthenticated') return setLoader(true)
        async function getDetails() {
            try {
                const res = await axios.get('/api/username')
                setUsername(res.data.userExists.username)
                if (!res.data.userExists.username) {
                    router.replace('/create-username');
                }
            } catch (error) {
                console.log("Internal server error :", error)

            } finally {
                setLoader(false)
            }
        }
        getDetails()
    }, [session.status, username])
    if (session.status === 'unauthenticated' || loader) return router.replace("/signin") 
    if (session.status === 'loading' || loader) return <Loader />
    return (
        <div className="flex items-center justify-center   min-h-screen">
            <div className=" ">
                <div className="text-center">
                    <h1 className='text-5xl font-semibold  m-2.5 mb-0'>
                        <span className=''>{"</>"}Biltz</span>
                        <span className='text-accent'>Code</span>
                    </h1>
                    <div className="mt-3 text-sec text-xl">Test your coding skills with quizzes and problem statements</div>
                </div>

                <div className="flex justify-center   items-center text-center mt-12">
                    <button onClick={()=>{
                        router.push("/single-player/configuration")
                    }} className="rounded-2xl bg-card h-[230px] w-[450px] flex flex-col items-center justify-center mr-3 border-2 border-border hover:border-accent transition-all duration-200 ease-in-out hover:scale-105">
                        <div className="h-16 w-16 bg-bg rounded-full flex  justify-center items-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                        <div className="font-semibold text-2xl text-pri mt-4">
                            Single Player
                        </div>
                        <div className="text-sec mt-2">
                            Practice coding challenges at your own pace
                        </div>
                    </button>
                    <button onClick={()=>{
                        router.push("/multiplayer")
                    }} className="rounded-2xl bg-card h-[230px] w-[450px] flex flex-col items-center justify-center ml-3 border-2 border-border hover:border-accent  transition-all duration-200 ease-in-out hover:scale-105">
                        <div className="h-16 w-16 bg-bg rounded-full flex  justify-center items-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg>
                        </div>
                        <div className="font-semibold text-2xl text-pri mt-4">
                            Multiplayer
                        </div>
                        <div className="text-sec mt-2">
                            Challenge other coders in real-time battles
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}