import { db, questions, users } from "@repo/db";
import { and, eq } from "drizzle-orm";
import { questionQueue, statusQueue } from "@repo/queue";
import { v4 as uuid } from "uuid"
import { Redis } from "@upstash/redis";

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
export async function ques(topic: string, difficulty: string, questionType: string, language: string, questionLength: number) {
    console.log("Multiplayer Question generation")
    const jobKey = `${topic}-${difficulty}-${language}-${questionType}`;
    const unusedQuestions = await db.select().from(questions).where(and(
        eq(questions.topic, topic),
        eq(questions.language, language),
        eq(questions.questionType, questionType),
        eq(questions.difficulty, difficulty),
        eq(questions.status, "unused")))

    const findQuestions = unusedQuestions.slice(0, questionLength);

    console.log("questions ", (findQuestions))
    let questionsToSend, quesId
    if (findQuestions.length != 0) {
        quesId = findQuestions.map((que) => {
            return que.questionId
        })
    }
    console.log("unsued ques id :", unusedQuestions)
    if ((unusedQuestions).length <= questionLength && questionLength) {
        console.log("Questions creation task added in the queue")
        console.log("Hello")
        questionsToSend = await questionQueue.add("generateQuestions", {
            topic,
            difficulty,
            questionLength,
            questionType,
            language
        }, {
            jobId: jobKey,
            attempts: 3,
            backoff: {
                type: "fixed",
                delay: 3000
            }
        },
        )

    }
    if (findQuestions.length != 0) {
        await statusQueue.add('statusQueue', { quesId }, {
            attempts: 3, backoff: {
                type: "fixed",
                delay: 3000
            }
        })
        console.log("Questions status changing task added in the queue")
    }
    let quizId
    if (findQuestions.length !== 0) {
        quizId = uuid()
        const storingToRedis = await redis.set(`quiz:${quizId}`, findQuestions)
        console.log("Storing to redis")
    }
    const finalQuestionsToSend = findQuestions.map((ques) => ({
        questionId: ques.questionId,
        description: ques.description,
        code: ques.code,
        options: ques.options,
        questionType: ques.questionType,
        language: ques.language,
        topic: ques.topic,
        difficulty: ques.difficulty,
        questionLength: questionLength,
    }))
    return findQuestions

}