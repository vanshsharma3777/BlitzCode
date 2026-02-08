import WebSocket from "ws";
import { START_GAME } from "./message.js";

export class Game{
    public player1 : WebSocket;
    public player2 : WebSocket;


    constructor(player1 : WebSocket , player2 : WebSocket ){
        this.player1 = player1
        this.player2 = player2
        
        const p1Email = (player1 as any).emailId;
        const p2Email = (player2 as any).emailId;

        this.player1.send(JSON.stringify({
            type : START_GAME,
            payload:{
                youAre: "player1",
                yourEmail : p1Email,
                opponentEmail : p2Email
            }
        }))

        this.player2.send(JSON.stringify({
            type : START_GAME,
            payload:{
              youAre: "player2",
                yourEmail : p2Email,
                opponentEmail : p1Email
            }
        }))
    }

    got(){
        console.log("ran")
    }
}