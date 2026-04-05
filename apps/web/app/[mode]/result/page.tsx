'use client'

import { useEffect, useState } from "react"
import ResultAnalysis from "../../../components/resultAnalysis"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Question } from "@repo/db"
import { SolvedQuestion, Status } from "../../../types/allTypes"
import Topbar from "../../../components/Topbar"

export default function Result() {
  const params = useParams()
  const session = useSession()
  const mode = params.mode
  const [data, setData] = useState<any>(null)
  const [answers, setAnswers] = useState<SolvedQuestion[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeTaken, setTimeTaken] = useState<string>('')
  const [ pointUpdated , setPointUpdated] = useState<boolean>(false)
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
        const sessionStorageData = JSON.parse(multiPlayer)
        setData(sessionStorageData)
        const timeTaken = sessionStorageData.timeTaken;
        const winnerEmail = sessionStorageData.winner;
        const winner = sessionStorageData.winner;
        const loserDetail = sessionStorageData.payload.find((p:any)=>{
          if(winner!==p.email) return p;
        })
        const winnerDetail = sessionStorageData.payload.find((p:any)=>{
          if(winner===p.email) return p;
        })
        const pointsData = sessionStorage.getItem("pointsUpdated")
        const pUpdate = JSON.parse(pointsData!) || false
        setPointUpdated(pUpdate)
        const winnerStatus = {
          winnerEmail:winnerDetail.email,
          timeTaken : formatTime(Math.ceil(winnerDetail.timeTaken / 1000) - 4),
          score: winnerDetail.score,
          status:"Winner"
        }
        const loserStatus = {
          loserEmail:loserDetail.email,
          timeTaken : formatTime(Math.ceil(loserDetail.timeTaken / 1000) - 4),
          score: loserDetail.score,
          status:"Defeat"
        }
         setLoserStatus(loserStatus)
         setWinnerStatus(winnerStatus)
      }
    }, [session.status])
    
  }
  console.log("params" , mode)
  if (!data) return <div>Loading...</div>
  return (
    <div className="p-6 text-pri min-h-screen  flex justify-center  gap-5" >
      <div className=" w-[65%]">
        <div><Topbar mode={mode}/></div>
        <div ><ResultAnalysis pointsUpdated={pointUpdated} timeTaken={(timeTaken)} totalTime={data.totalTime} answers={data.answers} questionType={data.questionType} allQuestions={data.allQuestions} quizId={data.quizId} winnerStatus={winnerStatus!} loserStatus= {loserStatus!} /></div>
      </div>  
    </div>
  )
}