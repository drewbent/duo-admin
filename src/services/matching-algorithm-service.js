import * as api from 'utils/api'

import { addMatchingAlgorithms } from 'redux/actions/matching-algorithms'

export const fetchAllMatchingAlgorithms = dispatch => async() => {
  console.log('Fetching all matching algorithms')
  const { data } = await api.get('/matching-algorithms')
  return dispatch(addMatchingAlgorithms(data))
}

export const createMatchingAlgorithm = dispatch => async data => {
  console.log('Creating matching algorithm')
  const { data: algorithm } = await api.post('/matching-algorithms', data)
  return dispatch(addMatchingAlgorithms([algorithm]))
}