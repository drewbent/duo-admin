import 'utils/array-utils'
import { ADD_SESSIONS } from '../action-list'

import { isToday } from 'utils/date-utils'

/** Mapping of sessionId => session  */
const initialState = {}

export default (state = initialState, action) => {
  const { sessions } = action

  switch (action.type) {
    case ADD_SESSIONS:
      console.log(`Redux: Adding ${sessions.length} sessions`)
      return { ...state, ...sessions.toObject('id') }
    default:
      return state
  }
}

export const getTodaysSessions = state => {
  return Object.values(state.Sessions).filter(session => isToday(session.start_time))
}