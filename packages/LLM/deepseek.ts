import { prompt } from "./prompt";

interface OpenRouterResponse  {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface Input {
  topic: string;
  difficulty: string
  language:string
  questionType: string
  questionLength:number
}


export async function generateQuestionDeepSeek({topic , difficulty , language , questionType  , questionLength}:Input){
    const systemPrompt = prompt() 
    const prompts = `
            ${systemPrompt}
            Generate a quiz question with these constraints:
            Topic: ${topic}
            Difficulty: ${difficulty}
            Language: ${language}
            Question Type: ${questionType}
            Number of Questions: ${questionLength}

            `;
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      messages: [
        { role: "user", content: prompts }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error("DeepSeek failed");
  }
  const data = await response.json() as OpenRouterResponse;
    return JSON.stringify(data?.choices[0]?.message.content);
  }