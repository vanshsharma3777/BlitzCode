import { SolvedQuestion } from "../../types/allTypes"

export const  updateAnswers =(
  prev: SolvedQuestion[],
  questionId: string,
  optionId: string,
  questionType: string
): SolvedQuestion[] => {
    console.log(questionId)
    console.log(optionId)
    console.log(questionType)
  const exists = prev.find(q => q.questionId === questionId)

  if (questionType === "multiple correct") {
    if (exists) {
      if (exists.userAnswer.includes(optionId)) {
        const updated = exists.userAnswer.filter(a => a !== optionId)

        if (updated.length === 0) {
          return prev.filter(q => q.questionId !== questionId)
        }

        return prev.map(q =>
          q.questionId === questionId
            ? { ...q, userAnswer: [...updated].sort()  }
            : q
        )
      }
          const newAnswer = [...exists.userAnswer, optionId].sort()
      return prev.map(q =>
        q.questionId === questionId
          ? { ...q, userAnswer: newAnswer }
          : q
      )
    }

    return [...prev, { questionId, userAnswer: [optionId].sort() }]
  }

  if (exists) {
    if (exists.userAnswer.includes(optionId)) {
      return prev.filter(q => q.questionId !== questionId)
    }

    return prev.map(q =>
      q.questionId === questionId
        ? { ...q, userAnswer: [optionId] }
        : q
    )
  }
  
  return [...prev, { questionId, userAnswer: [optionId] }]
}