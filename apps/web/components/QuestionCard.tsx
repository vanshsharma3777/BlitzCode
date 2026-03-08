'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi"
import { MdOutlineTimer } from "react-icons/md";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
export default function QuestionCard() {
    const session = useSession()
    const [show, setShow] = useState(false)
    useEffect(() => {
        setShow(true);
    }, []);

    const options = [
        {
            key: "1",
            option: "xyz"
        },
        {
            key: "2",
            option: "pqr"
        },
        {
            key: "3",
            option: "abc"
        },
        {
            key: "4",
            option: "lmn"
        },
    ]

    const code = `function isPrime(n) {
  if (n <= 1) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}`
    return (
        <div className={`min-h-screen flex flex-col justify-center gap-5  items-center  text-pri `}>
            <div className="w-[85%] ">
                <div className="grid grid-cols-3 mt-16">
                    <div className="bg-card border border-border rounded-xl py-5 px-4 mr-5 flex items-center">
                        <div className="lg:pr-1 pr-3 ">
                            <MdOutlineTimer />
                        </div>
                        <div className="hidden  sm:inline  pr-3">
                            Time Left :
                        </div>
                        <div className="font-medium">
                            30:00 </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl py-5 px-4 mr-5 flex items-center">
                        <div className="lg:pr-1 pr-3">
                            <FaChartLine />
                        </div>
                        <div className="hidden sm:inline  pr-3">
                            Your Progress :
                        </div>
                        <div className="font-medium">
                            1 / 4
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl py-5 px-4  flex  items-center justify-center">
                        <div className="pr-2 hidden sm:inline">
                            <HiOutlineMail />
                        </div>
                        <div className="hidden sm:inline font-medium md:truncate">
                            {session.data?.user.email}
                        </div>
                        <div className=" lg:hidden md:hidden h-10 w-10 rounded-full overflow-hidden border border-border">
                            <img
                                src={session.data?.user.image || ""}
                                alt="profile"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`w-[85%] bg-card border border-border  rounded-xl py-8 transform transition-all duration-200 ease-out${show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"} text-pri  rounded-xl`}>
                <div className="flex ">
                    <div className="bg-bg  ml-5 px-3 py-3 rounded-xl flex items-center">
                        Question No
                    </div>
                    <div className="bg-bg ml-2 px-3 py-3 rounded-xl flex items-center">
                        Single Correct
                    </div>
                </div>

                <div className="ml-5 mt-5 pr-5 ">
                    <p className="text-2xl font-medium mb-5">What do you mean by space complexity</p>

                    <div className="">
                        {code?.trim() ? (
                            <SyntaxHighlighter
                                language="javascript" style={vscDarkPlus} customStyle={{
                                    borderRadius: "12px",
                                    padding: "16px",
                                    fontSize: "16px",
                                    marginBottom: "12px"
                                }}
                            >
                                {code}
                            </SyntaxHighlighter>
                        ) : null}
                    </div>
                    {options.map((opt) => (
                        <button key={opt.key} className="border flex flex-col w-full border-border hover:border-accent rounded-xl py-3 pl-4 mb-2 bg-bg transtion-all duration-200 ease-in-out hover:scale-[1.01]">
                            <div className=" flex items-center">
                                <div className="pr-1"><div className="bg-card flex items-center justify-center text-xl text-sec h-10 w-10 rounded-full">{opt.key === "1" ? "A"
                                    : opt.key === "2" ? "B"
                                        : opt.key === "3" ? "C"
                                            : "D"

                                }</div></div>
                                <div className="pl-1">{opt.option}</div>
                            </div>
                        </button>
                    ))}

                </div>
            </div>
        </div>
    )
}