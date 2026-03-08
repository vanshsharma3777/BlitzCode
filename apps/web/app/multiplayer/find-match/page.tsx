'use client'

import { useState } from "react";
import ConfigurationCard from "../../../components/atoms/ConfiguratinCard";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuLoader } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function FindMatch() {
    const router = useRouter()
    const [found , setFound] = useState(false)

    setTimeout(() => {
        setFound(true)
        setTimeout(() => {
            router.replace('/questions-page')
        }, 2000);
    }, 5000);
    return (
        <div className="text-pri bg-bg flex justify-center items-center min-h-screen">
            <div className="bg-card w-[53%] rounded-xl border border-border flex flex-col justify-center items-center py-8  hover:border-accent hover:scale-105 transition-all duration-200 ease-in-out">
                {found ?(
                    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg>
                ) : (
                    <LuLoader className="animate-spin text-5xl" />
                )}
                <div className="mt-3 text-3xl font-medium">
                    Finding Your Match...
                </div>
                <div className="mt-3 text-sm text-sec">
                    Searching for the players with similar preferences
                </div>

                <div className="w-full ">
                    <div className="flex justify-between bg-bg mx-6 rounded-xl border border-border p-4 my-4">
                        <div className="text-sec">Topic :</div>
                        <div className="">Strings</div>
                    </div>
                    <div className="flex justify-between bg-bg mx-6 rounded-xl border border-border p-4 my-4">
                        <div className="text-sec">Difficulty :</div>
                        <div className="">Hard</div>
                    </div>
                    <div className="flex justify-between bg-bg mx-6 rounded-xl border border-border p-4 my-4">
                        <div className="text-sec">Language :</div>
                        <div className="">Java</div>
                    </div>
                    <div className="flex justify-between bg-bg mx-6 rounded-xl border border-border p-4 my-4">
                        <div className="text-sec">Questions :</div>
                        <div className="">10</div>
                    </div>
                </div>
                {found && (
                    <div className="bg-accent  p-3 text-sec rounded-xl  transition-all duration-500 ease-in-out">
                    Match Found : <span className="text-lg text-pri">vanshsharma.4777@gmail.com</span>
                </div>
                )}
            </div>
        </div>
    )
}