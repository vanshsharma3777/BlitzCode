import { db, questions, users } from "@repo/db";
import { and, eq } from "drizzle-orm";
import { questionQueue, statusQueue } from "@repo/queue";
export async function ques(topic: string, difficulty: string, questionType: string, language: string, questionLength: number) {

    const jobKey = `${topic}-${difficulty}-${language}-${questionType}`;
    const unusedQuestions = await db.select().from(questions).where(and(
        eq(questions.topic, topic),
        eq(questions.language, language),
        eq(questions.questionType, questionType),
        eq(questions.difficulty, difficulty),
        eq(questions.status, "unused")))

    const findQuestions = unusedQuestions.slice(0, questionLength);
        console.log("questionsd ", (findQuestions))
    let questionsToSend, quesId
    if (findQuestions.length != 0) {
        quesId = findQuestions.map((que) => {
            return que.questionId
        })
    }

     if ((unusedQuestions).length <= 15 && questionLength) {
            questionsToSend = await questionQueue.add("generateQuestions", {
                topic,
                difficulty,
                questionLength,
                questionType,
                language
            }, {
                jobId: jobKey
            }
        )
            console.log("Questions creation task added in the queue")
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
        console.log("ques are :", findQuestions)
    return findQuestions

}