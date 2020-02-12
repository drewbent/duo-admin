import 'utils/array-utils'
import * as api from 'utils/api'

import { addCompletions } from 'redux/actions/completions'
import { setUserCompletions } from 'redux/actions/user-completions'

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
  return dispatch(addCompletions([data]))
}

export const fetchCompletionAfterSession = dispatch => async sessionId => {
  console.log(`Fetching completion after session ${sessionId}`)
  const { data } = await api.get(`/tutoring-sessions/${sessionId}/completion-after`)
  return dispatch(addCompletions([data]))
}