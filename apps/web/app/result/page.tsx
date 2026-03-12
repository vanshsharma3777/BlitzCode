'use client'

import { useEffect, useState } from "react"
import ResultAnalysis from "../../components/resultAnalysis"

export default function Result() {

  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("matchData") 
    if (stored) {
        console.log(stored)
      const sessionStorageData = JSON.parse(stored)
      console.log("sessionStorageData", sessionStorageData)
      setData(sessionStorageData)
    }
    else {
      console.log("Items not found in sesion storage")
    }
  }, [])
  if (!data) return <div>Loading...</div>
    return (
    <div className="p-6 text-pri min-h-screen  flex justify-center  gap-5" >
       <div className=" w-[65%]">
        <div className=" mt-5"><ResultAnalysis matchType={data.questionType} answers = {data.answers} questionType ={data.questionType}  allAnswers = {data.allQuestions}/></div>
      </div>
    </div>
  )
}