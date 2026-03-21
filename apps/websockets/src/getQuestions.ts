import { db,questions ,users } from "@repo/db";
import { and, eq } from "drizzle-orm";
export async function ques(topic: string, difficulty: string, questionType: string, language: string, questionLength: number) {
    const jobKey = `${topic}-${difficulty}-${language}-${questionType}`;
    
    return null

}