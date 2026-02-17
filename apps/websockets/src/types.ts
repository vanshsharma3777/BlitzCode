import WebSocket from "ws";

export interface Answer {
    questionId: string,
    correctOptions : string[];
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

export interface Input {
  topic: string;
  difficulty: string
  language:string
  questionType: string
  questionLength:number
}