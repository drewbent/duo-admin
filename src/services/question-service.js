import * as api from 'utils/api'

import { addQuestions } from 'redux/actions/questions'
import { setQuestionTypes } from 'redux/actions/question-types'

export const createQuestion = dispatch => async data => {
  console.log(data)
  const { data: question } = await api.post('/questions', data)
  return dispatch(addQuestions([question]))
}

export const fetchAllQuestions = dispatch => async(includeNumQuestions) => {
  console.log('Fetching all questions')
  let path = '/questions'
  if (includeNumQuestions) path += '?num_responses=true'
  const { data: questions } = await api.get(path)
  return dispatch(addQuestions(questions))
}

export const fetchQuestionTypes = dispatch => async() => {
  console.log('Fetching question types')
  const { data } = await api.get('/question-types')
  return dispatch(setQuestionTypes(data))
}