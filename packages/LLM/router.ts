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

export async function generateQuestion(input:Input ): Promise< string>{ 
    console.log("input is " , input)
    try{
        return await generateQuestionMistral(input)
    }catch(error){
        console.warn("mistral failed")
        try{    
            return await generateQuestionDeepSeek(input)
        }catch(error){
            console.warn("deepseek failed")
        }
    }
    return await generateQuestionGemini(input)
 }