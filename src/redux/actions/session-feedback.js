import { SET_FEEDBACK_FOR_SESSION } from '../action-list'

export const setFeedbackForSession = (sessionId, feedback) => ({
  type: SET_FEEDBACK_FOR_SESSION,
  sessionId, feedback,
})