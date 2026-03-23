import { sendQuestion } from "./Game Functions/sendQuestions.js"
import type { CustomSocket } from "./types.js";
import { generateQuestion } from "./LLM/router.js"
import { startGlobalTimer } from "./Game Functions/startGlobalTimer.js";
import { endGame } from "./Game Functions/endGame.js";
import { isCorrect } from "./Game Functions/checkScore.js";
import { ques } from "./getQuestions.js";
import { createTime } from "./Game Functions/createTime.js";

export class Game {
    public players: CustomSocket[]
    topic: string
    difficulty: string
    questionType: string
    language: string
    questionLength: number
    questions: any[] | null
    playerProgress = new Map<string, number>()
    playerScores = new Map<string, number>()
    playerStartTime = new Map<string, number>()
    playerAnswers = new Map<string, Map<string, any>>()
    playerWhoEndedGame = new Map<string, string>()
    playerFinishTime = new Map<string, number>()
    gameEndTime = 0
    globalTimer: NodeJS.Timeout | null = null
    constructor(
        players: CustomSocket[], fields: {
            topic: string
            difficulty: string
            questionType: string
            language: string
            questionLength: number
        }) {
        this.questions = null
        this.players = players
        this.topic = fields.topic
        this.difficulty = fields.difficulty
        this.questionType = fields.questionType
        this.language = fields.language
        this.questionLength = fields.questionLength
    }

    async findQuestions() {
        const input = {
            topic: this.topic,
            difficulty: this.difficulty,
            language: this.language,
            questionType: this.questionType,
            questionLength: this.questionLength
        }
        console.log("request goes to ques")
        this.questions = await ques(this.topic, this.difficulty, this.questionType, this.language, this.questionLength)
        console.log("QUESTIONS RECEIVED:", this.questions);
        if (!this.questions) {
            console.log("Questions not found")
            this.players.forEach((player) => {
                player.send(JSON.stringify({
                    type: "ERROR",
                    payload: {
                        error: "Server Error Questions not found"
                    }
                }))
            })
        }
    }
    isReady: boolean = false;
    async start() {

        this.players.forEach((player) => {
            const emailId = player.emailId!
            this.playerProgress.set(emailId, 0)
            this.playerScores.set(emailId, 0)
            this.playerStartTime.set(emailId, Date.now())
        });

        await this.findQuestions();

        console.log("questions after findQuestions:", this.questions);

        if (!this.questions || this.questions.length === 0) {
            console.log("Questions not found in start()");
            return;
        }
        this.isReady = true;
        const time = createTime(Number(this.questionLength), this.difficulty);
        this.gameEndTime = Date.now() + 1000 * (time!);
        startGlobalTimer(this);
    }

    endThisGame(type: "timer" | "manual" = "timer" , player:CustomSocket) {
        if (this.globalTimer) {
            clearTimeout(this.globalTimer)
            this.globalTimer = null
        }
        const emailId = player.emailId
        this.playerWhoEndedGame.set(emailId! , type)
        if(this.playerWhoEndedGame.size===2){
            const results = endGame(this, type)
            this.playerFinishTime.set( emailId! ,Date.now())
        }
        else if(this.playerWhoEndedGame.size===1){
            this.playerFinishTime.set( emailId! ,Date.now())
            player.send(JSON.stringify({
                type: "HOLD",
                payload: {
                    error: "Player 2 is still solving"
                }
            }))
        }
    }

    handleNextQuestion(player: CustomSocket) {
        const emailId = player.emailId
        console.log("NEXT_QUESTION from:", emailId);
        if (!emailId) {
            console.log("player email id not passed/ found")
            player.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    error: "Email not found / passed"
                }
            }))
            return
        }
        console.log("this.playerProgress.size :", this.playerProgress.size)
        console.log("this.ques :", this.questions)
        if (!this.isReady) {
            this.findQuestions().then(() => {
                if (this.questions && this.questions.length > 0) {
                    this.isReady = true;
                    sendQuestion(this, player, this.gameEndTime);
                }
            });
            player.send(JSON.stringify({
                type: "ERROR",
                payload: { error: "Game is still initializing" }
            }));
            return;
        }
        const index = this.playerProgress.get(emailId)
        console.log("index ", index)
        if (index === undefined) {
            player.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    error: "Index undefined"
                }
            }))
            return
        }
        
        sendQuestion(this, player, this.gameEndTime)
        this.playerProgress.set(emailId, index + 1)
    }

    handleAnswer(player: CustomSocket, questionId: string, answer: any) {
        try{
            const emailId = player.emailId!;
        console.log("came in handleans")
        console.log("this.questions" , this.questions)
        const question = this.questions?.find(q => q.questionId === questionId);
        console.log("quiestion is :" , question)
        console.log("quiestionid is :" , questionId)
        console.log("answer by user is :" , answer)
        if (!question) return;

        if (!this.playerAnswers.has(emailId)) {
            this.playerAnswers.set(emailId, new Map());
        }

        const userAnswers = this.playerAnswers.get(emailId)!;
        const prevAnswer = userAnswers.get(questionId);

        console.log("checking question answers")
        if (prevAnswer !== undefined && isCorrect(question, prevAnswer)) {
            console.log("score --")
            const prevScore = this.playerScores.get(emailId) || 0;
            this.playerScores.set(emailId, prevScore - 1);
        }
        userAnswers.set(questionId, answer);

        if (isCorrect(question, answer)) {
            console.log("answer correct")
            console.log("score ++ ")
            const prevScore = this.playerScores.get(emailId) || 0;
            this.playerScores.set(emailId, prevScore + 1);
            console.log("this.playerScores" , this.playerScores.get(emailId))
        }
     }catch(err){
            console.log("err :" , err)
        }
        }
        
}