import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";
import { questionQueue } from "@repo/queue";
import { db, questions, users } from "@repo/db";
import { and, eq } from "drizzle-orm";

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
    const findQuestions = db.select().from(questions).where(and(
        eq(topic, topic),
        eq(language, language),
        eq(questionLength, questionLength),
        eq(questionType, questionType),
        eq(difficulty, difficulty),
    ))
    let questionsToSend
    if ((await findQuestions).length <= 15) {
        questionsToSend = await questionQueue.add("generateQuestions", {
            topic,
            difficulty,
            questionLength,
            questionType,
            language
        })
        console.log("Questions creation task added in the queue")
    }

    console.log(session)
    return NextResponse.json({
        success: true,
        questionsToSend,
        session: session,
        msg: "working fine"
    })
}