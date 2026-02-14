import type { Game } from "../game.js";
import { endGame } from "./endGame.js";

export function startGlobalTimer(game:Game){
    const remainingTime = game.gameEndTime - Date.now();
    if(remainingTime <=0 ){
         endGame(game)
         return
    }
    game.globalTimer = setTimeout(() => {
        endGame(game)
    }, remainingTime);
}