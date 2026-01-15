import express from "express";
import { Redis } from "@upstash/redis";
import { prompt } from "../prompt";
import { redisHashKey } from "../getHashKey";
import { generateQuestionDeepSeek } from "../deepseek";
import { generateQuestionGemini } from "../gemini";
import { extractJsonFromAI } from "../jsonConverter";
import cors from 'cors'

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

app.post("/", async (req, res) => {
  const { topic, difficulty, language, questionType } = req.body;

  const input = { topic, difficulty, language, questionType };
  const redisHashedKey = redisHashKey(input);

  const cachedData = await redis.get(redisHashedKey);
  console.log(cachedData)
  if (cachedData !== null) {
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

  const parsed = extractJsonFromAI(text);
  const questionsArray = normalizeToArray(parsed);

  await redis.set(redisHashedKey, questionsArray, { ex: 3600 });

  return res.json({
    source,
    data: questionsArray,
  });
});

app.listen(PORT, () => {
  console.log("server running at port", PORT);
});
