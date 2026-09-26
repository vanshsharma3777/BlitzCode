'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loader from '../../components/Loader'
import Navbar from '../../components/Navbar'
import HeroSection from '../../components/HeroSection'
import ModeCard from '../../components/ModeCard'
import { User, Users } from 'lucide-react'

export default function HomePage() {
    const { status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/signin')
        }
    }, [status, router])

    if (status === 'loading') return <Loader />
    if (status === 'unauthenticated') return null

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--primary-text)] flex flex-col relative overflow-hidden transition-colors duration-300">
            
            <div 
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-25 dark:opacity-20"
                style={{ background: 'var(--accent)' }}
            />

            <Navbar />

            <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 relative z-10">
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                    <HeroSection />

                    <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-12 md:mt-16">
                        <ModeCard
                            title="Single Player"
                            description="Practice coding challenges at your own pace"
                            icon={<User className="h-6 w-6" />}
                            onClick={() => router.push('/singleplayer/configuration')}
                        />

                        <ModeCard
                            title="Multiplayer"
                            description="Challenge other coders in real-time battles"
                            icon={<Users className="h-6 w-6" />}
                            onClick={() => router.push('/multiplayer/configuration')}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}