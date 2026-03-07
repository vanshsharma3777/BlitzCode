'use client'
import TopicsCard from "./TopicsCard";


type Props = {
    heading: string;
    setConfig: React.Dispatch<React.SetStateAction<any>>
    selected: string | null
};

export default function ConfigurationCard({ heading, setConfig , selected}: Props) {
    function handleField(value: string) {

        setConfig((prev: any) => {
            if (heading === "Language") return { ...prev, language: value }
            if (heading === "Topic") return { ...prev, topic: value }
            if (heading === "Question Type") return { ...prev, questionType: value }
            if (heading === "Difficulty Level") return { ...prev, difficulty: value }
            if (heading === "Question Length") return { ...prev, questionLength: value }
            
            return prev
        })

    }
    return (
        <div className=" w-[50%] bg-card mb-8 rounded-xl p-5 text-pri border-2 border-border hover:border-neutral-700">
            <div>
                {heading === 'Language' &&
                    <div >
                        <div>
                            {heading}
                        </div>
                        <div className="grid grid-cols-3 ">
                            <button onClick={(e) => handleField("c")} value={"c"} ><TopicsCard field={"C"} /></button>
                            <button onClick={(e) => handleField("python")} value={"python"}><TopicsCard field={"Python"} /></button>
                            <button onClick={(e) => handleField("typescript")} value={"typescript"}><TopicsCard field={"Typescript"} /></button>
                            <button onClick={(e) => handleField("java")} value={"java"}><TopicsCard field={"Java"} /></button>
                            <button onClick={(e) => handleField("cpp")} value={"cpp"}><TopicsCard field={"C++"} /></button>
                            <button onClick={(e) => handleField("javascript")} value={"javascript"}><TopicsCard field={"Javascript"} /></button>
                        </div>
                    </div>
                }
                {heading === 'Topic' &&
                    <div >
                        <div>
                            {heading}
                        </div>
                        <div className="grid grid-cols-3 ">
                            <button onClick={(e) => handleField("Basics")} value={"Basics"}><TopicsCard field={"Basics"} /></button>
                            <button onClick={(e) => handleField("Array")} value={"Array"}><TopicsCard field={"Array"} /></button>
                            <button onClick={(e) => handleField("String")} value={"String"}><TopicsCard field={"String"} /></button>
                            <button onClick={(e) => handleField("Linked List")} value={"Linked List"}><TopicsCard field={"Linked List"} /></button>
                            <button onClick={(e) => handleField("Tree")} value={"Tree"}><TopicsCard field={"Tree"} /></button>
                            <button onClick={(e) => handleField("Graph")} value={"Graph"}><TopicsCard field={"Graph"} /></button>
                        </div>
                    </div>
                }
                {heading === 'Question Type' &&
                    <div >
                        <div>
                            {heading}
                        </div>
                        <div className="grid grid-cols-3 ">
                            <button onClick={(e) => handleField("single correct")} value={"single correct"}><TopicsCard field={"Single Correct"} /></button>
                            <button onClick={(e) => handleField("multiple correct")} value={"multiple correct"}><TopicsCard field={"Multiple correct"} /></button>
                            <button onClick={(e) => handleField("bugfixer")} value={"bugfixer"}><TopicsCard field={"Bug-Fixer"} /></button>
                        </div>
                    </div>
                }
                {heading === 'Difficulty Level' &&
                    <div >
                        <div>
                            {heading}
                        </div>
                        <div className="grid grid-cols-3 ">
                            <button onClick={(e) => handleField("easy")} value={"easy"}><TopicsCard field={"Easy"} /></button>
                            <button onClick={(e) => handleField("medium")} value={"medium"}><TopicsCard field={"Medium"} /></button>
                            <button onClick={(e) => handleField("hard")} value={"hard"}><TopicsCard field={"Hard"} /></button>
                        </div>
                    </div>
                }
                {heading === 'Question Length' &&
                    <div >
                        <div>
                            {heading}
                        </div>
                        <div className="grid grid-cols-3 ">
                            <button onClick={(e) => handleField("5")} value={"5"}><TopicsCard field={"5"} /></button>
                            <button onClick={(e) => handleField("10")} value={"10"}><TopicsCard field={"10"} /></button>
                            <button onClick={(e) => handleField("15")} value={"15"}><TopicsCard field={"15"} /></button>
                        </div>
                    </div>
                }

            </div>

        </div>

    )
}