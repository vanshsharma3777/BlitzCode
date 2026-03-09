'use client'

import { useEffect, useState } from "react"

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
  }, [])
  if (!data) return <div>Loading...</div>
    return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">Result</h1>

      {data.answers.map((item: any) => (
        <div
          key={item.questionId}
          className="border border-border p-3 rounded-lg mb-3"
        >
          <p>Question ID: {item.questionId}</p>
          <p>Answer: {item.userAnswer.join(", ")}</p>
        </div>
      ))}

    </div>
  )
}