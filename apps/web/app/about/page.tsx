"use client"

import React from "react"
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
  ArrowLeft,
  Sparkles,
  Code2,
  Braces,
  Binary,
  GitBranch,
} from "lucide-react"

import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import Navbar from "../../components/Navbar"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--primary-text)] font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background Ambient Glows & Floating Code Icons */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[180px] pointer-events-none opacity-20 dark:opacity-15"
        style={{ background: "var(--accent)" }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-12 sm:pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--borders)] text-[var(--secondary-text)] hover:text-[var(--primary-text)] hover:border-[var(--accent)] transition-all duration-300 text-xs font-mono font-semibold mb-8 cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/25 text-[var(--accent)] text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_-3px_var(--accent-glow)] backdrop-blur-md">
          <Terminal className="w-3.5 h-3.5" />
          <span>Inside the Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight relative">
          <span className="text-[var(--secondary-text)] font-normal">The Story Behind</span>{" "}
          <br />
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center font-mono font-extrabold text-[var(--primary-text)] hover:scale-105 transition-transform duration-300 cursor-pointer mt-1"
          >
            <span className="opacity-70">&lt;/&gt;</span>Blitz
            <span className="text-[var(--accent)] drop-shadow-[0_0_25px_var(--accent-glow)]">Code</span>
          </button>
        </h1>

        <p className="text-[var(--secondary-text)] text-base sm:text-xl max-w-3xl leading-relaxed mx-auto font-normal">
          BlitzCode isn&apos;t just another quiz app. It&apos;s a high-performance ecosystem designed to turn
          passive learning into an active, competitive sport for developers.
        </p>
      </section>

      {/* Vision Cards Section */}
      <section className="py-20 px-6 bg-[var(--bg-sec)]/40 border-y border-[var(--borders)] relative overflow-hidden backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span>
                The Blitz<span className="text-[var(--accent)]">Code</span> Vision
              </span>
            </h2>
            <p className="text-[var(--secondary-text)] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
              BlitzCode was born out of a simple realization: technical growth stagnates in isolation.
              We’ve combined competitive mechanics with modern AI to create a faster feedback loop for developers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap size={22} />}
              bgIcon={<Code2 className="w-32 h-32" />}
              title="Eliminating Friction"
              description="No more long setups. BlitzCode provides instant environments and real-time multiplayer lobbies using high-performance WebSockets to ensure you spend 100% of your time coding."
            />
            <FeatureCard
              icon={<BrainCircuit size={22} />}
              bgIcon={<Bot className="w-32 h-32" />}
              title="AI-Driven Evolution"
              description="Static question banks get old. Our system leverages Gemini and Deepseek APIs to generate contextually relevant, logic-heavy questions that evolve with the industry."
            />
            <FeatureCard
              icon={<Target size={22} />}
              bgIcon={<Terminal className="w-32 h-32" />}
              title="Precision Feedback"
              description="It's not just about being right; it's about being efficient. We analyze your speed and accuracy against real competitors to highlight exactly where your logic needs tuning."
            />
          </div>

          <div className="relative mt-16 p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--borders)] shadow-2xl backdrop-blur-2xl max-w-4xl mx-auto overflow-hidden group">
            <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-80" />
            
            <p className="italic text-[var(--secondary-text)] text-base sm:text-lg leading-relaxed text-center font-normal relative z-10">
              &quot;BlitzCode was built to solve the &apos;tutorial hell&apos; problem. By introducing competition
              and real-time pressure, we simulate the high-stakes environment of real-world production engineering.&quot;
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto relative">
        <div className="text-center mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
            <Code2 className="w-4 h-4" /> Powering the Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--primary-text)] tracking-tight">
            The Tech Stack
          </h2>
          <p className="text-[var(--secondary-text)] text-sm sm:text-base max-w-2xl mx-auto">
            Built with modern, scalable tools to ensure sub-100ms latency and a seamless developer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TechCard
            icon={<Layers size={22} />}
            bgIcon={<Layers className="w-28 h-28" />}
            title="Architecture"
            tech="Turborepo"
            desc="A high-performance monorepo management system for blazing fast builds and shared packages."
          />
          <TechCard
            icon={<Database size={22} />}
            bgIcon={<Database className="w-28 h-28" />}
            title="Database & ORM"
            tech="Drizzle + Redis"
            desc="Type-safe database access with Drizzle, paired with Redis for ultra-fast caching and session management."
          />
          <TechCard
            icon={<Globe size={22} />}
            bgIcon={<Globe className="w-28 h-28" />}
            title="Real-time"
            tech="WebSockets"
            desc="Powering the multiplayer engine for instantaneous head-to-head coding battles."
          />
          <TechCard
            icon={<Cpu size={22} />}
            bgIcon={<Cpu className="w-28 h-28" />}
            title="Queue System"
            tech="BullMQ Workers"
            desc="Background workers handling the complex logic of generating, validating, and storing questions."
          />
          <TechCard
            icon={<Bot size={22} />}
            bgIcon={<Bot className="w-28 h-28" />}
            title="AI Intelligence"
            tech="Gemini, Deepseek, Mistral"
            desc="Multi-LLM integration via API keys to dynamically generate diverse and challenging code puzzles."
          />
          <TechCard
            icon={<Sparkles size={22} />}
            bgIcon={<Braces className="w-28 h-28" />}
            title="Frontend"
            tech="Next.js 14"
            desc="Leveraging Server Components and the latest React patterns for optimal performance."
          />
        </div>
      </section>

      {/* Social Connect Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-sec)] border-t border-[var(--borders)] relative">
        <div className="max-w-xl mx-auto space-y-4 mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--primary-text)]">
            Let&apos;s Connect
          </h2>
          <p className="text-[var(--secondary-text)] text-sm sm:text-base leading-relaxed">
            Have questions about the architecture or want to collaborate on something cool?
            Feel free to reach out to me through any of these platforms.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          <SocialLink href="https://x.com/itz_sharmaji001" icon={<FaXTwitter />} label="X" />
          <SocialLink href="https://github.com/vanshsharma3777" icon={<FaGithub />} label="GitHub" />
          <SocialLink
            href="https://www.linkedin.com/in/vansh-sharma-812199316/"
            icon={<FaLinkedin />}
            label="LinkedIn"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-[var(--borders)] bg-[var(--bg-main)] font-mono text-xs text-[var(--secondary-text)]">
        Built with ❤️ by{" "}
        <span className="text-[var(--accent)] font-bold text-sm">Vansh</span>
      </footer>
    </div>
  )
}


function FeatureCard({
  icon,
  bgIcon,
  title,
  description,
}: {
  icon: React.ReactNode
  bgIcon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group relative p-8 bg-[var(--card-bg)] border border-[var(--borders)] rounded-3xl hover:border-[var(--accent)] transition-all duration-500 shadow-xl backdrop-blur-2xl flex flex-col justify-between overflow-hidden">
      {/* Top Border Glow Accent */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="pointer-events-none absolute -right-6 -bottom-6 text-[var(--accent)] opacity-[0.035] -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110">
        {bgIcon}
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 bg-[var(--accent)]/15 border border-[var(--accent)]/30 rounded-2xl flex items-center justify-center text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_-3px_var(--accent-glow)]">
          {icon}
        </div>
        <h3 className="text-xl font-extrabold mb-3 text-[var(--primary-text)] tracking-tight">
          {title}
        </h3>
        <p className="text-[var(--secondary-text)] text-sm leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </div>
  )
}

