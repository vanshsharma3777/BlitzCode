'use client'
import { useState } from "react";
import TopicsCard from "./TopicsCard";


type Props = {
    heading?: string;
    setConfig?: React.Dispatch<React.SetStateAction<any>>
    widthMob?: string
    widthMd?: string
    widthLg?: string
};

export default function ConfigurationCard({ heading, setConfig, widthMob }: Props) {

    const [selected, setSelected] = useState("")
    function handleField(value: string) {
        setSelected(value)
        if (setConfig) {
            setConfig((prev: any) => {
                if (heading === "Language") return { ...prev, language: value }
                if (heading === "Topic") return { ...prev, topic: value }
                if (heading === "Question Type") return { ...prev, questionType: value }
                if (heading === "Difficulty Level") return { ...prev, difficulty: value }
                if (heading === "Question Length") return { ...prev, questionLength: value }

                return prev
            })
        }
    }
    return (
        <div className={`w-${widthMob} md:w-[70%] lg:w-[53%] bg-card mb-8 rounded-xl p-4 sm:p-5 md:p-6 text-pri border-2 border-border hover:border-neutral-700`}>
            <div>
                {heading && <div>
                    {heading === 'Language' &&
                        <div >
                            <div>
                                {heading}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <TopicsCard field="C" selected={selected} onClick={() => handleField("C")} />
                                <TopicsCard field="Python" selected={selected} onClick={() => handleField("python")} />
                                <TopicsCard field="Typescript" selected={selected} onClick={() => handleField("typescript")} />
                                <TopicsCard field="Java" selected={selected} onClick={() => handleField("java")} />
                                <TopicsCard field="Cpp" selected={selected} onClick={() => handleField("cpp")} />
                                <TopicsCard field="Javascript" selected={selected} onClick={() => handleField("javascript")} />
                            </div>
                        </div>
                    }
                    {heading === 'Topic' &&
                        <div >
                            <div>
                                {heading}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <TopicsCard field="Basics" selected={selected} onClick={() => handleField("Basics")} />
                                <TopicsCard field="Array" selected={selected} onClick={() => handleField("Array")} />
                                <TopicsCard field="String" selected={selected} onClick={() => handleField("String")} />
                                <TopicsCard field="Linked List" selected={selected} onClick={() => handleField("Linked List")} />
                                <TopicsCard field="Tree" selected={selected} onClick={() => handleField("Tree")} />
                                <TopicsCard field="Graph" selected={selected} onClick={() => handleField("Graph")} />
                            </div>
                        </div>
                    }
                    {heading === 'Question Type' &&
                        <div >
                            <div>
                                {heading}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <TopicsCard field="Single Correct" selected={selected} onClick={() => handleField("single correct")} />

                                <TopicsCard field="Multiple correct" selected={selected} onClick={() => handleField("multiple correct")} />

                                <TopicsCard field="Bugfixer" selected={selected} onClick={() => handleField("bugfixer")} />
                            </div>
                        </div>
                    }
                    {heading === 'Difficulty Level' &&
                        <div >
                            <div>
                                {heading}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <TopicsCard field="Easy" selected={selected} onClick={() => handleField("easy")} />
                                <TopicsCard field="Medium" selected={selected} onClick={() => handleField("medium")} />
                                <TopicsCard field="Hard" selected={selected} onClick={() => handleField("hard")} />
                            </div>
                        </div>
                    }
                    {heading === 'Question Length' &&
                        <div >
                            <div>
                                {heading}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <TopicsCard field="5" selected={selected} onClick={() => handleField("5")} />
                                <TopicsCard field="10" selected={selected} onClick={() => handleField("10")} />
                                <TopicsCard field="15" selected={selected} onClick={() => handleField("15")} />
                            </div>
                        </div>
                    }
                    {heading !== "Language" &&
                        heading !== "Topic" &&
                        heading !== "Question Type" &&
                        heading !== "Difficulty Level" &&
                        heading !== "Question Length" && (
                            <div className="">
                                {heading}
                            </div>
                        )}
                </div>

                }



            </div>

        </div>

    )
}