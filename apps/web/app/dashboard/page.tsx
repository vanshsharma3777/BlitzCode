'use client'

import { useRouter } from "next/navigation"

export default function Dashboard(){
    const router = useRouter()
    return (
        <div className="flex justify-center flex-col min-h-screen   ">  
            <button className=" border  rounded-sm border-gray-500" onClick={()=>{
                router.push('/select-type')
            }}>Start Practicing</button>            
        </div>
    )
}