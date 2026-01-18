import { AnalysisData } from "../../types/allTypes";




export default function ContextDetails({analysisData}: {analysisData:AnalysisData}){
    return (
        <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
                    {[
                        { label: 'Topic', val: analysisData.topic, color: 'text-blue-400' },
                        { label: 'Language', val: analysisData.language, color: 'text-indigo-400' },
                        { label: 'Level', val: analysisData.difficulty, color: 'text-emerald-400' },
                        { label: 'Type', val: analysisData.questionType, color: 'text-orange-400' }
                    ].map((item, i) => (
                        <span key={i} className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                            {item.label}: <span className={item.color}>{item.val}</span>
                        </span>
                    ))}
                </div>
    )
}