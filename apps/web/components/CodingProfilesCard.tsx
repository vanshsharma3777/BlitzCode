'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ExternalLink, Loader2, Link as LinkIcon, Check, Code, Award } from "lucide-react"

interface CodingProfilesCardProps {
    userEmail?: string | null
}

export default function CodingProfilesCard({ userEmail }: CodingProfilesCardProps) {
    const router = useRouter()

    const [leetcodeUsername, setLeetcodeUsername] = useState("")
    const [savedLeetcodeUsername, setSavedLeetcodeUsername] = useState("")
    const [leetcodeLoading, setLeetcodeLoading] = useState(false)
    const [leetcodeError, setLeetcodeError] = useState("")
    const [leetcodeConnected, setLeetcodeConnected] = useState(false)
    const [leetcodeImgError, setLeetcodeImgError] = useState(false)

    const [codeforcesUsername, setCodeforcesUsername] = useState("")
    const [savedCodeforcesUsername, setSavedCodeforcesUsername] = useState("")
    const [codeforcesLoading, setCodeforcesLoading] = useState(false)
    const [codeforcesError, setCodeforcesError] = useState("")
    const [codeforcesConnected, setCodeforcesConnected] = useState(false)
    const [codeforcesImgError, setCodeforcesImgError] = useState(false)

    useEffect(() => {
        const lcUsername = localStorage.getItem("blitzcode_leetcode_username")
        if (lcUsername) {
            setSavedLeetcodeUsername(lcUsername)
            setLeetcodeUsername(lcUsername)
            setLeetcodeConnected(true)
        }

        const cfUsername = localStorage.getItem("blitzcode_codeforces_username")
        if (cfUsername) {
            setSavedCodeforcesUsername(cfUsername)
            setCodeforcesUsername(cfUsername)
            setCodeforcesConnected(true)
        }
    }, [])

  
    const handleAddLeetCode = async () => {
        const username = leetcodeUsername.trim()
        if (!username) {
            setLeetcodeError("Enter your LeetCode username")
            return
        }

        try {
            setLeetcodeLoading(true)
            setLeetcodeError("")

            const res = await axios.get(`/api/leetcode/${encodeURIComponent(username)}`)
            if (!res.data?.success || !res.data?.data?.username) {
                throw new Error("Invalid profile")
            }

            const actualUsername = res.data.data.username
            localStorage.setItem("blitzcode_leetcode_username", actualUsername)
            setSavedLeetcodeUsername(actualUsername)
            setLeetcodeUsername(actualUsername)
            setLeetcodeConnected(true)
        } catch (error) {
            console.error("Failed to connect LeetCode:", error)
            setLeetcodeError("Could not find this LeetCode profile.")
        } finally {
            setLeetcodeLoading(false)
        }
    }

    const handleRemoveLeetCode = () => {
        localStorage.removeItem("blitzcode_leetcode_username")
        setSavedLeetcodeUsername("")
        setLeetcodeUsername("")
        setLeetcodeConnected(false)
        setLeetcodeError("")
    }

    const handleAddCodeforces = async () => {
    const username = codeforcesUsername.trim()

    if (!username) {
        setCodeforcesError("Enter your Codeforces handle")
        return
    }

    try {
        setCodeforcesLoading(true)
        setCodeforcesError("")

        const res = await axios.get(
            `/api/codeforces/${encodeURIComponent(username)}`
        )

        if (
            !res.data?.success ||
            !res.data?.data?.profile?.handle
        ) {
            throw new Error("Invalid profile")
        }

        const actualUsername = res.data.data.profile.handle

        localStorage.setItem(
            "blitzcode_codeforces_username",
            actualUsername
        )

        setSavedCodeforcesUsername(actualUsername)
        setCodeforcesUsername(actualUsername)
        setCodeforcesConnected(true)

    } catch (error) {
        console.error("Failed to connect Codeforces:", error)

        setCodeforcesError(
            "Could not find this Codeforces profile."
        )
    } finally {
        setCodeforcesLoading(false)
    }
}

    const handleRemoveCodeforces = () => {
        localStorage.removeItem("blitzcode_codeforces_username")
        setSavedCodeforcesUsername("")
        setCodeforcesUsername("")
        setCodeforcesConnected(false)
        setCodeforcesError("")
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="relative overflow-hidden bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
                <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-80" />

                <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 w-10 h-10">
                                {!leetcodeImgError ? (
                                    <img
                                        src="/leetcode.png"
                                        alt="LeetCode Logo"
                                        className="w-5 h-5 object-contain"
                                        onError={() => setLeetcodeImgError(true)}
                                    />
                                ) : (
                                    <Code className="w-5 h-5 text-orange-400" />
                                )}
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-[var(--primary-text)]">LeetCode Profile</h2>
                                <p className="text-xs text-[var(--secondary-text)]">Showcase problem solving stats</p>
                            </div>
                        </div>

                        {leetcodeConnected && (
                            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                <Check className="w-3.5 h-3.5" />
                                Connected
                            </div>
                        )}
                    </div>

                    {!leetcodeConnected ? (
                        <div className="space-y-3 mt-4">
                            <label className="text-[11px] font-mono text-[var(--secondary-text)] uppercase tracking-wider font-semibold">
                                Username
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        value={leetcodeUsername}
                                        onChange={(e) => {
                                            setLeetcodeUsername(e.target.value)
                                            setLeetcodeError("")
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddLeetCode()}
                                        placeholder="e.g. __sharmaji01__"
                                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)] text-xs text-[var(--primary-text)] outline-none focus:border-orange-400/60 transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={handleAddLeetCode}
                                    disabled={leetcodeLoading}
                                    className="h-10 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-60 cursor-pointer"
                                >
                                    {leetcodeLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Connect"}
                                </button>
                            </div>
                            {leetcodeError && <p className="text-xs text-rose-400">{leetcodeError}</p>}
                        </div>
                    ) : (
                        <div className="p-3.5 rounded-2xl bg-[var(--bg-sec)] border border-[var(--borders)] flex items-center justify-between mt-4">
                            <div>
                                <p className="text-[10px] text-[var(--secondary-text)] uppercase font-mono font-semibold">Linked Handle</p>
                                <p className="font-mono font-semibold text-sm text-[var(--primary-text)]">{savedLeetcodeUsername}</p>
                            </div>
                            <button onClick={handleRemoveLeetCode} className="text-xs text-rose-400 hover:underline cursor-pointer">
                                Unlink
                            </button>
                        </div>
                    )}
                </div>

                {leetcodeConnected && (
                    <button
                        onClick={() => router.push(`/profile/leetcode?username=${encodeURIComponent(savedLeetcodeUsername)}`)}
                        className="mt-5 w-full h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer"
                    >
                        <ExternalLink className="w-3.5 h-3.5" /> View Detailed Stats
                    </button>
                )}
            </div>

            <div className="relative overflow-hidden bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
                <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-80" />

                <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 w-10 h-10">
                                {!codeforcesImgError ? (
                                    <img
                                        src="/codeforces.png"
                                        alt="Codeforces Logo"
                                        className="w-5 h-5 object-contain"
                                        onError={() => setCodeforcesImgError(true)}
                                    />
                                ) : (
                                    <Award className="w-5 h-5 text-blue-400" />
                                )}
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-[var(--primary-text)]">Codeforces Profile</h2>
                                <p className="text-xs text-[var(--secondary-text)]">Showcase competitive ratings & ranks</p>
                            </div>
                        </div>

                        {codeforcesConnected && (
                            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                <Check className="w-3.5 h-3.5" />
                                Connected
                            </div>
                        )}
                    </div>

                    {!codeforcesConnected ? (
                        <div className="space-y-3 mt-4">
                            <label className="text-[11px] font-mono text-[var(--secondary-text)] uppercase tracking-wider font-semibold">
                                Handle
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        value={codeforcesUsername}
                                        onChange={(e) => {
                                            setCodeforcesUsername(e.target.value)
                                            setCodeforcesError("")
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddCodeforces()}
                                        placeholder="e.g. tourist"
                                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)] text-xs text-[var(--primary-text)] outline-none focus:border-blue-400/60 transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={handleAddCodeforces}
                                    disabled={codeforcesLoading}
                                    className="h-10 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-60 cursor-pointer"
                                >
                                    {codeforcesLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Connect"}
                                </button>
                            </div>
                            {codeforcesError && <p className="text-xs text-rose-400">{codeforcesError}</p>}
                        </div>
                    ) : (
                        <div className="p-3.5 rounded-2xl bg-[var(--bg-sec)] border border-[var(--borders)] flex items-center justify-between mt-4">
                            <div>
                                <p className="text-[10px] text-[var(--secondary-text)] uppercase font-mono font-semibold">Linked Handle</p>
                                <p className="font-mono font-semibold text-sm text-[var(--primary-text)]">{savedCodeforcesUsername}</p>
                            </div>
                            <button onClick={handleRemoveCodeforces} className="text-xs text-rose-400 hover:underline cursor-pointer">
                                Unlink
                            </button>
                        </div>
                    )}
                </div>

                {codeforcesConnected && (
                    <button
                        onClick={() => router.push(`/profile/codeforces?username=${encodeURIComponent(savedCodeforcesUsername)}`)}
                        className="mt-5 w-full h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer"
                    >
                        <ExternalLink className="w-3.5 h-3.5" /> View Detailed Stats
                    </button>
                )}
            </div>

        </div>
    )
}