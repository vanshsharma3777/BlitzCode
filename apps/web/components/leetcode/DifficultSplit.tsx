"use client";

import { useState } from "react";

interface DifficultySplitProps {
    easy: number;
    medium: number;
    hard: number;
    total: number;

    easySubmissions?: number;
    mediumSubmissions?: number;
    hardSubmissions?: number;
}

type Difficulty = "Easy" | "Medium" | "Hard";
type DifficultyColor = "emerald" | "amber" | "rose";

interface DifficultyConfig {
    solved: number;
    submissions: number;
    color: DifficultyColor;
    description: string;
}

export default function DifficultySplit({
    easy,
    medium,
    hard,
    total,
    easySubmissions = 0,
    mediumSubmissions = 0,
    hardSubmissions = 0,
}: DifficultySplitProps) {
    const [selected, setSelected] = useState<Difficulty>("Easy");

    const difficulties: Record<Difficulty, DifficultyConfig> = {
        Easy: {
            solved: easy,
            submissions: easySubmissions,
            color: "emerald",
            description:
                "Fundamental problems focused on basic algorithms, data structures and implementation.",
        },

        Medium: {
            solved: medium,
            submissions: mediumSubmissions,
            color: "amber",
            description:
                "Problems requiring stronger algorithmic thinking, optimization and combining multiple concepts.",
        },

        Hard: {
            solved: hard,
            submissions: hardSubmissions,
            color: "rose",
            description:
                "Advanced problems that usually require deeper algorithmic insight, optimization and careful implementation.",
        },
    };

    const current = difficulties[selected];

    const acceptanceRate =
        current.submissions > 0
            ? Math.round((current.solved / current.submissions) * 100)
            : 0;

    const solvedPercentage =
        total > 0 ? Math.round((current.solved / total) * 100) : 0;

    return (
        <div className="relative overflow-hidden mt-6 rounded-2xl border border-white/10 bg-[#121212]/80 p-6 backdrop-blur-xl shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />

            <div className="relative z-10">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-500">
                        Problem analysis
                    </p>

                    <h2 className="text-xl font-bold text-white mt-1">
                        Difficulty breakdown
                    </h2>

                    <p className="text-sm text-zinc-500 mt-1">
                        Select a difficulty to inspect the detailed performance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                    <DifficultyCard
                        label="Easy"
                        solved={easy}
                        submissions={easySubmissions}
                        selected={selected === "Easy"}
                        onClick={() => setSelected("Easy")}
                        color="emerald"
                    />

                    <DifficultyCard
                        label="Medium"
                        solved={medium}
                        submissions={mediumSubmissions}
                        selected={selected === "Medium"}
                        onClick={() => setSelected("Medium")}
                        color="amber"
                    />

                    <DifficultyCard
                        label="Hard"
                        solved={hard}
                        submissions={hardSubmissions}
                        selected={selected === "Hard"}
                        onClick={() => setSelected("Hard")}
                        color="rose"
                    />
                </div>

                {/* Selected Evaluation Detail Section */}
                <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-2.5 h-2.5 rounded-full ${getDotColor(
                                        current.color
                                    )} shadow-[0_0_8px_currentColor]`}
                                />

                                <h3 className="text-lg font-semibold text-white">
                                    {selected} evaluation
                                </h3>
                            </div>

                            <p className="text-sm text-zinc-500 mt-2 max-w-xl">
                                {current.description}
                            </p>
                        </div>

                        {/* Pie / Donut Chart Component */}
                        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-3.5 rounded-xl shrink-0">
                            <PieChart
                                percentage={acceptanceRate}
                                color={current.color}
                            />
                            <div>
                                <p className="text-xs text-zinc-400 font-medium">
                                    Acceptance Ratio
                                </p>
                                <p className="text-lg font-bold text-white mt-0.5">
                                    {acceptanceRate}%
                                </p>
                                <p className="text-[10px] text-zinc-500">
                                    {current.solved} / {current.submissions} Accepted
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                        <EvaluationStat label="Solved" value={current.solved} />

                        <EvaluationStat
                            label="Submissions"
                            value={current.submissions}
                        />

                        <EvaluationStat
                            label="Acceptance"
                            value={`${acceptanceRate}%`}
                        />

                        <EvaluationStat
                            label="Share of solved"
                            value={`${solvedPercentage}%`}
                        />
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-zinc-500">
                                Acceptance rate
                            </span>

                            <span className="text-xs font-semibold text-zinc-300">
                                {current.solved} / {current.submissions}
                            </span>
                        </div>

                        <div className="h-2 rounded-full bg-zinc-900/80 border border-white/5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                                    current.color
                                )}`}
                                style={{
                                    width: `${acceptanceRate}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-zinc-500">
                                Contribution to solved problems
                            </span>

                            <span className="text-xs font-semibold text-zinc-300">
                                {current.solved} / {total}
                            </span>
                        </div>

                        <div className="h-2 rounded-full bg-zinc-900/80 border border-white/5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                                    current.color
                                )}`}
                                style={{
                                    width: `${solvedPercentage}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ============================================================= */
/* Pie Chart SVG Helper Component                                */
/* ============================================================= */

function PieChart({
    percentage,
    color,
}: {
    percentage: number;
    color: DifficultyColor;
}) {
    const strokeColors = {
        emerald: "#34d399",
        amber: "#fbbf24",
        rose: "#fb7185",
    };

    const strokeColor = strokeColors[color];
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
                {/* Background Ring */}
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="5"
                    fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke={strokeColor}
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            <span className="absolute text-[11px] font-bold text-white">
                {percentage}%
            </span>
        </div>
    );
}

function DifficultyCard({
    label,
    solved,
    submissions,
    selected,
    onClick,
    color,
}: {
    label: Difficulty;
    solved: number;
    submissions: number;
    selected: boolean;
    onClick: () => void;
    color: DifficultyColor;
}) {
    const acceptanceRate =
        submissions > 0 ? Math.round((solved / submissions) * 100) : 0;

    return (
        <button
            onClick={onClick}
            className={`
                text-left
                rounded-xl
                border
                p-4
                transition-all
                duration-200
                cursor-pointer
                ${
                    selected
                        ? getSelectedCardColor(color)
                        : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
                }
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-2 h-2 rounded-full ${getDotColor(
                            color
                        )} shadow-[0_0_6px_currentColor]`}
                    />

                    <span className="text-sm font-medium text-zinc-300">
                        {label}
                    </span>
                </div>

                {selected && (
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Selected
                    </span>
                )}
            </div>

            <div className="mt-4 flex items-end justify-between">
                <div>
                    <p className="text-2xl font-bold text-white">
                        {solved}
                    </p>

                    <p className="text-xs text-zinc-600 mt-0.5">
                        solved
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-400">
                        {acceptanceRate}%
                    </p>

                    <p className="text-[10px] text-zinc-600">
                        acceptance
                    </p>
                </div>
            </div>

            <div className="mt-4 h-1.5 rounded-full bg-zinc-900/80 border border-white/5 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${getBarColor(
                        color
                    )}`}
                    style={{
                        width: `${acceptanceRate}%`,
                    }}
                />
            </div>
        </button>
    );
}

function EvaluationStat({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-colors duration-200 hover:border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                {label}
            </p>

            <p className="text-lg font-semibold text-zinc-200 mt-1">
                {value}
            </p>
        </div>
    );
}

function getDotColor(color: DifficultyColor) {
    if (color === "emerald") return "bg-emerald-400 text-emerald-400";
    if (color === "amber") return "bg-amber-400 text-amber-400";
    return "bg-rose-400 text-rose-400";
}

function getBarColor(color: DifficultyColor) {
    if (color === "emerald") return "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]";
    if (color === "amber") return "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]";
    return "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]";
}

function getSelectedCardColor(color: DifficultyColor) {
    if (color === "emerald") {
        return "border-emerald-500/30 bg-emerald-500/[0.06] shadow-[0_0_20px_rgba(16,185,129,0.12)]";
    }

    if (color === "amber") {
        return "border-amber-500/30 bg-amber-500/[0.06] shadow-[0_0_20px_rgba(245,158,11,0.12)]";
    }

    return "border-rose-500/30 bg-rose-500/[0.06] shadow-[0_0_20px_rgba(244,63,94,0.12)]";
}