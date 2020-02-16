import * as api from 'utils/api'

import { addFormQuestions } from 'redux/actions/form-questions'

export const fetchFormQuestionsForForm = dispatch => async formId => {
  console.log(`Fetching form questions for form ${formId}`)
  const { data } = await api.get(`/forms/${formId}/form-questions`)
  return dispatch(addFormQuestions(data))
}

export const updateFormQuestion = dispatch => async(id, data) => {
  console.log(`Updating form question with id ${id}`)
  const { data: formQuestion } = await api.patch(`/form-questions/${id}`, data)
  return dispatch(addFormQuestions([formQuestion]))
}