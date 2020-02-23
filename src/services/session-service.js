import 'utils/array-utils'
import * as api from 'utils/api'

import { addSessions } from 'redux/actions/sessions'
import { setCancellationReasons } from 'redux/actions/cancellation-reasons'
import { setClassSessions } from 'redux/actions/class-sessions'

export const fetchSessionsForClass = dispatch => async classId => {
  console.log(`Fetching sessions for class ${classId}`)
  const { data } = await api.get(`/classes/${classId}/tutoring-sessions`)
  return Promise.all([
    dispatch(addSessions(data)),
    dispatch(setClassSessions(classId, data.objValues('id'))),
  ])
}

export const fetchSession = dispatch => async id => {
  console.log(`Fetching session ${id}`)
  const { data } = await api.get(`/tutoring-sessions/${id}`)
  return dispatch(addSessions([data]))
}

export const fetchSessions = dispatch => async() => {
  console.log('Fetching all sessions')
  const { data } = await api.get('/tutoring-sessions')
  return dispatch(addSessions(data))
}

export const cancelSession = dispatch => async(id, data) => {
  console.log(`Cancelling session ${id}`)
  const { data: session } = await api.post(`/tutoring-sessions/${id}/cancel`, data)
  return dispatch(addSessions([session]))
}

export const finishSession = dispatch => async(id) => {
  console.log(`Finish session ${id}`)
  const { data } = await api.post(`/tutoring-sessions/${id}/finish`)
  return dispatch(addSessions([data]))
}

export const fetchCancellationReasons = dispatch => async(id) => {
  console.log(`Cancelling session ${id}`)
  const { data } = await api.get('/tutoring-sessions/cancellation-reasons')
  return dispatch(setCancellationReasons(data))
}