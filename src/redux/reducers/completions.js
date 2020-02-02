import 'utils/array-utils'
import { ADD_COMPLETIONS } from 'redux/action-list'

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