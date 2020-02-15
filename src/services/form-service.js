import * as api from 'utils/api'

import { addForms } from 'redux/actions/forms'

export const fetchAllForms = dispatch => async() => {
  console.log('Fetching all forms')
  const { data } = await api.get('/forms')
  return dispatch(addForms(data))
}

export const fetchForm = dispatch => async(id) => {
  console.log(`Fetching form with id ${id}`)
  const { data } = await api.get(`/forms/${id}`)
  return dispatch(addForms([data]))
}

export const createForm = dispatch => async(data) => {
  console.log('Creating form')
  const { data: form } = await api.post('/forms', data)
  dispatch(addForms([form]))
  return form
}