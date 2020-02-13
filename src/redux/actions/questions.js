import { ADD_QUESTIONS } from '../action-list'

export const addQuestions = questions => ({
  type: ADD_QUESTIONS,
  questions,
})