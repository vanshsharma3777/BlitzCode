import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";
import { redis } from "../../../lib/configs/redis";
import { extractJsonFromAI } from '../../../../workers/src/LLM/jsonConverter';


export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({
            success: false,
            error: "Unauthenticated"
        }, { status: 401 })
    }
    const email = session?.user?.email!
    const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    try {
        if (existingUser.length == 0) {
            return NextResponse.json({
                error: "User not logged in",
                success: false
            }, { status: 401 })
        }

        let { topic, difficulty, questionType, language, questionLength } = await request.json();
        questionLength = parseInt(questionLength);

        console.log(topic)
        console.log(difficulty)
        console.log(language)
        console.log(questionType)
        console.log(questionLength)
        if (!topic || !difficulty || !questionType || !language || questionLength === undefined) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 })
        }

        const poolKey = `questions:${topic}:${difficulty}:${language}:${questionType}`
        console.log(poolKey)
        const availableQuestions = await redis.scard(poolKey)
        console.log("availableQuestions", availableQuestions)
        const requestQuestions = Math.min(availableQuestions, questionLength)
        const rawQuestions = availableQuestions > 0
            ? await redis.srandmember(poolKey, -requestQuestions)
            : []
        console.log("Raw questions count:", Array.isArray(rawQuestions) ? rawQuestions.length : 1);

        const questions = Array.isArray(rawQuestions) ? rawQuestions : [rawQuestions]
        const MIN_POOL_SIZE = 20;
        if (availableQuestions < MIN_POOL_SIZE) {
            console.log("runninbj")
            await redis.xadd(
                "questions_generation",
                '*',
                {
                    topic,
                    difficulty,
                    questionType,
                    language,
                    needed: String(MIN_POOL_SIZE - availableQuestions),
                }
            )
        }
        const finalQuestions: string = await extractJsonFromAI(JSON.stringify(questions))

        const parsedQuestions = questions.flatMap((group: any) =>
            Array.isArray(group)
                ? group.map((q: any) => {
                    const parsed = typeof q === "string" ? JSON.parse(q) : q;
                    return {
                        ...parsed,
                        questionId: parsed.questionId || crypto.randomUUID()
                    };
                })
                : (() => {
                    const parsed = typeof group === "string" ? JSON.parse(group) : group;
                    return {
                        ...parsed,
                        questionId: parsed.questionId || crypto.randomUUID()
                    };
                })()
        ).slice(0, questionLength);

        console.log("Parsed questions:", parsedQuestions);
        return NextResponse.json({
            success: true,
            returnedQuestionsLength: parsedQuestions.length,
            requestedLength: questionLength,
            availableQuestions,
            data: parsedQuestions
        })
    } catch (error) {
        console.error("get-questions error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}