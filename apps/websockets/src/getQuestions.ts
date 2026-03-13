import { redis } from "./lib/redis.js";
import { extractJsonFromAI } from "./LLM/jsonConverter.js";
import { generateQuestion } from "./LLM/router.js";

export async function questions(topic: string, difficulty: string, questionType: string, language: string, questionLength: number) {
    if (!topic || !difficulty || !questionType || !language || questionLength === undefined) {
        return "Input fields not found"
    }

    const poolKey = `questions:${topic}:${difficulty}:${language}:${questionType}`
    const availableQuestions = await redis.scard(poolKey)
    const requestQuestions = Math.min(availableQuestions, questionLength)
    const rawQuestions = availableQuestions > 0
        ? await redis.srandmember(poolKey, requestQuestions)
        : []
    console.log("Raw questions count:", Array.isArray(rawQuestions) ? rawQuestions.length : 1);

    const questions = Array.isArray(rawQuestions) ? rawQuestions : [rawQuestions]
    const MIN_POOL_SIZE = 10;
    if (availableQuestions < MIN_POOL_SIZE) {
        console.log("genmrating")
        const ans = await redis.xadd(
            "questions_generation",
            '*',
            {
                topic,
                difficulty,
                questionType,
                language,
                needed: String(MIN_POOL_SIZE - availableQuestions),
            }
        )
    }
    const questionIds = Array.isArray(rawQuestions)
        ? rawQuestions
        : rawQuestions
            ? [rawQuestions]
            : [];

    let parsedQuestions: any[] = [];

    if (questionIds.length > 0) {

        const redisQuestions = await redis.mget(
            questionIds.map((id: string) => `question:${id}`)
        );

        parsedQuestions = redisQuestions
            .filter(Boolean)
            .map((q: any) => (typeof q === "string" ? JSON.parse(q) : q));

    }
    if (parsedQuestions.length < questionLength) {

        const needed = questionLength - parsedQuestions.length;

        const input = {
            topic,
            difficulty,
            language,
            questionType,
            questionLength: needed
        };

        const quesFromAPI = await generateQuestion(input);

        const generated = extractJsonFromAI(quesFromAPI);

        if (Array.isArray(generated)) {
            const pipeline = redis.pipeline();

            for (const q of generated) {

                const questionKey = `question:${q.questionId}`;
                pipeline.set(questionKey, JSON.stringify(q));
                pipeline.sadd(poolKey, q.questionId);
            }

            await pipeline.exec();

            parsedQuestions = [...parsedQuestions, ...generated];
        }

    }

    function shuffle<T>(arr: any) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    const randomFive = shuffle([...parsedQuestions]).slice(0, questionLength);
    return randomFive

}