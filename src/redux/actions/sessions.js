import { ADD_SESSIONS } from '../action-list'

export const addSessions = sessions => ({
  type: ADD_SESSIONS,
  sessions,
})