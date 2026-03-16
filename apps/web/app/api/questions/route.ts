import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";

export async function GET(){
    const session= await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            error:"Unauthenticated",
            success:false
        }, {status: 400});
    }
    console.log(session)
    return NextResponse.json({
        success:true,
        session: session,
    })
}