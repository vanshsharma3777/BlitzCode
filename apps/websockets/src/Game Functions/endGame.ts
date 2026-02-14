import type { Game } from "../game.js";
import { OVER_GAME } from "../message.js";

export function endGame(game:Game , reason: 'timer' | 'manual' = 'timer'){
    if(game.globalTimer){
        clearTimeout(game.globalTimer);
        game.globalTimer = null
    }

    const [player1 , player2] = game.players;
    const email1 = player1?.emailId!;
    const email2 = player2?.emailId!;

    const score1 = game.playerScores.get(email1) || 0
    const score2 = game.playerScores.get(email2) || 0

    const player1Time = (game.playerFinishTime.get(email1) || Date.now()) - (game.playerStartTime.get(email1) || Date.now())
    const player2Time = (game.playerFinishTime.get(email2) || Date.now()) - (game.playerStartTime.get(email2) || Date.now())

    let winner: string | null = null
    if(score1 > score2) 
        winner = email1 
    else if(score2 > score1)
        winner = email2
    else if((score1 === score2 ) && player1Time < player2Time)
        winner = email1
    else if((score1 === score2 ) && player1Time > player2Time)
        winner = email2

    game.players.forEach((player)=>{
        player.send(JSON.stringify({
            type: OVER_GAME,
            winner:winner,
            reason,
            payload:[
                {email:email1 , score : score1 , timeTaken : player1Time},
                {email:email2 , score : score2 , timeTaken : player2Time}
            ],
        }))
    })
}