'use client'

import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Loader from "../../components/Loader"

export default function Dashboard(){
    const session = useSession()
    const [loader , setLoader] = useState(false)
    const [ username , setUsername] = useState<string>('')
    const router = useRouter()
    useEffect(()=>{     
        if(session.status==='unauthenticated') return setLoader(true);
        async function getDetails (){
            try{
                const res = await axios.get('/api/username')
            console.log(res.data)
            setUsername(res.data.userExists.username)
            if(!res.data.userExists.username){
                router.replace('/create-username');
            }
            }catch(error){  
                console.log("Internal server error :" , error)
                
            }finally{
                setLoader(false)
            }
        }
        getDetails()
    },[session.status , username])
    console.log(session.status)
    if(session.status === 'loading' || loader) return <Loader/>
    if(session.status === 'unauthenticated') return router.replace('/signin')
    

    return (
        <div className="flex justify-center flex-col min-h-screen   ">  
            <button className=" border  rounded-sm border-gray-500" onClick={()=>{
                router.push('/select-type')
            }}>Start Practicing</button>            
        </div>
    )
}