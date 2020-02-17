import * as api from 'utils/api'

import { addFormQuestions } from 'redux/actions/form-questions'
import { addQuestions } from 'redux/actions/questions'
import { setQuestionTypes } from 'redux/actions/question-types'

export const createQuestion = dispatch => async data => {
  console.log('Creating question')
  const { data: question } = await api.post('/questions', data)
  return dispatch(addQuestions([question]))
}

export const createQuestionForForm = dispatch => async(formId, questionData) => {
  console.log(`Creating question for form ${formId}`)
  const { data } = await api.post(`/forms/${formId}/create-question`, questionData)
  const { form_question: formQuestion, question: question } = data
  return Promise.all([
    dispatch(addQuestions([question])),
    dispatch(addFormQuestions([formQuestion])),
  ])
}

export const archiveQuestion = dispatch => async(id, archive) => {
  console.log(`${archive ? 'Archiving' : 'Unarchiving'} question ${id}`)
  const { data } = await api.patch(`/questions/${id}`, { archive })
  return dispatch(addQuestions([data]))
}

export const updateQuestion = dispatch => async(id, data) => {
  console.log(`Updating question ${id}`)
  const { data: question } = await api.patch(`/questions/${id}`, data)
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