import WebSocket from "ws";
import { START_GAME } from "./message.js";

interface Answer {
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


export class Game{
    public player1 : WebSocket;
    public player2 : WebSocket;
    public answers : Answer[] | null;

    constructor(player1 : CustomSocket , player2 : CustomSocket ){
        this.player1 = player1
        this.player2 = player2
        this.answers = null
        const p1Email = (player1).emailId;
        const p2Email = (player2).emailId;
        
        const p1Payload =player1.payload
        const p2Payload = player2.payload
        this.player1.send(JSON.stringify({
            type : START_GAME,
            payload:{
                youAre: "player1",
                yourEmail : p1Email,
                opponentEmail : p2Email,
                payload: p1Payload
            }
        }))

        this.player2.send(JSON.stringify({
            type : START_GAME,
            payload:{
              youAre: "player2",
                yourEmail : p2Email,
                opponentEmail : p1Email,
                payload: p2Payload
            }
        }))
    }
    
        check(payload1: any, payload2: any){
            console.log("check ran in game ")
            if(payload1 === payload2){
                console.log("true")
            }else{
                console.log("false")
            }
            console.log('eherghb')
        }

}