'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import Loader from "./Loader";
import { useRouter } from "next/navigation";

interface Question {
    topic:string,
    description:string,
    code:string,
    difficulty:'easy' | 'medium' | 'hard',
    questionType:'single' | 'multiple' |'bugfix',
    language: string 
}

export default  function RenderQuestion(){
    const session = useSession()
    const router = useRouter()
    console.log(session)
    const [question , setQuestion] = useState();
    const [ quesNumber , setQuesNumber] = useState<number>(1)
    const [ loader , setLoader] = useState<boolean>(false)
    const [ error , setError] = useState<string>('')
    
    if(session.status === 'loading')
          return <Loader></Loader>
    if(session.status === 'unauthenticated'){
        <Loader/>
        return router.replace('/api/auth/signin')
    }

    return (
        <div>
            running..,
        </div>
    )
}