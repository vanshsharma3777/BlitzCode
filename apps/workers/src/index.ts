import { Worker } from 'bullmq'

const worker = new Worker(
    "questionQueue",
    async (job) => {
        console.log("hello from workers")
        
    },
    {
        connection:{
            url:process.env.REDIS_URL
        }
    },
)

















