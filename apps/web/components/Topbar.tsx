import { FaUser } from "react-icons/fa";

<FaUser />
export default function Topbar() {
    return (
        <header className="mt-5 ">
            <div className="flex gap-5 items-center bg-card p-3 pl-8 text-xl ">
                <button>Home</button>
                <button>About</button>
                <button>Analysis</button>
                <button>Fields</button>
                <button className="absolute right-8 flex justify-center items-center ">
                    <span className=" bg-neutral-800 rounded-full h-10 w-10 flex justify-center items-center "><FaUser color="#FFFFFF"></FaUser></span>
                </button>
            </div>
        </header>
    )
}