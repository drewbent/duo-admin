import { SET_SESSION_AFTER, SET_SESSION_BEFORE } from '../action-list'

/** Mapping of sessionId => { after: completionId, before: completionId } */
const initialState = {}

export default (state = initialState, action) => {
  const { sessionId, completionId } = action

  switch (action.type) {
    case SET_SESSION_AFTER:
      console.log(`Setting 'after' of session ${sessionId} to completion ${completionId}`)
      return { ...state, [sessionId]: { ...state[sessionId], after: completionId } }
    case SET_SESSION_BEFORE:
      console.log(`Setting 'before' of session ${sessionId} to completion ${completionId}`)
      return { ...state, [sessionId]: { ...state[sessionId], before: completionId } }
    default:
      return state
  }
}