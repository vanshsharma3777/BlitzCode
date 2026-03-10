import { Question, SolvedQuestion } from "../../types/allTypes";

export const calculateScores = (
    answers: SolvedQuestion[],
    questions: Question[]
) => {
    let score = 0;
    const questionMap = new Map(
        questions.map(q => [q.questionId, q])
    );
    for (const ans of answers) {
        const ques = questionMap.get(ans.questionId);
        if (!ques) continue;
        if (ques.questionType === "single correct" || ques.questionType === "bugfixer") {
            if (ans.userAnswer[0] === ques.correctOptions[0]) {
                score += 1;
            }
        }

        else if (ques.questionType === "multiple correct") {
            const user = [...ans.userAnswer].sort();
            const correct = [...ques.correctOptions].sort();
            if (JSON.stringify(user) === JSON.stringify(correct)) {
                score += 1;
            }
        }
    }
    return score;
};