import type { Game } from "../game.js"
import { NEXT_QUESTION } from "../message.js"
import type { CustomSocket } from "../types.js"

export function sendQuestion(game: Game, player: CustomSocket) {
    const emailId = player.emailId!
    if (!emailId) {
        console.log("emailId missing (sendQuestion)")
        return
    }
    const index = game.playerProgress.get(emailId)
    if (!emailId) {
        console.log("emailId missing (sendQuestion)")
        return
    }
    try {
        if (!game.questions) {
            console.log("questions do not exists (sendQuestions)")
            return
        }
        if (game.questions?.length! <= index!) {
            console.log("Last index of questions reached (sendQUestions)")
            return
        }
        console.log("index first time " , index)
        player.send(JSON.stringify({
            type: NEXT_QUESTION,
            data: {
                question: game.questions![index!],
                questionNumber: index! + 1,
                total: game.questions?.length,
                remainingTime: game.gameEndTime - Date.now()
            }
        }))
        console.log("index after sedning data " , index)
    } catch (error) {
        console.log("error in the sendQuestions of sendQuestions ", error)
    }
}