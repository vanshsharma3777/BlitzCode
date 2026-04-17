import { db, questions } from "@repo/db";
import { questionQueue } from "@repo/queue";
import { and, eq } from "drizzle-orm";
import { uuid } from "drizzle-orm/gel-core";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "../../../lib/configs/redis";

export async function POST(request : NextRequest){
    const { topic, difficulty, language, questionLength, questionType } = await request.json();
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
        if ((unusedQuestions).length <= 40 && questionLength) {
             console.log("Questions creation task added in the queue")
             console.log("Hello")
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
        let quizId;
        if(findQuestions.length!==0){
         quizId = uuid()
    const storingToRedis = await redis.set(`quiz:${quizId}` , findQuestions)    
    console.log("Storing to redis")

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
}