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

export interface Answer {
    questionId: string,
    correctOptions : string[];
}

export interface Options {
    id: string,
    selectedOptionId: string
    text: string
}

export enum MessageType {
  INIT_GAME = "init_game",
  NEXT_QUESTION = "next_question",
  OVER_GAME = "over_game",
  START_GAME = 'start_game',
  EXIT_GAME = 'exit_game'
}

export interface WSMessage {
  type: MessageType;
  payload?: object;
}
