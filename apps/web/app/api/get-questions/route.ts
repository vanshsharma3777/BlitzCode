import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";
import { redis } from "../../../lib/configs/redis";
import { generateQuestion } from '../../../../../packages/LLM/router'
import { extractJsonFromAI } from "../../../lib/jsonConverter";

export interface Options {
    id: string,
    selectedOptionId: string
    text: string
}

export interface QuestionToSend {
    topic: string,
    options: Options[],
    questionId: string,
    description: string
    code: string
    difficulty: string
    questionType: string,
    language: string,
    totalTime: number,

}

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
        console.log("came here in get ques backend")
        if (existingUser.length == 0) {
            return NextResponse.json({
                error: "User not logged in",
                success: false
            }, { status: 401 })
        }

        let { topic, difficulty, questionType, language, questionLength } = await request.json();
        questionLength = parseInt(questionLength);

        if (!topic || !difficulty || !questionType || !language || questionLength === undefined) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 })
        }

        const poolKey = `questions:${topic}:${difficulty}:${language}:${questionType}`
        const availableQuestions = await redis.scard(poolKey)
        const requestQuestions = Math.min(availableQuestions, questionLength)
        const rawQuestions = availableQuestions > 0
            ? await redis.srandmember(poolKey, requestQuestions)
            : []

        const questions = Array.isArray(rawQuestions) ? rawQuestions : [rawQuestions]

        const MIN_POOL_SIZE = 10;
        if (availableQuestions < MIN_POOL_SIZE) {
            console.log("genratrubf ques")
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
        const questionIds = Array.isArray(rawQuestions)
            ? rawQuestions
            : rawQuestions
                ? [rawQuestions]
                : [];

        let parsedQuestions: any[] = [];

        if (questionIds.length > 0) {

            const redisQuestions = await redis.mget(
                questionIds.map((id: string) => `question:${id}`)
            );

            parsedQuestions = redisQuestions
                .filter(Boolean)
                .map((q: any) => (typeof q === "string" ? JSON.parse(q) : q));

        }
        if (parsedQuestions.length < questionLength) {

            const needed = questionLength - parsedQuestions.length;

            const input = {
                topic,
                difficulty,
                language,
                questionType,
                questionLength: needed
            };

            const quesFromAPI = await generateQuestion(input);

            const generated = extractJsonFromAI(quesFromAPI);

            if (Array.isArray(generated)) {
                const pipeline = redis.pipeline();

                for (const q of generated) {

                    const questionKey = `question:${q.questionId}`;
                    pipeline.set(questionKey, JSON.stringify(q));
                    pipeline.sadd(poolKey, q.questionId);
                }

                await pipeline.exec();

                parsedQuestions = [...parsedQuestions, ...generated];
            }

        }

        function shuffle(arr: any[]) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        const finalQues = shuffle(parsedQuestions)
            .slice(0, questionLength)
            .map((q: any) => ({
                code: q.code,
                description: q.description,
                questionId: q.questionId,
                topic: q.topic,
                options: q.options
            }));
        return NextResponse.json({
            success: true,
            returnedQuestionsLength: parsedQuestions.length,
            requestedLength: questionLength,
            availableQuestions,
            data: finalQues
        })
    } catch (error) {
        console.error("get-questions error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}