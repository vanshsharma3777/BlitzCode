'use client'
import axios from "axios";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";

export default function HomePage() {
    const session = useSession()
    const [loader, setLoader] = useState(false)
    const router = useRouter()
    useEffect(() => {
        if (session.status === 'unauthenticated') return router.replace("/signin")
        if (!session.data?.user.email) { return  }
    }, [session.status])
    if (session.status === 'loading' || loader) return <Loader />
    return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-4xl">
            {/* Hero Section */}
            <div className="text-center">
                <h1 className='text-4xl md:text-6xl font-semibold m-2.5 mb-0 tracking-tight'>
                    <span className=''>{"</>"}Blitz</span>
                    <span className='text-accent'>Code</span>
                </h1>
                <div className="mt-3 text-sec text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                    Test your coding skills with quizzes and problem statements
                </div>
            </div>

            {/* Mode Selection Grid */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mt-10 md:mt-16">
                {/* Single Player Card */}
                <button 
                    onClick={() => router.push("/singleplayer/configuration")} 
                    className="group relative rounded-2xl bg-card h-auto md:h-[230px] w-full md:w-[450px] p-8 md:p-0 flex flex-col items-center justify-center border-2 border-border hover:border-accent transition-all duration-300 ease-in-out hover:scale-[1.02] md:hover:scale-105 shadow-sm hover:shadow-accent/10"
                >
                    <div className="h-16 w-16 bg-bg rounded-full flex justify-center items-center transition-colors group-hover:bg-accent/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user transition-colors group-hover:text-accent">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="font-semibold text-2xl text-pri mt-5">
                        Single Player
                    </div>
                    <div className="text-sec mt-2 text-sm md:text-base max-w-[280px]">
                        Practice coding challenges at your own pace
                    </div>
                </button>

                {/* Multiplayer Card */}
                <button 
                    onClick={() => router.push("/multiplayer/configuration")} 
                    className="group relative rounded-2xl bg-card h-auto md:h-[230px] w-full md:w-[450px] p-8 md:p-0 flex flex-col items-center justify-center border-2 border-border hover:border-accent transition-all duration-300 ease-in-out hover:scale-[1.02] md:hover:scale-105 shadow-sm hover:shadow-accent/10"
                >
                    <div className="h-16 w-16 bg-bg rounded-full flex justify-center items-center transition-colors group-hover:bg-accent/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users transition-colors group-hover:text-accent">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <circle cx="9" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="font-semibold text-2xl text-pri mt-5">
                        Multiplayer
                    </div>
                    <div className="text-sec mt-2 text-sm md:text-base max-w-[280px]">
                        Challenge other coders in real-time battles
                    </div>
                </button>
            </div>
        </div>
    </div>
)
}