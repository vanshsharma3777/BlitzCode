import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";
import { questionQueue, statusQueue } from "@repo/queue";
import { db, questions, users } from "@repo/db";
import { and, eq } from "drizzle-orm";
import { Question } from "../../../types/allTypes";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({
            error: "Unauthenticated",
            success: false
        }, { status: 400 });
    }

    const userExists = db.select().from(users).where(eq(users.email, session.user.email!))
    if ((await userExists).length === 0) {
        return NextResponse.json({
            error: "User not found",
            success: false
        }, { status: 400 });
    }

    const { topic, difficulty, language, questionLength, questionType } = await request.json();
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
    console.log("unsued ques id :", unusedQuestions)
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
    return NextResponse.json({
        success: true,
        data: findQuestions,
        msg: "working fine"
    })
}