import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";
import { getServerSession } from "next-auth";
import { redis } from "../../../lib/configs/redis";
import { concat } from "drizzle-orm/gel-core/expressions";
import { extractJsonFromAI } from "../../../../workers/src/LLM/jsonConverter";
import { parse } from "path";

interface xyz {
    id: string,
    selectedOptionId: string
    text: string
}

interface SolvedQuestion {
    questionId: string;
    userAnswer: string[];
}

interface Data {
    attemptId: string;
    solvedQuestions: SolvedQuestion[];
    topic: string;
    language: string;
    questionType: string;
    questionLength: number
    difficulty: string;
}

type OriginalQuestion = {
    questionId: string;
    description: string;
    options: any[];
    correctAnswer: string[];
    explanation: string;
};

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({
            error: "Unauthenticated",
            success: false
        }, { status: 401 })
    }

    try {
        const { attemptId, topic, difficulty, language, questionType, questionLength, solvedQuestions }: Data = await request.json();
        if (!topic || !language || !difficulty || !questionType || !attemptId || !solvedQuestions || questionLength === undefined) {
            return NextResponse.json({
                success: false,
                error: "Data cannot be submitted",
            }, { status: 404 })
        }

        const poolKey = `questions:${topic}:${difficulty}:${language}:${questionType}`
        const result = solvedQuestions.map((opt) => {
            return opt.questionId
        })

        const rawQuestions = await redis.smembers(poolKey);
        const questions = Array.isArray(rawQuestions) ? rawQuestions : [rawQuestions]
        console.log( 'questions',questions[0])
        const parsedQuestions = questions.flatMap((group: any) =>
            Array.isArray(group)
                ? group.map((q: any) => {
                    const parsed = typeof q === "string" ? JSON.parse(q) : q;
                    return {
                        ...parsed,
                        questionId: parsed.questionId
                    };
                })
                : (() => {
                    const parsed = typeof group === "string" ? JSON.parse(group) : group;
                    return {
                        ...parsed,
                        questionId: parsed.questionId
                    };
                })()
        ).slice(0, questionLength);
        let correct = 0;

 let count =0
        
        solvedQuestions.forEach((attempt) => {
            const original = parsedQuestions.find( (q) =>
                  q.questionId === attempt.questionId,
                count++
            );
            if (!original) return;
            console.log("original" , original)
            console.log("attempt.questionId" , attempt.questionId)
            const userAns = attempt.userAnswer;
            const correctAns = original.correctOptions;

            if (areArraysEqual(userAns, correctAns)) {
                correct++;
            }
        });

        function areArraysEqual(a: string[], b: string[]) {
            if (a.length !== b.length) return false;
            return a.every(val => b.includes(val));
        }

        console.log("solvedQuestions " , solvedQuestions)
        console.log("parsedQuestions" , parsedQuestions)
        return NextResponse.json({
            correct,
            incorrect: parsedQuestions.length - correct,
            msg: "Answers evaluated successfully",
            originalQuestions: parsedQuestions
        });

    }
    catch (error) {
        console.log("errooooo")
        return NextResponse.json({
            error: error,
            success: false
        }, { status: 405 })
    }
}