import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";
import { getServerSession } from "next-auth";
import { redisHashKey } from '../../../../worker/getHashKey' 
import { redis } from "../../../lib/configs/redis";

interface SolvedQuestion {
  questionId: string;
  userAnswer: string[];
}

interface Data {
  attemptId: string;
  solvedQuestions: SolvedQuestion[];
  topic: string;
  language: string;
  questionType: string;
  questionLength:number
  difficulty: string;
}

type OriginalQuestion = {
  questionId: string;
  description: string;
  options: any[];
  correctAnswer: string[];
  explanation: string;  
};

export async function POST(request:NextRequest){
    const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({
                error:"Unauthenticated",
                success:false
            },{status:401})
        }
        
        const { attemptId , topic , difficulty , language , questionType , questionLength ,solvedQuestions}:Data = await request.json();
        console.log(attemptId)
        console.log(topic)
        console.log(difficulty)
        console.log(language)
        console.log(questionType)
        console.log(solvedQuestions)
        console.log(questionLength)
        if(!topic ||!language || !difficulty || !questionType || !attemptId || !solvedQuestions || questionLength===undefined){
        return NextResponse.json({
            success:false,
            error:"Data cannot be submitted",
        },{status:404})
        }
        const input = { 
            topic : topic as string, 
            difficulty : difficulty as 'easy' | 'medium' | 'hard', 
            language : language as "cpp" | "java" | "javascript" | "c" | "python" | "rust" | "go" | "typescript",
            questionType : questionType as "single correct" | "multiple correct" | "bugfixer",
            questionLength: questionLength 
         };
        try{
            const quizKey =  redisHashKey(input) 
            const originalQuestions = await redis.get(quizKey) as OriginalQuestion[];
            console.log(originalQuestions)
            return NextResponse.json({
                success:true,
                originalQuestions
            })
        }catch(error){
            console.log("errooooo")
             return NextResponse.json({
                error:error,
                success:false
             },{status:405})
        }
}