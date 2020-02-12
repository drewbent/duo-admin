import * as api from 'utils/api'

import { setFeedbackForSession } from 'redux/actions/session-feedback'

export const fetchFeedback = dispatch => async sessionId => {
  console.log(`Fetching feedback for session ${sessionId}`)
  const { data } = await api.get(`/tutoring-sessions/${sessionId}/feedback`)
  return dispatch(setFeedbackForSession(sessionId, data || {}))
}