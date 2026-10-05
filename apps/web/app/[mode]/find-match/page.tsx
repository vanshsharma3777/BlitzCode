"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { connectSocket } from "../../../lib/websocket"
import Navbar from "../../../components/Navbar"
import {
    Frown, RotateCcw, ArrowLeft, Swords, Layers,
    Gauge, Code2, ListOrdered, Radar, User
} from "lucide-react"

const SEARCH_TIMEOUT_MS = 20000

export default function FindMatch() {
    const router = useRouter()
    const session = useSession()
    const searchParams = useSearchParams()
    const socketRef = useRef<WebSocket | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [found, setFound] = useState(false)
    const [noUserFound, setNoUserFound] = useState(false)
    const [playerFound, setPlayerFound] = useState<string | null>(null)
    const [elapsed, setElapsed] = useState(0)

    const topic = searchParams.get("topic")
    const language = searchParams.get("language")
    const questionLength = searchParams.get("questionLength")
    const questionType = searchParams.get("questionType")
    const difficulty = searchParams.get("difficulty")

    const startSearch = () => {
        const socket = socketRef.current
        if (!socket) return
        if (socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not open")
            return
        }

        setNoUserFound(false)
        setFound(false)
        setElapsed(0)

        socket.send(JSON.stringify({
            type: "init_game",
            payload: {
                topic,
                questionLength,
                questionType,
                difficulty,
                language,
            },
        }))

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setNoUserFound(true)
        }, SEARCH_TIMEOUT_MS)
    }

    useEffect(() => {
        const email = session.data?.user.email
        if (!email) return

        const socket = connectSocket()
        socketRef.current = socket

        const handleOpen = () => {
            console.log("🔥 FindMatch WebSocket OPEN")

            if (socket.readyState !== WebSocket.OPEN) return

            socket.send(JSON.stringify({
                type: "AUTH",
                meta: { emailId: email },
            }))
        }

        const handleMessage = (event: MessageEvent) => {
            let data: any

            try {
                data = JSON.parse(event.data)
            } catch {
                return
            }

            console.log("📥 WS:", data)

            if (data?.data === "AUTH OK") {
                startSearch()
                return
            }

            if (data?.type === "start_game") {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                }

                setFound(true)
                setPlayerFound(data.opponent)

                router.replace(
                    `/multiplayer/match-page?topic=${topic}&difficulty=${difficulty}&language=${language}&questionType=${questionType}&questionLength=${questionLength}`
                )

                return
            }

            if (
                data?.type === "error" &&
                data?.data === "Unauthenticated"
            ) {
                console.error("User unauthenticated")
            }
        }

        const handleError = (event: Event) => {
            console.error("WebSocket error:", event)
        }

        const handleClose = (event: CloseEvent) => {
            console.log(
                "WebSocket closed:",
                event.code,
                event.reason
            )
        }

        socket.addEventListener("open", handleOpen, { once: true })
        socket.addEventListener("message", handleMessage)
        socket.addEventListener("error", handleError)
        socket.addEventListener("close", handleClose)

        if (socket.readyState === WebSocket.OPEN) {
            handleOpen()
        }

        return () => {
            socket.removeEventListener("open", handleOpen)
            socket.removeEventListener("message", handleMessage)
            socket.removeEventListener("error", handleError)
            socket.removeEventListener("close", handleClose)

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [session.data?.user.email])

    useEffect(() => {
        if (found || noUserFound) return

        const id = setInterval(() => {
            setElapsed(e => Math.min(e + 1, SEARCH_TIMEOUT_MS / 1000))
        }, 1000)

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

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0d0d0c] text-zinc-200">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                    backgroundSize: "52px 52px",
                    maskImage:
                        "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 100%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 100%)",
                }}
            />

            <Navbar />

            <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
                <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#121212]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    {!noUserFound ? (
                        <>
                            <div className="flex justify-center">
                                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] ${
                                    found
                                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                                        : "border-violet-500/25 bg-violet-500/10 text-violet-300"
                                }`}>
                                    <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${
                                        found ? "bg-emerald-400" : "bg-violet-400"
                                    }`} />
                                    {found ? "Match found" : "Live matchmaking"}
                                </span>
                            </div>

                            <div className="relative mx-auto mt-6 flex h-44 w-44 items-center justify-center">
                                {[0, 1, 2].map(i => (
                                    <span
                                        key={i}
                                        className="fm-ring absolute inset-0 rounded-full border border-violet-400/40"
                                        style={{ animationDelay: `${i * 0.8}s` }}
                                    />
                                ))}

                                <span className="absolute inset-6 rounded-full border border-violet-400/20" />
                                <span className="absolute inset-12 rounded-full border border-violet-400/10" />

                                <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border ${
                                    found
                                        ? "border-emerald-500/40 bg-emerald-500/10"
                                        : "border-violet-500/30 bg-violet-500/10"
                                }`}>
                                    {found
                                        ? <Swords className="h-8 w-8 text-emerald-400" />
                                        : <Radar className="h-8 w-8 text-violet-400" />
                                    }
                                </div>
                            </div>

                            <h2 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                {found ? "Match Found!" : "Finding Your Opponent"}
                                {!found && <span className="fm-dots" />}
                            </h2>

                            <p className="mx-auto mt-2 max-w-sm text-center text-xs text-zinc-400 sm:text-sm">
                                {found
                                    ? "Connecting you with your opponent..."
                                    : "Scanning for active coders with matching preferences"}
                            </p>

                            {!found && (
                                <div className="mx-auto mt-5 max-w-sm">
                                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                                        <div
                                            className="h-full rounded-full bg-violet-400 transition-all duration-1000"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>

                                    <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                                        Timeout in {secondsLeft}s
                                    </p>
                                </div>
                            )}

                            {found && (
                                <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <Player
                                            name={me?.name || "You"}
                                            image={me?.image}
                                            tag="You"
                                        />

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 font-mono text-sm font-black text-amber-300">
                                            VS
                                        </div>

                                        <Player
                                            name={playerFound || "Opponent"}
                                            tag="Opponent"
                                            right
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                {params.map(({ label, value, icon: Icon }) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10">
                                            <Icon className="h-4 w-4 text-violet-400" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                                                {label}
                                            </p>
                                            <p className="truncate text-sm font-bold capitalize text-white">
                                                {value || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center py-4 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10">
                                <Frown className="h-10 w-10 text-rose-400" />
                            </div>

                            <h2 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl">
                                No Opponent Found
                            </h2>

                            <p className="mt-2 max-w-sm text-xs text-zinc-400 sm:text-sm">
                                No active players matched your exact configuration.
                            </p>

                            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={startSearch}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Retry Match
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        socketRef.current?.close()
                                        router.back()
                                    }}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-200"
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
                @keyframes fm-ring {
                    0% { transform: scale(.35); opacity: .9 }
                    100% { transform: scale(1.15); opacity: 0 }
                }
                @keyframes fm-dots {
                    0% { content: "" }
                    25% { content: "." }
                    50% { content: ".." }
                    75%,100% { content: "..." }
                }
                .fm-ring { animation: fm-ring 2.4s ease-out infinite }
                .fm-dots::after {
                    content: "";
                    animation: fm-dots 1.4s steps(1) infinite
                }
            `}</style>
        </div>
    )
}

function Player({
    name,
    image,
    tag,
    right = false,
}: {
    name: string
    image?: string | null
    tag: string
    right?: boolean
}) {
    return (
        <div className={`flex min-w-0 flex-1 items-center gap-3 ${right ? "flex-row-reverse text-right" : ""}`}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-400/40 bg-white/[0.04]">
                {image ? (
                    <img
                        src={image}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                    />
                ) : right ? (
                    <span className="font-mono text-lg font-bold text-violet-300">
                        {name.charAt(0).toUpperCase()}
                    </span>
                ) : (
                    <User className="h-5 w-5 text-zinc-400" />
                )}
            </div>

            <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                    {tag}
                </p>
                <p className="truncate text-sm font-bold text-white">
                    {name}
                </p>
            </div>
        </div>
    )
}