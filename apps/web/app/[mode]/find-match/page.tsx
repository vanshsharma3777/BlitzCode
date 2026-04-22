'use client'

import { useEffect, useRef, useState } from "react";
import { LuLoader } from "react-icons/lu";
import { useRouter, useSearchParams } from "next/navigation";
import { connectSocket } from "../../../lib/websocket";
import { useSession } from "next-auth/react";

export default function FindMatch() {
    const router = useRouter()
    const session = useSession()
    const socketRef = useRef<WebSocket | null>(null)
    const searchParams = useSearchParams()
    const [found, setFound] = useState(false)
    const [playerFound, setPlayerFound] = useState(null)
    const topic = searchParams.get("topic");
    const language = searchParams.get("language");
    const questionLength = searchParams.get("questionLength");
    const questionType = searchParams.get("questionType");
    const difficulty = searchParams.get("difficulty");

    useEffect(() => {

        const socket = connectSocket()
        socketRef.current = socket;

        if (!session.data?.user.email) {
            return
        }

        socket.onopen = () => {

            socket.send(JSON.stringify({
                type: "AUTH",
                meta: {
                    emailId: session.data?.user.email
                }
            }));

        };
        socket.onmessage = (event) => {

            const data = JSON.parse(event.data);

            if (data.data === "AUTH OK") {
                socket.send(JSON.stringify({
                    type: "init_game",
                    payload: {
                        topic,
                        questionLength,
                        questionType,
                        difficulty,
                        language
                    }
                }));
            }
            if (data.type === "start_game") {
                setFound(true)
                setPlayerFound(data.opponent)
                setTimeout(() => {
                   router.replace(`/multiplayer/match-page?topic=${topic}&difficulty=${difficulty}&language=${language}&questionType=${questionType}&questionLength=${questionLength}`)
                },2000);
            }

            if (data === "Unauthenticated") {
                console.log("User Unauthenticated");
            }

        };

    }, [session.data?.user.email]);
    return (
        <div className="text-pri bg-bg flex justify-center items-center min-h-screen">
            <div className="bg-card w-[53%] rounded-xl border border-border flex flex-col justify-center items-center py-8  hover:border-accent hover:scale-105 transition-all duration-200 ease-in-out">
                {found ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg>
                ) : (
                    <LuLoader className="animate-spin text-5xl" />
                )}
                <div className="mt-3 text-3xl font-medium">
                    Finding Your Match...
                </div>
                <div className="mt-3 text-sm text-sec">
                    Searching for the players with similar preferences
                </div>

                <div className="w-full ">
                    <div className="flex justify-between bg-bg mx-6 rounded-xl border border-border p-4 my-4">
                        <div className="text-sec">Topic :</div>
                        <div className="">{topic}</div>
                    </div>
                    <div className="flex justify-between bg-bg mx-6 rounded-xl border border-border p-4 my-4">
                        <div className="text-sec">Difficulty :</div>
                        <div className="">{difficulty}</div>
                    </div>
                    <div className="flex justify-between bg-bg mx-6 rounded-xl border border-border p-4 my-4">
                        <div className="text-sec">Language :</div>
                        <div className="">{language}</div>
                    </div>
                    <div className="flex justify-between bg-bg mx-6 rounded-xl border border-border p-4 my-4">
                        <div className="text-sec">Questions :</div>
                        <div className="">{questionLength}</div>
                    </div>
                </div>
                {found && (

                    <div>
                        <div className="bg-accent  p-3 text-sec rounded-xl ">
                        Match Found : <span className="text-lg text-pri">{playerFound}</span>
                    </div>
                    <div className="mt-3 text-center rounded-xl  bg-bg p-2 ">
                        Starting Game
                    </div>
                    </div>

                )}
            </div>
        </div>
    )
}