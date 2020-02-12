import { SET_FEEDBACK_FOR_SESSION } from '../action-list'

/** Mapping of sessionId => feedback (1:1 relationship) */
const initialState = {}

export default (state = initialState, action) => {
  const { sessionId, feedback } = action

  switch (action.type) {
    case SET_FEEDBACK_FOR_SESSION:
      console.log(`Redux: Setting feedback for session ${sessionId}`)
      return { ...state, [sessionId]: feedback }
    default:
      return state
  }
}
