"use client"

import React from 'react';
import { ArrowRight, Zap, Target, Swords, BarChart3, Code2, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
   const router = useRouter()
  return (
    <div className="bg-bg text-pri min-h-screen font-sans selection:bg-accent selection:text-white">
      

      <section className="flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-6 animate-fade-in">
          <Zap size={16} />
          <span>New: Multiplayer Mode is Live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Level Up Your Coding <br />
          <span className="text-accent">Skills in Real-Time</span>
        </h1>
        
        <p className="text-sec text-xl max-w-2xl mb-10 leading-relaxed">
          Practice, compete, and improve with interactive coding quizzes designed to test both logic and speed.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <FeatureBadge icon={<Target size={18}/>} text="Solve questions" />
          <FeatureBadge icon={<Zap size={18}/>} text="Earn XP" />
          <FeatureBadge icon={<Swords size={18}/>} text="Compete in real-time" />
        </div>

        <button onClick={()=>{
         router.push("/home")
        }} className="px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent/90 transition-all hover:scale-105 flex items-center gap-2">
          Play Now — It's Free  <ArrowRight size={20} />
        </button>
      </section>

      <section className="py-20 px-6 bg-card/50 border-y border-border">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-accent">🧠</span> What is BlitzCode?
            </h2>
            <p className="text-sec text-lg mb-6 leading-relaxed">
              BlitzCode is a fast-paced coding platform built for the modern developer. Whether you're prepping for interviews or just love the thrill of logic puzzles, every question helps you get better.
            </p>
            <ul className="space-y-4">
              {["Instant feedback on performance", "Accuracy-based XP system", "Multiple coding question types"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sec">
                  <div className="h-2 w-2 rounded-full bg-accent" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-bg border border-border p-8 rounded-3xl shadow-2xl">
             <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
             </div>
             <code className="text-accent block mb-2">// BlitzCode.ts</code>
             <code className="text-pri block">while (alive) {"{"}</code>
             <code className="text-pri block ml-4">solve(challenges);</code>
             <code className="text-pri block ml-4">gain(XP);</code>
             <code className="text-pri block ml-4">enjoy();</code>
             <code className="text-pri block">{"}"}</code>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">🎮 Game Modes</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-card border-2 border-border hover:border-accent transition-all group">
             <div className="w-14 h-14 bg-bg rounded-xl flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
               <Code2 size={32} />
             </div>
             <h3 className="text-2xl font-bold mb-4">🧍 Single Player Mode</h3>
             <p className="text-sec mb-6">Perfect for building consistency and understanding core concepts at your own pace.</p>
             <ul className="text-sm space-y-3 text-sec/80">
               <li>• Detailed analysis of every answer</li>
               <li>• Logic-based coding questions</li>
               <li>• +50 XP per correct answer</li>
             </ul>
          </div>

          <div className="p-8 rounded-2xl bg-card border-2 border-border hover:border-accent transition-all group">
             <div className="w-14 h-14 bg-bg rounded-xl flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
               <Swords size={32} />
             </div>
             <h3 className="text-2xl font-bold mb-4">⚔️ Multiplayer Mode</h3>
             <p className="text-sec mb-6">Challenge another player. Both attempt the same set. Winner takes the glory.</p>
             <ul className="text-sm space-y-3 text-sec/80">
               <li>• Real-time head-to-head battles</li>
               <li>• Based on accuracy + speed</li>
               <li>• Win XP or lose it on defeat</li>
             </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-accent/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-card rounded-xl border border-border text-center">
                  <div className="text-3xl font-bold text-accent">+50</div>
                  <div className="text-xs text-sec uppercase tracking-widest mt-1">Single Player</div>
                </div>
                <div className="p-6 bg-card rounded-xl border border-border text-center">
                  <div className="text-3xl font-bold text-green-500">+25</div>
                  <div className="text-xs text-sec uppercase tracking-widest mt-1">Match Win</div>
                </div>
             </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-6">⚡ Progress Tracking</h2>
            <p className="text-sec text-lg mb-4">
              Your growth is measured through XP. After every quiz, get a complete breakdown of correct vs incorrect answers with step-by-step explanations.
            </p>
            <div className="flex items-center gap-4 text-accent font-semibold">
              <BarChart3 /> Detailed Performance Analysis
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">💻 Master Every Format</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Single Correct", "Multi-Correct", "Bug-Fixing"].map((type) => (
            <span key={type} className="px-6 py-3 bg-card border border-border rounded-full text-pri font-medium">
              {type}
            </span>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
           <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2">
             <Rocket className="text-accent" /> What’s Coming Next
           </h2>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 opacity-70">
              {["User Profiles", "Leaderboards", "Advanced Stats"].map(item => (
                <div key={item} className="p-4  bg-card hover:scale-105 border-2 border-border hover:border-accent transition-all rounded-lg text-sm font-semibold">{item}</div>
              ))}
           </div>
        </div>
      </section>

      <section className="py-32 px-6 text-center bg-gradient-to-b from-bg to-accent/10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to test your skills?</h2>
        <p className="text-sec text-xl mb-10">Start solving. Start competing. Start improving.</p>
        <button onClick={()=>{
         router.push("/about")
        }} className="px-10 py-5 bg-accent text-white rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl shadow-accent/20">
          Know About BiltzCode
        </button>
      </section>

      <footer className="py-10 text-center text-sec/50 text-sm border-t border-border">
       <div >
          © {new Date().getFullYear()} BlitzCode. Built for the competitive coder.
       </div>
       <div className='text-sec mt-2'>
          Built with ❤️ by Vansh
       </div>
      </footer>
    </div>
  );
}

function FeatureBadge({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2 text-sec bg-card border border-border px-4 py-2 rounded-lg">
      <span className="text-accent">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}