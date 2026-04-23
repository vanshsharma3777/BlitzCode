import { GoogleGenerativeAI } from "@google/generative-ai";
import { usernamePrompt } from "./usernamePrompt";

interface MistralResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}

interface MistralError {
    error: {
        message: string;
        type?: string;
        code?: string;
    };
}


export async function generateUsernameGemini(email: string) {
    console.log("geeini api key ", process.env.GEMINI_API_KEY)
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
    }

    const systemPrompt = usernamePrompt();
    const prompts = `
    ${systemPrompt}
       Input email: ${email}
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompts);
    return result.response.text();
}

export async function generateUsernameMistral(email: string) {
    console.log("api key" , process.env.MISTRAL_API_KEY )
    const systemPrompt = usernamePrompt();
    const userPrompt = `
            ${systemPrompt}
             Input email: ${email}
          `;
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "codestral-latest",
            messages: [
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        }),
    });
    if (!response.ok) {
        const errorData = await response.json() as MistralError;
        console.log("Mistral Full Error:", errorData);
        throw new Error(JSON.stringify(errorData));
    }
    const data = await response.json() as MistralResponse;
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error("Mistral returned an empty or invalid response structure");
    }
    return content;
}



