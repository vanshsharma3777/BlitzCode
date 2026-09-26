'use client'

import { useState } from "react"
import TopicsCard from "./TopicsCard"

type Props = {
    heading?: string
    setConfig?: React.Dispatch<React.SetStateAction<any>>
}

export default function ConfigurationCard({ heading, setConfig }: Props) {
    const [selected, setSelected] = useState<string>("")

    function handleField(value: string) {
        // Toggle feature: deselect if already selected
        const nextValue = selected === value ? "" : value
        setSelected(nextValue)

        if (setConfig) {
            setConfig((prev: any) => {
                const targetKey =
                    heading === "Language"
                        ? "language"
                        : heading === "Topic"
                        ? "topic"
                        : heading === "Question Type"
                        ? "questionType"
                        : heading === "Difficulty Level"
                        ? "difficulty"
                        : heading === "Question Length"
                        ? "questionLength"
                        : null

                if (!targetKey) return prev

                return {
                    ...prev,
                    [targetKey]: nextValue === "" ? null : nextValue
                }
            })
        }
    }

    const optionsMap: Record<string, { label: string; value: string }[]> = {
        Language: [
            { label: "C", value: "c" },
            { label: "Python", value: "python" },
            { label: "TypeScript", value: "typescript" },
            { label: "Java", value: "java" },
            { label: "C++", value: "cpp" },
            { label: "JavaScript", value: "javascript" }
        ],
        Topic: [
            { label: "Basics", value: "Basics" },
            { label: "Array", value: "Array" },
            { label: "String", value: "String" },
            { label: "Linked List", value: "Linked List" },
            { label: "Tree", value: "Tree" },
            { label: "Graph", value: "Graph" }
        ],
        "Question Type": [
            { label: "Single Correct", value: "single correct" },
            { label: "Multiple Correct", value: "multiple correct" },
            { label: "Bugfixer", value: "bugfixer" }
        ],
        "Difficulty Level": [
            { label: "Easy", value: "easy" },
            { label: "Medium", value: "medium" },
            { label: "Hard", value: "hard" }
        ],
        "Question Length": [
            { label: "5 Questions", value: "5" },
            { label: "10 Questions", value: "10" },
            { label: "15 Questions", value: "15" }
        ]
    }

    const currentOptions = heading ? optionsMap[heading] : undefined

    return (
        <div className="w-full bg-[var(--card-bg)] hover:bg-[var(--card-hover)]/40 rounded-2xl p-5 sm:p-6 text-[var(--primary-text)] border border-[var(--borders)] hover:border-[var(--accent)]/50 transition-all duration-300 shadow-xl backdrop-blur-md">
            {heading && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[var(--borders)] pb-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                            <h2 className="text-sm sm:text-base font-bold tracking-tight text-[var(--primary-text)]">
                                {heading}
                            </h2>
                        </div>
                        
                        {selected ? (
                            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 font-semibold capitalize">
                                {selected}
                            </span>
                        ) : (
                            <span className="text-[11px] font-mono text-[var(--text-muted)] italic">
                                None selected
                            </span>
                        )}
                    </div>

                    {currentOptions && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                            {currentOptions.map((item) => (
                                <TopicsCard
                                    key={item.value}
                                    field={item.label}
                                    value={item.value}
                                    selected={selected}
                                    onClick={() => handleField(item.value)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}