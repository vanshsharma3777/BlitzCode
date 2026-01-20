import { AnalysisData, Question, Theme } from "../../types/allTypes";

export default function ScoreCard({ theme, correct, question, analysisData }: { theme: Theme, correct: number, question: Question[], analysisData: AnalysisData }) {
    const accuracy = (correct / question.length) * 100;
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-5">
            <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center group relative backdrop-blur-md overflow-hidden transition-all hover:border-slate-700">
                <div className={`absolute inset-0 opacity-5 blur-2xl transition-opacity group-hover:opacity-10 ${theme.bg}`} />
                <div className="relative h-36 w-36">
                    <svg className="h-full w-full -rotate-90 drop-shadow-2xl" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-800/50" strokeWidth="2.5" />
                        <circle
                            cx="18" cy="18" r="16" fill="none"
                            className={`${theme.stroke} transition-all duration-1000 ease-in-out`}
                            strokeWidth="2.5"
                            strokeDasharray={`${accuracy}, 100`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-3xl font-black text-white">{correct}</span>
                            <span className="text-slate-500 font-bold text-sm">/{question.length}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">Accuracy</span>
                    </div>
                </div>
                <div className={`mt-4 px-4 py-1 rounded-full border text-xl border-slate-700/50 bg-slate-900/80 text-[10px] font-bold ${theme.text} shadow-xl`}>
                    {accuracy.toFixed(1)}% Score
                </div>
            </div>
            <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 grid grid-cols-2 gap-6 relative backdrop-blur-md">
                <div className="flex flex-col justify-center border-r border-slate-800/50 pr-4">
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Total Duration</p>
                    <p className="text-3xl font-mono font-black text-blue-400 tracking-tight">{analysisData.totalTime} 
                        <span className="text-xl "> seconds</span></p>
                </div>
                <div className="flex flex-col justify-center pl-4">
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Performance</p>
                    <p className={`text-3xl font-black tracking-tight ${theme.text}`}>
                        {accuracy >= 50 ? 'Optimal' : 'Standard'}
                    </p>
                </div>
                <div className="group flex items-center gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50 transition-all hover:bg-slate-950/60">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Correct</p>
                        <p className="text-lg font-bold text-emerald-400">{correct}</p>
                    </div>
                </div>
                <div className="group flex items-center gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50 transition-all hover:bg-slate-950/60">
                    <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Incorrect</p>
                        <p className="text-lg font-bold text-red-400">{question.length - correct}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}