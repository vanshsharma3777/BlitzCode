import { redis } from '../../web/lib/configs/redis'
import { extractJsonFromAI } from '../../../packages/LLM/jsonConverter';
import { generateQuestion } from './router';

const STREAM_KEY = "questions_generation";
const GROUP_NAME = "ai-workers";
const CONSUMER_NAME = `worker-${process.pid}`;
const MIN_POOL_SIZE = 16;

async function ensureGroup() {
    try {
        await redis.xgroup(STREAM_KEY, {
            type: "CREATE",
            group: GROUP_NAME,
            id: "0", options: {
                MKSTREAM: true
            }
        });
        console.log("✅ Consumer group created");
    } catch (error: any) {
        const errorStr = error?.message || error?.toString() || "";
        if (errorStr.includes("BUSYGROUP")) {
            console.log("ℹ️ Consumer group already exists");
        } else {
            throw error;
        }
    }
}
async function startWorker() {
    const ans = await ensureGroup()
    console.log("ans ", ans)
    while (true) {
        try {
            const result = await redis.xreadgroup(
                GROUP_NAME,
                CONSUMER_NAME,
                STREAM_KEY,
                ">",
                {
                    count: 2,
                }
            );
            if (!result) continue

            type StreamMessage = [string, string[]];
            type StreamResponse = [string, StreamMessage[]][];

            const streamResult = result as StreamResponse;
            const streamEntry = streamResult[0];

            if (!streamEntry) continue;
            const messages = streamEntry[1];
            if (!messages || messages.length === 0) continue;

            const firstMessage = messages[0];
            if (!firstMessage) continue;

            const [messageId, fieldValues] = firstMessage as StreamMessage;
            const data: Record<string, string> = {};
            for (let i = 0; i < fieldValues.length; i += 2) {
                const field = fieldValues[i];
                const value = fieldValues[i + 1];

                if (field !== undefined && value !== undefined) {
                    data[field] = value;
                }
            }

            let { topic, difficulty, language, questionType, needed, } = data
            console.log(topic)
            console.log(difficulty)
            console.log(language)
            console.log(questionType)
            console.log(needed)
            topic = topic as string
            difficulty = difficulty as string
            language = language as string
            questionType = questionType as string
            const poolKey = `questions:${topic}:${difficulty}:${language}:${questionType}`

            const currentSize = await redis.scard(poolKey);
            if (currentSize >= MIN_POOL_SIZE) {
                await redis.xack(STREAM_KEY, GROUP_NAME, messageId);
                continue;
            }

            console.log(`🧠 Generating ${needed} questions for ${poolKey}`);

            const raw: string = await generateQuestion({ topic, difficulty, language, questionType, questionLength: Number(needed), })
            let questions = extractJsonFromAI(raw)
            if (questions.length === 0) {
                throw new Error("No valid questions generated");
            }
             questions = questions.map((q: any) => ({
                ...q,
                questionId: crypto.randomUUID(),
            }));

            console.log("Question generated Now storing")
            await redis.sadd(
                poolKey,
                questions.map((q: string) => JSON.stringify(q))
            );
            console.log("Question stored")

            await redis.xack(STREAM_KEY, GROUP_NAME, messageId);

            console.log(`✅ Stored ${questions.length} questions`)
        } catch (error) {
            console.log("Failed to generate new Questions")
        }
    }
}
startWorker()
