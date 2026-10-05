'use client'

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { connectSocket } from "../../../lib/websocket";
import { useSession } from "next-auth/react";
import Navbar from "../../../components/Navbar";
import { Frown, RotateCcw, ArrowLeft, Swords, Layers, Gauge, Code2, ListOrdered, Radar, User } from "lucide-react";

const SEARCH_TIMEOUT_MS = 20000

export default function FindMatch() {
    const router = useRouter()
    const session = useSession()
    const socketRef = useRef<WebSocket | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchParams = useSearchParams()
    const [found, setFound] = useState(false)
    const [noUserFound, setNoUserFound] = useState(false);
    const [playerFound, setPlayerFound] = useState<string | null>(null)
    const [elapsed, setElapsed] = useState(0)
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
        setElapsed(0);

        socket.send(JSON.stringify({
            type: "init_game",
            payload: { topic, questionLength, questionType, difficulty, language }
        }));

        // retry par purana timeout clear, warna timeouts stack ho jaate hain
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setNoUserFound(true);
        }, SEARCH_TIMEOUT_MS);
    };

    useEffect(() => {
        if (!session.data?.user.email) {
            return
        }
        const socket = connectSocket()
        socketRef.current = socket;
        const handleSocketOpen = () => {
            console.log("🔥 FindMatch WebSocket OPEN");

            socket.send(
                JSON.stringify({
                    type: "AUTH",
                    meta: {
                        emailId: session.data?.user.email,
                    },
                })
            );
        };
        if (socket.readyState === WebSocket.OPEN) {
            handleSocketOpen();
        } else {
            socket.addEventListener(
                "open",
                handleSocketOpen,
                { once: true }
            );
        }

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
    useEffect(() => {
        if (found || noUserFound) return
        const id = setInterval(() => setElapsed(e => Math.min(e + 1, SEARCH_TIMEOUT_MS / 1000)), 1000)
        return () => clearInterval(id)
    }, [found, noUserFound])

    const me = session.data?.user
    const params = [
        { label: "Topic", value: topic, icon: Layers },
        { label: "Difficulty", value: difficulty, icon: Gauge },
        { label: "Language", value: language, icon: Code2 },
        { label: "Questions", value: questionLength, icon: ListOrdered },
    ]
    const pct = Math.min(100, (elapsed / (SEARCH_TIMEOUT_MS / 1000)) * 100)
    const secondsLeft = SEARCH_TIMEOUT_MS / 1000 - elapsed

    const tone = found ? 'emerald' : 'violet'
    const ringColor = found ? 'border-emerald-400/40' : 'border-violet-400/40'

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0d0d0c] text-zinc-200">

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundSize: '52px 52px',
                    maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 100%)',
                }}
            />
            <div aria-hidden className={`pointer-events-none absolute left-1/2 top-[38%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[170px] transition-colors duration-700 ${noUserFound ? 'bg-rose-500/[0.07]' : found ? 'bg-emerald-500/[0.09]' : 'bg-violet-500/[0.10]'}`} />

            <Navbar />

            <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
                <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#121212]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-90 ${noUserFound ? 'via-rose-400' : found ? 'via-emerald-400' : 'via-violet-400'}`} />

                    {!noUserFound ? (
                        <>

                            <div className="flex justify-center">
                                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] ${found ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border-violet-500/25 bg-violet-500/10 text-violet-300'}`}>
                                    <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${found ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-violet-400 shadow-[0_0_8px_#a78bfa]'}`} />
                                    {found ? 'Match found' : 'Live matchmaking'}
                                </span>
                            </div>

                            <div className="relative mx-auto mt-6 flex h-44 w-44 items-center justify-center">
                                {[0, 1, 2].map(i => (
                                    <span
                                        key={i}
                                        className={`fm-ring absolute inset-0 rounded-full border ${ringColor} ${found ? 'opacity-0' : ''}`}
                                        style={{ animationDelay: `${i * 0.8}s` }}
                                    />
                                ))}
                                <span className={`absolute inset-6 rounded-full border ${found ? 'border-emerald-400/30' : 'border-violet-400/20'}`} />
                                <span className={`absolute inset-12 rounded-full border ${found ? 'border-emerald-400/20' : 'border-violet-400/10'}`} />

                                {!found && (
                                    <span
                                        className="fm-sweep absolute inset-0 rounded-full"
                                        style={{ background: 'conic-gradient(from 0deg, rgba(167,139,250,0.35), transparent 28%)' }}
                                    />
                                )}

                                <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border bg-gradient-to-br transition-all duration-500 ${found
                                    ? 'border-emerald-500/40 from-emerald-500/30 to-emerald-500/5 shadow-[0_0_30px_-4px_rgba(52,211,153,0.7)]'
                                    : 'border-violet-500/30 from-violet-500/25 to-violet-500/5 shadow-[0_0_26px_-4px_rgba(167,139,250,0.65)]'}`}>
                                    {found
                                        ? <Swords className="h-8 w-8 text-emerald-400" />
                                        : <Radar className="h-8 w-8 text-violet-400" />}
                                </div>
                            </div>

                            <h2 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                {found ? "Match Found!" : "Finding Your Opponent"}
                                {!found && <span className="fm-dots" />}
                            </h2>
                            <p className="mx-auto mt-2 max-w-sm text-center text-xs text-zinc-400 sm:text-sm">
                                {found
                                    ? "Opponent locked in. Get your keyboard ready."
                                    : "Scanning for active coders with matching preferences"}
                            </p>

                            {!found && (
                                <div className="mx-auto mt-5 max-w-sm">
                                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                                        <div className="h-full rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.7)] transition-all duration-1000 ease-linear" style={{ width: `${pct}%` }} />
                                    </div>
                                    <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                                        Timeout in {secondsLeft}s
                                    </p>
                                </div>
                            )}


                            {found && (
                                <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 shadow-[0_0_30px_-8px_rgba(52,211,153,0.5)]">
                                    <div className="flex items-center justify-between gap-3">
                                        <Player name={me?.name || 'You'} image={me?.image} tag="You" />
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 font-mono text-sm font-black text-amber-300 shadow-[0_0_18px_-2px_rgba(251,191,36,0.6)]">
                                            VS
                                        </div>
                                        <Player name={playerFound || 'Opponent'} tag="Opponent" right />
                                    </div>
                                    <p className="mt-3 animate-pulse text-center font-mono text-xs text-emerald-300/80">
                                        Initializing match session...
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                {params.map(({ label, value, icon: Icon }) => (
                                    <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3 transition-colors hover:border-violet-500/30">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10">
                                            <Icon className="h-4 w-4 text-violet-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
                                            <p className="truncate text-sm font-bold capitalize text-white">{value || "N/A"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (

                        <div className="flex flex-col items-center py-4 text-center">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl bg-rose-500/20 blur-xl" />
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/25 to-rose-500/5 shadow-[0_0_26px_-4px_rgba(244,63,94,0.6)]">
                                    <Frown className="h-10 w-10 text-rose-400" />
                                </div>
                            </div>

                            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                No Opponent Found
                            </h2>
                            <p className="mt-2 max-w-sm text-xs text-zinc-400 sm:text-sm">
                                No active players matched your exact configuration. Try adjusting parameters or searching again.
                            </p>

                            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={startSearch}
                                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_22px_-4px_rgba(167,139,250,0.8)] transition-all hover:bg-violet-400 active:scale-95"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Retry Match
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        socketRef.current?.close();
                                        router.back();
                                    }}
                                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-200 transition-all hover:border-white/20 hover:bg-white/[0.07] active:scale-95"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Go Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                    @keyframes fm-ring { 0% { transform: scale(0.35); opacity: 0.9; } 100% { transform: scale(1.15); opacity: 0; } }
                    @keyframes fm-sweep { to { transform: rotate(360deg); } }
                    @keyframes fm-dots { 0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75%, 100% { content: '...'; } }
                    .fm-ring { animation: fm-ring 2.4s ease-out infinite; }
                    .fm-sweep { animation: fm-sweep 2.2s linear infinite; }
                    .fm-dots::after { content: ''; animation: fm-dots 1.4s steps(1) infinite; }
                    @media (prefers-reduced-motion: reduce) { .fm-ring, .fm-sweep, .fm-dots::after { animation: none; } }
                `}</style>
        </div>
    )
}

function Player({ name, image, tag, right = false }: { name: string; image?: string | null; tag: string; right?: boolean }) {
    return (
        <div className={`flex min-w-0 flex-1 items-center gap-3 ${right ? 'flex-row-reverse text-right' : ''}`}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-400/40 bg-white/[0.04]">
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                ) : right ? (
                    <span className="font-mono text-lg font-bold text-violet-300">{name.charAt(0).toUpperCase()}</span>
                ) : (
                    <User className="h-5 w-5 text-zinc-400" />
                )}
            </div>
            <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{tag}</p>
                <p className="truncate text-sm font-bold text-white">{name}</p>
            </div>
        </div>
    )
}