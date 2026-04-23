import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type InputComponents = {
    show?: boolean,
    currentIndex: number,
    questionType?: 'single correct' | 'bugfixer' | 'multple correct',
    handleSubmit: () => void,
    data: {
        questionId: string;
        description: string;
        code?: string;
        options: {
            id: string;
            text: string;
        }[];
    }[];
    currentAnswer?: {
        questionId: string;
        userAnswer: string[];
    };

    selectOption: (
        questionId: string,
        optionId: string,
        questionType: string
    ) => void;

    questionLength: number;

    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function QuestionDescription({ show, currentIndex, questionType, handleSubmit, data, currentAnswer, setIsSubmitting, selectOption, questionLength, setCurrentIndex
}: InputComponents) {
    console.log("current index" , currentIndex)
    console.log("current index" , data[currentIndex])
    return (
        <div className={`w-[85%] bg-card border select-none border-border  rounded-xl py-8 transform transition-all duration-200 ease-out${show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"} text-pri  rounded-xl`}>
            <div className="flex ">
                <div className="bg-sec  ml-5 px-3 py-3 rounded-xl flex items-center">
                    QUESTION NO {currentIndex + 1}
                </div>
                <div className="bg-bg ml-2 px-3 py-3 rounded-xl flex items-center">
                    {questionType?.toUpperCase()}
                </div>
                <div className=" fixed right-5 flex gap-3">
                    <button onClick={() => {
                        setCurrentIndex((prev) => Math.max(prev - 1, 0));
                    }}
                        className="bg-bg  px-5 py-2 rounded-xl border hover:bg-accent border-border hover:border-blue-600 flex items-center  transition-all duration-300 font-semibold text-2xl ease-in-out hover:scale-105 ">
                        {"<"}
                    </button>
                    <button onClick={() => {
                        setCurrentIndex((prev) => Math.min(prev + 1, data.length - 1));
                    }}
                        className="bg-bg  px-5 py-2 rounded-xl border hover:bg-accent border-border hover:border-blue-600 flex items-center  transition-all duration-300 font-semibold text-2xl ease-in-out hover:scale-105 ">
                        {">"}
                    </button>
                </div>
            </div>

            <div className="ml-5 mt-5 pr-5 ">
                <p className="text-2xl font-medium mb-5">{data[currentIndex]?.description}</p>
                <div className="">
                    {data[currentIndex]?.code?.trim() ? (
                        <SyntaxHighlighter
                            language="javascript" style={vscDarkPlus} customStyle={{
                                borderRadius: "12px",
                                padding: "16px",
                                fontSize: "20px",
                                marginBottom: "12px",
                            }}
                        >
                            {data[currentIndex]?.code}
                        </SyntaxHighlighter>
                    ) : null}
                </div>
                {data[currentIndex]?.options?.map((opt) => {

                    const isSelected = currentAnswer?.userAnswer.includes(opt.id)

                    return (
                        <button
                            key={opt.id}
                            onClick={() =>
                                selectOption(data[currentIndex]?.questionId!, opt.id, questionType!)
                            }
                            className={`border flex flex-col w-full rounded-xl py-3 pl-4 mb-2 transition-all duration-200 ease-in-out hover:scale-[1.01]
                                        ${isSelected
                                    ? "bg-accent border-accent"
                                    : "bg-bg border-border hover:border-accent"
                                }`}
                        >
                            <div className="flex items-center">
                                <div className="pr-1">
                                    <div className="bg-card flex items-center justify-center text-xl text-sec h-10 w-10 rounded-full">
                                        {opt.id}
                                    </div>
                                </div>

                                <div className="pl-1 flex justify-start">
                                    {opt.text}
                                </div>
                            </div>
                        </button>
                    )
                })}
                <div className="flex flex-row-reverse gap-x-3 mt-3 ">
                    <button onClick={() => {
                        handleSubmit()
                    }}
                        className="bg-bg  px-5 py-2 rounded-xl border hover:bg-accent border-border hover:border-blue-600 flex items-center  transition-all duration-300 font-semibold text-2xl ease-in-out hover:scale-105 ">
                        Submit
                    </button>

                </div>
            </div>


        </div>
    )
}