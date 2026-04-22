import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";
import { questionQueue, statusQueue } from "@repo/queue";
import { db, questions, users } from "@repo/db";
import { and, eq } from "drizzle-orm";
import { Question } from "../../../types/allTypes";
import { redis } from "../../../lib/configs/redis";
import { v4 as uuid } from "uuid"
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

    let questionsToSend, quesId
    if (findQuestions.length != 0) {
        quesId = findQuestions.map((que) => {
            return que.questionId
        })
    }
    if ((unusedQuestions).length <= questionLength && questionLength) {
         console.log("Questions creation task added in the queue")
        questionsToSend = await questionQueue.add("generateQuestions", {
            topic,
            difficulty,
            questionLength,
            questionType ,
            language
        }, {
            attempts: 3 ,
            backoff:{
                type:"fixed",
                delay:3000
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
    if(findQuestions.length!==0){
         quizId = uuid()
    const storingToRedis = await redis.set(`quiz:${quizId}` , findQuestions)    
    console.log("Storing to redis")
    }
    const finalQuestionsToSend = findQuestions.map((ques)=>({
        questionId:ques.questionId,
        description:ques.description,
        code:ques.code,
        options:ques.options,
        questionType : ques.questionType,
        language:ques.language,
        topic:ques.topic,
        difficulty:ques.difficulty,
        questionLength:questionLength,
    }))
    return NextResponse.json({
        success: true,
        data: finalQuestionsToSend,
        quizId,
        msg: "working fine"
    })
}