import { SET_SESSION_AFTER, SET_SESSION_BEFORE } from '../action-list'

export const setSessionBefore = (sessionId, completionId) => ({
  type: SET_SESSION_BEFORE,
  sessionId, completionId,
})

export const setSessionAfter = (sessionId, completionId) => ({
  type: SET_SESSION_AFTER,
  sessionId, completionId,
})