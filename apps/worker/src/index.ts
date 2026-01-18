import express from "express";
import { Redis } from "@upstash/redis";
import { prompt } from "../prompt";
import { redisHashKey } from "../getHashKey";
import { generateQuestionDeepSeek } from "../deepseek";
import { generateQuestionGemini } from "../gemini";
import { randomUUID } from "crypto";
import { extractJsonFromAI } from "../jsonConverter";
import cors from 'cors'
import axios from "axios";
import { send } from "process";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
const PORT = 3002;

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI api key is missing");
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function normalizeToArray<T>(data: T | T[]): T[] {
  return Array.isArray(data) ? data : [data];
}

app.post("/create-questions", async (req, res) => {
  const { topic, difficulty, language, questionType } = req.body;

  if (!topic || !difficulty || !questionType || !language) {
    return res.status(404).json({
      success: false,
      error: 'Details not found',

    })
  }

  const input = { topic, difficulty, language, questionType };
  const redisHashedKey = redisHashKey(input);
  console.log("REDIS KEY:", redisHashedKey);

  const cachedData = await redis.get(redisHashedKey);
  if (cachedData !== null) {
    console.log('source  redis ,', cachedData)
    return res.json({
      source: "cache",
      data: normalizeToArray(cachedData),
    });
  }

  let text: string;
  let source: "gemini" | "deepseek";

  try {
    text = await generateQuestionGemini(input);
    source = "gemini";
  } catch {
    console.warn("Gemini failed → falling back to DeepSeek");
    text = await generateQuestionDeepSeek(input);
    source = "deepseek";
  }
  if (!text) {
    return res.status(403).json({
      error: "Failed to create questions / Server Error",
      success: false
    })
  }
  console.log("her")
  const parsed = extractJsonFromAI(text);
  const questionsArray = normalizeToArray(parsed);
  if (!questionsArray) {
    return res.status(403).json({
      error: "Failed to parse data",
      success: true
    })
  }
  await redis.set(redisHashedKey, questionsArray);
  console.log('source llm')

  return res.status(200).json({
    source,
    data: questionsArray,
  });
});

type CachedQuestion = {
  questionId:number,
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

app.post('/get-questions', async (req, res) => {
  try {
    const { topic, difficulty, language, questionType } = req.body;
    if (!topic || !difficulty || !questionType || !language) {
      return res.status(404).json({
        success: false,
        error: 'Details not found',

      })
    }
    const input = { topic, difficulty, language, questionType };
    const redisHashedKey = redisHashKey(input);

    const cachedData = await redis.get(redisHashedKey);
    if (cachedData!== null) {

      console.log('source  redis ')

      const parsedData: CachedQuestion[] = typeof(cachedData) === 'string' ? JSON.parse(cachedData) : cachedData
      
      const sendData = parsedData.map((q) => ({
         questionId:randomUUID(),
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
      }))

      return res.json({
        source: "cache",
        data: normalizeToArray(sendData),
      });
    }else {
      const response = await axios.post('http://localhost:3002/create-questions' , { topic, difficulty, language, questionType } )
      
      console.log("response data length",response.data.data.length)
      console.log("response data ",response.data.data)
      const sendData : CachedQuestion[] = response.data.data
      if(!response || response.data === undefined){
        return res.status(404).json({
          success:false,
          error:"Unable to fetch further questions"
        })
      }
      
      const questionsArray = sendData.map((q: CachedQuestion) => ({
         questionId:randomUUID(),
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
       }))

       return res.status(200).json({
        success:true,
        data: questionsArray
       })
    }

  }catch(error){
    console.log(error)
    return res.status(403).json({
      error :error,
      success:false
    })
  }
})

app.listen(PORT, () => {
  console.log("server running at port", PORT);
  
});
