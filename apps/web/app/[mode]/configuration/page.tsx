'use client'

import { useEffect, useRef, useState } from "react";
import ConfigurationCard from "../../../components/atoms/ConfiguratinCard";
import { useParams, useRouter } from "next/navigation";
import Loader from "../../../components/Loader";
import { useSession } from "next-auth/react";
import axios from "axios";


export default function Configuration() {
    const router = useRouter()
    const params = useParams();
    const {status} = useSession()
    const mode = params.mode as string;
    const [loader, setLoader] = useState(false)
    const [config, setConfig] = useState({
        language: null,
        topic: null,
        questionType: null as "single correct" | "multiple correct" | "bugfixer" | null,
        difficulty: null as "easy" | "medium" | "hard" | null,
        questionLength: null as "5" | "10" | "15" | null
    })

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/signin")
        }
    }, [status, router])
    useEffect(() => {
        if (config.topic !== null && config.questionLength !== null && config.questionType !== null && config.difficulty !== null && config.language !== null) {
            setLoader(true)
            if (mode === 'multiplayer') router.push(`/multiplayer/find-match?topic=${config.topic}&difficulty=${config.difficulty}&language=${config.language}&questionType=${config.questionType}&questionLength=${config.questionLength}`)

            else if (mode === 'singleplayer') router.push(`/singleplayer/questions-page?topic=${config.topic}&difficulty=${config.difficulty}&language=${config.language}&questionType=${config.questionType}&questionLength=${config.questionLength}`)

            setTimeout(() => {
                setLoader(false)
            }, 2000)
        }
    }, [config])

    if (loader) return <Loader />
    return (
        <div className=" min-h-screen px-4 py-10 md:px-8  text-pri ">
            <div className="flex flex-col items-center justify-center max-w-7xl mx-auto ">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-5 text-center leading-tight">
                    Set your Configuration
                </h1>
                <p className="mt-4 mb-10 text-sec text-center max-w-md text-sm md:text-base">
                    Configure your preference to the best of your comfort
                </p>
                

                <div className="flex flex-col gap-6 w-full items-center">
                    <ConfigurationCard heading="Language" setConfig={setConfig} widthMob={"full"} widthMd={"80%"} widthLg={"60"} />
                    <ConfigurationCard heading="Topic" setConfig={setConfig} widthMob={"full"} widthMd={"80%"} widthLg={"60%"} />
                    <ConfigurationCard heading="Question Type" setConfig={setConfig} widthMob={"full"} widthMd={"80%"} widthLg={"60%"} />
                    <ConfigurationCard heading="Difficulty Level" setConfig={setConfig} widthMob={"full"} widthMd={"80%"} widthLg={"60%"} />
                    <ConfigurationCard heading="Question Length" setConfig={setConfig} widthMob={"full"} widthMd={"80%"} widthLg={"60%"} />

                </div>
            </div>
        </div>
    )
}