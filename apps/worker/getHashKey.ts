import crypto from 'crypto'

interface  Input  {
      topic:string,
      difficulty:"easy" | 'medium' | 'hard',
      language:"cpp" | "java" | "javascript" | "c" | "python" | 'rust' | 'go' | 'typescript' ,
      questionType: "single correct" | "multiple correct" | "bugfixer",
    };
export function redisHashKey(input :Input){
  return (
    "question:" +
    crypto.createHash("md5").update(JSON.stringify(input)).digest("hex")
    
  )
}