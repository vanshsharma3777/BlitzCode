"use client"

import React from 'react';
import {
    Cpu,
    Database,
    Globe,
    Layers,
    MessageSquare,
    Zap,
    Terminal,
    BrainCircuit,
    Bot,
    Target
} from 'lucide-react';

import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";

export default function AboutPage() {
    return (
        <div className="bg-bg text-pri min-h-screen font-sans selection:bg-accent selection:text-white">
            <section className="flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-6 animate-fade-in">
                    <Terminal size={16} />
                    <span>Inside the Engine</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    The Story Behind <br />
                    <span className="text-accent">BlitzCode</span>
                </h1>

                <p className="text-sec text-xl max-w-3xl mb-10 leading-relaxed mx-auto">
                    BlitzCode isn&apos;t just another quiz app. It&apos;s a high-performance ecosystem designed to turn
                    passive learning into an active, competitive sport for developers.
                </p>
            </section>

            <section className="py-24 px-6 bg-gradient-to-b from-card/50 to-bg border-y border-border relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 blur-[120px] pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                            <span className="text-accent">🚀</span> The BlitzCode Vision
                        </h2>
                        <p className="text-sec text-lg max-w-2xl mx-auto">
                            BlitzCode was born out of a simple realization: technical growth stagnates in isolation.
                            We’ve combined competitive mechanics with modern AI to create a faster feedback loop for developers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group p-8 bg-bg border border-border rounded-3xl hover:border-accent/50 transition-all shadow-sm">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Eliminating Friction</h3>
                            <p className="text-sec text-sm leading-relaxed">
                                No more long setups. BlitzCode provides instant environments and real-time multiplayer lobbies
                                using high-performance WebSockets to ensure you spend 100% of your time coding.
                            </p>
                        </div>
                        <div className="group p-8 bg-bg border border-border rounded-3xl hover:border-accent/50 transition-all shadow-sm">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                                <BrainCircuit size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI-Driven Evolution</h3>
                            <p className="text-sec text-sm leading-relaxed">
                                Static question banks get old. Our system leverages Gemini and Deepseek APIs to generate
                                contextually relevant, logic-heavy questions that evolve with the industry.
                            </p>
                        </div>

                        <div className="group p-8 bg-bg border border-border rounded-3xl hover:border-accent/50 transition-all shadow-sm">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                                <Target size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Precision Feedback</h3>
                            <p className="text-sec text-sm leading-relaxed">
                                It&apos;s not just about being right; it&apos;s about being efficient. We analyze your speed and
                                accuracy against real competitors to highlight exactly where your logic needs tuning.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 p-8 border-l-4 border-accent bg-accent/5 rounded-r-2xl max-w-4xl mx-auto italic text-sec text-lg">
                        &quot;BlitzCode was built to solve the &apos;tutorial hell&apos; problem. By introducing competition
                        and real-time pressure, we simulate the high-stakes environment of real-world production engineering.&quot;
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4">🛠️ The Tech Stack</h2>
                <p className="text-sec text-center mb-16 max-w-2xl mx-auto">Built with modern, scalable tools to ensure sub-100ms latency and a seamless developer experience.</p>

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
            <section className="py-24 px-6 text-center bg-gradient-to-b from-bg to-accent/5 border-t border-border">
                <h2 className="text-3xl font-bold mb-6">Let&apos;s Connect</h2>
                <p className="text-sec mb-10 max-w-xl mx-auto">
                    Have questions about the architecture or want to collaborate on something cool?
                    Feel free to reach out to me through any of these platforms.
                </p>

                <div className="flex justify-center gap-6 mb-16">
                    <SocialLink href="https://x.com/itz_sharmaji001" icon={<FaXTwitter />} label="X" />
                    <SocialLink href="https://github.com/vanshsharma3777" icon={<FaGithub />} label="GitHub" />
                    <SocialLink href="https://www.linkedin.com/in/vansh-sharma-812199316/" icon={<FaLinkedin />} label="LinkedIn" />
                </div>
            </section>

            <footer className="py-10 text-center text-sec/50 text-sm border-t border-border">
                <div className="text-2xl font-medium text-pri">
                    Built with ❤️ by <span className="text-accent font-bold">Vansh</span>
                </div>
            </footer>
        </div>
    );
}

function TechCard({ icon, title, tech, desc }: { icon: React.ReactNode, title: string, tech: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-card border border-border hover:border-accent transition-all group">
            <div className="w-12 h-12 bg-bg rounded-lg flex items-center justify-center mb-4 text-accent group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-sec mb-1">{title}</h3>
            <h4 className="text-xl font-bold mb-3 text-pri">{tech}</h4>
            <p className="text-sec text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-xl hover:border-accent hover:text-accent transition-all hover:-translate-y-1"
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </a>
    );
}