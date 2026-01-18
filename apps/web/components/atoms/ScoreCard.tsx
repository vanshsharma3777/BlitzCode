import { AnalysisData, Question , Theme } from "../../types/allTypes";


export default function ScoreCard({theme , correct , question , analysisData}:{theme:Theme , correct:number , question:Question[] , analysisData:AnalysisData}){

    
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">

                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center group relative backdrop-blur-sm">
                        <div className="relative h-32 w-32">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-800" strokeWidth="3" />
                                <circle
                                    cx="18" cy="18" r="16" fill="none"
                                    className={`${theme.stroke} transition-all duration-1000 ease-in-out`}
                                    strokeWidth="3"
                                    strokeDasharray={`${45}, 100`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-white">{correct}/{question.length}</span>
                                <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold">Score</span>
                            </div>
                        </div>
                        <div className="absolute -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-slate-700 text-white text-xs py-1 px-3 rounded-full">
                            Accuracy: {(correct / question.length) * 100}%
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 grid grid-cols-2 gap-4">
                        <div className="flex flex-col justify-center border-r border-slate-800/50">
                            <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Total Time</p>
                            <p className="text-2xl font-mono font-bold text-blue-400">{analysisData.totalTime}</p>
                        </div>
                        <div className="flex flex-col justify-center pl-2">
                            <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Status</p>
                            <p className={`text-2xl font-bold ${theme.text}`}>
                                {(correct / question.length) * 100 >= 50 ? 'Passed' : 'Failed'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/50">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                            <span className="text-xs font-bold uppercase tracking-tight text-slate-300">{correct} Correct</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/50">
                            <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></div>
                            <span className="text-xs font-bold uppercase tracking-tight text-slate-300">{question.length - correct} Incorrect</span>
                        </div>
                    </div>
                </div>
        </div>
    )
}