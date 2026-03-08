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
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 ">
                                <button onClick={(e) => handleField("c")} value={"c"} ><TopicsCard field={"C"} selected={selected} /></button>
                                <button onClick={(e) => handleField("python")} value={"python"}><TopicsCard field={"Python"} selected={selected} /></button>
                                <button onClick={(e) => handleField("typescript")} value={"typescript"}><TopicsCard field={"Typescript"} selected={selected} /></button>
                                <button onClick={(e) => handleField("java")} value={"java"}><TopicsCard field={"Java"} selected={selected} /></button>
                                <button onClick={(e) => handleField("cpp")} value={"cpp"}><TopicsCard field={"Cpp"} selected={selected} /></button>
                                <button onClick={(e) => handleField("javascript")} value={"javascript"}><TopicsCard field={"Javascript"} selected={selected} /></button>
                            </div>
                        </div>
                    }
                    {heading === 'Topic' &&
                        <div >
                            <div>
                                {heading}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 ">
                                <button onClick={(e) => handleField("Basics")} value={"Basics"}><TopicsCard field={"Basics"} selected={selected} /></button>
                                <button onClick={(e) => handleField("Array")} value={"Array"}><TopicsCard field={"Array"} selected={selected} /></button>
                                <button onClick={(e) => handleField("String")} value={"String"}><TopicsCard field={"String"} selected={selected} /></button>
                                <button onClick={(e) => handleField("Linked List")} value={"Linked List"}><TopicsCard field={"Linked List"} selected={selected} /></button>
                                <button onClick={(e) => handleField("Tree")} value={"Tree"}><TopicsCard field={"Tree"} selected={selected} /></button>
                                <button onClick={(e) => handleField("Graph")} value={"Graph"}><TopicsCard field={"Graph"} selected={selected} /></button>
                            </div>
                        </div>
                    }
                    {heading === 'Question Type' &&
                        <div >
                            <div>
                                {heading}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 ">
                                <button onClick={(e) => handleField("single correct")} value={"single correct"}><TopicsCard field={"Single Correct"} selected={selected} /></button>
                                <button onClick={(e) => handleField("multiple correct")} value={"multiple correct"}><TopicsCard field={"Multiple correct"} selected={selected} /></button>
                                <button onClick={(e) => handleField("bugfixer")} value={"bugfixer"}><TopicsCard field={"Bugfixer"} selected={selected} /></button>
                            </div>
                        </div>
                    }
                    {heading === 'Difficulty Level' &&
                        <div >
                            <div>
                                {heading}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <button onClick={(e) => handleField("easy")} value={"easy"}><TopicsCard field={"Easy"} selected={selected} /></button>
                                <button onClick={(e) => handleField("medium")} value={"medium"}><TopicsCard field={"Medium"} selected={selected} /></button>
                                <button onClick={(e) => handleField("hard")} value={"hard"}><TopicsCard field={"Hard"} selected={selected} /></button>
                            </div>
                        </div>
                    }
                    {heading === 'Question Length' &&
                        <div >
                            <div>
                                {heading}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 ">
                                <button onClick={(e) => handleField("5")} value={"5"}><TopicsCard field={"5"} selected={selected} /></button>
                                <button onClick={(e) => handleField("10")} value={"10"}><TopicsCard field={"10"} selected={selected} /></button>
                                <button onClick={(e) => handleField("15")} value={"15"}><TopicsCard field={"15"} selected={selected} /></button>
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