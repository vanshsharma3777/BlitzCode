import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";
import { questionQueue } from "@repo/queue";

export async function POST(request : NextRequest){
    const session= await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            error:"Unauthenticated",
            success:false
        }, {status: 400});
    }

    const {topic , difficulty , language , questionLength , questionType} = await request.json();
    await questionQueue.add("generateQuestions" , {
        topic,
        difficulty,
        questionLength,
        questionType,
        language
    })

    console.log(session)
    return NextResponse.json({
        success:true,
        session: session,
        msg:"working fine"
    })
}