'use client'

import React, { useState } from 'react'
import { signIn } from "next-auth/react"
import { FaGithub, FaGoogle } from "react-icons/fa";
import ButtonLoader from '../../components/btnLoader';

export default function SignIn() {
  const [ btnLoader , setBtnLoader] = useState<boolean>(false)
  const [ field , setField] = useState<string>("")

  function navigate(provider:"google" | "github"){
    setBtnLoader(true)
    setField(provider)
    signIn(provider)
    
  }
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-card  flex flex-col justify-center w-[400px] p-8 rounded-2xl shadow-xl border-2 border-neutral-800 hover:border-accent'>
        <div className='text-center'>
          <h1 className='text-4xl font-semibold  m-2.5 mb-0'>
          <span className=''>{'</>'}Biltz</span>
          <span className='text-accent'>Code</span>
        </h1>

        <p className='mt-2 text-sm text-sec mb-6'>Sign in to continue</p>

        <button disabled={btnLoader} onClick={()=>{ 
          navigate("google")
        }} className='flex items-center justify-center gap-3 w-full bg-bg font-medium py-2.5 rounded-lg border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-600 transition mb-4 ' >
          {btnLoader && field === 'google' ? <ButtonLoader/> : 
            <><FaGoogle size={18}/> 
            Continue with Google
            </>
          }
          
        </button>
        <button disabled={btnLoader} onClick={()=>{
          navigate("github")
        }} className='flex items-center justify-center gap-3 w-full bg-bg font-medium py-2.5 rounded-lg border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-600 transition' >
          {btnLoader && field==='github' ? <ButtonLoader/> : 
            <><FaGithub size={18}/> 
            Continue with Github
            </>
          }
        </button>
        </div>
      </div>
    </div>
  )
}