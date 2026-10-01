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
        <div className="relative overflow-hidden rounded-3xl bg-[var(--card-bg)] border border-[var(--borders)] shadow-2xl backdrop-blur-xl">
            {/* Banner */}
            <div className="relative h-28 sm:h-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/35 via-purple-500/15 to-transparent" />
                <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(var(--borders)_1px,transparent_1px),linear-gradient(90deg,var(--borders)_1px,transparent_1px)] [background-size:28px_28px]" />
                <div className="absolute -top-12 -right-10 h-44 w-44 rounded-full blur-3xl bg-[var(--accent)]/30" />
                <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[var(--card-bg)] to-transparent" />
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-80" />
            </div>

            {/* Content, avatar banner ke upar overlap karta hai */}
            <div className="relative -mt-14 sm:-mt-16 px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-5">
                <div className={`relative shrink-0 ${currentRank.color}`}>
                    <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl overflow-hidden ring-2 ring-current shadow-[0_0_28px_-4px_currentColor] bg-[var(--bg-sec)] flex items-center justify-center">
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
                    <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[var(--player-you)] border-4 border-[var(--card-bg)] shadow-md" />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2.5 sm:pb-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--primary-text)] font-sans truncate">
                            {session?.user?.name || "BlitzCoder"}
                        </h1>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-wide uppercase ${currentRank.bg} ${currentRank.color} self-center sm:self-auto`}>
                            <Shield className="w-3.5 h-3.5" />
                            <span>{currentRank.title}</span>
                        </div>
                    </div>

                    <p className="text-sm text-[var(--secondary-text)] flex items-center justify-center sm:justify-start gap-2">
                        <Mail className="w-4 h-4 text-[var(--accent)]" />
                        <span className="truncate">{session?.user?.email}</span>
                    </p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 text-xs font-mono text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)] hover:border-[var(--accent)]/40 transition-colors">
                            <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" /> Active Member
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)] hover:border-[var(--accent)]/40 transition-colors">
                            <Code className="w-3.5 h-3.5 text-[var(--accent)]" /> Full-Stack Competitor
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}