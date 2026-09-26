"use client"

import React from 'react';
import {
    Cpu,
    Database,
    Globe,
    Layers,
    Zap,
    Terminal,
    BrainCircuit,
    Bot,
    Target,
    ArrowLeft
} from 'lucide-react';

import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function AboutPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--primary-text)] font-sans relative overflow-hidden transition-colors duration-300">
            {/* Ambient Radial Background Glow */}
            <div 
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 dark:opacity-15"
                style={{ background: 'var(--accent)' }}
            />

            <Navbar />

            {/* Back Button & Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center pt-16 sm:pt-24 pb-16 px-6 text-center max-w-5xl mx-auto">
                <button 
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--borders)] text-[var(--secondary-text)] hover:text-[var(--primary-text)] hover:border-[var(--accent)] transition-all duration-200 text-xs font-mono font-semibold mb-8 cursor-pointer shadow-sm active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </button>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-mono font-medium tracking-wider uppercase mb-6 shadow-sm backdrop-blur-sm">
                    <Terminal className="w-4 h-4 text-[var(--accent)]" />
                    <span>Inside the Engine</span>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                    <span className="text-[var(--secondary-text)] font-normal">The Story Behind</span> <br />
                    <button 
                        onClick={() => router.back()}
                        className="group inline-flex items-center font-mono font-bold text-[var(--primary-text)] hover:scale-105 transition-transform cursor-pointer"
                    >
                        <span className="opacity-80">&lt;/&gt;</span>Blitz
                        <span className="text-[var(--accent)] drop-shadow-[0_0_20px_var(--accent-glow)]">Code</span>
                    </button>
                </h1>

                <p className="text-[var(--secondary-text)] text-base sm:text-xl max-w-3xl mb-10 leading-relaxed mx-auto font-normal">
                    BlitzCode isn&apos;t just another quiz app. It&apos;s a high-performance ecosystem designed to turn
                    passive learning into an active, competitive sport for developers.
                </p>
            </section>

            {/* Vision Section */}
            <section className="py-20 px-6 bg-[var(--bg-sec)]/50 border-y border-[var(--borders)] relative overflow-hidden backdrop-blur-md">
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-20"
                    style={{ background: 'var(--accent)' }}
                />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16 space-y-3">
                        <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center gap-3">
                            <span>🚀</span>
                            <span>
                                The Blitz<span className="text-[var(--accent)]">Code</span> Vision
                            </span>
                        </h2>
                        <p className="text-[var(--secondary-text)] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                            BlitzCode was born out of a simple realization: technical growth stagnates in isolation.
                            We’ve combined competitive mechanics with modern AI to create a faster feedback loop for developers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="group p-8 bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl hover:border-[var(--accent)] transition-all duration-300 shadow-xl backdrop-blur-md">
                            <div className="w-12 h-12 bg-[var(--accent)]/15 border border-[var(--accent)]/30 rounded-2xl flex items-center justify-center text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_-3px_var(--accent-glow)]">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[var(--primary-text)]">Eliminating Friction</h3>
                            <p className="text-[var(--secondary-text)] text-sm leading-relaxed">
                                No more long setups. BlitzCode provides instant environments and real-time multiplayer lobbies
                                using high-performance WebSockets to ensure you spend 100% of your time coding.
                            </p>
                        </div>

                        <div className="group p-8 bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl hover:border-[var(--accent)] transition-all duration-300 shadow-xl backdrop-blur-md">
                            <div className="w-12 h-12 bg-[var(--accent)]/15 border border-[var(--accent)]/30 rounded-2xl flex items-center justify-center text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_-3px_var(--accent-glow)]">
                                <BrainCircuit size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[var(--primary-text)]">AI-Driven Evolution</h3>
                            <p className="text-[var(--secondary-text)] text-sm leading-relaxed">
                                Static question banks get old. Our system leverages Gemini and Deepseek APIs to generate
                                contextually relevant, logic-heavy questions that evolve with the industry.
                            </p>
                        </div>

                        <div className="group p-8 bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl hover:border-[var(--accent)] transition-all duration-300 shadow-xl backdrop-blur-md">
                            <div className="w-12 h-12 bg-[var(--accent)]/15 border border-[var(--accent)]/30 rounded-2xl flex items-center justify-center text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_-3px_var(--accent-glow)]">
                                <Target size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[var(--primary-text)]">Precision Feedback</h3>
                            <p className="text-[var(--secondary-text)] text-sm leading-relaxed">
                                It&apos;s not just about being right; it&apos;s about being efficient. We analyze your speed and
                                accuracy against real competitors to highlight exactly where your logic needs tuning.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 p-6 sm:p-8 border-l-4 border-[var(--accent)] bg-[var(--accent)]/10 rounded-r-3xl max-w-4xl mx-auto italic text-[var(--secondary-text)] text-base sm:text-lg leading-relaxed shadow-lg backdrop-blur-md">
                        &quot;BlitzCode was built to solve the &apos;tutorial hell&apos; problem. By introducing competition
                        and real-time pressure, we simulate the high-stakes environment of real-world production engineering.&quot;
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16 space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--primary-text)]">🛠️ The Tech Stack</h2>
                    <p className="text-[var(--secondary-text)] text-sm sm:text-base max-w-2xl mx-auto">
                        Built with modern, scalable tools to ensure sub-100ms latency and a seamless developer experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TechCard
                        icon={<Layers size={24} />}
                        title="Architecture"
                        tech="Turborepo"
                        desc="A high-performance monorepo management system for blazing fast builds and shared packages."
                    />
                    <TechCard
                        icon={<Database size={24} />}
                        title="Database & ORM"
                        tech="Drizzle + Redis"
                        desc="Type-safe database access with Drizzle, paired with Redis for ultra-fast caching and session management."
                    />
                    <TechCard
                        icon={<Globe size={24} />}
                        title="Real-time"
                        tech="WebSockets"
                        desc="Powering the multiplayer engine for instantaneous head-to-head coding battles."
                    />
                    <TechCard
                        icon={<Cpu size={24} />}
                        title="Queue System"
                        tech="BullMQ Workers"
                        desc="Background workers handling the complex logic of generating, validating, and storing questions."
                    />
                    <TechCard
                        icon={<Bot size={24} />}
                        title="AI Intelligence"
                        tech="Gemini, Deepseek, Mistral"
                        desc="Multi-LLM integration via API keys to dynamically generate diverse and challenging code puzzles."
                    />
                    <TechCard
                        icon={<Zap size={24} />}
                        title="Frontend"
                        tech="Next.js 14"
                        desc="Leveraging Server Components and the latest React patterns for optimal performance."
                    />
                </div>
            </section>

            {/* Social Connect Section */}
            <section className="py-20 px-6 text-center bg-gradient-to-b from-[var(--bg-main)] to-[var(--card-bg)] border-t border-[var(--borders)]">
                <h2 className="text-3xl font-extrabold mb-4 text-[var(--primary-text)]">Let&apos;s Connect</h2>
                <p className="text-[var(--secondary-text)] text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed">
                    Have questions about the architecture or want to collaborate on something cool?
                    Feel free to reach out to me through any of these platforms.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <SocialLink href="https://x.com/itz_sharmaji001" icon={<FaXTwitter />} label="X" />
                    <SocialLink href="https://github.com/vanshsharma3777" icon={<FaGithub />} label="GitHub" />
                    <SocialLink href="https://www.linkedin.com/in/vansh-sharma-812199316/" icon={<FaLinkedin />} label="LinkedIn" />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center border-t border-[var(--borders)] bg-[var(--bg-main)]">
                <div className="text-base font-semibold text-[var(--primary-text)]">
                    Built with ❤️ by <span className="text-[var(--accent)] font-extrabold font-mono">Vansh</span>
                </div>
            </footer>
        </div>
    );
}

function TechCard({ icon, title, tech, desc }: { icon: React.ReactNode, title: string, tech: string, desc: string }) {
    return (
        <div className="p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--borders)] hover:border-[var(--accent)] transition-all duration-300 group shadow-xl backdrop-blur-md">
            <div className="w-12 h-12 bg-[var(--bg-sec)] border border-[var(--borders)] rounded-2xl flex items-center justify-center mb-4 text-[var(--accent)] group-hover:scale-110 transition-transform group-hover:border-[var(--accent)]/50 shadow-sm">
                {icon}
            </div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--secondary-text)] mb-1">{title}</h3>
            <h4 className="text-xl font-extrabold mb-3 text-[var(--primary-text)]">{tech}</h4>
            <p className="text-[var(--secondary-text)] text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 bg-[var(--card-bg)] border border-[var(--borders)] rounded-2xl text-[var(--primary-text)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_-5px_var(--accent-glow)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-md font-semibold text-sm"
        >
            {icon}
            <span>{label}</span>
        </a>
    );
}