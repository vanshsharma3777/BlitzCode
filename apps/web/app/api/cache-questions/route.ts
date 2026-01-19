import { db, questions, questionStatus, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/configs/authOptions";
import { Redis } from "@upstash/redis";
import { redisHashKey } from "../../../../worker/getHashKey";

type CachedQuestion = {
  questionId:string,
  topic: string;
  description: string
  correctOptions: string
  explanation?: string
  code: string
  options?: {
    id: string;
    text: string;
  }[];
  difficulty: string;
  language: string;
  questionType: "single correct" | "multiple correct" | "bugfixer";
};

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function normalizeToArray<T>(data: T | T[]): T[] {
  return Array.isArray(data) ? data : [data];
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({
            success: false,
            error: "Unauthenticated"
        }, { status: 401 })
    }
    const email = session?.user?.email!
    const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
    try {
        if (existingUser.length == 0) {
            return NextResponse.json({
                error: "User not logged in",
                success: false
            }, { status: 401 })
        }
        const { topic, difficulty, questionType, language, questionLength } = await request.json();
        if (!topic || !difficulty || !questionType || !language || questionLength===undefined) {
                        return NextResponse.json({
                success: false,
                error: 'Details not found'
            }, { status: 404 })
        }
        const input = { topic, difficulty, language, questionType, questionLength };
        const redisHashedKey = redisHashKey(input);
            const cachedData = await redis.get(redisHashedKey);

        if (cachedData!== null) {
      console.log('source  redis ')
      const parsedData: CachedQuestion[] = typeof(cachedData) === 'string' ? JSON.parse(cachedData) : cachedData
      const sendData = parsedData.map((q) => ({
        topic,
        description: q.description,
        code: q.code,
        options: q.options?.map((option)=>({
          id:option.id,
          text:option.text
        })),
        difficulty,
        language,
        questionType,
        questionId:q.questionId
      }))
      console.log("senddata", sendData)
      return NextResponse.json({
        source: "cache",
        data: normalizeToArray(sendData),
      });
    } 
    else if(cachedData===null){
        console.log("cached data null")
        return NextResponse.json({
            success:'data not present in cache',
            data:[]
        },{status:200})
    }
    return NextResponse.json({
        success:true,

    })

}catch(error){
    console.log("error in cache-questions")
    console.log(error)
}
}

