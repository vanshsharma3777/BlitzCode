'use client'

import { useEffect, useState } from "react"
import ResultAnalysis from "../../../components/resultAnalysis"

export default function Result() {

  const [data, setData] = useState<any>(null)
  const [timeTaken , setTimeTaken] = useState<string>('')

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  useEffect(() => {
    const stored = sessionStorage.getItem("matchData")
    if (stored) {
      console.log(stored)
      const sessionStorageData = JSON.parse(stored)
      console.log("sessionStorageData", sessionStorageData)
      setData(sessionStorageData)
      const leftTime = sessionStorageData.leftTime
      const totalTime = sessionStorageData.totalTime
      const timeTaken = totalTime - leftTime;

      const displayTime = formatTime(timeTaken);
      setTimeTaken((displayTime))
      console.log(displayTime); 
      console.log("rtimetken " , timeTaken)
    }
    else {
      console.log("Items not found in sesion storage")
    }
  }, [])
  if (!data) return <div>Loading...</div>
  return (
    <div className="p-6 text-pri min-h-screen  flex justify-center  gap-5" >
      <div className=" w-[65%]">
        <div className=" mt-5"><ResultAnalysis matchType={data.questionType} timeTaken = {(timeTaken)} totalTime={data.totalTime} answers={data.answers} questionType={data.questionType} allAnswers={data.allQuestions} /></div>
      </div>
    </div>
  )
}