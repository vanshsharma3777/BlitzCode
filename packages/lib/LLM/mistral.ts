import { prompt } from "./prompt";
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

interface Input {
  topic: string;
  difficulty: string
  language:string
  questionType: string
  questionLength:number
}

export async function generateQuestionMistral({ topic, difficulty, language, questionType , questionLength }: Input) {
  const systemPrompt = prompt();
  const userPrompt = `
    ${systemPrompt}
    Generate a quiz question with these constraints:
    Topic: ${topic}
    Difficulty: ${difficulty}
    Language: ${language}
    Question Type: ${questionType}
    Number of Questions: ${questionLength}
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
    throw new Error(`Mistral API failed: ${errorData.error?.message || response.statusText}`);
  }
  const data = await response.json() as MistralResponse;
    const content = data?.choices?.[0]?.message?.content;
if (!content) {
  throw new Error("Mistral returned an empty or invalid response structure");
}
console.log("MISTRALL" , JSON.stringify(content))
return JSON.stringify(content);
}