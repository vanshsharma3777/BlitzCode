'use client'

import { useSession } from "next-auth/react"
import Loader from "./Loader"
import { useRouter, useSearchParams } from "next/navigation"
import { ConsoleLogWriter } from "drizzle-orm"

export default function Analysis(){
    const router = useRouter()
    const session = useSession()
    if(session.status==='loading'){
        return <Loader></Loader>
    }
    else if(session.status==='unauthenticated'){
        return router.replace('/api/auth/signin')
    }

    const searchParams = useSearchParams()
    const rawData = searchParams.get('data')

    if(!rawData){
        return <div>
            No analysis data found.
        </div>
    }
    const analysisData = JSON.parse(decodeURIComponent(rawData))

    const {totalTime , answers , topic , difficulty , language , questionType } = analysisData
    console.log(analysisData)
     return (
        <div>
            Hello World
        </div>
    )
}