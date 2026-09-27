'use client'

import { useState } from "react"
import { User, Shield, Mail, Calendar, Code } from "lucide-react"

interface ProfileHeaderProps {
    session: any
    currentRank: { title: string; color: string; bg: string }
}

export default function ProfileHeader({ session, currentRank }: ProfileHeaderProps) {
    const [imgError, setImgError] = useState(false)
    const userImage = session?.user?.image

    return (
        <div className="relative overflow-hidden rounded-3xl bg-[var(--card-bg)] border border-[var(--borders)] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative shrink-0">
                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden border-2 border-[var(--borders)] bg-[var(--bg-sec)] flex items-center justify-center shadow-xl">
                        {userImage && !imgError ? (
                            <img
                                src={userImage}
                                alt={session?.user?.name || "User Avatar"}
                                className="h-full w-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <User className="h-12 w-12 text-[var(--secondary-text)]" />
                        )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[var(--player-you)] border-4 border-[var(--card-bg)] shadow-md" />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--primary-text)] font-sans">
                            {session?.user?.name || "BlitzCoder"}
                        </h1>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-wide uppercase ${currentRank.bg} ${currentRank.color} self-center sm:self-auto`}>
                            <Shield className="w-3.5 h-3.5" />
                            <span>{currentRank.title}</span>
                        </div>
                    </div>

                    <p className="text-sm text-[var(--secondary-text)] flex items-center justify-center sm:justify-start gap-2">
                        <Mail className="w-4 h-4 text-[var(--accent)]" />
                        <span>{session?.user?.email}</span>
                    </p>

                    <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3 text-xs font-mono text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)]">
                            <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" /> Active Member
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)]">
                            <Code className="w-3.5 h-3.5 text-[var(--accent)]" /> Full-Stack Competitor
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}