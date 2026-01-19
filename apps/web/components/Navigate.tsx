'use client'

import { useSession } from "next-auth/react"
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default  function Navigate(){
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
    
  return (  
       null
    )
}