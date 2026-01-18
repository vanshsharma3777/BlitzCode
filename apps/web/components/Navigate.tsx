'use client'

import { useSession } from "next-auth/react"
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default  function Navigate(){
    const session = useSession();
    const [loader , setLoader] = useState(false)
    const [error , setError] = useState<string>('')
    const [userName , setUserName] = useState<string>('')
    const router = useRouter()
    useEffect(()=>{
        if (session.status !== 'authenticated') return
        async function getUsername(){
        try{
            const response = await axios.get('/api/username' )
        setUserName( response.data.userName.trim());

        }catch(error){
            if(axios.isAxiosError(error)){
                if(error.response?.status===403){
                    setError("Internal Server Error. Try after sometime")
                }
                else if(error.response?.status===401){
                    setError("User Not Found")
                    router.replace('/signin')
                }
            }
        }
        
    }
    getUsername()
     
    },[session.status , router])

    useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.replace('/signin')
    }

    if (session.status === 'authenticated' && userName) {
      router.replace('/dashboard')
    }

    if ( (session.status === 'authenticated' && !userName)) {
    return router.replace('/create-username')
  }

    if( session.status==='authenticated' && userName){
        router.replace('/dashboard')
    }
  }, [session.status, userName, router])
  console.log(session.status)
   

  if (error) {
    return <div className="text-red-400 text-center">{error}</div>
  }

  return null
}