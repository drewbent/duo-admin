import * as api from 'utils/api'

import { addDistributions, deleteDistribution as deleteDistributionRedux } from 'redux/actions/distributions'

export const fetchDistributions = dispatch => async() => {
  console.log('Fetching all distributions')
  const { data } = await api.get('/form-distributions')
  return dispatch(addDistributions(data))
}

export const fetchDistribution = dispatch => async(id) => {
  console.log(`Fetching distribution ${id}`)
  const { data } = await api.get(`/form-distributions/${id}`)
  return dispatch(addDistributions([data]))
}

export const createDistribution = dispatch => async data => {
  console.log('Creating distribution')
  const { data: distribution } = await api.post('/form-distributions', data)
  return dispatch(addDistributions([distribution]))
}

export const deleteDistribution = dispatch => async id => {
  console.log(`Deleting distribution with id ${id}`)
  await api.del(`/form-distributions/${id}`)
  return dispatch(deleteDistributionRedux(id))
}

export const fetchDistributionsForForm = dispatch => async formId => {
  console.log(`Fetching distributions for form ${formId}`)
  const { data } = await api.get(`/forms/${formId}/form-distributions`)
  return dispatch(addDistributions(data))
}