import { Queue } from 'bullmq';
import IORedis from 'ioredis'

export const questionQueue = new Queue('questionQueue' , {
    connection: {
    url:process.env.REDIS_URL
  }
})