'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import Loader from "./Loader";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

interface Question {
    topic: string,
    description: string,
    code: string,
    difficulty: 'easy' | 'medium' | 'hard',
    questionType: 'single' | 'multiple' | 'bugfix',
    language: string
}

export default function RenderQuestion() {
    const session = useSession()
    const router = useRouter()
    console.log(session)
    const [question, setQuestion] = useState();
    const [quesNumber, setQuesNumber] = useState<number>(1)
    const [loader, setLoader] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const searchParams = useSearchParams()
    const topic = searchParams.get('topic')?.trim().toLowerCase()
    const questionType = searchParams.get('questionType')?.trim().toLowerCase()
    const difficulty = searchParams.get('difficulty')?.trim().toLowerCase()
    const language = searchParams.get('language')?.trim().toLowerCase()
    
    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.replace("/api/auth/signin")
        }
    }, [session.status, router])

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoader(true)
                
                const response = await axios.post('http://localhost:3002/create-questions' , {
                    topic ,
                    difficulty,
                    language ,
                    questionType ,
                })

                console.log(response)
            } catch (error) {

            }finally{
                setLoader(false)
            }
        }
        fetchQuestions()
    }, [])

    if (session.status === "loading" || loader===true) return <Loader />
    if (session.status === "unauthenticated") return <Loader />
    return (
        <div>
            hello
        </div>
    )
}