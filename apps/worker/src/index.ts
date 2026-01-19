import express from "express";
import { Redis } from "@upstash/redis";
import { redisHashKey } from "../getHashKey";
import { generateQuestionDeepSeek } from "../deepseek";
import { generateQuestionGemini } from "../gemini";
import { randomUUID } from "crypto";
import { extractJsonFromAI } from "../../workers/src/LLM/jsonConverter";
import cors from 'cors'
import axios from "axios";
import { generateQuestionMistral } from "../mistral";

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

const STREAM_KEY =  'questions_generation';
const GROUP_NAME = "ai-workers";
const CONSUMER_NAME = `worker-${process.pid}`;
const MIN_POOL_SIZE = 20;
