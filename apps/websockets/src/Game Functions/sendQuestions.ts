import type { CustomSocket } from "../gameManager.js"

export function sendQuestion(
   player: CustomSocket,
   questions: string,
   playerProgress: Map<string, number>,
   gameEndTime: number
) {
        const emailId = player.emailId!
        const index = playerProgress.get(emailId)
        try{
            if(!index || !emailId || !questions){
            console.log("index or emailId or questions do not exists (sendQuestions)")
            return
        }
            if(questions?.length! <= index!){
                console.log("Last index of questions reached (sendQUestions)")
                return
            }
            if(index || emailId ||questions){
                player.send(JSON.stringify({
                type: "NEXT_QUESTION",
                data:{
                    question :questions![index!],
                    questionNumber : index! + 1,
                    total: questions?.length,
                    remainingTime:gameEndTime - Date.now()
                }
            }))}
        }catch(error){
            console.log("error in the sendQuestions of sendQuestions " , error)
        }
    }