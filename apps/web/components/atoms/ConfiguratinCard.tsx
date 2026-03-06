import SubmitBUtton from "../SubmitButton";
import TopicsCard from "./TopicsCard";
type Props = {
    heading: string;
};

export default function ConfigurationCard({ heading }: Props) {

    return (
        <div className=" w-[50%] bg-card mb-8 rounded-xl p-5 text-pri border-2 border-border hover:border-neutral-700">
            <div>
                {heading === 'Language' &&
                <div >
                    <div>
                        {heading}
                    </div>
                    <div className="grid grid-cols-3 ">
                        <button><TopicsCard field={"C"} /></button>
                        <button><TopicsCard field={"Python"} /></button>
                        <button><TopicsCard field={"Typescript"} /></button>
                        <button><TopicsCard field={"Java"} /></button>
                        <button><TopicsCard field={"C++"} /></button>
                        <button><TopicsCard field={"Javascript"} /></button>
                    </div>
                </div>
            }
            {heading === 'Topic' &&
                <div >
                    <div>
                        {heading}  
                    </div>
                    <div className="grid grid-cols-3 ">
                        <button><TopicsCard field={"Basics"} /></button>
                        <button><TopicsCard field={"Array"} /></button>
                        <button><TopicsCard field={"String"} /></button>
                        <button><TopicsCard field={"Linked List"} /></button>
                        <button><TopicsCard field={"Tree"} /></button>
                        <button><TopicsCard field={"Graph"} /></button>
                    </div>
                </div>
            }
            {heading === 'Question Type' &&
                <div >
                    <div>
                        {heading}  
                    </div>
                    <div className="grid grid-cols-3 ">
                        <button><TopicsCard field={"Single Correct"} /></button>
                        <button><TopicsCard field={"Multiple correct"} /></button>
                        <button><TopicsCard field={"Bug-Fixer"} /></button>
                    </div>
                </div>
            }
            {heading === 'Difficulty Level' &&
                <div >
                    <div>
                        {heading}  
                    </div>
                    <div className="grid grid-cols-3 ">
                        <button><TopicsCard field={"Easy"} /></button>
                        <button><TopicsCard field={"Medium"} /></button>
                        <button><TopicsCard field={"Hard"} /></button>
                    </div>
                </div>
            }
            {heading === 'Question Length' &&
                <div >
                    <div>
                        {heading}  
                    </div>
                    <div className="grid grid-cols-3 ">
                        <button><TopicsCard field={"5"} /></button>
                        <button><TopicsCard field={"10"} /></button>
                        <button><TopicsCard field={"15"} /></button>
                    </div>
                </div>
            }
            
            </div>
            
        </div>
        
    )
}