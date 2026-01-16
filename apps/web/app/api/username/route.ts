import { NextRequest, NextResponse } from "next/server";

export  async function POST(request: NextRequest){
    const {email , userName} = await request.json()
    console.log(email)
    console.log(userName)
    return NextResponse.json({
        msg:"done",
        email ,
        userName
    })
}