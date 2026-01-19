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

        const { topic, difficulty, questionType, language, questionLength } = await request.json();
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
        const rawQuestions = availableQuestions > 0
            ? await redis.srandmember(poolKey, Math.min(availableQuestions, questionLength))
            : []

        const questions = Array.isArray(rawQuestions) ? rawQuestions : [rawQuestions]
        const MIN_POOL_SIZE = 5;

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
        const finalQuestions : string = await extractJsonFromAI(JSON.stringify(questions))

const parsedQuestions = questions.map(group =>
  group.map((q:any) => {
    if (typeof q === "string") {
      return JSON.parse(q);
    }
    return q; 
  })
);
  console.log(parsedQuestions)      
        return NextResponse.json({
            success: true,
            returnedQuestionsLength: questions.length,
            availableQuestions,
            questions:parsedQuestions
        })
    } catch (error) {
        console.error("get-questions error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}