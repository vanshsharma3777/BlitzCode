'use client'

import { useEffect, useRef, useState } from "react";
import { LuLoader } from "react-icons/lu";
import { useRouter, useSearchParams } from "next/navigation";
import { connectSocket } from "../../../lib/websocket";
import { useSession } from "next-auth/react";
import Navbar from "../../../components/Navbar";
import { Users, Frown, RotateCcw, ArrowLeft, Swords } from "lucide-react";

export default function FindMatch() {
    const router = useRouter()
    const session = useSession()
    const socketRef = useRef<WebSocket | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchParams = useSearchParams()
    const [found, setFound] = useState(false)
    const [noUserFound, setNoUserFound] = useState(false);
    const [playerFound, setPlayerFound] = useState<string | null>(null)
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
        }
    }, [session.data?.user.email]);

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--primary-text)] flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Ambient Background Glow */}
            <div 
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-25 dark:opacity-20"
                style={{ background: 'var(--accent)' }}
            />

            <Navbar />

            <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
                <div className="w-full max-w-xl bg-[var(--card-bg)] rounded-3xl border border-[var(--borders)] p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
                    
                    {!noUserFound ? (
                        <>
                            {/* Visual Loader / Found Animation */}
                            <div className="flex flex-col items-center text-center">
                                <div className="relative flex items-center justify-center mb-6">
                                    <div className="absolute inset-0 rounded-full bg-[var(--accent)]/20 blur-xl animate-pulse" />
                                    
                                    {found ? (
                                        <div className="relative p-5 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)] text-[var(--accent)] shadow-[0_0_25px_-5px_var(--accent-glow)]">
                                            <Users className="w-12 h-12 stroke-[2.2]" />
                                        </div>
                                    ) : (
                                        <div className="relative p-5 rounded-2xl bg-[var(--bg-sec)] border border-[var(--borders)] text-[var(--accent)] shadow-lg">
                                            <LuLoader className="animate-spin w-12 h-12 stroke-[2.2]" />
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--primary-text)]">
                                    {found ? "Match Discovered!" : "Finding Your Opponent..."}
                                </h2>
                                
                                <p className="mt-2 text-xs sm:text-sm text-[var(--secondary-text)] max-w-sm">
                                    Searching for active competitive coders with matching match preferences
                                </p>
                            </div>

                            {/* Match Parameters List */}
                            <div className="mt-8 space-y-3">
                                <div className="flex justify-between items-center bg-[var(--bg-sec)]/70 rounded-xl border border-[var(--borders)] p-3.5 px-4 text-xs sm:text-sm font-medium">
                                    <span className="text-[var(--secondary-text)]">Topic</span>
                                    <span className="font-mono font-bold text-[var(--accent)] capitalize">{topic || "N/A"}</span>
                                </div>

                                <div className="flex justify-between items-center bg-[var(--bg-sec)]/70 rounded-xl border border-[var(--borders)] p-3.5 px-4 text-xs sm:text-sm font-medium">
                                    <span className="text-[var(--secondary-text)]">Difficulty</span>
                                    <span className="font-mono font-bold text-[var(--accent)] capitalize">{difficulty || "N/A"}</span>
                                </div>

                                <div className="flex justify-between items-center bg-[var(--bg-sec)]/70 rounded-xl border border-[var(--borders)] p-3.5 px-4 text-xs sm:text-sm font-medium">
                                    <span className="text-[var(--secondary-text)]">Language</span>
                                    <span className="font-mono font-bold text-[var(--accent)] capitalize">{language || "N/A"}</span>
                                </div>

                                <div className="flex justify-between items-center bg-[var(--bg-sec)]/70 rounded-xl border border-[var(--borders)] p-3.5 px-4 text-xs sm:text-sm font-medium">
                                    <span className="text-[var(--secondary-text)]">Questions</span>
                                    <span className="font-mono font-bold text-[var(--accent)]">{questionLength || "N/A"}</span>
                                </div>
                            </div>

                            {/* Match Found Banner */}
                            {found && playerFound && (
                                <div className="mt-6 p-4 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-center shadow-[0_0_20px_-5px_var(--accent-glow)] animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
                                        <Swords className="w-4 h-4" />
                                        Opponent Ready
                                    </div>
                                    <div className="text-base sm:text-lg font-bold text-[var(--primary-text)]">
                                        {playerFound}
                                    </div>
                                    <div className="mt-2 text-xs font-mono text-[var(--secondary-text)] animate-pulse">
                                        Initializing match session...
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Timeout / No Opponent Found View */
                        <div className="flex flex-col items-center text-center py-4">
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 mb-4">
                                <Frown className="w-12 h-12 stroke-[2]" />
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--primary-text)]">
                                No Opponent Found
                            </h2>

                            <p className="mt-2 text-xs sm:text-sm text-[var(--secondary-text)] max-w-sm">
                                No active players matched your exact configuration. Try adjusting parameters or searching again.
                            </p>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
                                <button
                                    type="button"
                                    onClick={startSearch}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-[var(--accent)]/25 active:scale-95"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Retry Match</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        socketRef.current?.close();
                                        router.back();
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[var(--bg-sec)] hover:bg-[var(--card-hover)] text-[var(--primary-text)] border border-[var(--borders)] font-semibold text-sm transition-all duration-200 cursor-pointer active:scale-95"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Go Back</span>
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    )
}