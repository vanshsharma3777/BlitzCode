'use client'

import { useState } from "react";
import ButtonLoader from "./btnLoader";

export default function SubmitBUtton(){
    const [btnLoader , setBtnLoader] = useState<boolean>(false)    
    return(
        <div>
            <button  className="mt-5 w-full border flex justify-center font-medium rounded-lg border-neutral-800 bg-bg py-2 hover:border-blue-700 hover:brightness-110 transform transiton-all duration-200 ease-in-out hover:scale-105">{btnLoader ? <ButtonLoader /> : "Submit"}</button> 
        </div>
    )
}