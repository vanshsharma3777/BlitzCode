import { Queue } from 'bullmq';

export const questionQueue = new Queue('questionQueue' , {
    connection: {
    url:process.env.REDIS_URL
  }
})
export const statusQueue = new Queue('statusQueue' , {
    connection: {
    url:process.env.REDIS_URL
  }
})