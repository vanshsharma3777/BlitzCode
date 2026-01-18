import { useEffect, useRef, useState } from "react"


export default function Timer({ onStop }: { onStop?: (time: number) => void }){
    const [time, setTime] = useState(0)
const timerRef = useRef<NodeJS.Timeout | null>(null)

useEffect(() => {
  if (!timerRef.current) {
    timerRef.current = setInterval(() => {
      setTime(t => t + 1)
    }, 1000)
  }
  return () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }
}, [])

useEffect(() => {
    if (onStop) onStop(time)
  }, [time, onStop])


const formatTime = (t: number) =>
  `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`

return (
          <div className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-1 text-slate-200"> ⏱ {formatTime(time)}</div>  
)
}