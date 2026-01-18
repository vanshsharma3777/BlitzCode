'use client'

import { useSession } from "next-auth/react"
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigate(){
    const session = useSession();
    const [loader , setLoader] = useState(false)
    const router = useRouter()
    useEffect(()=>{
        if(session.status==='loading'){
        setLoader(true)
    }
    else if(session.status==='authenticated'){
         router.replace('/dashboard')
    }
    else if(session.status==='unauthenticated'){
        router.replace('/signin')
    }
    
    },[session.status])
    if(session.status==='loading'){
        return <Loader></Loader>
    }
    return (
        null
    )
}

