import * as api from 'utils/api'

import { addFormQuestions } from 'redux/actions/form-questions'

export const fetchFormQuestionsForForm = dispatch => async formId => {
  console.log(`Fetching form questions for form ${formId}`)
  const { data } = await api.get(`/forms/${formId}/form-questions`)
  return dispatch(addFormQuestions(data))
}

export const fetchAllFormQuestions = dispatch => async() => {
  console.log('Fetching all form questions')
  const { data } = await api.get('/form-questions')
  return dispatch(addFormQuestions(data))
}

export const updateFormQuestion = dispatch => async(id, data) => {
  console.log(`Updating form question with id ${id}`)
  const { data: formQuestion } = await api.patch(`/form-questions/${id}`, data)
  return dispatch(addFormQuestions([formQuestion]))
}

export const updateFormQuestionIndex = dispatch => async(id, index) => {
  console.log(`Setting index of form question ${id} to ${index}`)
  const { data } = await api.post(`/form-questions/${id}/index`, { index_in_form: index })
  return dispatch(addFormQuestions(data))
}

export const createFormQuestion = dispatch => async(data) => {
  console.log('Creating form question')
  const { data: form } = await api.post('/form-questions', data)
  return dispatch(addFormQuestions([form]))
}