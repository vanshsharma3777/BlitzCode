import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../../lib/configs/authOptions"
import { db, users } from "@repo/db"
import { eq } from "drizzle-orm"
import { Question, SolvedQuestion } from "../../../types/allTypes"
import { redis } from "../../../lib/configs/redis"
import { calculateScores } from "../../../lib/functions/calculateScores"

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({
            success: false,
            error: "Unauthenticated"
        }, { status: 401 })
    }

    const email = session.user.email!
    const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

        console.log('email :' , email)
        console.log('existing user :' , existingUser)
    try {
        console.log('came here1 :')
        if (existingUser.length == 0) {
            return NextResponse.json({
                error: "User not logged in",
                success: false
            }, { status: 401 })
        }
        console.log('came her 2')
        const { answers } = await request.json()
        console.log("answers came for calculating " , answers)
        if (answers.length === 0) {
            return NextResponse.json({
                success: true,
                error: "answers array size is 0 (empty)"
            }, { status: 501 })
        }
        
        const questionIds = answers.map((ques: SolvedQuestion) => ques.questionId)
        const questions:Question[] = await redis.mget((
            questionIds.map((id: SolvedQuestion) => `question:${id}`)
        )) 
        let scores;
        if(questions){
             scores =  calculateScores(answers , questions )
        }else{
            console.log("calcultae function not called")
        }

        return NextResponse.json({
            success: true,
            score: scores || 0,
            questionIds , 
            questions
        })
    } catch (err) {
        return NextResponse.json({
            error: "internal server error while calculating the score",
            success: false
        }, { status: 400 })
    }

}