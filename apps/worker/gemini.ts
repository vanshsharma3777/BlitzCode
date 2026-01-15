import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompt } from "./prompt";

interface Input {
    topic: string;
    difficulty: "easy" | "medium" | "hard";
    language:
    | "cpp"
    | "java"
    | "javascript"
    | "c"
    | "python"
    | "rust"
    | "go"
    | "typescript";
    questionType: "single correct" | "multiple correct" | "bugfixer";
}

export async function generateQuestionGemini(
    { topic, difficulty, language, questionType }: Input
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
`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // ✅ correct free model
    });

    const result = await model.generateContent(prompts);

    return result.response.text(); // ✅ always string
}
