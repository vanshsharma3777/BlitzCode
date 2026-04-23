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
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchParams = useSearchParams()
    const [found, setFound] = useState(false)
    const [noUserFound, setNoUserFound] = useState(false);
    const [playerFound, setPlayerFound] = useState(null)
    const topic = searchParams.get("topic");
    const language = searchParams.get("language");
    const questionLength = searchParams.get("questionLength");
    const questionType = searchParams.get("questionType");
    const difficulty = searchParams.get("difficulty");

    const startSearch = () => {
        const socket = socketRef.current;
        if (!socket) return;

        setNoUserFound(false);
        setFound(false);

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

        timeoutRef.current = setTimeout(() => {
            setNoUserFound(true);
        }, 20000);
    };
    useEffect(() => {
        
        if (!session.data?.user.email) {
            return
        }
        const socket = connectSocket()
        socketRef.current = socket;


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
                startSearch();

            }

            if (data.type === "start_game") {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setFound(true)
                setPlayerFound(data.opponent)
                router.replace(`/multiplayer/match-page?topic=${topic}&difficulty=${difficulty}&language=${language}&questionType=${questionType}&questionLength=${questionLength}`)

            }

            if (data === "Unauthenticated") {
                console.log("User Unauthenticated");
            }

           
        };
         return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                socket.close();
            };
    }, [session.data?.user.email]);
    return (
        <div className="text-pri bg-bg flex justify-center items-center px-4 py-4 min-h-screen">
            <div className="bg-card w-full max-w-2xl md:w-[53%] rounded-xl border border-border flex flex-col justify-center items-center py-8  px-4 md:px-0 hover:border-accent hover:scale-105 transition-all duration-300 ease-in-out">
                {!noUserFound ? (
                    <>
                        {found ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg>
                        ) : (
                            <LuLoader className="animate-spin text-5xl" />
                        )}
                        <div className="mt-3 text-2xl md:text-3xl font-medium text-center">
                            Finding Your Match...
                        </div>
                        <div className="mt-3 text-sm text-sec text-center">
                            Searching for the players with similar preferences
                        </div>
                        <div className="w-full mt-4">
                            <div className="flex justify-between bg-bg  mx-0 md:mx-6 rounded-xl border border-border p-4 my-4">
                                <div className="text-sec">Topic :</div>
                                <div className="">{topic}</div>
                            </div>
                            <div className="flex justify-between bg-bg mx-0 md:mx-6 rounded-xl border border-border p-4 my-4">
                                <div className="text-sec">Difficulty :</div>
                                <div className="">{difficulty}</div>
                            </div>
                            <div className="flex justify-between bg-bg mx-0 md:mx-6 rounded-xl border border-border p-4 my-4">
                                <div className="text-sec">Language :</div>
                                <div className="">{language}</div>
                            </div>
                            <div className="flex justify-between bg-bg mx-0 md:mx-6 rounded-xl border border-border p-4 my-4">
                                <div className="text-sec">Questions :</div>
                                <div className="">{questionLength}</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-5xl">😕</div>

                        <div className="text-2xl md:mt-3 text-center font-medium">
                            No User Found
                        </div>

                        <div className="mt-3 text-sm text-sec text-center">
                            Try searching again or go back
                        </div>

                        <div className="hidden md:flex gap-3 mt-5">
                            <button
                                onClick={startSearch}
                                className="px-5 py-3 rounded-xl bg-accent"
                            >
                                Retry
                            </button>

                            <button
                                onClick={() => {
                                    socketRef.current?.close();
                                    router.back();
                                }}
                                className="px-5 py-3 rounded-xl bg-bg border border-border"
                            >
                                Go Back
                            </button>
                        </div>
                        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex gap-3 z-50">
                            <button
                                onClick={startSearch}
                                className="flex-1 py-3 rounded-xl bg-accent"
                            >
                                Retry
                            </button>

                            <button
                                onClick={() => {
                                    socketRef.current?.close();
                                    router.back();
                                }}
                                className="flex-1 py-3 rounded-xl bg-bg border border-border"
                            >
                                Go Back
                            </button>
                        </div>
                    </>
                )}

                {found && (

                    <div className="mt-5 px-2 md:px-0 w-full">
                        <div className="bg-accent   p-3 text-sec rounded-xl text-center">
                            Match Found : <span className="text-lg text-pri ml-2">{playerFound}</span>
                        </div>
                        <div className="mt-3 text-center rounded-xl bg-bg p-2 ">
                            Starting Game
                        </div>
                    </div>

                )}
            </div>
        </div>
    )
}