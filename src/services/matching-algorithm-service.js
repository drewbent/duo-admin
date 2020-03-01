import * as api from 'utils/api'

import { addActiveMatchingAlgorithms } from 'redux/actions/active-matching-algorithms'
import { addMatchingAlgorithms } from 'redux/actions/matching-algorithms'

export const fetchAllMatchingAlgorithms = dispatch => async() => {
  console.log('Fetching all matching algorithms')
  const { data } = await api.get('/matching-algorithms')
  return dispatch(addMatchingAlgorithms(data))
}

export const fetchMatchingAlgorithm = dispatch => async id => {
  console.log(`Fetching matching algorithm ${id}`)
  const { data } = await api.get(`/matching-algorithms/${id}`)
  return dispatch(addMatchingAlgorithms([data]))
}

export const createMatchingAlgorithm = dispatch => async data => {
  console.log('Creating matching algorithm')
  const { data: algorithm } = await api.post('/matching-algorithms', data)
  return dispatch(addMatchingAlgorithms([algorithm]))
}

export const updateMatchingAlgorithm = dispatch => async(id, data) => {
  console.log(`Updating matching algorithm ${id}`)
  const { data: algorithm } = await api.patch(`/matching-algorithms/${id}`, data)
  return dispatch(addMatchingAlgorithms([algorithm]))
}

export const activateMatchingAlgorithm = dispatch => async(data) => {
  console.log('Activating matching algorithm')
  const { data: actives } = await api.post('/active-matching-algorithms', data)
  return dispatch(addActiveMatchingAlgorithms(actives))
}

export const fetchActiveMatchingAlgorithms = dispatch => async() => {
  console.log('Fetching active matching algorithms')
  const { data } = await api.get('/active-matching-algorithms')
  return dispatch(addActiveMatchingAlgorithms(data))
}

/**
 * @param {Object} student The student to test for
 * @param {Object} algorithm The argument to test
 * @param {*} args A mapping of arg => value
 */
export const getTestMatchingAlgorithmPath = (student, algorithm, args) => {
  const paramString = Object.keys(args).reduce((acc, next) => {
    acc.push(`${next}=${args[next]}`)
    return acc
  }, []).join('&')
  return `/students/${student.id}/find-matches?algorithm=${algorithm.id}${paramString ? `&${paramString}` : ''}`
}

/**
 * @param {String} path
 */
export const testMatchingAlgorithm = async path => {
  console.log('Testing matching algorithm')
  const { data } = await api.get(path)
  return data
}