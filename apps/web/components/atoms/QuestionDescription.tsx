'use client'

import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChevronLeft, ChevronRight, Check, Send, Code } from "lucide-react";

type InputComponents = {
    show?: boolean;
    currentIndex: number;
    questionType?: 'single correct' | 'bugfixer' | 'multple correct';
    handleSubmit: () => void;
    data: {
        questionId: string;
        description: string;
        code?: string;
        options: {
            id: string;
            text: string;
        }[];
    }[];
    currentAnswer?: {
        questionId: string;
        userAnswer: string[];
    };
    selectOption: (
        questionId: string,
        optionId: string,
        questionType: string
    ) => void;
    questionLength: number;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function QuestionDescription({
    show,
    currentIndex,
    questionType,
    handleSubmit,
    data,
    currentAnswer,
    selectOption,
    questionLength,
    setCurrentIndex
}: InputComponents) {
    const currentQuestion = data[currentIndex];

    return (
        <div
            className={`w-full max-w-5xl mx-auto bg-[var(--card-bg)] border border-[var(--borders)] select-none rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl transform transition-all duration-300 ease-out ${
                show ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
            } text-[var(--primary-text)]`}
        >
            {/* Header / Badges & Nav Controls */}
            <div className="flex items-center justify-between gap-3 border-b border-[var(--borders)] pb-5 mb-6">
                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Question Number Badge */}
                    <div className="px-3.5 py-1.5 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] font-mono text-xs sm:text-sm font-bold tracking-wide">
                        QUESTION {currentIndex + 1} OF {questionLength}
                    </div>

                    {/* Question Type Badge */}
                    {questionType && (
                        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--borders)] text-[var(--secondary-text)] font-mono text-xs font-semibold tracking-wider uppercase">
                            <Code className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span>{questionType}</span>
                        </div>
                    )}
                </div>

                {/* Quick Prev / Next Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={currentIndex === 0}
                        className="p-2.5 rounded-xl border border-[var(--borders)] bg-[var(--bg-sec)] text-[var(--primary-text)] hover:border-[var(--accent)] hover:bg-[var(--card-hover)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
                        aria-label="Previous question"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, data.length - 1))}
                        disabled={currentIndex === data.length - 1}
                        className="p-2.5 rounded-xl border border-[var(--borders)] bg-[var(--bg-sec)] text-[var(--primary-text)] hover:border-[var(--accent)] hover:bg-[var(--card-hover)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
                        aria-label="Next question"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Question Text */}
            <div className="mb-6">
                <p className="text-lg sm:text-xl font-semibold leading-relaxed text-[var(--primary-text)]">
                    {currentQuestion?.description}
                </p>
            </div>

            {/* Code Block snippet */}
            {currentQuestion?.code?.trim() && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-[var(--borders)] shadow-lg">
                    <SyntaxHighlighter
                        language="javascript"
                        style={vscDarkPlus}
                        customStyle={{
                            borderRadius: "0px",
                            padding: "20px",
                            fontSize: "15px",
                            margin: 0,
                            background: "var(--bg-sec)",
                            lineHeight: "1.6"
                        }}
                    >
                        {currentQuestion.code}
                    </SyntaxHighlighter>
                </div>
            )}

            {/* Option Cards Grid */}
            <div className="space-y-3 mb-8">
                {currentQuestion?.options?.map((opt) => {
                    const isSelected = currentAnswer?.userAnswer?.includes(opt.id);

                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                                selectOption(currentQuestion.questionId, opt.id, questionType!)
                            }
                            className={`group relative flex items-center justify-between w-full p-4 rounded-2xl border text-left transition-all duration-200 ease-in-out cursor-pointer active:scale-[0.99] ${
                                isSelected
                                    ? "bg-[var(--accent)]/15 border-[var(--accent)] shadow-[0_0_20px_-5px_var(--accent-glow)] text-[var(--primary-text)] font-medium"
                                    : "bg-[var(--bg-sec)]/70 border-[var(--borders)] text-[var(--secondary-text)] hover:border-[var(--accent)]/50 hover:bg-[var(--card-hover)] hover:text-[var(--primary-text)]"
                            }`}
                        >
                            <div className="flex items-center gap-3.5 pr-4">
                                {/* Option Key Identifier Badge (A, B, C, D) */}
                                <div
                                    className={`flex items-center justify-center h-9 w-9 shrink-0 rounded-xl font-mono text-sm font-bold border transition-colors ${
                                        isSelected
                                            ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-md"
                                            : "bg-[var(--card-bg)] border-[var(--borders)] text-[var(--secondary-text)] group-hover:border-[var(--accent)]/40 group-hover:text-[var(--accent)]"
                                    }`}
                                >
                                    {opt.id}
                                </div>

                                {/* Option Text */}
                                <span className="text-sm sm:text-base leading-snug">
                                    {opt.text}
                                </span>
                            </div>

                            {/* Selection Radio / Check Indicator */}
                            <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                                    isSelected
                                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                        : "border-[var(--borders)] bg-transparent opacity-0 group-hover:opacity-100"
                                }`}
                            >
                                {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end border-t border-[var(--borders)] pt-5">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[var(--accent)]/25 transition-all duration-200 cursor-pointer active:scale-95"
                >
                    <Send className="w-4 h-4" />
                    <span>Submit Quiz</span>
                </button>
            </div>
        </div>
    );
}