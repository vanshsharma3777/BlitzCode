'use client'

import { useParams } from "next/navigation";
import QuestionCard from "../../../components/QuestionCard";
import { connectSocket } from "../../../lib/websocket";
import { useEffect, useRef } from "react";


export default function QuestionPage() {
    const params = useParams()
    const mode = params.mode
    const socketRef = useRef<WebSocket | null>(null)

    if (mode === 'multiplayer') {
        useEffect(() => {
            const socket = connectSocket()
            socketRef.current = socket;
        }, [])
    }
    return (
        <div><QuestionCard  /></div>
    )
}