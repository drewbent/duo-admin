import * as api from 'utils/api'

import { addResponses } from 'redux/actions/responses'

export const fetchResponsesForSession = dispatch => async sessionId => {
  console.log(`Fetching responses for session ${sessionId}`)
  const { data } = await api.get(`/sessions/${sessionId}/form-responses`)
  return dispatch(addResponses(data))
}

/**
 * Data should have the format: 
 * {
 *  student_id,
 *  session_id,
 *  distribution_id,
 *  responses: { form_question_id: response }
 * }
 */
export const createFeedback = dispatch => async(data) => {
  console.log('Redux: Creating feedback')
  const { data: responses } = await api.post('/form-responses/feedback', data)
  return dispatch(addResponses(responses))
}