'use client'

import { useEffect, useState } from "react"
import ResultAnalysis from "../../../components/resultAnalysis"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { time } from "console"
import { Question } from "@repo/db"
import { SolvedQuestion } from "../../../types/allTypes"
type Status = {
  status: string,
  winnerEmail?: string,
  score:string
  loserEmail?:string,
  timeTaken:string
}
export default function Result() {
  const params = useParams()
  const session = useSession()
  const mode = params.mode
  const [data, setData] = useState<any>(null)
  const [answers, setAnswers] = useState<SolvedQuestion[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeTaken, setTimeTaken] = useState<string>('')
  const [winnerStatus , setWinnerStatus] = useState<Status>()
  const [loserStatus , setLoserStatus] = useState<Status>()
  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  useEffect(() => {
    const singlePlayer = sessionStorage.getItem("singlePlayerMatchData");
    if (singlePlayer) {
      console.log(singlePlayer)
      const sessionStorageData = JSON.parse(singlePlayer)
      console.log("sessionStorageData", sessionStorageData)
      setData(sessionStorageData)
      const leftTime = sessionStorageData.leftTime
      const totalTime = sessionStorageData.totalTime
      const timeTaken = totalTime - leftTime;
      const displayTime = formatTime(timeTaken);
      setTimeTaken((displayTime))
    }
    else {
      console.log("Items not found in sesion storage")
    }
  }, [])

  if (mode === 'multiplayer') {
    useEffect(() => {
      const multiPlayer = sessionStorage.getItem("multiPlayerMatchData");
      if (multiPlayer) {
        console.log(multiPlayer)
        const sessionStorageData = JSON.parse(multiPlayer)
        console.log("sessionStorageData", sessionStorageData)
        setData(sessionStorageData)
        const timeTaken = sessionStorageData.timeTaken;
        console.log("time taken", ((timeTaken / 1000) - 4).toFixed(3))
        const ans = formatTime(Math.ceil(timeTaken / 1000) - 4)
        const winnerEmail = sessionStorageData.winner;
        console.log("hello" , winnerEmail)
        console.log(session.data?.user.email === winnerEmail)
        console.log(session.data?.user.email)
        if (session.data?.user.email === winnerEmail) {
          const player = sessionStorageData.payload.find((p: any) => {
            if (session.data?.user.email ===p.email) {
              return p;
            }
          })
          console.log("player1" , player)
          const detail = {
            winnerEmail,
            score:player.score,
            status: "Winner",
            timeTaken : ans
          }
          setWinnerStatus(detail)
        } 
        if(session.data?.user.email !== winnerEmail) {
          const player = sessionStorageData.payload.find((p:any)=>{
          if(session.data?.user.email!==p.email){
            return p;
          }
        })
        console.log("player2" , player)
          const detail = {
            loserEmail : player.email,
            score:player.score,
            status: "Defeat",
            timeTaken : ans
          }
          setLoserStatus(detail)
        }
      }
    }, [session.status])
  }
  if (!data) return <div>Loading...</div>
  return (
    <div className="p-6 text-pri min-h-screen  flex justify-center  gap-5" >
      <div className=" w-[65%]">
        <div className=" mt-5"><ResultAnalysis matchType={data.questionType} timeTaken={(timeTaken)} totalTime={data.totalTime} answers={data.answers} questionType={data.questionType} allQuestions={data.allQuestions} quizId={data.quizId} winnerStatus={winnerStatus!} loserStatus= {loserStatus!} /></div>
      </div>
    </div>
  )
}