function TechCard({
  icon,
  bgIcon,
  title,
  tech,
  desc,
}: {
  icon: React.ReactNode
  bgIcon: React.ReactNode
  title: string
  tech: string
  desc: string
}) {
  return (
    <div className="group relative p-7 rounded-3xl bg-[var(--card-bg)] border border-[var(--borders)] hover:border-[var(--accent)] transition-all duration-500 shadow-xl backdrop-blur-2xl flex flex-col justify-between overflow-hidden">
      {/* Top Border Glow Accent */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Background Watermark Icon */}
      <div className="pointer-events-none absolute -right-5 -bottom-5 text-[var(--accent)] opacity-[0.035] -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110">
        {bgIcon}
      </div>

      <div className="relative z-10">
        <div className="w-11 h-11 bg-[var(--bg-sec)] border border-[var(--borders)] rounded-2xl flex items-center justify-center mb-5 text-[var(--accent)] group-hover:scale-110 group-hover:border-[var(--accent)]/50 transition-all duration-300 shadow-sm">
          {icon}
        </div>
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--secondary-text)] mb-1">
          {title}
        </h3>
        <h4 className="text-lg font-extrabold mb-2.5 text-[var(--primary-text)] tracking-tight">
          {tech}
        </h4>
        <p className="text-[var(--secondary-text)] text-xs leading-relaxed font-normal">
          {desc}
        </p>
      </div>
    </div>
  )
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-6 py-3.5 bg-[var(--card-bg)] border border-[var(--borders)] rounded-2xl text-[var(--primary-text)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_25px_-5px_var(--accent-glow)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-lg font-semibold text-xs font-mono"
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </a>
  )
}