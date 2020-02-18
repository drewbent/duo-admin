import * as api from 'utils/api'

import { addResponses } from 'redux/actions/responses'

export const fetchResponsesForSession = dispatch => async sessionId => {
  console.log(`Fetching responses for session ${sessionId}`)
  const { data } = await api.get(`/sessions/${sessionId}/form-responses`)
  return dispatch(addResponses(data))
}