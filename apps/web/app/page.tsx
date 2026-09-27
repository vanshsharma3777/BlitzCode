"use client"

import React from 'react';
import { ArrowRight, Zap, Target, Swords, BarChart3, Code2, Rocket, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function LandingPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--primary-text)] font-sans relative overflow-hidden transition-colors duration-300 selection:bg-[var(--accent)] selection:text-white">

            <div 
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 dark:opacity-15"
                style={{ background: 'var(--accent)' }}
            />

            

            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center pt-16 sm:pt-24 pb-20 px-6 text-center max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-mono font-medium tracking-wider uppercase mb-6 shadow-sm backdrop-blur-sm animate-fade-in">
                    <Zap className="w-4 h-4 text-[var(--accent)]" />
                    <span>Multiplayer Arena Live</span>
                </div>
                
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                    Level Up Your Coding <br />
                    <span className="text-[var(--accent)] drop-shadow-[0_0_25px_var(--accent-glow)]">Skills in Real-Time</span>
                </h1>
                
                <p className="text-[var(--secondary-text)] text-base sm:text-xl max-w-2xl mb-10 leading-relaxed font-normal">
                    Practice, compete, and improve with interactive coding quizzes designed to test both logic and speed.
                </p>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
                    <FeatureBadge icon={<Target size={18}/>} text="Solve Challenges" />
                    <FeatureBadge icon={<Zap size={18}/>} text="Earn XP & Rank Up" />
                    <FeatureBadge icon={<Swords size={18}/>} text="1v1 Real-Time Battles" />
                </div>

                <button 
                    onClick={() => router.push("/home")} 
                    className="group flex items-center gap-2.5 px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[var(--accent)]/25 hover:shadow-[0_0_25px_var(--accent-glow)] transition-all duration-200 cursor-pointer active:scale-95"
                >
                    <span>Play Now — It&apos;s Free</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
            </section>

            <section className="py-20 px-6 bg-[var(--bg-sec)]/50 border-y border-[var(--borders)] relative overflow-hidden backdrop-blur-md">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-extrabold flex items-center gap-3 text-[var(--primary-text)]">
                            <span className="text-[var(--accent)]">🧠</span> What is BlitzCode?
                        </h2>
                        <p className="text-[var(--secondary-text)] text-base sm:text-lg leading-relaxed">
                            BlitzCode is a fast-paced coding platform built for the modern developer. Whether you&apos;re prepping for technical interviews or love the thrill of logic puzzles, every challenge sharpens your edge.
                        </p>
                        <ul className="space-y-3">
                            {["Instant performance analysis & step-by-step explanations", "Accuracy-based XP progression system", "Multiple question formats: Single, Multi-Correct & Bugfixer"].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[var(--secondary-text)] text-sm font-medium">
                                    <div className="h-2 w-2 rounded-full bg-[var(--accent)] shrink-0" /> 
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[var(--card-bg)] border border-[var(--borders)] p-6 sm:p-8 rounded-3xl shadow-2xl font-mono text-sm sm:text-base leading-relaxed backdrop-blur-xl">
                        <div className="flex gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <code className="text-[var(--accent)] block mb-2">// BlitzCode.ts</code>
                        <code className="text-[var(--primary-text)] block">while (alive) {"{"}</code>
                        <code className="text-[var(--secondary-text)] block ml-4">solve(challenges);</code>
                        <code className="text-[var(--accent)] block ml-4">gain(XP);</code>
                        <code className="text-[var(--primary-text)] block ml-4">enjoy();</code>
                        <code className="text-[var(--primary-text)] block">{"}"}</code>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-16 text-[var(--primary-text)]">
                    🎮 Choose Your Arena
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--borders)] hover:border-[var(--accent)] transition-all duration-300 group shadow-xl backdrop-blur-md">
                        <div className="w-14 h-14 bg-[var(--bg-sec)] border border-[var(--borders)] rounded-2xl flex items-center justify-center mb-6 text-[var(--accent)] group-hover:scale-110 transition-transform shadow-sm">
                            <Code2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-[var(--primary-text)]">🧍 Single Player Mode</h3>
                        <p className="text-[var(--secondary-text)] text-sm mb-6 leading-relaxed">
                            Perfect for building consistency and mastering core data structures & algorithms at your own pace.
                        </p>
                        <ul className="text-xs sm:text-sm space-y-2.5 text-[var(--secondary-text)] font-medium">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Detailed analysis of every submission</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Topic & difficulty customization</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Earn +50 XP per correct answer</li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--borders)] hover:border-[var(--accent)] transition-all duration-300 group shadow-xl backdrop-blur-md">
                        <div className="w-14 h-14 bg-[var(--bg-sec)] border border-[var(--borders)] rounded-2xl flex items-center justify-center mb-6 text-[var(--accent)] group-hover:scale-110 transition-transform shadow-sm">
                            <Swords size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-[var(--primary-text)]">⚔️ Multiplayer Arena</h3>
                        <p className="text-[var(--secondary-text)] text-sm mb-6 leading-relaxed">
                            Challenge developers in 1v1 real-time WebSocket battles. Speed and accuracy determine the winner.
                        </p>
                        <ul className="text-xs sm:text-sm space-y-2.5 text-[var(--secondary-text)] font-medium">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Live matchmaking lobbies</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Accuracy + speed scoring system</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Competitive XP stakes (+25 / -25)</li>
                        </ul>
                    </div>
                </div>
            </section>

    
            <section className="py-20 px-6 bg-[var(--accent)]/5 border-y border-[var(--borders)]">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-[var(--card-bg)] rounded-2xl border border-[var(--borders)] text-center shadow-lg">
                                <div className="text-3xl font-extrabold text-[var(--accent)] font-mono">+50 XP</div>
                                <div className="text-xs text-[var(--secondary-text)] uppercase font-mono tracking-wider mt-1">Single Player Win</div>
                            </div>
                            <div className="p-6 bg-[var(--card-bg)] rounded-2xl border border-[var(--borders)] text-center shadow-lg">
                                <div className="text-3xl font-extrabold text-emerald-400 font-mono">+25 XP</div>
                                <div className="text-xs text-[var(--secondary-text)] uppercase font-mono tracking-wider mt-1">Arena Match Victory</div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <h2 className="text-3xl font-extrabold text-[var(--primary-text)]">⚡ Measured Progression</h2>
                        <p className="text-[var(--secondary-text)] text-base leading-relaxed">
                            Your growth is tracked transparently through XP. After every match, receive a breakdown of correct vs. incorrect answers alongside detailed explanations.
                        </p>
                        <div className="flex items-center gap-2.5 text-[var(--accent)] font-semibold text-sm">
                            <BarChart3 className="w-5 h-5" /> 
                            <span>Instant Post-Quiz Performance Analytics</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 text-center max-w-4xl mx-auto space-y-8">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--primary-text)]">💻 Master Diverse Formats</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {["Single Correct Choice", "Multi-Select Options", "Bugfixer Code Diagnostics"].map((type) => (
                        <span key={type} className="px-6 py-3 bg-[var(--card-bg)] border border-[var(--borders)] rounded-2xl text-[var(--primary-text)] font-semibold text-sm shadow-sm">
                            {type}
                        </span>
                    ))}
                </div>
            </section>

            <section className="py-20 px-6 border-t border-[var(--borders)] bg-[var(--bg-sec)]/30">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-[var(--primary-text)]">
                        <Rocket className="text-[var(--accent)] w-5 h-5" /> 
                        <span>What&apos;s Coming Next</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["User Profiles (Live)", "Global Leaderboards", "Custom Tournaments"].map((item, idx) => (
                            <div 
                                key={item} 
                                className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                                    idx === 0 
                                        ? "bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent)]" 
                                        : "bg-[var(--card-bg)] border-[var(--borders)] text-[var(--secondary-text)] opacity-80"
                                }`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-28 px-6 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--primary-text)] tracking-tight">
                        Ready to test your skills?
                    </h2>
                    <p className="text-[var(--secondary-text)] text-lg">
                        Start solving. Start competing. Start improving.
                    </p>
                    <button 
                        onClick={() => router.push("/about")} 
                        className="px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-2xl font-bold text-base shadow-xl shadow-[var(--accent)]/25 transition-all duration-200 cursor-pointer active:scale-95"
                    >
                        Explore BlitzCode Architecture
                    </button>
                </div>
            </section>

            <footer className="py-8 text-center text-[var(--secondary-text)] text-xs border-t border-[var(--borders)] space-y-2 bg-[var(--bg-main)]">
                <div>
                    © {new Date().getFullYear()} BlitzCode. Built for the competitive coder.
                </div>
                <div className="font-medium text-[var(--primary-text)]">
                    Built with ❤️ by <span className="text-[var(--accent)] font-extrabold font-mono">Vansh</span>
                </div>
            </footer>
        </div>
    );
}

function FeatureBadge({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-2 text-[var(--secondary-text)] bg-[var(--card-bg)] border border-[var(--borders)] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm">
            <span className="text-[var(--accent)]">{icon}</span>
            <span>{text}</span>
        </div>
    );
}