
export interface Options {
    id: string,
    selectedOptionId: string
    text: string
}
export type Status = {
    status: string,
    winnerEmail?: string,
    loserEmail?: string,
    score: string
    timeTaken: string
}
 export interface Question {
    explanation: string,
    topic: string,
    correctOptions: string[],
    options: Options[],
    selectedOptionId:string
    questionId:string,
    description: string
    code: string
    difficulty: string
    questionType: string,
    language: string,
    totalTime: number,

}
export type MatchType = {
    answers?: SolvedQuestion[]
    allQuestions?: Question[]
    questionType?: string,
    pointsUpdated:boolean,
    timeTaken?: string,
    status?: Status
    totalTime: number,
    quizId: string,
    winnerStatus: Status
    loserStatus: Status
}
export type Response = {
    success: boolean,
    score: number,
    questionIds: string[],
    questions: Question[]
}
export interface Answers{
    questionId:string,
    selectedOptionId:string
}

export interface SolvedQuestion{
    questionId:string,
    userAnswer:string[]
}

export interface AnalysisData {
  attemptId: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  language: "cpp" | "java" | "javascript" | "c" | "python" | "rust" | "go" | "typescript";
  questionType: "single correct" | "multiple correct" | "bugfixer";
  totalTime: number;

  answers: Answers[];        
  solvedQuestions: SolvedQuestion[];
}

export interface LLMInput {
  topic: string;
  difficulty: string;
  language: string;
  questionType: string;
  questionLength: number;
}

export interface Theme {
    text: string;
    stroke: string;
    bg: string;
    border: string;
}

export interface CustomSocket extends WebSocket {
    emailId?: string;
    payload? : {
        topic : string,
        language : string ,
        questionType : string,
        questionLength : number ,
        difficulty: string
    } 
}
export type   WSQuestionData = {
    question: Question,
    questionNumber: number,
    remainingTime: number,
    gameEndTime: number
    total: number
}