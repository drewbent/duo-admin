import { ADD_CLASS_SESSIONS, SET_CLASS_SESSIONS } from '../action-list'

/** Mapping of classId => sessionId[] */
const initialState = {}

export default (state = initialState, action) => {
  const { classId, sessionIds } = action
    
  switch (action.type) {
    case ADD_CLASS_SESSIONS:
      console.log(`Redux: Adding ${sessionIds.length} sessions to class ${classId}`)
      return { ...state, [classId]: [ ...state[classId], ...sessionIds ] }
    case SET_CLASS_SESSIONS:
      console.log(`Redux: Setting ${sessionIds.length} sessions to class ${classId}`)
      return { ...state, [classId]: sessionIds }
    default:
      return state
  }
}