"use client";

import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import LeetCodeHeader from "../../../components/leetcode/LeetCodeHeader";
import LeetCodeSummary from "../../../components/leetcode/LeetCodeSummary";
import BadgesSection from "../../../components/leetcode/BadgesSection";
import AboutSection from "../../../components/leetcode/AboutSection";
import DifficultySplit from "../../../components/leetcode/DifficultSplit";
import ContestPerformance from "../../../components/leetcode/ContestPerformance";
import LeetCodeStats from "../../../components/leetcode/LeetCodeStats";
import CodingHeatmap from "../../../components/CodingHeatmap";
import RecentSubmissions from "../../../components/RecentSubmissions";
import { LeetCodeData } from "../../../types/leetCode";

function LeetCodeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get("username");

    const [data, setData] = useState<LeetCodeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!username) {
            setError("LeetCode username is missing");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await axios.get(`/api/leetcode/${encodeURIComponent(username)}`);
                if (!res.data?.success) {
                    throw new Error(res.data?.error || "Failed to fetch LeetCode profile");
                }
                setData(res.data.data);
            } catch (err) {
                console.error("Failed to fetch LeetCode profile:", err);
                setError("Could not load this LeetCode profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    const handleBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push("/profile");
        }
    };

    if (loading) return <LoadingScreen />;

    if (error || !data) {
        return (
            <main className="min-h-screen bg-[#0d0d0c] text-white flex items-center justify-center px-5">
                <div className="text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold">Unable to load profile</h2>
                    <p className="text-sm text-zinc-500 mt-2">{error || "Profile not found"}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-6 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 transition text-sm font-semibold cursor-pointer"
                    >
                        Go Back
                    </button>
                </div>
            </main>
        );
    }

    const solved = data.stats.submissions.acSubmissionNum;
    const totalSolved = getDifficultyCount(solved, "All");
    const easySolved = getDifficultyCount(solved, "Easy");
    const mediumSolved = getDifficultyCount(solved, "Medium");
    const hardSolved = getDifficultyCount(solved, "Hard");
    const maxStreak = calculateMaxStreak(data.stats.calendar.submissionCalendar);

    const getTotalSubmissions = (difficulty: string) =>
        data.stats.submissions.totalSubmissionNum.find((item) => item.difficulty === difficulty)?.submissions ?? 0;

    return (
        <main className="min-h-screen bg-[#0d0d0c] text-zinc-200 px-4 md:px-8 py-6">
            <div className="max-w-[1250px] mx-auto">
                <button
                    onClick={handleBack}
                    aria-label="Go back to previous page"
                    className="group mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </button>

                <LeetCodeHeader
                    username={data.username}
                    realName={data.profile.realName}
                    avatar={data.profile.userAvatar}
                    country={data.profile.countryName}
                />

                <LeetCodeSummary
                    ranking={data.profile.ranking}
                    activeDays={data.stats.calendar.totalActiveDays}
                    reputation={data.profile.reputation}
                    profileViews={data.profile.postViewCount}
                />

                <section className="mt-6 rounded-2xl border border-white/10 bg-[#151514] p-5 md:p-6">
                    <div className="mb-6">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Consistency</p>
                        <h2 className="text-xl font-bold text-white mt-1">Coding activity</h2>
                        <p className="text-sm text-zinc-500 mt-1">
                            Your daily LeetCode submission activity over the last year.
                        </p>
                    </div>
                    <CodingHeatmap submissionCalendar={data.stats.calendar.submissionCalendar} />
                </section>

                <LeetCodeStats
                    totalSolved={totalSolved}
                    easySolved={easySolved}
                    mediumSolved={mediumSolved}
                    hardSolved={hardSolved}
                    contestRating={data.contest?.rating ?? null}
                    contests={data.contest?.attendedContestsCount ?? 0}
                    maxStreak={maxStreak}
                    currentStreak={data.stats.calendar.streak}
                />

                <section className="mt-5">
                    <DifficultySplit
                        easy={easySolved}
                        medium={mediumSolved}
                        hard={hardSolved}
                        total={totalSolved}
                        easySubmissions={getTotalSubmissions("Easy")}
                        mediumSubmissions={getTotalSubmissions("Medium")}
                        hardSubmissions={getTotalSubmissions("Hard")}
                    />
                </section>

                {data.contest && (
                    <ContestPerformance
                        rating={data.contest.rating}
                        globalRanking={data.contest.globalRanking}
                        contests={data.contest.attendedContestsCount}
                        topPercentage={data.contest.topPercentage}
                    />
                )}

                <RecentSubmissions leetcodeSubmissions={data.recentSubmissions} />

                <BadgesSection badges={data.badges} />

                <AboutSection
                    aboutMe={data.profile.aboutMe}
                    school={data.profile.school}
                    company={data.profile.company}
                    location={data.profile.location}
                />

                <footer className="py-10 text-center text-xs text-zinc-700">
                    LeetCode analytics powered by BlitzCode
                </footer>
            </div>
        </main>
    );
}

function getDifficultyCount(
    stats: { difficulty: string; count: number; submissions: number }[],
    difficulty: string
) {
    return stats.find((item) => item.difficulty === difficulty)?.count || 0;
}

function calculateMaxStreak(calendarString: string): number {
    let calendar: Record<string, number> = {};

    try {
        calendar = JSON.parse(calendarString || "{}");
    } catch {
        return 0;
    }

    const dates = Object.entries(calendar)
        .filter(([, count]) => count > 0)
        .map(([timestamp]) => {
            const date = new Date(Number(timestamp) * 1000);
            return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        })
        .sort((a, b) => a - b);

    if (dates.length === 0) return 0;

    let max = 1;
    let current = 1;
    const oneDay = 24 * 60 * 60 * 1000;

    for (let i = 1; i < dates.length; i++) {
        if (dates[i]! - dates[i - 1]! === oneDay) {
            current++;
            max = Math.max(max, current);
        } else {
            current = 1;
        }
    }

    return max;
}

function LoadingScreen() {
    return (
        <main className="min-h-screen bg-[#0d0d0c] flex items-center justify-center">
            <div className="text-center">
                <div className="w-9 h-9 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-zinc-500 mt-4">Loading LeetCode data...</p>
            </div>
        </main>
    );
}

export default function LeetCodePage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <LeetCodeContent />
        </Suspense>
    );
}