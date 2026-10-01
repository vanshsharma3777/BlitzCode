"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

import CodeforcesSummary from "../../../components/codeforces/CodeforcesSummary";
import CodeforcesHeader from "../../../components/codeforces/CodeforcesHeader";
import CodeforcesStats from "../../../components/codeforces/CodeforcesStats";

import {
    CFProfile,
    CFSubmission,
    RatingChange,
} from "../../../types/codeForcesTypes";
import CodingHeatmap from "../../../components/CodingHeatmap";
import RecentSubmissions from "../../../components/RecentSubmissions";
import Loader from "../../../components/Loader";

interface CFStats {
    acceptedSubmissions: number;
    contestsParticipated: number;
    currentRating: number;
    highestRating: number;
    solvedProblems: number;
    totalSubmissions: number;
}

interface CFData {
    profile: CFProfile;
    stats: CFStats;
    recentSubmissions: CFSubmission[];
}

export default function CodeforcesProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handle = searchParams.get("username");

    const [data, setData] = useState<CFData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!handle) {
            setError("Codeforces handle is missing");
            setLoading(false);
            return;
        }

        setLoading(true);

        axios
            .get(`/api/codeforces/${encodeURIComponent(handle)}`)
            .then((res) => {
                if (!res.data.success) {
                    throw new Error(res.data.error || "Not found");
                }

                setData(res.data.data);
                console.log(res.data)
            })
            .catch((err) => {
                console.error("CF profile fetch error:", err);
                setError("Could not load Codeforces profile.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [handle]);

    if (loading )  {
        return <Loader/>
    }

    if (error || !data) {
        return (
            <main className="min-h-screen bg-[#0d0d0c] flex items-center justify-center px-4 text-center relative overflow-hidden">
                <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />

                <div className="relative z-10 rounded-2xl border border-white/10 bg-[#121212]/80 p-8 backdrop-blur-xl shadow-2xl max-w-sm w-full">
                    <div className="text-4xl mb-4">⚠️</div>

                    <h2 className="text-xl font-bold text-white">
                        Profile Not Found
                    </h2>

                    <p className="text-xs text-neutral-400 mt-2">
                        {error || "User does not exist."}
                    </p>

                    <button
                        onClick={() => router.back()}
                        className="mt-6 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold transition duration-200 active:scale-95"
                    >
                        Go Back
                    </button>
                </div>
            </main>
        );
    }

    if(data.profile.avatar ==="https://userpic.codeforces.org/no-avatar.jpg"){
        data.profile.avatar = "https://assets.leetcode.com/users/default_avatar.jpg";
    }

    return (
        <main className="min-h-screen bg-[#0d0d0c] text-zinc-200 px-4 md:px-8 py-8 relative overflow-hidden">
            <div className="pointer-events-none absolute top-10 left-1/4 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 right-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

            <div className="max-w-7xl mx-auto space-y-6 relative z-10">

                

                <CodeforcesHeader
                    handle={data.profile.handle}
                    name={`${data.profile.firstName || ""} ${data.profile.lastName || ""}`.trim()}
                    country={data.profile.country}
                    organization={data.profile.organization}
                    avatar={data.profile.avatar}
                />

                <CodeforcesStats
                    acceptedSubmissions={data.stats.acceptedSubmissions}
                    contestsParticipated={data.stats.contestsParticipated}
                    currentRating={data.stats.currentRating}
                    highestRating={data.stats.highestRating}
                    solvedProblems={data.stats.solvedProblems}
                    totalSubmissions={data.stats.totalSubmissions}
                />
                <section
                    className="
                                  mt-6
                                  rounded-2xl
                                  border
                                  border-white/10
                                  bg-[#151514]
                                  p-5
                                  md:p-6
                              ">
                    <div className="mb-6">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                            Consistency
                        </p>

                        <h2 className="text-xl font-bold text-white mt-1">
                            Coding activity
                        </h2>

                        <p className="text-sm text-zinc-500 mt-1">
                            Your daily Codeforces submission
                            activity over the last year.
                        </p>
                    </div>
                    <CodingHeatmap recentSubmissions={data.recentSubmissions} />
                    
                </section>
                {/* Profile / Rating Summary */}
                <CodeforcesSummary
                    
                    rank={data.profile.rank || "N/A"}
                    maxRank={data.profile.maxRank || "N/A"}
                    contribution={data.profile.contribution ?? 0}
                />


                        <RecentSubmissions codeforcesSubmissions={data.recentSubmissions ?? []} />
            </div>
        </main>
    );
}