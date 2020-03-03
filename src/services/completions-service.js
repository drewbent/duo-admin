import 'utils/array-utils'
import * as api from 'utils/api'

import { addCompletions } from 'redux/actions/completions'
import { setSessionAfter, setSessionBefore } from 'redux/actions/session-before-after'
import { setUserCompletions } from 'redux/actions/user-completions'

export const fetchTodaysCompletions = dispatch => async() => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return fetchCompletionsFromDate(dispatch)(date)
}

export const fetchCompletionsFromDate = dispatch => async date => {
  const startTime = Math.floor(date.getTime() / 1000)
  console.log(`Fetching completions from ${startTime}`)
  const { data } = await api.get(`/ka-skill-completion?start_time=${startTime}`)
  return dispatch(addCompletions(data))
}

export const fetchCompletionsForStudent = dispatch => async studentId => {
  console.log(`Fetching completions for user ${studentId}`)
  const { data } = await api.get(`/students/${studentId}/ka-skill-completions`)
  return Promise.all([
    dispatch(addCompletions(data)),
    dispatch(setUserCompletions(studentId, data.objValues('id'))),
  ])
}

export const fetchCompletionBeforeSession = dispatch => async sessionId => {
  console.log(`Fetching completion before session ${sessionId}`)
  const { data } = await api.get(`/tutoring-sessions/${sessionId}/completion-before`)
  if (data) {
    return Promise.all([
      dispatch(setSessionBefore(sessionId, data.id)),
      dispatch(addCompletions([data])),
    ])
  } else {
    console.log(`No 'before' completion for session ${sessionId}`)
  }
}

export const fetchCompletionAfterSession = dispatch => async sessionId => {
  console.log(`Fetching completion after session ${sessionId}`)
  const { data } = await api.get(`/tutoring-sessions/${sessionId}/completion-after`)
  if (data) {
    return Promise.all([
      dispatch(setSessionAfter(sessionId, data.id)),
      dispatch(addCompletions([data])),
    ])
  } else {
    console.log(`No 'after' completion for session ${sessionId}`)
  }
}