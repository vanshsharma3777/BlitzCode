import Link from "next/link";
import { FaUser } from "react-icons/fa";

<FaUser />
export default function Topbar({mode}:any) {
    let nav 
    if(mode === "singleplayer"){
        nav= "singleplayer"
    }else if(mode==='multiplayer'){
        nav="multiplayer"
    }
    return (
        <header className=" ">
            <div className="flex justify-between border-border rounded-xl items-center bg-card p-3 pl-8 text-xl ">
                <div>
                    <Link href="/home" replace>
                        <button className="px-2">Home</button>
                    </Link>
                    <Link href={`/${nav}/configuration`} replace>
                        <button className="px-2">Configuration</button>
                    </Link>
                    <Link href="/about" replace>
                        <button className="px-2">About</button>
                    </Link>
                    
                </div>
                
            </div>
        </header>
    )
}