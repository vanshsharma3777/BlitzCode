'use client'

import { useSession } from "next-auth/react"
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default  function Navigate(navigateTo:string|null){
    const session = useSession();
    const router = useRouter()
    const [loader , setLoader] = useState(false)
     useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/signin")
    }
    if(session.status === 'authenticated'){
      router.replace('/dashboard')
    }
  }, [session.status, router])
      if(session.status==='loading' || loader ) return <Loader></Loader>
      
    useEffect(() => {
  if (session?.status==='authenticated' && navigateTo !== null) {
    router.push(navigateTo)
  }
}, [session, navigateTo])
  return (  
       null
    )
}