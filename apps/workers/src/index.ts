import { Worker } from 'bullmq'
import { generateQuestion } from '../../../packages/LLM/router'
import { db, questions } from '../../../packages/db/src/index'
import { and, eq } from "drizzle-orm";
import { parse } from 'node:path';

const worker = new Worker(
    "questionQueue",
    async (job) => {
        try {
            console.log("Worker started executing its task");
            const { topic, difficulty, language, questionLength, questionType } = job.data;
            const input = { topic, difficulty, language, questionLength, questionType };
            const createQuestions =await  generateQuestion(input);
            const parsedQuestions = JSON.parse(createQuestions);
            if(parsedQuestions && parsedQuestions.length!==0 ){
                await db.insert(questions).values(parsedQuestions).returning()
            }
            console.log("questions generated successfully by worker :" , parsedQuestions.length );
            console.log("Worker done successfully");

        } catch (err) {
            console.error("WORKER ERROR:", err);
        }
    },
    {
        connection: {
            url: process.env.REDIS_URL
        }
    },
)

















