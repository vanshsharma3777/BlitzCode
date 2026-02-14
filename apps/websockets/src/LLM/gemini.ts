import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompt } from "./prompt.js";
interface Input {
  topic: string;
  difficulty: string
  language:string
  questionType: string
  questionLength:number
}


export async function generateQuestionGemini(
    { topic, difficulty, language, questionType, questionLength }: Input
): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
    }

    const systemPrompt = prompt();
    const prompts = `
${systemPrompt}
Generate a quiz question with these constraints:
Topic: ${topic}
Difficulty: ${difficulty}
Language: ${language}
Question Type: ${questionType}
Number of Questions: ${questionLength}

`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompts);
    
    return result.response.text();
}
