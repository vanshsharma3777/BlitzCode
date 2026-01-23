import { db, questions, questionStatus, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";
import axios from "axios";

export async function POST(request:NextRequest){
    const session = await getServerSession(authOptions)
    if(!session?.user){
        return NextResponse.json({
            success:false,
            error:"Unauthenticated"
        } , {status:401})
    }
    const email = session?.user?.email!
    const existingUser = await db
        .select({id : users.id})
        .from(users)
        .where(eq(users.email , email))
        .limit(1)
    try{
        if(existingUser.length==0){
        return NextResponse.json({
            error:"User not logged in",
            success: false
        } ,{status:401})
    }
    
    const { topic , difficulty , type , language , questionLength } = await request.json();
    if(!topic || !difficulty || !type || !language){
        return NextResponse.json({
            success:false,
            error:'Details not found'
        },{status:404}) 
    }
    const questionType = type
    const res = await axios.post("http://localhost:3002/create-questions" , { topic , difficulty , language , questionType , questionLength})

    if(res.status===200){
    for(let i =0 ; i< res.data.data.length ; i++){
        const storeQuestions = await db
        .insert(questions)
        .values({
            topic:topic,
            questionType:type,
            description:res.data.data[i].description,
            options:res.data.data[i].options,
            difficulty:difficulty,
            language:language,  
            code:res.data.data[i].code || '',
            correctOptions:res.data.data[i].correctOptions,
            timeLimit: 45,
            explanation:res.data.data[i].explanation,
            userId : existingUser[0]?.id
        }).returning()
        
    }
    return NextResponse.json({
        success:true,
        msg:"Questions created successfully"
    })
 }else{
    return NextResponse.json({
        success:true,
        msg:"Questions not created"
    } , {status:501})
 }
    
    
    }catch(err){
        console.log("error :" , err)
        return NextResponse.json({
            error:err,

        },{status:403})
    }
}