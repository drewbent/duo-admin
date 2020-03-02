import 'utils/array-utils'
import { ADD_COMPLETIONS } from 'redux/action-list'

import { isToday } from 'utils/date-utils'

// Mapping of completionId => completion
const initialState = {}

export default (state = initialState, action) => {
  const { completions } = action
  
  switch (action.type) {
    case ADD_COMPLETIONS:
      console.log(`Redux: Adding ${completions.length} completions`)
      return { ...state, ...completions.toObject('id') }
    default:
      return state
  }
}

export const getTodaysCompletions = state => {
  return Object.values(state.Completions).filter(c => isToday(c.created_at))
}