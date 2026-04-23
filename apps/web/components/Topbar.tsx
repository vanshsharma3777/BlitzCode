import Link from "next/link";
import { HiHome, HiAdjustmentsHorizontal, HiInformationCircle } from "react-icons/hi2";

export default function Topbar({ mode }: any) {
    let nav = mode === "multiplayer" ? "multiplayer" : "singleplayer";

    return (
        <header className="w-full px-4 md:px-0 mt-2">
            <div className="flex justify-around border border-border rounded-xl items-center bg-card p-2 md:p-3 shadow-sm">
                <nav className="flex items-center w-full overflow-x-auto no-scrollbar gap-1 md:gap-2 text-sm md:text-base font-medium">
                    <Link href="/home" replace className="flex-shrink-0">
                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-bg rounded-lg transition-colors active:scale-95">
                            <HiHome className="md:hidden text-xl" />
                            <span className="hidden md:inline">Home</span>
                        </button>
                    </Link>

                    <Link href={`/${nav}/configuration`} replace className="flex-shrink-0">
                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-bg rounded-lg transition-colors active:scale-95">
                            <HiAdjustmentsHorizontal className="md:hidden text-xl" />
                            <span className="hidden md:inline">Configuration</span>
                            <span className="md:hidden">Config</span>
                        </button>
                    </Link>

                    <Link href="/about" replace className="flex-shrink-0">
                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-bg rounded-lg transition-colors active:scale-95">
                            <HiInformationCircle className="md:hidden text-xl" />
                            <span className="hidden md:inline">About</span>
                        </button>
                    </Link>
                </nav>

                <div className="hidden md:flex pr-4 font-bold tracking-tighter text-xl">
                    <span className="text-accent">{"</>"}Blitz</span>Code
                </div>
            </div>
        </header>
    );
}