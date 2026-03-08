'use client'

import { useEffect, useState } from "react";
import ConfigurationCard from "../../../components/atoms/ConfiguratinCard";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";

export default function Configuration(){
   const router = useRouter()
       const [loader, setLoader] = useState(false)
       const [config, setConfig] = useState({
           language: null,
           topic: null,
           questionType: null as "single correct" | "multiple correct" | "bugfixer" | null,
           difficulty: null as "easy" | "medium" | "hard" | null,
           questionLength: null as "5" | "10" | "15" | null
       })
       useEffect(() => {
           console.log(config.topic)
           console.log(config.questionLength)
           console.log(config.questionType)
           console.log(config.difficulty)
           console.log(config.language)
           if (config.topic !== null && config.questionLength !== null && config.questionType !== null && config.difficulty !== null && config.language !== null) {
               setLoader(true)
   
               router.push(`/multiplayer/find-match?topic=${config.topic}&difficulty=${config.difficulty}&language=${config.language}&questionType=${config.questionType}&questionLength=${config.questionLength}`)
   
               setTimeout(() => {
                   setLoader(false)
               }, 2000)
           }
       }, [config])
   
       if (loader) return <Loader />
       return (
           <div className=" min-h-screen  text-pri ">
               <div className="flex flex-col items-center justify-center ">
                   <div className=" md:text-4xl text-3xl lg:text-5xl font-medium mt-5">
                       Set your Configuration
                   </div>
                   <div className="mt-4 mb-8">
                       Configure your preference to the best of your comfort
                   </div>
                   <ConfigurationCard heading="Language" setConfig={setConfig}   widthMob={"full"} widthMd={"70%"} widthLg = {"53%"} />
                   <ConfigurationCard heading="Topic" setConfig={setConfig}   widthMob={"full"} widthMd={"70%"} widthLg = {"53%"}/>
                   <ConfigurationCard heading="Question Type" setConfig={setConfig}   widthMob={"full"} widthMd={"70%"} widthLg = {"53%"}/>
                   <ConfigurationCard heading="Difficulty Level" setConfig={setConfig}   widthMob={"full"} widthMd={"70%"} widthLg = {"53%"}/>
                   <ConfigurationCard heading="Question Length" setConfig={setConfig}  widthMob={"full"} widthMd={"70%"} widthLg = {"53%"} />
   
               </div>
           </div>
       )
}