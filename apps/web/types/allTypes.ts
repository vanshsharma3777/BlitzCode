
export interface Options {
    id: string,
    selectedOptionId: string
    text: string
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