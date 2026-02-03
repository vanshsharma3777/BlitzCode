'use client'

import axios from "axios";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";

export default function Multiplayer(){
    const session = useSession();
    const [loader , setLoader] = useState<Boolean>(false)
    const [ username , setUsername] = useState<string>('')
    const router = useRouter()
    useEffect(()=>{     
        if(session.status==='unauthenticated') return setLoader(true);
        async function getDetails (){
            try{
            const res = await axios.get('/api/username')
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
    if(session.status === 'loading' || loader) return <Loader/>
    if(session.status === 'unauthenticated') return router.replace('/signin')
    return (
        <div>
            
        </div>
    )
}