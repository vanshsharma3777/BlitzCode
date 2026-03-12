import { Question, SolvedQuestion } from "../../types/allTypes";

export const calculateScores = (
    answers: SolvedQuestion[],
    questions: Question[]
) => {
    console.log("cam here 1")
    let score = 0;
    console.log('qusestions from cal score function' ,questions)
    const questionMap = new Map( 
        questions.map(q => [q.questionId, q])
    );
    console.log("cam here 3")
    for (const ans of answers) {
        console.log("cam here 4")
        const ques = questionMap.get(ans.questionId);
        if (!ques) continue;
        console.log("cam here 5")
        if (ques.questionType === "single correct" || ques.questionType === "bugfixer") {
            if (ans.userAnswer[0] === ques.correctOptions[0]) {
                score += 1;
                console.log("cam here 6")
            }
        }

        else if (ques.questionType === "multiple correct") {
            console.log("cam here 7")
            const user = [...ans.userAnswer].sort();
            console.log("cam here 8")
            const correct = [...ques.correctOptions].sort();
            console.log("cam here 9")
            if (JSON.stringify(user) === JSON.stringify(correct)) {
                score += 1;
                console.log("cam here 10")
            }
        }
    }
    return score;
};