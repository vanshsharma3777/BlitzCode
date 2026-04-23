import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateQuestionDeepSeek } from "./deepseek";
import { generateQuestionGemini } from "./gemini";
import { generateQuestionMistral } from "./mistral"

interface Input {
    topic: string;
    difficulty: string
    language: string
    questionType: string
    questionLength: number
}


export async function generateQuestion(input: Input): Promise<string> {
    console.log("input is ", input)
    try {

        return await generateQuestionGemini(input)
    } catch (error: any) {
        console.warn("gemini failed")
        console.log(error.message)
        try {
            return await generateQuestionDeepSeek(input)
        } catch (error: any) {
            console.warn("deepseek failed")
            console.log(error.message)
        }
    }
    console.log("Gemini and Deepseek failed generating questions from Mistral")
    return await generateQuestionMistral(input)
}


