import { redis } from "./lib/redis.js";
import { generateQuestion } from "./LLM/router.js";

export async function questions(topic:string, difficulty:string, questionType:string, language:string, questionLength:number ){
    if (!topic || !difficulty || !questionType || !language || questionLength === undefined) {
            return "Input fields not found"
        }

        const poolKey = `questions:${topic}:${difficulty}:${language}:${questionType}`
        const availableQuestions = await redis.scard(poolKey)
        const requestQuestions = Math.min(availableQuestions, questionLength)
        const rawQuestions = availableQuestions > 0
            ? await redis.srandmember(poolKey, -requestQuestions)
            : []
        console.log("Raw questions count:", Array.isArray(rawQuestions) ? rawQuestions.length : 1);

        const questions  = Array.isArray(rawQuestions) ? rawQuestions : [rawQuestions]
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
            console.log("answer = " , ans)
        }
        let parsedQuestions = questions.flatMap((group: any) =>
            Array.isArray(group)
                ? group.map((q: any) => {
                    const parsed = typeof q === "string" ? JSON.parse(q) : q;
                    return {
                        ...parsed,
                        questionId: parsed.questionId || crypto.randomUUID()
                    };
                })
                : (() => {
                    const parsed = typeof group === "string" ? JSON.parse(group) : group;
                    return {
                        ...parsed,
                        questionId: parsed.questionId || crypto.randomUUID()
                    };
                })()
        ).slice(0, questionLength);
        if (parsedQuestions.length < questionLength) {
    const needed = Math.max(
        questionLength - parsedQuestions.length,
        MIN_POOL_SIZE - availableQuestions
    );

    const input = {
        topic,
        difficulty,
        language,
        questionType,
        questionLength: needed
    };

    const quesFromAPI = await generateQuestion(input);
    const generated = JSON.parse(quesFromAPI);

    for (const q of generated) {
        await redis.sadd(poolKey, JSON.stringify(q));
    }

    parsedQuestions = [...parsedQuestions, ...generated];
}

        function shuffle<T>(arr:any ) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }
        const randomFive = shuffle([...parsedQuestions]).slice(0, questionLength);
             return randomFive
        
}