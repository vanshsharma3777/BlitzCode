import { generateQuestionDeepSeek } from "./LLM/deepseek";
import { generateQuestionGemini } from "./LLM/gemini";
import { generateQuestionMistral } from "./LLM/mistral";

interface Input {
    topic: string;
    difficulty: string
    language: string
    questionType: string
    questionLength: number
}

export async function generateQuestion(input:Input ): Promise< string>{ 
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